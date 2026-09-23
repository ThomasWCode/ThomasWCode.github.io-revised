import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const skippedDirectories = new Set([
  ".git",
  ".github",
  ".lighthouseci",
  "CSS",
  "Fonts",
  "Images",
  "JS",
  "docs",
  "node_modules",
  "playwright-report",
  "scripts",
  "test-results",
  "tests",
]);
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);
const schoolYearPattern = /Year 1[0-3]\b/;
const updatedWindowDays = 60;

// List every published HTML file, relative to the repository root.
export async function listPublishedHtml(root = repositoryRoot, directory = "") {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = directory ? `${directory}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (!skippedDirectories.has(entry.name) && !entry.name.startsWith(".") && !entry.name.startsWith("_")) {
        files.push(...(await listPublishedHtml(root, relativePath)));
      }
    } else if (entry.name.endsWith(".html")) {
      files.push(relativePath);
    }
  }

  return files.sort();
}

function parseAttributes(source) {
  const attributes = {};

  for (const match of source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attributes;
}

// Walk the markup once, reporting each element and text run with its line and open ancestors.
export function scanHtml(source, visit) {
  const html = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, (frontMatter) =>
    frontMatter.replace(/[^\n]/g, " "),
  );
  const lineStarts = [0];
  for (let index = 0; index < html.length; index += 1) {
    if (html[index] === "\n") {
      lineStarts.push(index + 1);
    }
  }

  function lineAt(offset) {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      if (lineStarts[middle] <= offset) {
        low = middle;
      } else {
        high = middle - 1;
      }
    }
    return low + 1;
  }

  const stack = [];
  const tokenPattern = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g;
  let lastIndex = 0;

  function emitText(text, offset) {
    if (text.trim()) {
      visit({
        type: "text",
        text,
        line: lineAt(offset + text.length - text.trimStart().length),
        lineOf: (index) => lineAt(offset + index),
        ancestors: stack,
      });
    }
  }

  for (const match of html.matchAll(tokenPattern)) {
    emitText(html.slice(lastIndex, match.index), lastIndex);
    lastIndex = match.index + match[0].length;

    if (match[0].startsWith("<!--")) {
      continue;
    }

    if (match[1]) {
      const element = {
        tag: match[1].toLowerCase(),
        attributes: parseAttributes(match[0].slice(match[1].length + 1, match[0].indexOf(">"))),
        line: lineAt(match.index),
      };
      visit({ type: "element", element, ancestors: stack });
      continue;
    }

    const tag = match[3].toLowerCase();

    if (match[2]) {
      const openIndex = stack.map((element) => element.tag).lastIndexOf(tag);
      if (openIndex > -1) {
        stack.length = openIndex;
      }
      continue;
    }

    const element = { tag, attributes: parseAttributes(match[4]), line: lineAt(match.index) };
    visit({ type: "element", element, ancestors: stack });

    if (!voidElements.has(tag) && !match[4].trim().endsWith("/")) {
      stack.push(element);
    }
  }

  emitText(html.slice(lastIndex), lastIndex);
}

function parseDay(value) {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value || "");
  if (!match) {
    return null;
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3] || 1)));
  return Number.isNaN(date.getTime()) ? null : date;
}

function describe(element) {
  const label = element.attributes["data-record"] || element.attributes.id || element.attributes.class;
  return label ? `<${element.tag}> ${label}` : `<${element.tag}>`;
}

function futureReviewCovers(chain, today) {
  return chain.some((element) => {
    const review = parseDay(element.attributes["data-review"]);
    return review && review > today;
  });
}

// Find every item in one page's markup that is due for a re-read on the given day.
export function reviewMarkup(source, today) {
  const findings = [];
  const staleUpdatedBefore = new Date(today.getTime() - updatedWindowDays * 86_400_000);

  scanHtml(source, (token) => {
    if (token.type === "text") {
      const match = schoolYearPattern.exec(token.text);
      if (match && !futureReviewCovers(token.ancestors, today)) {
        findings.push({
          line: token.lineOf(match.index),
          message: `mentions “${match[0]}” without a future review date`,
        });
      }
      return;
    }

    const { element, ancestors } = token;
    const review = parseDay(element.attributes["data-review"]);
    const updated = parseDay(element.attributes["data-updated"]);

    if (review && review <= today) {
      findings.push({
        line: element.line,
        message: `${describe(element)}: review date ${element.attributes["data-review"]} has passed`,
      });
    }

    if (updated && updated < staleUpdatedBefore) {
      findings.push({
        line: element.line,
        message: `${describe(element)}: last updated ${element.attributes["data-updated"]}, more than ${updatedWindowDays} days ago`,
      });
    }

    for (const [name, value] of Object.entries(element.attributes)) {
      const match = schoolYearPattern.exec(value);
      if (!name.startsWith("data-") && match && !futureReviewCovers([...ancestors, element], today)) {
        findings.push({
          line: element.line,
          message: `${describe(element)} ${name} mentions “${match[0]}” without a future review date`,
        });
      }
    }
  });

  return findings;
}

// Review every published page and return the findings grouped by file.
export async function reviewContent({ root = repositoryRoot, today = new Date() } = {}) {
  const day = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const results = [];

  for (const file of await listPublishedHtml(root)) {
    const findings = reviewMarkup(await readFile(path.join(root, file), "utf8"), day);
    if (findings.length > 0) {
      results.push({ file, findings });
    }
  }

  return results;
}

// List every draft placeholder (data-draft) with the text Tom still has to replace.
export async function listDrafts(root = repositoryRoot) {
  const drafts = [];

  for (const file of await listPublishedHtml(root)) {
    const open = new Map();

    scanHtml(await readFile(path.join(root, file), "utf8"), (token) => {
      if (token.type === "element" && "data-draft" in token.element.attributes) {
        const record = [...token.ancestors, token.element]
          .map((element) => element.attributes["data-record"])
          .filter(Boolean)
          .pop();
        const kind = token.element.attributes["data-draft"] === "check" ? "check" : "write";
        const draft = { file, line: token.element.line, kind, record, text: "" };
        open.set(token.element, draft);
        drafts.push(draft);
      } else if (token.type === "text") {
        for (const element of token.ancestors) {
          if (open.has(element)) {
            open.get(element).text += ` ${token.text}`;
          }
        }
      }
    });
  }

  return drafts.map((draft) => ({ ...draft, text: draft.text.replace(/\s+/g, " ").trim() }));
}

export function formatReport(results, today) {
  if (results.length === 0) {
    return "";
  }

  const count = results.reduce((total, result) => total + result.findings.length, 0);
  const lines = [
    `The content review on ${today.toISOString().slice(0, 10)} found ${count} item${count === 1 ? "" : "s"} to re-read.`,
    "",
    "For each one, update the copy (school years, ages, “currently” lines), then move its `data-review` or `data-updated` date forward. The convention is in `AGENTS.md`.",
    "",
  ];

  for (const { file, findings } of results) {
    lines.push(`### \`${file}\``, "");
    for (const finding of findings) {
      lines.push(`- [ ] line ${finding.line}: ${finding.message}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const todayArgument = process.argv.find((argument) => argument.startsWith("--today="))?.slice(8);
  const today = todayArgument ? parseDay(todayArgument) : new Date();

  if (!today) {
    console.error("Use --today=YYYY-MM-DD");
    process.exit(2);
  }

  if (process.argv.includes("--drafts")) {
    for (const draft of await listDrafts()) {
      const text = draft.text.length > 110 ? `${draft.text.slice(0, 107)}...` : draft.text;
      console.log(`${draft.file}:${draft.line} ${draft.kind}${draft.record ? ` [${draft.record}]` : ""}  ${text}`);
    }
  } else {
    process.stdout.write(formatReport(await reviewContent({ today }), today));
  }
}
