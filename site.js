// HiHatGo! website: on phones, show one feature at a time and fold long pages into parts.
(function () {
  var phone = window.matchMedia("(max-width: 960px)");
  document.documentElement.classList.add("js");
  document.addEventListener("click", function (e) {           // close the menu after a tap outside or on a link
    var m = document.querySelector(".mmenu");
    if (m && m.open && (!m.contains(e.target) || e.target.closest(".mlist a"))) m.open = false;
  });
  // home: feature buttons
  var feats = document.querySelectorAll(".feature"), btns = document.querySelectorAll(".ftabs button");
  function show(i) {
    feats.forEach(function (f, j) { f.classList.toggle("on", i === j); });
    btns.forEach(function (b, j) { b.classList.toggle("on", i === j); });
  }
  btns.forEach(function (b, i) { b.addEventListener("click", function () { show(i); }); });
  if (feats.length) show(0);
  // guides: wrap each h2 and what follows it into a part that opens on tap
  var prose = document.querySelector(".prose");
  if (prose && prose.querySelector("h2")) {
    var kids = Array.prototype.slice.call(prose.children), cur = null;
    kids.forEach(function (k) {
      if (k.tagName === "H2") {
        cur = document.createElement("div"); cur.className = "fold"; if (k.id) { cur.id = k.id; k.removeAttribute("id"); }
        prose.insertBefore(cur, k); cur.appendChild(k);
      } else if (cur) cur.appendChild(k);
    });
  }
  document.querySelectorAll(".tipcat").forEach(function (t) { t.classList.add("fold"); });
  var folds = document.querySelectorAll(".fold");
  if (folds.length) document.body.classList.add("hasfolds");
  folds.forEach(function (f) {
    f.querySelector("h2").addEventListener("click", function () { if (phone.matches) f.classList.toggle("open"); });
  });
  function openHash() { var t = location.hash && document.getElementById(location.hash.slice(1)); if (t && t.classList.contains("fold")) t.classList.add("open"); }
  window.addEventListener("hashchange", openHash); openHash();
})();

// Visitor counter (28.11): adds +1 to today's numbers in our own Firebase database. No cookies and nothing is
// stored on the visitor's device or about the visitor: only "which page", "came from Google / AI / social / other /
// typed it in" and "phone or computer". Open hihatgo.com/#notme once on your own phone/PC and it stops counting you.
(function () {
  try {
    if (location.hash === "#notme") { localStorage.setItem("hhg_notme", "1"); }
    if (location.hash === "#countme") { localStorage.removeItem("hhg_notme"); }
    if (localStorage.getItem("hhg_notme")) return;
  } catch (e) {}
  if (!/(^|\.)hihatgo\.com$/.test(location.hostname)) return;
  if (navigator.webdriver || /bot|crawl|spider|slurp|headless|preview|lighthouse/i.test(navigator.userAgent)) return;
  var DB = "https://firestore.googleapis.com/v1/projects/sktrener-6d6c0/databases/(default)/documents";
  function day() {
    try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bratislava" }).format(new Date()); }
    catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function add(keys) {
    var body = JSON.stringify({ writes: [{
      update: { name: "projects/sktrener-6d6c0/databases/(default)/documents/site_stats/" + day(), fields: {} },
      updateMask: { fieldPaths: [] },
      updateTransforms: keys.map(function (k) { return { fieldPath: k, increment: { integerValue: "1" } }; })
    }] });
    try { fetch(DB + ":commit", { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }); } catch (e) {}
  }
  var pages = { "": "p_home", "index.html": "p_home", "learn-drums.html": "p_learn", "drum-rudiments.html": "p_rudiments",
    "read-drum-sheet-music.html": "p_sheet", "setup.html": "p_setup", "tips.html": "p_tips",
    "privacy.html": "p_privacy", "terms.html": "p_terms" };
  var file = location.pathname.split("/").pop();
  var keys = [pages[file] || "p_other", /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "d_phone" : "d_computer"];
  var ref = "";
  try { ref = document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) {}
  if (!/(^|\.)hihatgo\.com$/.test(ref)) {                    // a new arrival (moving between our pages doesn't count here)
    keys.push(!ref ? "s_direct"
      : /google\.|bing\.|duckduckgo|yahoo\.|ecosia|yandex|seznam|brave\.com/.test(ref) && !/gemini/.test(ref) ? "s_search"
      : /chatgpt|openai|perplexity|claude\.ai|gemini|copilot|you\.com|phind/.test(ref) ? "s_ai"
      : /reddit|facebook|fb\.|youtube|youtu\.be|instagram|tiktok|t\.co$|twitter|x\.com|discord|linkedin|pinterest/.test(ref) ? "s_social"
      : "s_other");
  }
  add(keys);
  document.addEventListener("click", function (e) {           // Google Play button clicks
    var a = e.target.closest && e.target.closest('a[href*="play.google.com"]');
    if (a) add(["c_play"]);
  });
})();
