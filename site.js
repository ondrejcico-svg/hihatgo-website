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
