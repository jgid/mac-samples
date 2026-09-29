import { JSDOM } from 'jsdom';
import { getAgent } from '../../src/core/agents';
import {
  buildBeforeContentScript,
  buildInfoRequestCall,
  buildScreenUpdateCall,
  HOVER_STYLE_ID,
  mouse,
  MQ_FALSE,
  MQ_TRUE,
} from '../../src/core/injected';
import { TEST_PAGE_HTML } from '../../src/core/testPage';

type Win = JSDOM['window'] & Record<string, any>;

const agent = getAgent('chrome-win');

function setup(
  html: string,
  opts: { desktopMode?: boolean; before?: (w: Win) => void } = {},
): { dom: JSDOM; win: Win; doc: Document; messages: any[] } {
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://example.com/' });
  const win = dom.window as Win;
  const messages: any[] = [];
  win.ReactNativeWebView = { postMessage: (s: string) => messages.push(JSON.parse(s)) };
  opts.before?.(win);
  win.eval(buildBeforeContentScript({ screen: { width: 1920, height: 1080 }, agent, desktopMode: opts.desktopMode ?? true }));
  return { dom, win, doc: win.document, messages };
}

function stubPoint(doc: Document, map: () => Element | null) {
  (doc as any).elementFromPoint = () => map();
}

describe('script shape', () => {
  it('all builders end with true; and are valid JS', () => {
    const scripts = [
      buildBeforeContentScript({ screen: { width: 1920, height: 1080 }, agent, desktopMode: true }),
      buildBeforeContentScript({ screen: { width: 1920, height: 1080 }, agent, desktopMode: false }),
      buildScreenUpdateCall({ width: 1280, height: 800 }),
      buildInfoRequestCall(),
      mouse.move(1, 2),
      mouse.click(1, 2),
      mouse.contextMenu(1, 2),
      mouse.scroll(1, 2, 3, 4),
      mouse.leave(),
    ];
    for (const s of scripts) {
      expect(s.trim().endsWith('true;')).toBe(true);
      expect(() => new Function(s)).not.toThrow();
    }
  });
  it('serializes numbers safely', () => {
    expect(mouse.move(NaN, Infinity)).toContain('window.__dv && window.__dv.move(0,0)');
    expect(mouse.move(10.26, -3.04)).toContain('move(10.3,-3)');
    expect(mouse.scroll(1, 2, -Infinity, 5.55)).toContain('scroll(1,2,0,5.6)');
    expect(buildScreenUpdateCall({ width: NaN, height: 800.4 })).toContain('__dvSetScreen(1920,800)');
  });
  it('commands are harmless without the engine', () => {
    const dom = new JSDOM('<p>x</p>', { runScripts: 'outside-only' });
    expect(dom.window.eval(mouse.click(5, 5))).toBe(true);
    expect(dom.window.eval(buildInfoRequestCall())).toBe(true);
  });
});

describe('viewport override', () => {
  it('inserts our viewport meta and neutralizes page metas', async () => {
    const { doc } = setup('<!doctype html><html><head><meta name="viewport" content="width=980"></head><body></body></html>');
    const metas = () => Array.from(doc.querySelectorAll('meta[name="viewport"]'));
    expect(metas()).toHaveLength(1);
    expect(metas()[0].getAttribute('content')).toBe('width=device-width, initial-scale=1');
    // A page adding a meta later is neutralized too.
    const late = doc.createElement('meta');
    late.setAttribute('name', 'viewport');
    late.setAttribute('content', 'width=1024');
    doc.head.appendChild(late);
    await new Promise((r) => setTimeout(r, 0));
    expect(metas()).toHaveLength(1);
    expect(late.getAttribute('name')).not.toBe('viewport');
    // Changing an existing meta's name back is neutralized as well.
    late.setAttribute('name', 'viewport');
    await new Promise((r) => setTimeout(r, 0));
    expect(metas()).toHaveLength(1);
    expect(metas()[0].getAttribute('content')).toBe('width=device-width, initial-scale=1');
  });
  it('is idempotent', () => {
    const { win, doc } = setup('<head></head><body></body>');
    win.eval(buildBeforeContentScript({ screen: { width: 1920, height: 1080 }, agent, desktopMode: true }));
    expect(doc.querySelectorAll('meta[name="viewport"]')).toHaveLength(1);
  });
});

