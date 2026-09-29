// Built-in start page: shows what websites see of the virtual monitor (work package A).
// Self-contained: no external resources, system font, works without the injected scripts.

const CSS = `
:root{--bg:#f5f6f8;--card:#fff;--text:#16181d;--muted:#5d6472;--line:#e3e6eb;--accent:#2f6fec;--accent-soft:#e6eefe;--ok:#1a8f4c;--ok-soft:#e3f5ea;--bad:#c9372c;--bad-soft:#fbe7e5;--shadow:0 1px 2px rgba(16,24,40,.06),0 4px 16px rgba(16,24,40,.06)}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#181b21;--text:#eceef2;--muted:#9aa2b1;--line:#2a2f38;--accent:#6a9bff;--accent-soft:#1c2740;--ok:#4cc781;--ok-soft:#15291e;--bad:#ff7a6e;--bad-soft:#35191a;--shadow:none}}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%}
.wrap{max-width:1600px;margin:0 auto;padding:24px}
header{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px 24px;margin-bottom:20px}
h1{font-size:28px;margin:0;letter-spacing:-.02em}
h1 span{color:var(--accent)}
.lead{margin:4px 0 0;color:var(--muted);font-size:17px}
.layout-tag{font-weight:600;font-size:14px;padding:6px 12px;border-radius:999px;background:var(--accent-soft);color:var(--accent);white-space:nowrap}
.layout-tag::after{content:"Mobil-Layout · 1 Spalte"}
.hero{background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:24px;margin-bottom:20px;display:grid;gap:20px;grid-template-columns:1fr}
.big-label{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600}
.big{font-size:56px;font-weight:700;letter-spacing:-.03em;line-height:1.05;font-variant-numeric:tabular-nums}
.big small{font-size:22px;font-weight:500;color:var(--muted);margin-left:6px}
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.stat{border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.stat b{display:block;font-size:22px;font-variant-numeric:tabular-nums}
.stat span{font-size:13px;color:var(--muted)}
.bp{margin-top:4px}
.bp-bar{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:8px}
.bp-seg{border-radius:10px;padding:8px 6px;text-align:center;background:var(--bg);border:1px solid var(--line);color:var(--muted);font-size:13px;transition:background .2s,color .2s}
.bp-seg b{display:block;font-size:15px}
.bp-seg.on{background:var(--accent);border-color:var(--accent);color:#fff}
.bp-seg.cur{outline:3px solid var(--accent-soft);outline-offset:1px}
.bp-note{margin-top:8px;font-size:14px;color:var(--muted)}
.grid{display:grid;gap:20px;grid-template-columns:1fr}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:20px}
.card h2{font-size:18px;margin:0 0 4px}
.card p.sub{margin:0 0 14px;color:var(--muted);font-size:14px}
.checks{list-style:none;margin:0;padding:0}
.checks li{display:grid;grid-template-columns:28px 1fr;gap:4px 10px;padding:9px 0;border-top:1px solid var(--line);align-items:start}
.checks li:first-child{border-top:0}
.ico{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:14px}
.ico.ok{background:var(--ok-soft);color:var(--ok)}
.ico.bad{background:var(--bad-soft);color:var(--bad)}
.checks .name{font-weight:600;font-size:15px}
.checks code{display:block;grid-column:2;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);word-break:break-all}
.summary{margin-top:10px;font-weight:600}
.menu{position:relative;display:inline-block}
.menu-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:12px;background:var(--accent-soft);color:var(--accent);font-weight:600;border:1px solid transparent;cursor:pointer;user-select:none}
.menu:hover .menu-btn{background:var(--accent);color:#fff}
.menu-list{display:none;position:absolute;left:0;top:100%;margin-top:6px;min-width:240px;background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:0 12px 32px rgba(16,24,40,.18);padding:6px;z-index:5}
.menu:hover .menu-list{display:block}
.menu-list a{display:block;padding:9px 12px;border-radius:8px;color:var(--text);text-decoration:none}
.menu-list a:hover{background:var(--accent-soft);color:var(--accent)}
.hover-box{margin-top:16px;padding:16px;border-radius:12px;border:2px dashed var(--line);text-align:center;color:var(--muted);transition:all .15s}
.hover-box:hover{border-style:solid;border-color:var(--ok);background:var(--ok-soft);color:var(--ok)}
.hover-box:hover::after{content:" – :hover aktiv ✓"}
.row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
button.btn{font:inherit;font-weight:600;padding:12px 18px;border-radius:12px;border:0;background:var(--accent);color:#fff;cursor:pointer}
button.btn:hover{filter:brightness(1.1)}
button.btn:active{transform:translateY(1px)}
.rc{flex:1 1 200px;padding:16px;border-radius:12px;background:var(--bg);border:1px solid var(--line);text-align:center;color:var(--muted);user-select:none;-webkit-user-select:none}
.count{font-variant-numeric:tabular-nums;font-weight:700;color:var(--text)}
.log{margin-top:14px;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);min-height:3em}
footer{margin:24px 0 8px;color:var(--muted);font-size:13px;text-align:center}
@media (min-width:640px){.layout-tag::after{content:"Kleines Tablet-Layout · 1 Spalte"}.stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (min-width:768px){.layout-tag::after{content:"Tablet-Layout · 1 Spalte"}}
@media (min-width:1024px){.layout-tag::after{content:"Desktop-Layout · 2 Spalten"}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hero{grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);align-items:center}.big{font-size:72px}.wrap{padding:32px}}
@media (min-width:1280px){.layout-tag::after{content:"Großes Desktop-Layout · 3 Spalten"}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.big{font-size:84px}h1{font-size:32px}}
@media (min-width:1536px){.layout-tag::after{content:"Breitbild-Layout · 3 Spalten"}}
`;

