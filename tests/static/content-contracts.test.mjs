import assert from "node:assert/strict";
import test from "node:test";
import { listPublishedHtml, reviewMarkup, scanHtml } from "../../scripts/content-review.mjs";
import { DRAFT_KINDS, DraftMarkupError, emptiedByDrafts, findDrafts, LIVE_HOST, liveView } from "../../scripts/drafts.mjs";
import { readSiteFile, repositoryRoot, siteHost, textContent } from "../support/site-files.mjs";

const whenPattern = /^(?:unknown|\d{4}(?:-\d{2})?(?:\/(?:\d{4}(?:-\d{2})?)?)?)$/;
const reviewPattern = /^\d{4}-\d{2}-\d{2}$/;
const updatedPattern = /^\d{4}-\d{2}(?:-\d{2})?$/;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const bannedWords = /\b(impressive|incredible|journey|leverage|showcase)\b/gi;
const analisaQuote =
  "I was honestly so impressed with Thomas after working on this project with him. Yes, his technical abilities were great, but actually, it was his strategic mindset and communications skills that made this a good project to work on with him.";

const recordSlugs = new Set(
  Array.from((await readSiteFile("docs/record.md")).matchAll(/^### ([a-z0-9-]+)\s*$/gm), (match) => match[1]),
);
const publishedFiles = await listPublishedHtml(repositoryRoot);
const rawSources = new Map(
  await Promise.all(publishedFiles.map(async (file) => [file, await readSiteFile(file)])),
);
// The contracts judge the pages as their site serves them: on thomaswhite.me
// drafts are left out, so a draft never breaks the live site's checks.
const sources = new Map([...rawSources].map(([file, source]) => [file, liveView(source, siteHost)]));

function isValidDay(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function collect(source) {
  const elements = [];
  const texts = [];

  scanHtml(source, (token) => {
    if (token.type === "element") {
      elements.push({ ...token.element, ancestors: [...token.ancestors] });
    } else {
      texts.push({ ...token, ancestors: [...token.ancestors] });
    }
  });

  return { elements, texts };
}

const scanned = new Map([...sources].map(([file, source]) => [file, collect(source)]));

test("every dated item names its record entry, its real date and a review date", () => {
  const errors = [];

  for (const [file, { elements }] of scanned) {
    for (const element of elements) {
      const { "data-record": record, "data-when": when, "data-review": review } = element.attributes;
      const where = `${file}:${element.line}`;

      if (record === undefined && when === undefined) {
        continue;
      }

      if (!record || !recordSlugs.has(record)) {
        errors.push(`${where} data-record "${record}" is not a ### heading in docs/record.md`);
      }
      if (!when || !whenPattern.test(when)) {
        errors.push(`${where} data-when "${when}" is not YYYY-MM, a range, or unknown`);
      }
      if (!review || !reviewPattern.test(review) || !isValidDay(review)) {
        errors.push(`${where} data-review "${review}" is not a YYYY-MM-DD date`);
      }
    }
  }

  assert.deepEqual(errors, []);
});

test("every review and updated date is well formed", () => {
  const errors = [];

  for (const [file, { elements }] of scanned) {
    for (const element of elements) {
      const { "data-review": review, "data-updated": updated } = element.attributes;
      if (review !== undefined && !(reviewPattern.test(review) && isValidDay(review))) {
        errors.push(`${file}:${element.line} data-review "${review}"`);
      }
      if (updated !== undefined && !updatedPattern.test(updated)) {
        errors.push(`${file}:${element.line} data-updated "${updated}"`);
      }
    }
  }

  assert.deepEqual(errors, []);
});

test("every school-year mention sits inside an element with a review date", () => {
  const errors = [];

  for (const [file, { elements, texts }] of scanned) {
    for (const text of texts) {
      const match = /Year 1[0-3]\b/.exec(text.text);
      if (match && !text.ancestors.some((element) => element.attributes["data-review"])) {
        errors.push(`${file}:${text.lineOf(match.index)} “${match[0]}”`);
      }
    }

    for (const element of elements) {
      for (const [name, value] of Object.entries(element.attributes)) {
        const covered = [...element.ancestors, element].some((item) => item.attributes["data-review"]);
        if (!name.startsWith("data-") && /Year 1[0-3]\b/.test(value) && !covered) {
          errors.push(`${file}:${element.line} ${name}`);
        }
      }
    }
  }

  assert.deepEqual(errors, []);
});

test("sections with data-updated show a matching Updated line", () => {
  const errors = [];

  for (const [file, { elements, texts }] of scanned) {
    for (const element of elements.filter((item) => item.attributes["data-updated"])) {
      const [year, month] = element.attributes["data-updated"].split("-");
      const expected = `Updated ${monthNames[Number(month) - 1]} ${year}`;
      const inside = texts
        .filter((text) => text.ancestors.some((item) => item.line === element.line && item.tag === element.tag))
        .map((text) => text.text.replace(/\s+/g, " "))
        .join(" ");

      if (!inside.includes(expected)) {
        errors.push(`${file}:${element.line} should say “${expected}”`);
      }
    }
  }

  assert.deepEqual(errors, []);
});

test("the review script flags passed review dates, stale updates and uncovered school years", () => {
  const markup = [
    '<section data-updated="2026-01"><p>Updated January 2026</p></section>',
    '<article data-record="cradle" data-when="2026-02" data-review="2026-09-01">Year 11</article>',
    '<p data-review="2030-09-01">Year 12, reviewed later</p>',
    "<p>Year 13 with no review date</p>",
  ].join("\n");
  const findings = reviewMarkup(markup, new Date(Date.UTC(2026, 8, 23)));

  assert.deepEqual(
    findings.map((finding) => finding.line),
    [1, 2, 2, 4],
  );
  assert.match(findings[0].message, /more than 60 days ago/);
  assert.match(findings[1].message, /review date 2026-09-01 has passed/);
  assert.match(findings[3].message, /Year 13/);
});

test("banned words stay off the site and “passionate” appears at most once", () => {
  const errors = [];
  let passionate = 0;

  for (const [file, { elements, texts }] of scanned) {
    const values = [
      ...texts.map((text) => text.text),
      ...elements.flatMap((element) =>
        ["alt", "content", "title", "aria-label", "data-caption"]
          .map((name) => element.attributes[name])
          .filter(Boolean),
      ),
    ];

    for (const value of values) {
      for (const match of value.matchAll(bannedWords)) {
        errors.push(`${file}: “${match[0]}”`);
      }
      passionate += (value.match(/\bpassionate\b/gi) || []).length;
    }
  }

  assert.deepEqual(errors, []);
  assert.ok(passionate <= 1, `“passionate” appears ${passionate} times`);
});

test("Analisa’s testimonial is quoted word for word wherever it appears", () => {
  const quoted = [];

  for (const [file, source] of sources) {
    const text = textContent(source);
    if (text.includes("I was honestly so impressed")) {
      assert.ok(text.includes(analisaQuote), `${file} changes Analisa’s words`);
      quoted.push(file);
    }
  }

  assert.ok(quoted.includes("testimonials.html"), "the testimonial is missing from testimonials.html");
});

test("drafts are well-formed, so the live build can leave them out cleanly", (context) => {
  const errors = [];
  let count = 0;

  for (const [file, source] of rawSources) {
    let drafts;
    try {
      drafts = findDrafts(source);
    } catch (error) {
      if (!(error instanceof DraftMarkupError)) throw error;
      errors.push(`${file}: ${error.message}`);
      continue;
    }
    count += drafts.length;
    for (const draft of drafts) {
      const where = `${file}:${draft.line} <${draft.tag}>`;
      if (!DRAFT_KINDS.has(draft.kind)) {
        errors.push(`${where}: data-draft="${draft.kind}" is not a draft kind (see scripts/drafts.mjs)`);
      }
      if (draft.kind === "" && !/\bdraft-(?:note|inline)\b/.test(source.slice(draft.start, draft.startTagEnd))) {
        errors.push(`${where}: a placeholder needs the draft-note or draft-inline class`);
      }
      if (draft.kind === "replace" && (!draft.previous || draft.previous.tag !== draft.tag || draft.previous.kind !== null)) {
        errors.push(`${where}: a new version must come straight after the live <${draft.tag}> it replaces`);
      }
    }
    // No paragraph or list item is served empty because its words are all
    // drafts. Here every kind counts; on the preview only `new` drafts do, since
    // the placeholders and checks are resolved before the content-strategy merge.
    const counted = siteHost === LIVE_HOST ? undefined : (draft) => draft.kind === "new";
    for (const { tag, line } of emptiedByDrafts(source, counted)) {
      errors.push(`${file}:${line} <${tag}>: its words are all drafts, so it would be empty on ${LIVE_HOST}; mark the <${tag}> itself (a placeholder with class="draft-note")`);
    }
  }

  assert.deepEqual(errors, []);
  if (siteHost === LIVE_HOST) {
    const left = [...sources].filter(([, html]) => findDrafts(html).length).map(([file]) => file);
    assert.deepEqual(left, [], "the live view still holds drafts");
  }
  context.diagnostic(`${count} drafts, ${siteHost === LIVE_HOST ? `left out of ${LIVE_HOST}` : `shown on the ${siteHost} preview`}`);
});
