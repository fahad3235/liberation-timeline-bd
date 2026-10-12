/* liberation-timeline-bd — UI (vanilla JS, zero network) */
(function () {
"use strict";
var D = window.LTB_DATA, Q = window.LTB_QUIZ;

var MONTHS = {
  en: ["March","April","May","June","July","August","September","October","November","December"],
  bn: ["মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"]
};
var MONTH_NUM = [3,4,5,6,7,8,9,10,11,12];

var S = {
  en: {
    tagline:"March – December 1971",
    timeline:"Timeline", journey:"Journey", figures:"Key Figures", sectors:"Sectors & Operations",
    quiz:"Quiz", about:"About",
    timelineHead:"Chronological Event Explorer", timelineSub:"Every event verified against published sources.",
    searchPh:"Search events…",
    journeyHead:"The Nine-Month Journey", journeySub:"Month-by-month progression from March to December 1971.",
    events:"events", keyEvent:"Key event",
    figHead:"Key Figures", figSub:"Roles and key facts only — no invented anecdotes.",
    secHead:"The 11 Sectors", secSub:"Decided at the July 1971 Sector Commanders' Conference.",
    sector:"Sector", commander:"Commander", area:"Area of operation",
    opsHead:"Major Operations & Battles", opsSub:"Factual summaries of the war's key operations.",
    birHead:"Bir Sreshtho — the seven highest gallantry honours",
    quizHead:"Quiz Mode", startSub:"10 questions generated from the timeline. Date ↔ event matching.",
    start:"Start quiz", best:"Best score", question:"Question", of:"of", next:"Next →", finish:"See results",
    qDatePrompt:"On which date did this happen?", qEventPrompt:"What happened on this date?",
    yourScore:"Your score", retake:"Retake quiz", review:"Review answers",
    correct:"Correct", wrong:"Wrong", correctWas:"Correct answer",
    aboutHead:"About this project",
    noResults:"No events match your search.",
    footer:"Educational project. All dates verified against published sources listed in the README. No casualty figures are asserted where estimates vary."
  },
  bn: {
    tagline:"মার্চ – ডিসেম্বর ১৯৭১",
    timeline:"সময়রেখা", journey:"যাত্রা", figures:"গুরুত্বপূর্ণ ব্যক্তিত্ব", sectors:"সেক্টর ও অভিযান",
    quiz:"কুইজ", about:"সম্পর্কে",
    timelineHead:"কালানুক্রমিক ঘটনা অন্বেষণ", timelineSub:"প্রতিটি ঘটনা প্রকাশিত উৎসের সঙ্গে যাচাইকৃত।",
    searchPh:"ঘটনা খুঁজুন…",
    journeyHead:"নয় মাসের যাত্রা", journeySub:"১৯৭১ সালের মার্চ থেকে ডিসেম্বর — মাসভিত্তিক অগ্রগতি।",
    events:"টি ঘটনা", keyEvent:"গুরুত্বপূর্ণ ঘটনা",
    figHead:"গুরুত্বপূর্ণ ব্যক্তিত্ব", figSub:"শুধু ভূমিকা ও মূল তথ্য — কোনো কাল্পনিক কাহিনি নয়।",
    secHead:"১১টি সেক্টর", secSub:"১৯৭১ সালের জুলাইয়ের সেক্টর কমান্ডার সম্মেলনে নির্ধারিত।",
    sector:"সেক্টর", commander:"কমান্ডার", area:"অপারেশন এলাকা",
    opsHead:"প্রধান অভিযান ও যুদ্ধ", opsSub:"যুদ্ধের প্রধান অভিযানগুলোর তথ্যভিত্তিক সারসংক্ষেপ।",
    birHead:"বীরশ্রেষ্ঠ — সাতটি সর্বোচ্চ বীরত্ব পদক",
    quizHead:"কুইজ মোড", startSub:"সময়রেখা থেকে তৈরি ১০টি প্রশ্ন। তারিখ ↔ ঘটনা মিলানো।",
    start:"কুইজ শুরু করুন", best:"সেরা স্কোর", question:"প্রশ্ন", of:"/", next:"পরেরটি →", finish:"ফলাফল দেখুন",
    qDatePrompt:"এটি কোন তারিখে ঘটেছিল?", qEventPrompt:"এই তারিখে কী ঘটেছিল?",
    yourScore:"আপনার স্কোর", retake:"আবার কুইজ দিন", review:"উত্তর পর্যালোচনা",
    correct:"সঠিক", wrong:"ভুল", correctWas:"সঠিক উত্তর",
    aboutHead:"এই প্রকল্প সম্পর্কে",
    noResults:"আপনার খোঁজের সঙ্গে কোনো ঘটনা মেলেনি।",
    footer:"শিক্ষামূলক প্রকল্প। সব তারিখ README-তে তালিকাভুক্ত প্রকাশিত উৎসের সঙ্গে যাচাইকৃত। যেখানে অনুমান ভিন্ন, সেখানে হতাহতের সংখ্যা দাবি করা হয়নি।"
  }
};

var state = { lang: "en", view: "timeline", month: 0, query: "",
              quiz: null, qi: 0, answers: [], locked: false };

function $(id) { return document.getElementById(id); }
function t(key) { return S[state.lang][key]; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

function init() {
  try { state.lang = localStorage.getItem("ltb-lang") || "en"; } catch (e) {}
  if (state.lang !== "bn") state.lang = "en";
  document.body.setAttribute("lang", state.lang);
  buildTabs(); buildMonthNav();
  document.querySelectorAll("nav.tabs button").forEach(function (b) {
    b.addEventListener("click", function () { switchView(b.dataset.view); });
  });
  $("langbtn").addEventListener("click", function () {
    state.lang = (state.lang === "en") ? "bn" : "en";
    try { localStorage.setItem("ltb-lang", state.lang); } catch (e) {}
    document.body.setAttribute("lang", state.lang);
    renderAll();
  });
  $("search").addEventListener("input", function (e) { state.query = e.target.value.trim().toLowerCase(); renderTimeline(); });
  $("modalback").addEventListener("click", function (e) { if (e.target.id === "modalback") closeModal(); });
  renderAll();
  switchView("timeline");
}

function buildTabs() {
  var tabs = [["timeline","timeline"],["journey","journey"],["figures","figures"],["sectors","sectors"],["quiz","quiz"],["about","about"]];
  var nav = $("tabs");
  nav.innerHTML = "";
  tabs.forEach(function (pair) {
    var b = document.createElement("button");
    b.dataset.view = pair[0];
    b.textContent = t(pair[1]);
    nav.appendChild(b);
  });
}

function buildMonthNav() {
  var mn = $("monthnav");
  mn.innerHTML = "";
  MONTH_NUM.forEach(function (m, i) {
    var b = document.createElement("button");
    b.textContent = MONTHS[state.lang][i];
    b.dataset.i = i;
    b.addEventListener("click", function () { state.month = i; renderMonthNav(); renderTimeline(); });
    mn.appendChild(b);
  });
  renderMonthNav();
}

function renderMonthNav() {
  document.querySelectorAll("#monthnav button").forEach(function (b) {
    b.textContent = MONTHS[state.lang][+b.dataset.i];
    b.classList.toggle("active", +b.dataset.i === state.month);
  });
}

function switchView(v) {
  state.view = v;
  document.querySelectorAll("nav.tabs button").forEach(function (b) {
    b.classList.toggle("active", b.dataset.view === v);
  });
  document.querySelectorAll("main .view").forEach(function (el) {
    el.classList.toggle("active", el.id === "view-" + v);
  });
  if (v === "quiz" && !state.quiz) renderQuizStart();
}

function renderAll() {
  buildTabs(); buildMonthNav();
  document.querySelectorAll("nav.tabs button").forEach(function (b) {
    b.addEventListener("click", function () { switchView(b.dataset.view); });
    b.classList.toggle("active", b.dataset.view === state.view);
  });
  $("brand-title").textContent = state.lang === "en" ? "Liberation Timeline BD" : "মুক্তিযুদ্ধের সময়রেখা";
  $("brand-sub").textContent = t("tagline");
  $("langbtn").textContent = state.lang === "en" ? "বাংলা" : "English";
  $("search").placeholder = t("searchPh");
  $("foot").textContent = t("footer");
  renderHeadings(); renderTimeline(); renderJourney(); renderFigures(); renderSectors(); renderAbout();
  if (state.view === "quiz") renderQuizStart(); else { state.quiz = null; }
}

function renderHeadings() {
  var map = { timeline:["h-timeline","timelineHead","timelineSub"], journey:["h-journey","journeyHead","journeySub"],
              figures:["h-figures","figHead","figSub"], sectors:["h-sectors","secHead","secSub"],
              quiz:["h-quiz","quizHead","startSub"], about:["h-about","aboutHead",""] };
  Object.keys(map).forEach(function (v) {
    var ids = map[v], h = $(ids[0]);
    if (h) h.innerHTML = "<h2>" + esc(t(ids[1])) + "</h2>" + (ids[2] ? "<p>" + esc(t(ids[2])) + "</p>" : "");
  });
}

/* ---------------- timeline ---------------- */
function filteredEvents() {
  var q = state.query, m = MONTH_NUM[state.month];
  return D.EVENTS.filter(function (e) {
    var em = +e.date.slice(5, 7);
    if (em !== m) return false;
    if (!q) return true;
    var hay = (e.title.en + " " + e.title.bn + " " + e.desc.en + " " + e.desc.bn).toLowerCase();
    return hay.indexOf(q) >= 0;
  });
}

function renderTimeline() {
  var list = $("timeline-list"), evs = filteredEvents();
  list.innerHTML = "";
  if (!evs.length) { list.innerHTML = '<p style="color:var(--muted)">' + esc(t("noResults")) + "</p>"; return; }
  evs.forEach(function (e) {
    var d = document.createElement("div");
    d.className = "ev" + (e.key ? " key" : "");
    d.innerHTML = '<span class="date">' + esc(Q.fmtDate(e.date, state.lang)) + (e.key ? '<span class="keystar">★ ' + esc(t("keyEvent")) + "</span>" : "") + "</span>" +
      "<h3>" + esc(e.title[state.lang]) + "</h3><p>" + esc(e.desc[state.lang]) + "</p>" +
      '<div class="tags">' + e.tags.map(function (g) { return '<span class="tag">' + esc(g) + "</span>"; }).join("") + "</div>";
    d.addEventListener("click", function () { openEventModal(e); });
    list.appendChild(d);
  });
}

function figById(id) { return D.FIGURES.filter(function (f) { return f.id === id; })[0]; }

function openEventModal(e) {
  var chips = e.figures.map(function (fid) {
    var f = figById(fid);
    return f ? '<button class="figchip" data-fig="' + fid + '">' + esc(f.name[state.lang]) + "</button>" : "";
  }).join("");
  $("modalbody").innerHTML =
    '<span class="date">' + esc(Q.fmtDate(e.date, state.lang)) + "</span>" +
    "<h2>" + esc(e.title[state.lang]) + "</h2><p>" + esc(e.desc[state.lang]) + "</p>" +
    (chips ? '<div class="figlinks">' + chips + "</div>" : "");
  $("modalbody").querySelectorAll(".figchip").forEach(function (c) {
    c.addEventListener("click", function (ev) { ev.stopPropagation(); openFigureModal(figById(c.dataset.fig)); });
  });
  $("modalback").classList.add("open");
}

function openFigureModal(f) {
  if (!f) return;
  $("modalbody").innerHTML =
    '<span class="date">' + esc(f.role[state.lang]) + "</span>" +
    "<h2>" + esc(f.name[state.lang]) + "</h2>" +
    "<ul style='list-style:none'>" + f.facts.map(function (x) {
      return "<li style='padding:6px 0 6px 18px;position:relative'><span style='position:absolute;left:0;color:var(--green)'>▸</span>" + esc(x[state.lang]) + "</li>";
    }).join("") + "</ul>";
  $("modalback").classList.add("open");
}

function closeModal() { $("modalback").classList.remove("open"); }

/* ---------------- journey ---------------- */
function renderJourney() {
  var j = $("journey"); j.innerHTML = "";
  var max = 0;
  var byMonth = MONTH_NUM.map(function (m) {
    var evs = D.EVENTS.filter(function (e) { return +e.date.slice(5, 7) === m; });
    if (evs.length > max) max = evs.length;
    return evs;
  });
  MONTH_NUM.forEach(function (m, i) {
    var evs = byMonth[i].slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var box = document.createElement("div");
    box.className = "jmonth";
    var pct = max ? Math.round(evs.length / max * 100) : 0;
    box.innerHTML = '<div class="jhead"><div class="jdot">' + (i + 1) + "</div><h3>" + esc(MONTHS[state.lang][i]) + ' 1971</h3><span class="jcount">' +
      evs.length + " " + esc(t("events")) + "</span></div>" +
      '<div class="jbar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="jlist">' + evs.map(function (e) {
        return '<div class="jitem" data-ev="' + e.id + '"><b>' + esc(Q.fmtDate(e.date, state.lang)) + "</b>" + esc(e.title[state.lang]) + (e.key ? " ★" : "") + "</div>";
      }).join("") + "</div>";
    j.appendChild(box);
  });
  j.querySelectorAll(".jitem").forEach(function (el) {
    el.addEventListener("click", function () {
      var e = D.EVENTS.filter(function (x) { return x.id === el.dataset.ev; })[0];
      openEventModal(e);
    });
  });
}

/* ---------------- figures ---------------- */
function renderFigures() {
  var g = $("figgrid"); g.innerHTML = "";
  D.FIGURES.forEach(function (f) {
    var d = document.createElement("div");
    d.className = "figcard";
    d.innerHTML = '<div class="avatar">' + esc(f.name.en.charAt(0)) + "</div><h3>" + esc(f.name[state.lang]) + '</h3><div class="role">' +
      esc(f.role[state.lang]) + "</div><ul>" + f.facts.map(function (x) { return "<li>" + esc(x[state.lang]) + "</li>"; }).join("") + "</ul>";
    d.addEventListener("click", function () { openFigureModal(f); });
    g.appendChild(d);
  });
}

/* ---------------- sectors & ops ---------------- */
function renderSectors() {
  var body = $("sectors-body"); body.innerHTML = "";
  var twrap = document.createElement("div");
  twrap.innerHTML = '<table class="sectable"><thead><tr><th>#</th><th>' + esc(t("commander")) + "</th><th>" + esc(t("area")) + '</th></tr></thead><tbody id="sectable-body"></tbody></table>';
  body.appendChild(twrap);
  var tb = $("sectable-body");
  D.SECTORS.forEach(function (s) {
    var tr = document.createElement("tr");
    tr.innerHTML = '<td class="n">' + s.n + "</td><td>" + esc(s.commander[state.lang]) + "</td><td>" + esc(s.area[state.lang]) + "</td>";
    tb.appendChild(tr);
  });
  var oh = document.createElement("div");
  oh.className = "section-head"; oh.style.marginTop = "30px";
  oh.innerHTML = "<h2>" + esc(t("opsHead")) + "</h2><p>" + esc(t("opsSub")) + "</p>";
  body.appendChild(oh);
  var og = document.createElement("div"); og.className = "opgrid";
  D.OPERATIONS.forEach(function (o) {
    var d = document.createElement("div");
    d.className = "opcard";
    d.innerHTML = "<h3>" + esc(o.title[state.lang]) + '</h3><div class="dates">' + esc(o.dates[state.lang]) + "</div><p>" + esc(o.summary[state.lang]) + "</p>";
    og.appendChild(d);
  });
  body.appendChild(og);
  var bh = document.createElement("div");
  bh.className = "section-head"; bh.style.marginTop = "30px";
  bh.innerHTML = "<h2>" + esc(t("birHead")) + '</h2><span class="count-chip">' + D.BIR_SRESHTHO.length + "</span>";
  body.appendChild(bh);
  var bg = document.createElement("div"); bg.className = "opgrid";
  D.BIR_SRESHTHO.forEach(function (b) {
    var d = document.createElement("div");
    d.className = "opcard";
    d.style.borderLeftColor = "var(--gold)";
    d.innerHTML = "<h3>🎖 " + esc(b.name[state.lang]) + "</h3><p>" + esc(b.note[state.lang]) + "</p>";
    bg.appendChild(d);
  });
  body.appendChild(bg);
}

/* ---------------- quiz ---------------- */
function bestKey() { return "ltb-best-" + state.lang; }
function getBest() { try { return +(localStorage.getItem(bestKey()) || 0); } catch (e) { return 0; } }
function setBest(v) { try { localStorage.setItem(bestKey(), String(v)); } catch (e) {} }

function renderQuizStart() {
  state.quiz = null;
  $("quizbox").innerHTML =
    '<div class="qresult"><p style="color:var(--muted)">' + esc(t("startSub")) + '</p><div class="best">' + esc(t("best")) + ": " + getBest() + " / 10</div>" +
    '<button class="qbtn" id="qstart">' + esc(t("start")) + "</button></div>";
  $("qstart").addEventListener("click", startQuiz);
}

function startQuiz() {
  var seed = (Date.now() % 1000000) >>> 0;
  state.quiz = Q.buildQuiz(D.EVENTS, seed, 10, state.lang);
  state.qi = 0; state.answers = []; state.locked = false;
  renderQuestion();
}

function renderQuestion() {
  var q = state.quiz[state.qi], total = state.quiz.length;
  var promptLabel = q.type === "date" ? t("qDatePrompt") : t("qEventPrompt");
  var html = '<div class="qprogress"><span>' + esc(t("question")) + " " + (state.qi + 1) + " " + esc(t("of")) + " " + total + "</span><span>" + esc(promptLabel) + "</span></div>" +
    '<div class="qbar"><i style="width:' + Math.round(state.qi / total * 100) + '%"></i></div>' +
    '<div class="qprompt">' + esc(q.prompt) + '</div><div class="qopts">' +
    q.options.map(function (o, i) { return '<button class="qopt" data-i="' + i + '">' + esc(o) + "</button>"; }).join("") + "</div>" +
    '<div id="qnext"></div>';
  $("quizbox").innerHTML = html;
  $("quizbox").querySelectorAll(".qopt").forEach(function (b) {
    b.addEventListener("click", function () { answer(+b.dataset.i); });
  });
}

function answer(i) {
  if (state.locked) return;
  state.locked = true;
  var q = state.quiz[state.qi];
  state.answers.push(i);
  var btns = $("quizbox").querySelectorAll(".qopt");
  btns.forEach(function (b, bi) {
    b.disabled = true;
    if (bi === q.correctIndex) b.classList.add("correct");
    else if (bi === i) b.classList.add("wrong");
  });
  var last = state.qi === state.quiz.length - 1;
  $("qnext").innerHTML = '<button class="qbtn" id="qnextbtn">' + esc(last ? t("finish") : t("next")) + "</button>";
  $("qnextbtn").addEventListener("click", function () {
    state.qi++;
    if (state.qi >= state.quiz.length) renderResult();
    else { state.locked = false; renderQuestion(); }
  });
}

function renderResult() {
  var score = Q.grade(state.quiz, state.answers), total = state.quiz.length;
  if (score > getBest()) setBest(score);
  var html = '<div class="qresult"><p>' + esc(t("yourScore")) + '</p><div class="score">' + score + " / " + total + '</div>' +
    '<div class="best">' + esc(t("best")) + ": " + getBest() + " / " + total + "</div>" +
    '<button class="qbtn" id="qretake">' + esc(t("retake")) + "</button></div>" +
    '<div class="review"><h3 style="margin-bottom:8px">' + esc(t("review")) + "</h3>" +
    state.quiz.map(function (q, i) {
      var ok = state.answers[i] === q.correctIndex;
      return '<div class="ritem"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓ " + esc(t("correct")) : "✗ " + esc(t("wrong"))) + "</span> — " + esc(q.prompt) +
        '<br><span style="color:var(--muted)">' + esc(t("correctWas")) + ": " + esc(q.correctText) + "</span></div>";
    }).join("") + "</div>";
  $("quizbox").innerHTML = html;
  $("qretake").addEventListener("click", startQuiz);
  state.quiz = null;
}

/* ---------------- about ---------------- */
function renderAbout() {
  var el = $("about");
  if (state.lang === "en") {
    el.innerHTML = '<div class="about"><h3>Methodology</h3><p>This timeline covers March–December 1971 with 41 events, 19 key-figure profiles, the 11 war sectors, 9 major operations and battles, and the seven Bir Sreshtho recipients. Every date, name spelling and event was verified against multiple published sources before inclusion.</p>' +
    "<h3>What was left out</h3><p>Anything that could not be verified was omitted. Disputed casualty figures are never asserted — where estimates vary, the text says so. No anecdotes, quotes (beyond one famous public line from the 7 March speech) or details were invented.</p>" +
    "<h3>Offline</h3><p>The app makes zero network requests. Language preference and quiz best scores are stored only in your browser's localStorage.</p></div>";
  } else {
    el.innerHTML = '<div class="about"><h3>পদ্ধতি</h3><p>এই সময়রেখায় ১৯৭১ সালের মার্চ–ডিসেম্বর জুড়ে ৪১টি ঘটনা, ১৯ জন গুরুত্বপূর্ণ ব্যক্তিত্বের প্রোফাইল, ১১টি যুদ্ধ সেক্টর, ৯টি প্রধান অভিযান ও যুদ্ধ এবং সাতজন বীরশ্রেষ্ঠের তথ্য রয়েছে। অন্তর্ভুক্তির আগে প্রতিটি তারিখ, নামের বানান ও ঘটনা একাধিক প্রকাশিত উৎসের সঙ্গে যাচাই করা হয়েছে।</p>' +
    "<h3>যা বাদ দেওয়া হয়েছে</h3><p>যা যাচাই করা যায়নি তা বাদ দেওয়া হয়েছে। বিতর্কিত হতাহতের সংখ্যা কখনো দাবি করা হয়নি — যেখানে অনুমান ভিন্ন, সেখানে তা উল্লেখ করা আছে। কোনো কাল্পনিক কাহিনি, উদ্ধৃতি (৭ মার্চের ভাষণের একটি বিখ্যাত প্রকাশ্য বাক্য ছাড়া) বা তথ্য উদ্ভাবন করা হয়নি।</p>" +
    "<h3>অফলাইন</h3><p>অ্যাপটি কোনো নেটওয়ার্ক অনুরোধ করে না। ভাষা পছন্দ ও কুইজের সেরা স্কোর শুধু আপনার ব্রাউজারের localStorage-এ সংরক্ষিত হয়।</p></div>";
  }
}

document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
document.addEventListener("DOMContentLoaded", init);
})();
