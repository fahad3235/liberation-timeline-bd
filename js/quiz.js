/* liberation-timeline-bd — deterministic quiz generator (UMD: browser + Node) */
(function (root, factory) {
  if (typeof module === "object" && module.exports) { module.exports = factory(); }
  else { root.LTB_QUIZ = factory(); }
}(typeof self !== "undefined" ? self : this, function () {
"use strict";

/* mulberry32 — small deterministic PRNG */
function rng32(seed) {
  var a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  var a = arr.slice(), i, j, t;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(rand() * (i + 1));
    t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

var MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var MONTHS_BN = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

function fmtDate(iso, lang) {
  var p = iso.split("-"), d = parseInt(p[2], 10), m = parseInt(p[1], 10) - 1;
  if (lang === "bn") {
    var digits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
    var bnNum = function (n) { return String(n).split("").map(function (c) { return digits[+c]; }).join(""); };
    return bnNum(d) + " " + MONTHS_BN[m] + " " + bnNum(1971);
  }
  return d + " " + MONTHS_EN[m] + " 1971";
}

/* Build `count` multiple-choice questions from the event list.
 * Types alternate: "date" (given event title, pick the date) and
 * "event" (given a date, pick what happened). Deterministic per seed. */
function buildQuiz(events, seed, count, lang) {
  count = Math.min(count || 10, events.length);
  lang = (lang === "bn") ? "bn" : "en";
  var rand = rng32(seed);
  var pool = shuffle(events, rand);
  var questions = [];
  for (var i = 0; i < count; i++) {
    var ev = pool[i];
    var others = events.filter(function (e) { return e.id !== ev.id; });
    var type = (i % 2 === 0) ? "date" : "event";
    var q, opts, correct;
    if (type === "date") {
      var distDates = [];
      var shuffled = shuffle(others, rand);
      for (var k = 0; k < shuffled.length && distDates.length < 3; k++) {
        if (shuffled[k].date !== ev.date && distDates.indexOf(shuffled[k].date) < 0) {
          distDates.push(shuffled[k].date);
        }
      }
      opts = shuffle([{ t: fmtDate(ev.date, lang), ok: true }].concat(distDates.map(function (d) {
        return { t: fmtDate(d, lang), ok: false };
      })), rand);
      q = { type: "date", prompt: ev.title[lang], eventId: ev.id, options: opts.map(function (o) { return o.t; }) };
    } else {
      var distEvents = shuffle(others, rand).slice(0, 3);
      opts = shuffle([{ t: ev.title[lang], ok: true }].concat(distEvents.map(function (e) {
        return { t: e.title[lang], ok: false };
      })), rand);
      q = { type: "event", prompt: fmtDate(ev.date, lang), eventId: ev.id, options: opts.map(function (o) { return o.t; }) };
    }
    correct = opts.findIndex(function (o) { return o.ok; });
    q.correctIndex = correct;
    q.correctText = opts[correct].t;
    questions.push(q);
  }
  return questions;
}

function grade(questions, answers) {
  var score = 0;
  for (var i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].correctIndex) score++;
  }
  return score;
}

return { buildQuiz: buildQuiz, grade: grade, fmtDate: fmtDate, rng32: rng32 };
}));