describe('desktop environment', () => {
  const before = (w: Win) => {
    w.ontouchstart = null;
    (w.Element.prototype as any).ontouchstart = null;
    w.matchMedia = (q: string) => ({ matches: q === MQ_TRUE, media: q });
  };
  it('spoofs screen, navigator and touch', () => {
    const { win } = setup('<body></body>', { before });
    expect(win.screen.width).toBe(1920);
    expect(win.screen.height).toBe(1080);
    expect(win.screen.availWidth).toBe(1920);
    expect(win.outerWidth).toBe(1920);
    expect(win.outerHeight).toBe(1080);
    expect(win.navigator.platform).toBe('Win32');
    expect(win.navigator.vendor).toBe('Google Inc.');
    expect(win.navigator.userAgent).toBe(agent.userAgent);
    expect(win.navigator.maxTouchPoints).toBe(0);
    expect('ontouchstart' in win).toBe(false);
    expect('ontouchstart' in win.document.body).toBe(false);
    expect(Object.keys(win)).not.toContain('__dvSetScreen');
  });
  it('rewrites hover/pointer media queries', () => {
    const { win } = setup('<body></body>', { before });
    expect(win.matchMedia('(hover: hover)').matches).toBe(true);
    expect(win.matchMedia('(pointer:fine)').matches).toBe(true);
    expect(win.matchMedia('(any-pointer: fine)').matches).toBe(true);
    expect(win.matchMedia('(hover: none)').media).toBe(MQ_FALSE);
    expect(win.matchMedia('(pointer: coarse)').matches).toBe(false);
    expect(win.matchMedia('(pointer: coarse)').media).toBe(MQ_FALSE);
    expect(win.matchMedia('(min-width: 800px)').media).toBe('(min-width: 800px)');
  });
  it('updates the screen size via __dvSetScreen', () => {
    const { win, messages } = setup('<body></body>', { before });
    win.eval(buildScreenUpdateCall({ width: 1280, height: 800 }));
    expect(win.screen.width).toBe(1280);
    expect(win.screen.height).toBe(800);
    expect(messages.some((m) => m.type === 'info' && m.screenWidth === 1280)).toBe(true);
    // Re-injection with a new size updates instead of redefining.
    win.eval(buildBeforeContentScript({ screen: { width: 2560, height: 1440 }, agent, desktopMode: true }));
    expect(win.screen.width).toBe(2560);
  });
  it('leaves the environment alone when desktopMode is off', () => {
    const { win } = setup('<body></body>', { desktopMode: false });
    expect(win.navigator.platform).not.toBe('Win32');
    expect(typeof win.__dvSetScreen).toBe('undefined');
  });
});

describe('info reporter', () => {
  it('posts info on request', () => {
    const { win, messages } = setup('<title>Hallo</title><body></body>');
    win.eval(buildInfoRequestCall());
    const info = messages.find((m) => m.type === 'info');
    expect(info).toMatchObject({ type: 'info', url: 'https://example.com/', title: 'Hallo', screenWidth: 1920, screenHeight: 1080 });
    expect(typeof info.innerWidth).toBe('number');
    expect(typeof info.devicePixelRatio).toBe('number');
  });
});

