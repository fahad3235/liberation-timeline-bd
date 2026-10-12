/* liberation-timeline-bd — data validation over the ENTIRE dataset */
"use strict";
const D = require("../js/data.js");
const QUIZ = require("../js/quiz.js");

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; }
  else { fail++; failures.push(name + (detail ? " — " + detail : "")); }
}
const ISO = /^\d{4}-\d{2}-\d{2}$/;
function validISO(s) {
  if (!ISO.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
function bi(obj, ctx) {
  return obj && typeof obj.en === "string" && obj.en.trim().length > 0 &&
         typeof obj.bn === "string" && obj.bn.trim().length > 0;
}

/* ---------- EVENTS ---------- */
check("events: non-empty array", Array.isArray(D.EVENTS) && D.EVENTS.length >= 40, "count=" + D.EVENTS.length);
const ids = new Set(), dtTitle = new Set();
const figIds = new Set(D.FIGURES.map(f => f.id));
const tagSet = new Set(D.TAGS);
D.EVENTS.forEach((e, i) => {
  const ctx = "event[" + i + "] id=" + e.id;
  check(ctx + " unique id", !ids.has(e.id)); ids.add(e.id);
  check(ctx + " valid ISO date", validISO(e.date), e.date);
  check(ctx + " date in 1971-03..1971-12", e.date >= "1971-03-01" && e.date <= "1971-12-31", e.date);
  check(ctx + " bilingual title", bi(e.title, ctx));
  check(ctx + " bilingual desc", bi(e.desc, ctx));
  check(ctx + " desc has substance (>=40 chars)", e.desc.en.length >= 40 && e.desc.bn.length >= 40);
  check(ctx + " tags non-empty & known", Array.isArray(e.tags) && e.tags.length > 0 && e.tags.every(t => tagSet.has(t)), JSON.stringify(e.tags));
  check(ctx + " figures array", Array.isArray(e.figures));
  e.figures.forEach(fid => check(ctx + " figure ref exists: " + fid, figIds.has(fid)));
  const key = e.date + "|" + e.title.en.toLowerCase();
  check(ctx + " no duplicate date+title", !dtTitle.has(key)); dtTitle.add(key);
  check(ctx + " key is boolean", typeof e.key === "boolean");
});
check("events: sorted chronologically", D.EVENTS.every((e, i, a) => i === 0 || a[i - 1].date <= e.date));
const keyEvents = D.EVENTS.filter(e => e.key).map(e => e.id);
["e0307","e0325","e0326","e0410","e0417","e0711","e0815","e1121a","e1203a","e1206","e1214a","e1216"]
  .forEach(id => check("anchor event present & key: " + id, keyEvents.includes(id)));
/* anchor dates spot-check */
const byId = Object.fromEntries(D.EVENTS.map(e => [e.id, e]));
check("anchor: 7 March speech", byId.e0307.date === "1971-03-07");
check("anchor: Operation Searchlight", byId.e0325.date === "1971-03-25");
check("anchor: declaration", byId.e0326.date === "1971-03-26");
check("anchor: Zia broadcast 27 Mar", byId.e0327.date === "1971-03-27");
check("anchor: Mujibnagar formed 10 Apr", byId.e0410.date === "1971-04-10");
check("anchor: oath 17 Apr", byId.e0417.date === "1971-04-17");
check("anchor: sectors conference 11 Jul", byId.e0711.date === "1971-07-11");
check("anchor: full-scale war 3 Dec", byId.e1203a.date === "1971-12-03");
check("anchor: surrender 16 Dec", byId.e1216.date === "1971-12-16");

/* ---------- FIGURES ---------- */
check("figures: count >= 15", D.FIGURES.length >= 15, "count=" + D.FIGURES.length);
const fids = new Set();
D.FIGURES.forEach((f, i) => {
  const ctx = "figure[" + i + "] id=" + f.id;
  check(ctx + " unique id", !fids.has(f.id)); fids.add(f.id);
  check(ctx + " bilingual name", bi(f.name, ctx));
  check(ctx + " bilingual role", bi(f.role, ctx));
  check(ctx + " >=2 facts", Array.isArray(f.facts) && f.facts.length >= 2, "facts=" + (f.facts && f.facts.length));
  f.facts.forEach((x, j) => check(ctx + " fact[" + j + "] bilingual", bi(x, ctx)));
});
["mujib","nazrul","tajuddin","osmani","rab","khandker","zia","shafiullah","khaled","jalil","osman","indira","aurora","niazi","yahya","tikka"]
  .forEach(id => check("required figure present: " + id, fids.has(id)));

/* ---------- BIR SRESHTHO ---------- */
check("bir sreshtho: exactly 7", D.BIR_SRESHTHO.length === 7, "count=" + D.BIR_SRESHTHO.length);
const bn = new Set();
D.BIR_SRESHTHO.forEach((b, i) => {
  check("bir[" + i + "] unique id", !bn.has(b.id)); bn.add(b.id);
  check("bir[" + i + "] bilingual name", bi(b.name, "bir" + i));
  check("bir[" + i + "] bilingual note", bi(b.note, "bir" + i));
});
["matiu","hamidur","nurmohammad","mostafa","rouf","ruhul","jahangir"]
  .forEach(id => check("bir sreshtho present: " + id, bn.has(id)));

/* ---------- SECTORS ---------- */
check("sectors: exactly 11", D.SECTORS.length === 11);
const snums = D.SECTORS.map(s => s.n).sort((a, b) => a - b);
check("sectors: numbered 1..11", JSON.stringify(snums) === JSON.stringify([1,2,3,4,5,6,7,8,9,10,11]));
D.SECTORS.forEach((s, i) => {
  check("sector[" + i + "] bilingual commander", bi(s.commander, "s" + i));
  check("sector[" + i + "] bilingual area", bi(s.area, "s" + i));
});

/* ---------- OPERATIONS ---------- */
check("operations: count >= 8", D.OPERATIONS.length >= 8, "count=" + D.OPERATIONS.length);
const oids = new Set();
D.OPERATIONS.forEach((o, i) => {
  check("op[" + i + "] unique id", !oids.has(o.id)); oids.add(o.id);
  check("op[" + i + "] bilingual title", bi(o.title, "o" + i));
  check("op[" + i + "] bilingual summary", bi(o.summary, "o" + i));
  check("op[" + i + "] bilingual dates", bi(o.dates, "o" + i));
});

/* ---------- QUIZ GENERATOR (over real data) ---------- */
[12345, 999].forEach(seed => {
  ["en", "bn"].forEach(lang => {
    const qs = QUIZ.buildQuiz(D.EVENTS, seed, 10, lang);
    check("quiz[" + seed + "," + lang + "]: 10 questions", qs.length === 10);
    qs.forEach((q, i) => {
      check("quiz q[" + i + "]: 4 options", q.options.length === 4);
      check("quiz q[" + i + "]: unique options", new Set(q.options).size === 4);
      check("quiz q[" + i + "]: valid correctIndex", q.correctIndex >= 0 && q.correctIndex < 4);
      check("quiz q[" + i + "]: correctText matches option", q.options[q.correctIndex] === q.correctText);
      check("quiz q[" + i + "]: prompt non-empty", typeof q.prompt === "string" && q.prompt.length > 0);
    });
    const idsInQuiz = new Set(qs.map(q => q.eventId));
    check("quiz[" + seed + "," + lang + "]: no repeated event", idsInQuiz.size === qs.length);
  });
});
check("grade(): full marks", QUIZ.grade([{ correctIndex: 1 }, { correctIndex: 3 }], [1, 3]) === 2);
check("grade(): zero marks", QUIZ.grade([{ correctIndex: 1 }, { correctIndex: 3 }], [0, 2]) === 0);

/* ---------- secrets scan ---------- */
const fs = require("fs"), path = require("path");
const src = ["../js/data.js", "../js/quiz.js", "../js/app.js", "../index.html", "../css/styles.css"]
  .map(f => fs.readFileSync(path.join(__dirname, f), "utf8")).join("\n");
check("no API keys/tokens", !/(api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{8,}/i.test(src));
check("no http(s) resource URLs", !/(src|href)\s*=\s*["']https?:\/\//i.test(src));
check("no fetch/XHR", !/fetch\s*\(|XMLHttpRequest|sendBeacon/.test(src));

console.log("\nDATA VALIDATION: " + pass + " passed, " + fail + " failed");
if (failures.length) { console.log("FAILURES:\n - " + failures.join("\n - ")); process.exit(1); }