const BODY = `
<div class="wrap">
  <header>
    <div>
      <h1><span>Deskview</span> Testseite</h1>
      <p class="lead">Diese Seite zeigt, was Websites von deinem virtuellen Monitor sehen.</p>
    </div>
    <div class="layout-tag" title="Reine CSS-Media-Queries"></div>
  </header>

  <section class="hero">
    <div>
      <div class="big-label">Fenstergröße (innerWidth × innerHeight)</div>
      <div class="big" id="vp">– × –</div>
      <div class="bp-note" id="vp-note">So breit „denkt“ die Website, dass dein Browserfenster ist.</div>
    </div>
    <div>
      <div class="stats">
        <div class="stat"><b id="scr">–</b><span>Bildschirm (screen)</span></div>
        <div class="stat"><b id="dpr">–</b><span>Pixeldichte (devicePixelRatio)</span></div>
        <div class="stat"><b id="cols">–</b><span>Spalten in diesem Layout</span></div>
      </div>
      <div class="bp">
        <div class="bp-bar" id="bp-bar">
          <div class="bp-seg" data-min="0"><b>xs</b>&lt; 640</div>
          <div class="bp-seg" data-min="640"><b>sm</b>≥ 640</div>
          <div class="bp-seg" data-min="768"><b>md</b>≥ 768</div>
          <div class="bp-seg" data-min="1024"><b>lg</b>≥ 1024</div>
          <div class="bp-seg" data-min="1280"><b>xl</b>≥ 1280</div>
          <div class="bp-seg" data-min="1536"><b>2xl</b>≥ 1536</div>
        </div>
        <div class="bp-note" id="bp-note">Breakpoints wie in Tailwind CSS.</div>
      </div>
    </div>
  </section>

  <div class="grid" id="grid">
    <section class="card">
      <h2>Wirkt das wie ein Desktop?</h2>
      <p class="sub">Merkmale, an denen Websites Maus und großen Bildschirm erkennen.</p>
      <ul class="checks" id="checks"></ul>
      <div class="summary" id="summary"></div>
    </section>

    <section class="card">
      <h2>Hover testen</h2>
      <p class="sub">Tippe unten auf „Maus“ und bewege den Zeiger über das Menü.</p>
      <nav class="menu">
        <div class="menu-btn">☰ Fahre mit der Maus hierüber ▾</div>
        <div class="menu-list">
          <a href="#produkte">Produkte</a>
          <a href="#preise">Preise</a>
          <a href="#hilfe">Hilfe &amp; Kontakt</a>
        </div>
      </nav>
      <div class="hover-box" id="hover-box">Hover-Fläche (nur CSS <code>:hover</code>)</div>
      <div class="log">JavaScript-Hover (mouseenter): <span class="count" id="enter-count">0</span></div>
    </section>

    <section class="card">
      <h2>Klicken &amp; Rechtsklick</h2>
      <p class="sub">Tippen = Klick, lange drücken = Rechtsklick.</p>
      <div class="row">
        <button class="btn" id="click-btn" type="button">Klick mich</button>
        <span>Klicks: <span class="count" id="click-count">0</span></span>
      </div>
      <div class="row" style="margin-top:14px">
        <div class="rc" id="rc-area">Rechtsklick hier<br>Rechtsklicks: <span class="count" id="rc-count">0</span></div>
      </div>
      <div class="log" id="log"></div>
    </section>
  </div>

  <footer>Hinweis: Auf dem iPhone rendert immer WebKit (die Safari-Engine) – auch wenn die Kennung „Chrome“ oder „Firefox“ lautet.</footer>
</div>
`;