describe('mouse engine', () => {
  const html = `<!doctype html><html><head><style>
      .menu:hover .list { display: block; }
      @media (hover: hover) { a.x:hover { color: red; } }
      .plain { color: blue; }
    </style></head><body>
      <div id="outer"><div class="menu" id="menu"><span id="label">Menü</span></div></div>
      <div id="other"></div>
      <a id="link" href="#ziel">Link</a>
      <input id="field" type="text">
      <div id="box" style="overflow-y: auto; height: 50px"><div style="height: 500px">x</div></div>
    </body></html>`;

  it('is installed once and hidden', () => {
    const { win } = setup(html);
    const dv = win.__dv;
    expect(typeof dv.move).toBe('function');
    win.eval(buildBeforeContentScript({ screen: { width: 1920, height: 1080 }, agent, desktopMode: true }));
    expect(win.__dv).toBe(dv);
    expect(Object.keys(win)).not.toContain('__dv');
  });

  it('dispatches enter/over/leave and maintains the hover chain', () => {
    const { win, doc } = setup(html);
    const label = doc.getElementById('label')!;
    const menu = doc.getElementById('menu')!;
    const outer = doc.getElementById('outer')!;
    const other = doc.getElementById('other')!;
    const log: string[] = [];
    for (const el of [label, menu, outer, other]) {
      for (const t of ['mouseover', 'mouseenter', 'mouseleave', 'mouseout', 'mousemove', 'pointerenter']) {
        el.addEventListener(t, (e) => {
          if (e.currentTarget === e.target || !e.bubbles) log.push(`${t}:${(e.currentTarget as Element).id}`);
        });
      }
    }
    let target: Element | null = label;
    stubPoint(doc, () => target);
    win.eval(mouse.move(10, 20));
    expect(log).toContain('mouseover:label');
    expect(log).toContain('mouseenter:label');
    expect(log).toContain('mouseenter:menu');
    expect(log).toContain('mouseenter:outer');
    expect(log).toContain('pointerenter:menu');
    expect(log).toContain('mousemove:label');
    for (const el of [label, menu, outer, doc.body, doc.documentElement]) expect(el.hasAttribute('data-dv-hover')).toBe(true);
    expect(other.hasAttribute('data-dv-hover')).toBe(false);

    log.length = 0;
    target = other;
    win.eval(mouse.move(10, 200));
    expect(log).toEqual(expect.arrayContaining(['mouseout:label', 'mouseleave:label', 'mouseleave:menu', 'mouseleave:outer', 'mouseover:other', 'mouseenter:other']));
    expect(log).not.toContain('mouseleave:body');
    expect(log.indexOf('mouseleave:label')).toBeLessThan(log.indexOf('mouseleave:outer'));
    expect(label.hasAttribute('data-dv-hover')).toBe(false);
    expect(outer.hasAttribute('data-dv-hover')).toBe(false);
    expect(other.hasAttribute('data-dv-hover')).toBe(true);
    expect(doc.body.hasAttribute('data-dv-hover')).toBe(true);

    log.length = 0;
    win.eval(mouse.leave());
    expect(log).toContain('mouseleave:other');
    expect(doc.querySelectorAll('[data-dv-hover]')).toHaveLength(0);
  });

  it('clones :hover rules into the managed style (keeping @media, rewritten)', () => {
    const { win, doc } = setup(html);
    stubPoint(doc, () => doc.getElementById('label'));
    win.eval(mouse.move(1, 1));
    const style = doc.getElementById(HOVER_STYLE_ID)!;
    expect(style).not.toBeNull();
    const css = style.textContent!;
    expect(css).toContain('.menu[data-dv-hover] .list');
    expect(css).toContain('display: block');
    expect(css).toMatch(/@media \(min-width: 0px\) \{ a\.x\[data-dv-hover\] \{ color: red; \} \}/);
    expect(css).not.toContain('.plain');
    expect(css).not.toContain(':hover');
    // The cloned rule actually applies in the CSSOM.
    const sheet = (style as HTMLStyleElement).sheet!;
    expect(sheet.cssRules.length).toBe(2);
  });

  it('posts cursor messages only on change', () => {
    const { win, doc, messages } = setup(html);
    let target: Element | null = doc.getElementById('link');
    stubPoint(doc, () => target);
    win.eval(mouse.move(1, 1));
    win.eval(mouse.move(2, 1));
    target = doc.getElementById('field');
    win.eval(mouse.move(3, 1));
    target = doc.getElementById('other');
    win.eval(mouse.move(4, 1));
    const cursors = messages.filter((m) => m.type === 'cursor').map((m) => m.cursor);
    expect(cursors).toEqual(['pointer', 'text', 'default']);
  });

  it('click dispatches the sequence and focuses inputs', () => {
    const { win, doc } = setup(html);
    const field = doc.getElementById('field')!;
    stubPoint(doc, () => field);
    const seq: string[] = [];
    for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) field.addEventListener(t, () => seq.push(t));
    win.eval(mouse.click(5, 5));
    expect(seq).toEqual(['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']);
    expect(doc.activeElement).toBe(field);
  });

  it('click on a link navigates once via the click event', async () => {
    const { win, doc } = setup(html);
    const link = doc.getElementById('link')!;
    stubPoint(doc, () => link);
    let clicks = 0;
    link.addEventListener('click', () => clicks++);
    win.eval(mouse.click(5, 5));
    expect(clicks).toBe(1);
    await new Promise((r) => setTimeout(r, 10));
    expect(win.location.hash).toBe('#ziel');
  });

  it('contextMenu dispatches contextmenu with button 2', () => {
    const { win, doc } = setup(html);
    const other = doc.getElementById('other')!;
    stubPoint(doc, () => other);
    const got: MouseEvent[] = [];
    other.addEventListener('contextmenu', (e) => got.push(e as MouseEvent));
    let clicked = false;
    other.addEventListener('click', () => (clicked = true));
    win.eval(mouse.contextMenu(5, 5));
    expect(got).toHaveLength(1);
    expect(got[0].button).toBe(2);
    expect(clicked).toBe(false);
  });

  it('scroll scrolls the nearest scrollable ancestor and dispatches wheel', () => {
    const { win, doc } = setup(html);
    const box = doc.getElementById('box')!;
    const inner = box.firstElementChild!;
    let top = 0;
    Object.defineProperty(box, 'scrollHeight', { value: 500 });
    Object.defineProperty(box, 'clientHeight', { value: 50 });
    Object.defineProperty(box, 'scrollTop', { get: () => top, set: (v) => (top = Math.max(0, Math.min(450, v))) });
    (box as any).scrollBy = undefined;
    stubPoint(doc, () => inner);
    const wheels: WheelEvent[] = [];
    box.addEventListener('wheel', (e) => wheels.push(e as WheelEvent));
    win.eval(mouse.scroll(5, 5, 0, 120));
    expect(top).toBe(120);
    expect(wheels).toHaveLength(1);
    expect(wheels[0].deltaY).toBe(120);
    win.eval(mouse.scroll(5, 5, 0, -500));
    expect(top).toBe(0);
  });

  it('respects preventDefault on wheel', () => {
    const { win, doc } = setup(html);
    const box = doc.getElementById('box')!;
    let top = 0;
    Object.defineProperty(box, 'scrollHeight', { value: 500 });
    Object.defineProperty(box, 'clientHeight', { value: 50 });
    Object.defineProperty(box, 'scrollTop', { get: () => top, set: (v) => (top = v) });
    stubPoint(doc, () => box);
    box.addEventListener('wheel', (e) => e.preventDefault());
    win.eval(mouse.scroll(5, 5, 0, 100));
    expect(top).toBe(0);
  });
});

