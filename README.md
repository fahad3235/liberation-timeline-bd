# liberation-timeline-bd

Bilingual (English / বাংলা) interactive timeline of Bangladesh's **1971 Liberation War** — March to December 1971. **100% offline**: no internet connection needed, zero network requests, no accounts, no keys.

## 1. The problem

Most timelines of the 1971 war are either English-only, riddled with unverified dates, or locked behind ad-heavy news sites that don't work offline. Students in Bangladesh need a trustworthy, bilingual, offline-first way to explore the war chronologically — events, people, sectors, operations — and test their own knowledge.

## 2. Features

- **Chronological Event Explorer** — 41 events, March–December 1971, month-by-month navigation, live search, key events starred (★); click any event for a detail view with linked figure profiles
- **Journey View** — visual month-by-month progression with event-density bars
- **Key Figures** — 19 profiles (Sheikh Mujibur Rahman, Syed Nazrul Islam, Tajuddin Ahmad, M. A. G. Osmani, M. A. Rab, A. K. Khandker, Ziaur Rahman, sector commanders, Indira Gandhi, Sam Manekshaw, Aurora, Niazi, Yahya Khan, Tikka Khan…) — roles and key facts only, no invented anecdotes
- **Sectors & Operations** — all 11 war sectors with commanders and areas, 9 major operations/battles (Searchlight, Jackpot, Chengiz Khan, Trident, Kilo Flight, Kamalpur, Garibpur & Boyra, Hilli, Dhalai), plus the seven Bir Sreshtho recipients
- **Quiz Mode** — 10 multiple-choice questions per run, generated deterministically from the event data (date ↔ event matching), score tracking with best-score persistence, full answer review
- **EN/বাংলা toggle** — every string, date and dataset field bilingual (Bengali dates use Bengali numerals); preference persisted
- **Mobile responsive** down to 390 px, no horizontal overflow
- **Zero network requests** — verified by test (no `fetch`/`XHR`, no external `src`/`href`)

## 3. Stack

- Plain HTML + CSS + vanilla JavaScript (no build step, no framework, no CDN)
- `js/data.js` — the historical dataset, written as a UMD module so the **same file** powers the browser and the Node validation suite
- `js/quiz.js` — deterministic quiz generator (mulberry32 PRNG), also UMD
- `js/app.js` — view rendering, i18n, quiz flow
- Tests: plain Node `assert`-style scripts (no test framework dependency)

## 4. Prerequisites

- Any modern browser (Chrome, Edge, Firefox, Safari). No server, no Node, no internet required to *use* the app.
- Node.js ≥ 18 only needed to run the test suites.

## 5. Install

No installation. Copy the folder and open `index.html`:

```
liberation-timeline-bd/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js   # 41 events, 19 figures, 11 sectors, 9 operations, 7 Bir Sreshtho (UMD)
│   ├── quiz.js   # deterministic quiz generator (UMD)
│   └── app.js    # UI
├── tests/
│   ├── data.test.js
│   └── quiz.test.js
├── package.json
├── README.md
└── .gitignore
```

## 6. Dev commands

```sh
# syntax check
node --check js/data.js && node --check js/quiz.js && node --check js/app.js

# run all tests (data validation + quiz unit)
npm test

# static audit: no external resources, no network APIs
grep -rnE '(src|href)\s*=\s*"https?://' index.html css js || echo "no external resources"
grep -rnE 'fetch\(|XMLHttpRequest|sendBeacon' js || echo "no network APIs used"
```

## 7. Environment variables

**None.** There are no environment variables, no API keys, no config files. Fully static.

## 8. Testing

**Node (1,022 checks, 0 failures)** — `npm test`:

| Suite | Checks | What it covers |
|---|---|---|
| `tests/data.test.js` | 924 | Every event: unique id, valid ISO date, date within 1971-03…1971-12, non-empty bilingual title/description (≥40 chars), known tags, figure cross-references resolve, no duplicate date+title, chronological order; every figure: unique id, bilingual name/role, ≥2 bilingual facts; Bir Sreshtho exactly 7 with required ids; sectors exactly 11 numbered 1–11 with bilingual commander/area; operations ≥8 with bilingual fields; all 12 anchor dates spot-checked; quiz generator sanity over real data; secrets scan (no keys, no external URLs, no network APIs) |
| `tests/quiz.test.js` | 98 | Determinism (same seed → identical quiz), seed sensitivity, both question types present, prompt↔answer consistency against the dataset, 4 unique options per question, count clamping, `grade()` edge cases, Bengali date formatting with Bengali numerals |

**Headless Chromium (real browser, `file://`)** — `node /tmp/qatest/ltb.cjs` against Chrome 152. **59 checks, 0 failures**, covering:

