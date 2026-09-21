/* ==========================================================================
   AI Agent 講義 — main.js（無相依套件，純原生 JS）
   鍵盤：↓ → PgDn Space 下一頁｜↑ ← PgUp 上一頁｜Home/End｜M 目錄｜F 全螢幕｜T 主題｜R 重播動畫
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var slides = Array.prototype.slice.call(document.querySelectorAll("main .slide"));
  var dotsBox = document.getElementById("dots");
  var menu = document.getElementById("menu");
  var menuGrid = document.getElementById("menuGrid");
  var crumb = document.getElementById("crumb");
  var counter = document.getElementById("counter");
  var progress = document.getElementById("progress");
  var hint = document.getElementById("kbdHint");
  var current = 0;
  var initialHash = location.hash;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- theme ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    store("agent-deck-theme", t);
  }
  (function initTheme() {
    var saved = store("agent-deck-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  })();
  function toggleTheme() {
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
  }

  /* ---------- build nav (dots + menu) from sections ---------- */
  var parts = [];
  slides.forEach(function (s, i) {
    var part = s.dataset.part || "";
    var last = parts[parts.length - 1];
    if (!last || last.name !== part) { last = { name: part, items: [] }; parts.push(last); }
    last.items.push(i);

    var a = document.createElement("a");
    a.href = "#" + s.id;
    a.dataset.label = pad(i + 1) + "  " + (s.dataset.title || part);
    a.setAttribute("aria-label", a.dataset.label);
    if (last.items.length === 1) a.className = "first";
    dotsBox.appendChild(a);
  });
  parts.forEach(function (p) {
    var box = document.createElement("div");
    box.className = "mpart";
    var h = document.createElement("h3");
    h.textContent = p.name;
    box.appendChild(h);
    p.items.forEach(function (i) {
      var a = document.createElement("a");
      a.href = "#" + slides[i].id;
      a.innerHTML = "<span>" + pad(i + 1) + "</span>" + (slides[i].dataset.title || "");
      a.addEventListener("click", function (e) { e.preventDefault(); closeMenu(); goTo(i); });
      box.appendChild(a);
    });
    menuGrid.appendChild(box);
  });
  var dotEls = $$("a", dotsBox);
  dotEls.forEach(function (a, i) {
    a.addEventListener("click", function (e) { e.preventDefault(); goTo(i); });
  });

  /* ---------- navigation ---------- */
  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  function setActive(i) {
    if (i === current && slides[i].classList.contains("in")) return;
    current = i;
    var s = slides[i];
    s.classList.add("in");
    dotEls.forEach(function (d, k) { d.classList.toggle("active", k === i); });
    crumb.innerHTML = "<b>" + (s.dataset.part || "") + "</b> · " + (s.dataset.title || "");
    counter.innerHTML = "<b>" + pad(i + 1) + "</b> / " + pad(slides.length);
    try { history.replaceState(null, "", "#" + s.id); } catch (e) {}
    onEnter(s);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) setActive(slides.indexOf(en.target));
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  slides.forEach(function (s) { io.observe(s); });

  // 前面所有投影片一進入視窗附近就標記為已顯示（避免快速跳頁時內容還是空的）
  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) en.target.classList.add("in"); });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
  slides.forEach(function (s) { io2.observe(s); });

  // stagger index for reveal
  slides.forEach(function (s) {
    $$(".reveal", s).forEach(function (el, k) { el.style.setProperty("--i", Math.min(k, 8)); });
  });

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });

  /* ---------- menu / fullscreen ---------- */
  function openMenu() { menu.hidden = false; document.body.style.overflow = "hidden"; }
  function closeMenu() { menu.hidden = true; document.body.style.overflow = ""; }
  function toggleMenu() { menu.hidden ? openMenu() : closeMenu(); }
  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }
  $("#btnMenu").addEventListener("click", toggleMenu);
  $("#btnMenuClose").addEventListener("click", closeMenu);
  $("#btnFull").addEventListener("click", toggleFull);
  $("#btnTheme").addEventListener("click", toggleTheme);
  menu.addEventListener("click", function (e) { if (e.target === menu) closeMenu(); });

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    var k = e.key;
    if (!menu.hidden) { if (k === "Escape" || k === "m" || k === "M") { e.preventDefault(); closeMenu(); } return; }
    // 在按鈕上按空白鍵 / Enter 時，保留原本的按鈕行為
    if ((k === " " || k === "Enter") && t && t.tagName === "BUTTON") return;
    var handled = true;
    if (k === "ArrowDown" || k === "PageDown" || k === "ArrowRight" || (k === " " && !e.shiftKey)) goTo(current + 1);
    else if (k === "ArrowUp" || k === "PageUp" || k === "ArrowLeft" || (k === " " && e.shiftKey)) goTo(current - 1);
    else if (k === "Home") goTo(0);
    else if (k === "End") goTo(slides.length - 1);
    else if (k === "m" || k === "M") toggleMenu();
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "t" || k === "T") toggleTheme();
    else if (k === "r" || k === "R") replayCurrent();
    else handled = false;
    if (handled) e.preventDefault();
  });

  // 首次載入顯示鍵盤提示
  if (hint && !reduce) {
    setTimeout(function () { hint.classList.add("show"); }, 1600);
    setTimeout(function () { hint.classList.remove("show"); }, 9000);
  }

  /* ---------- terminal log typewriter ---------- */
  var tokens = new WeakMap();
  function playLog(box) {
    var lines = $$(".ln", box);
    var token = {};
    tokens.set(box, token);
    lines.forEach(function (l) { l.classList.remove("on"); });
    if (reduce) { lines.forEach(function (l) { l.classList.add("on"); }); return; }
    var t = 250;
    lines.forEach(function (l) {
      t += parseInt(l.dataset.d || "560", 10);
      setTimeout(function () { if (tokens.get(box) === token) l.classList.add("on"); }, t);
    });
  }
  var played = new WeakSet();
  function onEnter(slide) {
    $$("[data-log]", slide).forEach(function (box) {
      if (!played.has(box)) { played.add(box); playLog(box); }
    });
    $$("[data-count]", slide).forEach(countUp);
    if (slide.id === "cover") netStart(); else netStop();
  }
  function replayCurrent() {
    $$("[data-log]", slides[current]).forEach(playLog);
    $$("[data-count]", slides[current]).forEach(function (el) { el.dataset.done = ""; countUp(el); });
  }
  $$("[data-replay]").forEach(function (b) {
    b.addEventListener("click", function () {
      var box = document.getElementById(b.dataset.replay);
      if (box) playLog(box);
    });
  });

  /* ---------- count up ---------- */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var to = parseFloat(el.dataset.count);
    var dec = (el.dataset.count.split(".")[1] || "").length;
    var sep = el.hasAttribute("data-sep");
    function fmt(v) {
      var s = v.toFixed(dec);
      return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s;
    }
    if (reduce) { el.textContent = fmt(to); return; }
    var dur = 1500, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(to);
    }
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  }

  /* ---------- copy prompt ---------- */
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = document.querySelector(btn.dataset.copy);
      if (!src) return;
      var text = src.innerText.trim();
      var label = btn.querySelector("span");
      function ok() {
        btn.classList.add("done");
        if (label) label.textContent = "已複製 ✓";
        setTimeout(function () { btn.classList.remove("done"); if (label) label.textContent = "複製指令"; }, 1800);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(ok, fallback);
      } else fallback();
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); ok(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- level-2 pipeline widget ---------- */
  (function pipeline() {
    var box = document.getElementById("pipe");
    if (!box) return;
    var gates = $$(".gate", box);
    var cnt = document.getElementById("pipeCount");
    var vd = document.getElementById("pipeVerdict");
    function update() {
      var n = 0;
      gates.forEach(function (g) {
        var on = g.getAttribute("aria-pressed") === "true";
        if (on) n++;
        g.parentNode.classList.toggle("hit", on);
        g.querySelector("span").textContent = on ? "需要我確認" : "AI 自己判斷";
      });
      cnt.firstChild.nodeValue = n;
      vd.className = "vd";
      if (n > 2) {
        vd.classList.add("bad");
        vd.innerHTML = "點頭 " + n + " 次 → 仍是「人在跑流程」<small>你是這條流程的瓶頸，屬於第二層</small>";
      } else if (n > 0) {
        vd.classList.add("mid");
        vd.innerHTML = "點頭 " + n + " 次 → 流程開始由 AI 主導<small>只在關鍵處驗收。再加上「明確的完成標準」，就進入第三層</small>";
      } else {
        vd.classList.add("good");
        vd.innerHTML = "0 次點頭 → AI 從頭做到尾<small>這時「完成標準」就是你唯一的把關，請務必寫清楚</small>";
      }
    }
    gates.forEach(function (g) {
      g.addEventListener("click", function () {
        g.setAttribute("aria-pressed", g.getAttribute("aria-pressed") === "true" ? "false" : "true");
        update();
      });
    });
    update();
  })();


  /* ---------- security checklist widget ---------- */
  (function checklist() {
    var box = document.getElementById("secList");
    if (!box) return;
    var items = $$(".chk", box);
    var out = document.getElementById("secCount");
    var vd = document.getElementById("secVerdict");
    function update() {
      var n = items.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; }).length;
      out.textContent = n;
      vd.className = "vd";
      if (n === items.length) {
        vd.classList.add("good");
        vd.innerHTML = "八關全過 → 可以放心交給 Agent 做事<small>之後每一次新任務，都再快速檢查一遍</small>";
      } else if (n >= 5) {
        vd.classList.add("mid");
        vd.innerHTML = "還差 " + (items.length - n) + " 項<small>沒確認的項目，就是目前最大的風險點</small>";
      } else {
        vd.classList.add("bad");
        vd.innerHTML = "還有 " + (items.length - n) + " 項未確認<small>建議先補齊再讓 Agent 動手，尤其是「資料」與「權限」</small>";
      }
    }
    items.forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
        update();
      });
    });
    update();
  })();

  /* ---------- cover network canvas ---------- */
  var net = { run: false, raf: 0, nodes: [], w: 0, h: 0, ctx: null };
  (function initNet() {
    var cv = document.getElementById("net");
    if (!cv || reduce) return;
    net.ctx = cv.getContext("2d");
    function resize() {
      var r = cv.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      net.w = r.width; net.h = r.height;
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      net.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, (r.width * r.height) / 22000));
      net.nodes = [];
      for (var i = 0; i < n; i++) {
        net.nodes.push({ x: Math.random() * r.width, y: Math.random() * r.height, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 });
      }
    }
    resize();
    window.addEventListener("resize", resize);
    net.cv = cv;
  })();
  function netFrame() {
    if (!net.run) return;
    var c = net.ctx, w = net.w, h = net.h, ns = net.nodes;
    var light = document.documentElement.getAttribute("data-theme") === "light";
    var rgb = light ? "8,145,178" : "34,211,238";
    c.clearRect(0, 0, w, h);
    for (var i = 0; i < ns.length; i++) {
      var a = ns[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
      for (var j = i + 1; j < ns.length; j++) {
        var b = ns[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 19600) {
          c.strokeStyle = "rgba(" + rgb + "," + (0.22 * (1 - d / 19600)).toFixed(3) + ")";
          c.lineWidth = 1;
          c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
        }
      }
      c.fillStyle = "rgba(" + rgb + ",0.7)";
      c.beginPath(); c.arc(a.x, a.y, 1.6, 0, 6.283); c.fill();
    }
    net.raf = requestAnimationFrame(netFrame);
  }
  function netStart() { if (net.ctx && !net.run) { net.run = true; netFrame(); } }
  function netStop() { net.run = false; cancelAnimationFrame(net.raf); }

  /* ---------- init ---------- */
  onScroll();
  // 若網址帶有 #hash，跳到該頁；否則從第一頁開始
  setActive(0);
  if (initialHash) {
    var idx = slides.findIndex(function (s) { return "#" + s.id === initialHash; });
    if (idx > 0) {
      // 載入時直接跳到該頁（不要從頂端平滑捲動過去）
      var root = document.documentElement;
      root.style.scrollBehavior = "auto";
      slides[idx].scrollIntoView({ block: "start" });
      requestAnimationFrame(function () { root.style.scrollBehavior = ""; });
    }
  }
  document.documentElement.classList.add("ready");
})();
