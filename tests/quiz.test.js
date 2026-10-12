/* liberation-timeline-bd — quiz logic unit tests */
"use strict";
const QUIZ = require("../js/quiz.js");
const D = require("../js/data.js");

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; }
  else { fail++; failures.push(name + (detail ? " — " + detail : "")); }
}

/* determinism */
const a = QUIZ.buildQuiz(D.EVENTS, 42, 10, "en");
const b = QUIZ.buildQuiz(D.EVENTS, 42, 10, "en");
check("deterministic: same seed → identical quiz", JSON.stringify(a) === JSON.stringify(b));
const c = QUIZ.buildQuiz(D.EVENTS, 43, 10, "en");
check("different seed → different quiz", JSON.stringify(a) !== JSON.stringify(c));

/* rng sanity */
const r1 = QUIZ.rng32(7), r2 = QUIZ.rng32(7);
check("rng32 deterministic", r1() === r2());
const vals = Array.from({ length: 100 }, () => QUIZ.rng32(1)());
check("rng32 in [0,1)", vals.every(v => v >= 0 && v < 1));

/* structure across many seeds */
for (const seed of [1, 2, 777, 123456]) {
  const qs = QUIZ.buildQuiz(D.EVENTS, seed, 10, "en");
  const types = new Set(qs.map(q => q.type));
  check("seed " + seed + ": both question types present", types.has("date") && types.has("event"), [...types].join(","));
  qs.forEach((q, i) => {
    if (q.type === "date") {
      const ev = D.EVENTS.find(e => e.id === q.eventId);
      check("seed " + seed + " q" + i + " date-type prompt is event title", q.prompt === ev.title.en);
      check("seed " + seed + " q" + i + " correctText is formatted date", q.correctText === QUIZ.fmtDate(ev.date, "en"));
    } else {
      const ev = D.EVENTS.find(e => e.id === q.eventId);
      check("seed " + seed + " q" + i + " event-type prompt is formatted date", q.prompt === QUIZ.fmtDate(ev.date, "en"));
      check("seed " + seed + " q" + i + " correctText is event title", q.correctText === ev.title.en);
    }
  });
}

/* full-length quiz: every event usable exactly once */
const full = QUIZ.buildQuiz(D.EVENTS, 5, D.EVENTS.length, "en");
check("full quiz covers all events once", full.length === D.EVENTS.length &&
  new Set(full.map(q => q.eventId)).size === D.EVENTS.length);

/* count clamps to dataset size */
check("count clamps to dataset", QUIZ.buildQuiz(D.EVENTS, 5, 9999, "en").length === D.EVENTS.length);

/* fmtDate */
check("fmtDate en", QUIZ.fmtDate("1971-12-16", "en") === "16 December 1971", QUIZ.fmtDate("1971-12-16", "en"));
check("fmtDate bn", QUIZ.fmtDate("1971-12-16", "bn") === "১৬ ডিসেম্বর ১৯৭১", QUIZ.fmtDate("1971-12-16", "bn"));
check("fmtDate bn single digit", QUIZ.fmtDate("1971-03-07", "bn") === "৭ মার্চ ১৯৭১", QUIZ.fmtDate("1971-03-07", "bn"));

/* grade edge cases */
check("grade: partial", QUIZ.grade([{ correctIndex: 0 }, { correctIndex: 1 }, { correctIndex: 2 }], [0, 9, 2]) === 2);
check("grade: empty answers", QUIZ.grade([{ correctIndex: 0 }], []) === 0);
check("grade: undefined answer", QUIZ.grade([{ correctIndex: 0 }], [undefined]) === 0);

/* bn quiz uses Bengali strings */
const bnq = QUIZ.buildQuiz(D.EVENTS, 11, 4, "bn");
check("bn quiz prompts non-empty", bnq.every(q => q.prompt.length > 0));
check("bn date-type correctText has Bengali digits", bnq.filter(q => q.type === "date").every(q => /[০-৯]/.test(q.correctText)));

console.log("\nQUIZ UNIT: " + pass + " passed, " + fail + " failed");
if (failures.length) { console.log("FAILURES:\n - " + failures.join("\n - ")); process.exit(1); }