| # | Check |
|---|---|
| 1–4 | Title, 6 tabs, 10 month buttons, timeline default view |
| 5–9 | Month navigation (Dec ≥8 events incl. surrender; March incl. 7 March Speech) |
| 10–14 | Event modal opens/closes, shows title/date/description |
| 15 | Search filters events |
| 16–18 | Figures view: 19 cards, modal with ≥2 facts |
| 19–20 | Sectors view: 11 rows, 9 operations + 7 Bir Sreshtho cards |
| 21–24 | Journey view: 10 months, all 41 events listed, item opens modal |
| 25–33 | Quiz: start, 4 options ×10 questions, correct-marking, score format, 10-item review, best-score persisted to localStorage, retake restarts |
| 34–38 | Language toggle → Bengali brand/months/event titles, Bengali quiz works, toggle back |
| 39 | About view renders |
| 40 | **Zero console/page errors (desktop)** |
| 41–46 | **390 px mobile: no horizontal overflow** on all 5 main views, full quiz completes |
| 47 | **Zero console/page errors (mobile)** |

Result: **59 checks passed, 0 failures, 0 console/page errors** — desktop 1280 px and 390 px mobile.

## 9. Deployment

Static hosting only. Any static host works (GitHub Pages, Netlify, or just the folder on a phone). Nothing to build, no server needed. **Not published by the factory run** — staged for the user to push when ready.

## 10. Content & verification method

- **41 events** (13 starred as key), **19 figures**, **11 sectors**, **9 operations/battles**, **7 Bir Sreshtho**.
- Every date, name spelling and event was verified against multiple published sources *before* inclusion (see **Sources** below). The task's anchor facts were each individually search-verified: 7 March speech, 25 March Operation Searchlight, 26 March declaration (with the 26/27 March nuance — Mujib's declaration in the early hours of the 26th, Zia's radio broadcast on behalf of Mujib on the 27th), 10 April Mujibnagar government formation, 17 April oath at Baidyanathtala, the 11-sector system (11–17 July conference), 3 December full-scale war, 16 December surrender at the Ramna Race Course (now Suhrawardy Udyan).
- **What was deliberately left out:** anything that could not be verified from a published source; disputed casualty figures (never asserted — where estimates vary, the text says "estimates vary"); invented anecdotes, quotes (one exception: a single famous public line from the 7 March speech) and details.
- Sector 11's commander is listed as Major Abu Taher per The Daily Star / Govt. of Bangladesh portal (sources differ on Ziaur Rahman's later sector commands, so the app does not assert it).

## 11. Limitations

