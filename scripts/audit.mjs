// Fails on high or critical npm advisories, like `npm audit --audit-level=high`,
// apart from the advisories excused below. CI runs this instead of `npm audit`.
// An exception only holds while npm audit finds no fix for its advisory: once a
// fixed release can be installed, the exception lapses and CI fails until the
// dependency is updated and the exception removed. An exception for an advisory
// npm audit no longer reports fails too, so none is left behind.
// tests/static/audit.test.mjs covers these rules.
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const excused = {
  // braces 3.0.3 and below, through stylelint > micromatch. No fixed release
  // exists yet. It only expands the glob patterns in this repository's own lint
  // command, never outside input, and none of it reaches the published site.
  // GitHub auto-dismissed its Dependabot alert as a development-only denial of
  // service, so no Dependabot pull request will come: this exception lapsing
  // is what will flag the fix.
  "GHSA-vfj7-8cjw-p6xm": "braces has no fixed release yet; development-only",
};

const severe = new Set(["high", "critical"]);

// Sorts the high and critical advisories in an `npm audit --json` report into
// those excused, those whose exception has lapsed because a fix now exists, and
// those that fail; `unused` lists exceptions npm audit no longer reports.
export function assess(report, exceptions = excused) {
  // Advisories appear as objects in each vulnerable package's `via` list, and
  // that package's `fixAvailable` says whether npm can install a fixed release.
  // The packages that only depend on a vulnerable one list its name as a string.
  const advisories = new Map();
  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via === "object") {
        const id = via.url?.split("/").pop() || String(via.source);
        const fix = advisories.get(id)?.fix || vulnerability.fixAvailable || false;
        advisories.set(id, { ...via, id, fix });
      }
    }
  }

  const found = [...advisories.values()].filter((advisory) => severe.has(advisory.severity));
  const isExcepted = (advisory) => Object.hasOwn(exceptions, advisory.id);
  return {
    excused: found.filter((advisory) => isExcepted(advisory) && !advisory.fix),
    lapsed: found.filter((advisory) => isExcepted(advisory) && advisory.fix),
    failing: found.filter((advisory) => !isExcepted(advisory)),
    unused: Object.keys(exceptions).filter((id) => !advisories.has(id)),
  };
}

// CI passes only when nothing fails, no exception has lapsed and none is unused.
export function passes({ failing, lapsed, unused }) {
  return failing.length === 0 && lapsed.length === 0 && unused.length === 0;
}

// npm's `fixAvailable` is `true` when `npm audit fix` can install the fix within
// the declared ranges. An object names the dependency to update when the fix lies
// outside them, which only `npm audit fix --force` installs; `isSemVerMajor` then
// says whether that update is also a major one.
export function describeFix(fix) {
  if (fix === true) return "`npm audit fix` installs it";
  return `\`npm audit fix --force\` updates ${fix.name} to ${fix.version}, ${fix.isSemVerMajor ? "a major update" : "outside its declared range"}`;
}

function runAudit() {
  const audit = spawnSync("npm audit --json", {
    shell: true,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  let report;
  try {
    report = JSON.parse(audit.stdout);
  } catch {
    console.error(audit.stderr || audit.stdout || String(audit.error));
    console.error("npm audit did not return a JSON report.");
    process.exit(1);
  }

  if (report.error) {
    console.error(`npm audit failed: ${report.error.summary ?? JSON.stringify(report.error)}`);
    process.exit(1);
  }
  return report;
}

function main() {
  const result = assess(runAudit());
  const { excused: held, lapsed, failing, unused } = result;

  for (const advisory of held) {
    console.log(`Excused ${advisory.id} (${advisory.severity}, ${advisory.name} ${advisory.range}): ${excused[advisory.id]}. npm audit finds no fix yet.`);
  }

  for (const id of unused) {
    console.error(`${id} is excused in scripts/audit.mjs, but npm audit no longer reports it. Remove the exception.`);
  }

  for (const advisory of lapsed) {
    console.error(`${advisory.id} (${advisory.name} ${advisory.range}) is excused in scripts/audit.mjs, but a fix now exists: ${describeFix(advisory.fix)}. Update the dependency, then remove the exception.`);
  }

  for (const advisory of failing) {
    console.error(`${advisory.severity}: ${advisory.name} ${advisory.range}: ${advisory.title} (${advisory.url})`);
  }

  if (!passes(result)) {
    if (failing.length > 0) {
      console.error(`${failing.length} high or critical advisories. Update the dependency, or excuse the advisory in scripts/audit.mjs with the reason; an exception only holds while there is no fix.`);
    }
    process.exit(1);
  }

  console.log(held.length > 0 ? "No high or critical advisories apart from the excused ones." : "No high or critical advisories.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
