import assert from "node:assert/strict";
import test from "node:test";
import { assess, describeFix, excused, passes } from "../../scripts/audit.mjs";

const braces = "GHSA-vfj7-8cjw-p6xm";
const exceptions = { [braces]: "no fixed release yet" };

function advisory(id, name, severity) {
  return {
    source: 1,
    name,
    title: `${name} advisory`,
    url: `https://github.com/advisories/${id}`,
    severity,
    range: "<=3.0.3",
  };
}

// The shape `npm audit --json` gives a vulnerable package and one that only
// depends on it: the advisory object sits on the vulnerable package.
function report(fixAvailable, extra = {}) {
  return {
    vulnerabilities: {
      braces: {
        name: "braces",
        severity: "high",
        via: [advisory(braces, "braces", "high")],
        fixAvailable,
      },
      micromatch: { name: "micromatch", severity: "high", via: ["braces"], fixAvailable },
      ...extra,
    },
  };
}

const ids = (advisories) => advisories.map((entry) => entry.id);

test("an excused advisory holds while npm audit finds no fix", () => {
  const result = assess(report(false), exceptions);
  assert.deepEqual(ids(result.excused), [braces]);
  assert.deepEqual(ids(result.lapsed), []);
  assert.deepEqual(ids(result.failing), []);
  assert.deepEqual(result.unused, []);
  assert.equal(passes(result), true);
});

test("an exception lapses as soon as npm audit finds a fix", () => {
  const fixes = [
    true,
    { name: "stylelint", version: "17.15.0", isSemVerMajor: false },
    { name: "stylelint", version: "18.0.0", isSemVerMajor: true },
  ];
  for (const fix of fixes) {
    const result = assess(report(fix), exceptions);
    assert.deepEqual(ids(result.lapsed), [braces]);
    assert.deepEqual(ids(result.excused), []);
    assert.equal(passes(result), false);
  }
});

test("a fix outside the declared ranges is named with npm audit fix --force", () => {
  assert.equal(describeFix(true), "`npm audit fix` installs it");
  for (const isSemVerMajor of [false, true]) {
    assert.match(describeFix({ name: "stylelint", version: "18.0.0", isSemVerMajor }), /^`npm audit fix --force` updates stylelint to 18\.0\.0, /);
  }
});

test("high and critical advisories without an exception fail, and moderate ones pass", () => {
  const result = assess(
    report(false, {
      "source-map-js": {
        name: "source-map-js",
        severity: "high",
        via: [advisory("GHSA-68fv-2mgg-jv7q", "source-map-js", "high")],
        fixAvailable: true,
      },
      "postcss-selector-parser": {
        name: "postcss-selector-parser",
        severity: "moderate",
        via: [advisory("GHSA-rj75-hqrm-r3gf", "postcss-selector-parser", "moderate")],
        fixAvailable: true,
      },
    }),
    exceptions,
  );
  assert.deepEqual(ids(result.failing), ["GHSA-68fv-2mgg-jv7q"]);
  assert.deepEqual(ids(result.excused), [braces]);
});

test("an exception npm audit no longer reports fails until it is removed", () => {
  const result = assess({ vulnerabilities: {} }, exceptions);
  assert.deepEqual(result.unused, [braces]);
  assert.equal(passes(result), false);
});

test("every exception gives its reason", () => {
  for (const [id, reason] of Object.entries(excused)) {
    assert.match(id, /^GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/);
    assert.ok(reason.length > 20, `${id} needs a reason`);
  }
});
