// Fails on high or critical npm advisories, like `npm audit --audit-level=high`,
// apart from the advisories excused below. CI runs this instead of `npm audit`.
// Each exception says why it is safe for now and when to drop it.
import { spawnSync } from "node:child_process";

const excused = {
  // braces 3.0.3 and below, through stylelint > micromatch. No fixed release
  // exists yet. It only expands the glob patterns in this repository's own lint
  // command, never outside input, and none of it reaches the published site.
  // Drop this once braces ships a fix (Dependabot will open the pull request).
  "GHSA-vfj7-8cjw-p6xm": "braces has no fixed release yet; development-only",
};

const severe = new Set(["high", "critical"]);

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

// Advisories appear as objects in each vulnerable package's `via` list. The
// packages that only depend on a vulnerable one list its name as a string.
const advisories = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via === "object") {
      const id = via.url?.split("/").pop() || String(via.source);
      advisories.set(id, { ...via, id });
    }
  }
}

const found = [...advisories.values()].filter((advisory) => severe.has(advisory.severity));
const failing = found.filter((advisory) => !Object.hasOwn(excused, advisory.id));

for (const advisory of found.filter((advisory) => Object.hasOwn(excused, advisory.id))) {
  console.log(`Excused ${advisory.id} (${advisory.severity}, ${advisory.name} ${advisory.range}): ${excused[advisory.id]}.`);
}

for (const id of Object.keys(excused)) {
  if (!advisories.has(id)) {
    console.log(`::warning::${id} is excused in scripts/audit.mjs, but npm audit no longer reports it. Remove the exception.`);
  }
}

if (failing.length > 0) {
  for (const advisory of failing) {
    console.error(`${advisory.severity}: ${advisory.name} ${advisory.range}: ${advisory.title} (${advisory.url})`);
  }
  console.error(`${failing.length} high or critical advisories. Update the dependency, or excuse the advisory in scripts/audit.mjs with the reason.`);
  process.exit(1);
}

console.log(found.length > 0 ? "No high or critical advisories apart from the excused ones." : "No high or critical advisories.");