function loaded(dom: JSDOM): Promise<void> {
  return new Promise((resolve) => {
    if (dom.window.document.readyState !== 'loading') resolve();
    else dom.window.document.addEventListener('DOMContentLoaded', () => resolve());
  });
}

describe('test page', () => {
  it('parses and its script runs without errors', async () => {
    const errors: unknown[] = [];
    const dom = new JSDOM(TEST_PAGE_HTML, {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      beforeParse(w: any) {
        (w as any).matchMedia = (q: string) => ({ matches: /hover: hover|pointer: fine/.test(q), media: q });
        w.addEventListener('error', (e: any) => errors.push(e.error));
      },
    });
    const doc = dom.window.document;
    await loaded(dom);
    expect(errors).toEqual([]);
    expect(doc.title).toContain('Deskview');
    expect(doc.getElementById('vp')!.textContent).toMatch(/^\d+ × \d+px$/);
    expect(doc.querySelectorAll('#checks li')).toHaveLength(6);
    expect(doc.querySelectorAll('.bp-seg.on').length).toBeGreaterThan(0);
    expect(doc.body.textContent).toContain('Diese Seite zeigt, was Websites von deinem virtuellen Monitor sehen');
    expect(doc.body.textContent).toContain('Fahre mit der Maus hierüber');
    (doc.getElementById('click-btn') as HTMLButtonElement).click();
    expect(doc.getElementById('click-count')!.textContent).toBe('1');
    doc.getElementById('rc-area')!.dispatchEvent(new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    expect(doc.getElementById('rc-count')!.textContent).toBe('1');
    expect(TEST_PAGE_HTML).not.toMatch(/(src|href)=["']https?:/);
  });
  it('works together with the injected scripts', async () => {
    const dom = new JSDOM(TEST_PAGE_HTML, {
      runScripts: 'dangerously',
      beforeParse(w: any) {
        (w as any).matchMedia = (q: string) => ({ matches: q === MQ_TRUE, media: q });
        w.eval(buildBeforeContentScript({ screen: { width: 1920, height: 1080 }, agent, desktopMode: true }));
      },
    });
    const doc = dom.window.document;
    await loaded(dom);
    expect(doc.getElementById('scr')!.textContent).toBe('1920 × 1080');
    expect(doc.getElementById('summary')!.textContent).toMatch(/^6 von 6/);
  });
});