const SCRIPT = `
(function () {
  function $(id) { return document.getElementById(id); }
  function mq(q) { try { return !!(window.matchMedia && window.matchMedia(q).matches); } catch (e) { return false; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function columns(w) { return w >= 1280 ? 3 : w >= 1024 ? 2 : 1; }
  function render() {
    var w = window.innerWidth, h = window.innerHeight;
    var s = window.screen || {};
    $('vp').innerHTML = w + ' × ' + h + '<small>px</small>';
    $('scr').textContent = (s.width || '–') + ' × ' + (s.height || '–');
    $('dpr').textContent = String(Math.round((window.devicePixelRatio || 1) * 100) / 100);
    $('cols').textContent = String(columns(w));
    var segs = document.querySelectorAll('.bp-seg');
    var cur = null, active = [];
    for (var i = 0; i < segs.length; i++) {
      var min = +segs[i].getAttribute('data-min');
      var on = w >= min;
      segs[i].className = 'bp-seg' + (on ? ' on' : '');
      if (on) { cur = segs[i]; if (min > 0) active.push(segs[i].querySelector('b').textContent); }
    }
    if (cur) cur.className += ' cur';
    $('bp-note').textContent = active.length
      ? 'Aktive Breakpoints: ' + active.join(', ') + ' (Tailwind CSS)'
      : 'Keine Breakpoints aktiv – die Seite zeigt ihr Handy-Layout.';
    $('vp-note').textContent = w >= 1024
      ? 'Websites zeigen dir ihr Desktop-Layout.'
      : 'Unter 1024 px zeigen viele Websites ihr Mobil- oder Tablet-Layout.';
    var touch = 'ontouchstart' in window;
    var mtp = navigator.maxTouchPoints || 0;
    var platform = String(navigator.platform || '');
    var ua = String(navigator.userAgent || '');
    var checks = [
      ['Maus-Hover verfügbar', '(hover: hover) → ' + mq('(hover: hover)'), mq('(hover: hover)')],
      ['Feiner Zeiger (Maus)', '(pointer: fine) → ' + mq('(pointer: fine)'), mq('(pointer: fine)')],
      ['Keine Touch-Ereignisse', "'ontouchstart' in window → " + touch, !touch],
      ['Keine Touch-Punkte', 'navigator.maxTouchPoints → ' + mtp, mtp === 0],
      ['Desktop-Plattform', 'navigator.platform → ' + (platform || '(leer)'), !!platform && !/iPhone|iPad|iPod|Android|arm/i.test(platform)],
      ['Desktop-Kennung', ua, !!ua && !/iPhone|iPad|Android|Mobile/i.test(ua)]
    ];
    var html = '', ok = 0;
    for (var j = 0; j < checks.length; j++) {
      var c = checks[j];
      if (c[2]) ok++;
      html += '<li><span class="ico ' + (c[2] ? 'ok' : 'bad') + '">' + (c[2] ? '✓' : '✗') + '</span>' +
        '<span class="name">' + esc(c[0]) + '</span><code>' + esc(c[1]) + '</code></li>';
    }
    $('checks').innerHTML = html;
    $('summary').textContent = ok + ' von ' + checks.length + ' Merkmalen wirken wie ein Desktop-Browser' +
      (ok === checks.length ? ' ✓' : ' – „Desktop-Modus“ unter „Mehr“ einschalten.');
  }
  var logLines = [];
  function log(t) {
    var d = new Date();
    logLines.unshift(('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2) + '  ' + t);
    logLines = logLines.slice(0, 4);
    $('log').innerHTML = logLines.map(esc).join('<br>');
  }
  function init() {
    var clicks = 0, rcs = 0, enters = 0;
    $('click-btn').addEventListener('click', function (e) {
      clicks++; $('click-count').textContent = String(clicks);
      log('click bei ' + Math.round(e.clientX) + ', ' + Math.round(e.clientY));
    });
    $('rc-area').addEventListener('contextmenu', function (e) {
      e.preventDefault();
      rcs++; $('rc-count').textContent = String(rcs);
      log('contextmenu (Rechtsklick)');
    });
    $('hover-box').addEventListener('mouseenter', function () {
      enters++; $('enter-count').textContent = String(enters);
    });
    var t = null;
    window.addEventListener('resize', function () {
      if (t) clearTimeout(t);
      t = setTimeout(render, 50);
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
`;

/** Self-contained HTML of the built-in test page (no external resources). */
export const TEST_PAGE_HTML = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deskview Testseite</title>
<style>${CSS}</style>
</head>
<body>
${BODY}
<script>${SCRIPT}</script>
</body>
</html>`;