- Static educational content: no user accounts, no sync, no new events after December 1971 (post-war events like Bangabandhu's 10 January 1972 return are out of scope by design).
- Quiz distractors are drawn from other real events — a knowledgeable user may find some easy.
- Bengali typography relies on system fonts (Noto Sans Bengali / SolaimanLipi fallback); rendering varies by device.
- Best scores live in `localStorage` only — clearing browser data resets them.

## 12. Status

✅ **Complete.** Staged at `builds/liberation-timeline-bd/` — **not published** (no GitHub repo created, nothing pushed). Ready for the user to review and push.

Test summary: **924** data-validation + **98** quiz-unit checks (Node) and **59** headless-Chrome UI checks — all green, 0 console/page errors, desktop + 390 px mobile.

## Sources

Every fact below was consulted to verify dates, spellings and events before inclusion:

- Wikipedia — *7 March Speech of Bangabandhu* (https://en.wikipedia.org/wiki/7_March_Speech_of_Bangabandhu)
- Wikipedia — *Proclamation of Bangladeshi Independence* (https://en.wikipedia.org/wiki/Proclamation_of_Bangladeshi_Independence)
- Wikipedia — *Bangladesh War of Liberation of 1971* (https://en.wikipedia.org/wiki/Bangladesh_War_of_Liberation_of_1971)
- Wikipedia — *Instrument of Surrender (1971)* (https://en.wikipedia.org/wiki/Instrument_of_Surrender_(1971))
- Wikipedia — *Mujibnagar* (https://en.wikipedia.org/wiki/Mujibnagar)
- Wikipedia — *List of sectors in the Bangladesh Liberation War* (https://en.wikipedia.org/wiki/List_of_sectors_in_the_Bangladesh_Liberation_War)
- Wikipedia — *M. A. G. Osmani* (https://en.wikipedia.org/wiki/M._A._G._Osmani)
- Wikipedia — *Martyred Intellectuals Day* (https://en.wikipedia.org/wiki/Martyred_Intellectuals_Day)
- Wikipedia — *Indo-Pakistani War of 1971* (https://en.wikipedia.org/wiki/Indo-Pakistani_War_of_1971)
- Wikipedia — *Indo-Soviet Treaty of Friendship and Cooperation* (https://en.wikipedia.org/wiki/Indo-Soviet_Treaty_of_Friendship_and_Cooperation)
- Wikipedia — *Bangladesh–Soviet Union relations* (https://en.wikipedia.org/wiki/Bangladesh–Soviet_Union_relations)
- Wikipedia — *The Concert for Bangladesh* (https://en.wikipedia.org/wiki/The_Concert_for_Bangladesh)
- Wikipedia — *Defence of Kamalpur* (https://en.wikipedia.org/wiki/Defence_of_Kamalpur)
- Wikipedia — *Mukti Bahini* (https://en.wikipedia.org/wiki/Mukti_Bahini)
- Banglapedia — *Mujibnagar Government* (http://en.banglapedia.org/index.php?title=Mujibnagar_Government)
- Banglapedia — *Operation Jackpot* (http://en.banglapedia.org/index.php?title=Operation_Jackpot)
- The Daily Star — *A speech that created a nation* (https://www.thedailystar.net/a-speech-that-created-a-nation-14412)
- The Daily Star — *Operation Searchlight: 55 years on* (https://www.thedailystar.net/news/bangladesh/news/operation-searchlight-55-years-the-scars-are-still-fresh-4134851)
- The Daily Star — *December 16, 1971* (https://www.thedailystar.net/december-16-1971-53696)
- The Daily Star — *Sector Commanders* (https://www.thedailystar.net/news-detail-15472)
- The Daily Star — *A bond that was forged by war* (https://www.thedailystar.net/views/opinion/news/bond-was-forged-war-2910426)
- The Daily Star — *Naval operation that shook Pakistan* (http://thedailystar.net/news/bangladesh/news/naval-operation-shook-pakistan-2152366)
- The Daily Star — *DU students raise flag of Bangladesh* (https://www.thedailystar.net/news-detail-224610)
- Dhaka Tribune — *February-March 1971: Events leading to the independence of Bangladesh* (https://www.dhakatribune.com/bangladesh/334010/february-march-1971-events-leading-to-the)
- Dhaka Tribune — *Bangladesh hoists its first flag* (https://www.dhakatribune.com/bangladesh/264751/bangladesh-hoists-its-first-flag)
- ThePrint — *Fierce 3-day battle… Garibpur* (https://theprint.in/world/fierce-3-day-battle-fought-between-india-pak-heralded-final-victory-in-1971-liberation-war-of-bangladesh-military-records/1269549/?amp)
- ThePrint — *Indians, Bangladeshis know the same 1971 events differently* (https://theprint.in/opinion/indians-bangladeshis-know-the-same-1971-events-differently-we-need-a-common-official-history/1116346/?amp)
- IndiaDefenceNews — *India Quietly Marks 50 Years of Key Battle (Garibpur/Boyra)* (https://www.indiandefensenews.in/2021/11/india-quietly-marks-50-years-of-key.html)
- The Tribune (India) — *First day of 1971 War* (https://www.tribuneindia.com/news/anniversary/first-day-of-1971-war)
- Firstpost — *Did you know: This remote place… gave wings to Bangladesh Air Force* (https://www.firstpost.com/world/did-you-know-this-remote-place-in-north-east-india-gave-wings-to-bangladesh-air-force-10006131.html/amp)
- The Telegraph (India) — *1971: The birth of an air force and the first strike back* (https://www.telegraphindia.com/amp/my-kolkata/lifestyle/1971-the-birth-of-an-air-force-and-the-first-strike-back/cid/1985737)
- Observer BD — *Bangabandhu's official declaration of independence* (https://www.observerbd.com/news/65486)
- TOB News — *Ziaur Rahman's war memoir to enter textbooks* (https://tob.news/ziaur-rahmans-war-memoir-to-enter-textbooks/)
- Nation Thailand — *On March 26, 1971, Bangladesh declared its independence* (https://www.nationthailand.com/blogs/news/world/40047905)
- Govt. of Bangladesh, Freedom Fighters' Welfare Trust — sector commanders table (https://bffwt.portal.gov.bd/site/page/e36f4b6f-94c7-409a-becc-9a58f6b031bf/ট্রাষ্টের-জন্ম)
- Londoni.co — *Muktijuddho: Eleven (11) Sectors* and *Operation Jackpot / Bangladesh Navy* histories
- Mathrubhumi English, LiveMint, News18, Hindustan Times, The Business Standard (TBS), Xinhua via China Development Gateway — background confirmation on Searchlight, Chengiz Khan, the Indo-Soviet treaty, Martyred Intellectuals Day and the surrender.
