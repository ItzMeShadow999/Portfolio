(function(){
  const menus = document.querySelectorAll('#menubar .mb-menu');
  const closeAll = (except) => menus.forEach(m => { if (m !== except) m.classList.remove('open'); });
  menus.forEach(m => {
    const trig = m.querySelector('.mb-trigger');
    trig.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = m.classList.contains('open');
      closeAll(m);
      m.classList.toggle('open', !wasOpen);
    });
    m.addEventListener('mouseenter', () => {
      if ([...menus].some(x => x.classList.contains('open'))) {
        closeAll(m); m.classList.add('open');
      }
    });
  });
  document.addEventListener('click', () => closeAll(null));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(null); });
  const CURSOR_THEMES = ['Anime', 'Cute', 'MacOS', 'Minecraft', 'Minecraft2', 'Normal Black', 'Normal White -soft', 'RGB'];
  const DEFAULT_CURSOR_THEME = 'Normal Black'; // what first-time visitors (and "reset") get — matches the CSS fallback in styles.css
  const CURSOR_BASE_PATH = 'cursors';
  const CURSOR_INTERACTIVE_SELECTOR = 'a, button, .di, .wp-swatch, .mp-btn, .node, .folder, .photo-node .thumb, .book, .poster-card, .snake-expand, .sm-close, .restore-btn';
  function cursorFilePath(theme, file) {
    return `${CURSOR_BASE_PATH}/${theme}/${file}`;
  }
  const cursorStyleTag = document.createElement('style');
  cursorStyleTag.id = 'custom-cursor-style';
  document.head.appendChild(cursorStyleTag);
  const cursorFollower = document.createElement('div');
  cursorFollower.id = 'cursor-follower';
  cursorFollower.style.cssText = 'position:fixed; top:0; left:0; display:none; pointer-events:none; z-index:2147483647;';
  const cursorFollowerImg = document.createElement('img');
  cursorFollowerImg.style.cssText = 'display:block; user-select:none; -webkit-user-drag:none;';
  cursorFollowerImg.draggable = false;
  cursorFollower.appendChild(cursorFollowerImg);
  document.body.appendChild(cursorFollower);
  let activeCursorTheme = null;
  let cursorFollowerFrame = null;
  // The floating <img> follower is only accurately positioned AFTER the
  // first real mousemove event. Until then we must NOT blank the native
  // cursor (cursor:none), or the visitor would see nothing at all. Instead,
  // before that first move, we keep the browser's own cursor mechanism
  // showing the correct themed image via CSS url() — same trick as the
  // styles.css fallback, just swapped to match the active theme. Once we
  // have a real position, we switch over to the crisp JS-driven follower
  // and blank the native one. This guarantees a custom cursor is visible
  // at every single moment, with zero gap and zero native fallback.
  let followerReady = false;
  function updateCursorStyleTag() {
    if (!activeCursorTheme) return;
    if (followerReady) {
      cursorStyleTag.textContent = `* { cursor: none !important; }`;
    } else {
      const arrowPng = cursorFilePath(activeCursorTheme, 'Arrow.png');
      const arrowGif = cursorFilePath(activeCursorTheme, 'Arrow.gif');
      const handGif = cursorFilePath(activeCursorTheme, 'Working.gif');
      cursorStyleTag.textContent =
        `* { cursor: url('${arrowPng}') 0 0, url('${arrowGif}') 0 0, auto !important; }
${CURSOR_INTERACTIVE_SELECTOR} { cursor: url('${handGif}') 0 0, auto !important; }`;
    }
  }
  function setCursorFollowerFrame(frame) {
    if (!activeCursorTheme || cursorFollowerFrame === frame) return;
    cursorFollowerFrame = frame;
    cursorFollowerImg.src = cursorFilePath(activeCursorTheme, frame === 'hand' ? 'Working.gif' : 'Arrow.gif');
  }
  function onCursorFollowerMove(e) {
    if (!activeCursorTheme) return;
    cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    if (!followerReady) {
      followerReady = true;
      updateCursorStyleTag(); // safe to blank native now — follower is positioned correctly
    }
    const overInteractive = !!(e.target && e.target.closest && e.target.closest(CURSOR_INTERACTIVE_SELECTOR));
    setCursorFollowerFrame(overInteractive ? 'hand' : 'arrow');
  }
  document.addEventListener('mousemove', onCursorFollowerMove);
  // NOTE: we deliberately do NOT hide the follower or blank cursorStyleTag
  // on mouseleave/mouseenter anymore — if we did, the moment the pointer
  // left and re-entered the window (or a nested iframe/menu), there'd be a
  // window where nothing but the native cursor was left to show. Hiding the
  // follower div when the OS cursor is genuinely off-window is harmless
  // because at that point the OS's own (non-web) cursor takes over anyway —
  // that's outside any web page's control.
  document.addEventListener('mouseleave', () => { cursorFollower.style.display = 'none'; });
  document.addEventListener('mouseenter', () => { if (activeCursorTheme) cursorFollower.style.display = 'block'; });
  const cursorPicker = document.getElementById('cursor-picker');
  function applyCursorTheme(theme) {
    if (!CURSOR_THEMES.includes(theme)) { theme = DEFAULT_CURSOR_THEME; }
    activeCursorTheme = theme;
    cursorFollowerFrame = null;
    setCursorFollowerFrame('arrow');
    cursorFollower.style.display = 'block';
    updateCursorStyleTag();
    const label = document.getElementById('cursorStyleCurrent');
    if (label) label.textContent = theme === DEFAULT_CURSOR_THEME ? `${theme} (Default)` : theme;
    try { localStorage.setItem('cursorThemeV1', theme); } catch(_){}
    updateActiveOption(theme);
  }
  // "Reset" no longer means "turn the cursor off" — it means "go back to
  // the default theme." The custom cursor must never be fully disabled, or
  // the native browser cursor comes back, which is exactly what we're
  // avoiding everywhere else.
  function resetCursorStyle() {
    applyCursorTheme(DEFAULT_CURSOR_THEME);
  }
  // Always apply a theme on load — saved preference if valid, otherwise the
  // default. There is no "no theme" state; a first-time visitor with no
  // localStorage entry gets DEFAULT_CURSOR_THEME immediately, matching what
  // styles.css already painted on first frame, so the swap is invisible.
  try {
    const saved = localStorage.getItem('cursorThemeV1');
    applyCursorTheme((saved && CURSOR_THEMES.includes(saved)) ? saved : DEFAULT_CURSOR_THEME);
  } catch(_) {
    applyCursorTheme(DEFAULT_CURSOR_THEME);
  }
  window.__resetCursor = resetCursorStyle;
  const openCursorPicker = () => { cursorPicker.classList.add('show'); };
  const closeCursorPicker = () => cursorPicker.classList.remove('show');
  document.getElementById('cursorPickerClose').addEventListener('click', closeCursorPicker);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCursorPicker(); });
  function updateActiveOption(theme) {
    cursorPicker.querySelectorAll('.cursor-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cursor === theme);
    });
  }
  const cursorPickerGrid = document.getElementById('cursorPickerGrid');
  if (cursorPickerGrid) {
    CURSOR_THEMES.forEach(theme => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cursor-option';
      btn.dataset.cursor = theme;
      const preview = document.createElement('div');
      preview.className = 'cursor-preview';
      const img = document.createElement('img');
      img.src = cursorFilePath(theme, 'Arrow.gif');
      img.alt = `${theme} cursor preview`;
      img.loading = 'lazy';
      preview.appendChild(img);
      const label = document.createElement('div');
      label.className = 'cursor-option-label';
      label.textContent = theme;
      btn.appendChild(preview);
      btn.appendChild(label);
      btn.addEventListener('click', () => {
        applyCursorTheme(theme);
        setTimeout(closeCursorPicker, 260);
      });
      cursorPickerGrid.appendChild(btn);
    });
  }
  document.querySelectorAll('#menubar .mb-dropdown [data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.action;
      closeAll(null);
      if (act === 'about') { window.__openAbout && window.__openAbout(); }
      else if (act === 'cursor-style') openCursorPicker();
      else if (act === 'reset-cursor') resetCursorStyle();
    });
  });
})();
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('datebox');
function tick() {
  const d = new Date();
  const time = d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', second:'2-digit', hour12:false });
  clockEl.textContent = time;
  dateEl.textContent = d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}
tick(); setInterval(tick, 1000);
(function initBatteryIndicators(){
  if (!navigator.getBattery) return;
  const TARGETS = [
    { wrap:'menubarBattery', fill:'menubarBatFill', bolt:'menubarBatBolt', pct:'menubarBatteryPct', showDisplay:'inline-flex' },
    { wrap:null,             fill:'msBatFill',       bolt:'msBatBolt',      pct:'msBatteryPct',      showDisplay:null },
  ];
  const FILL_MAX = 16; // matches the SVG's inner fill-area width (x=3 to x=19)
  function colorFor(level){
    if (level <= 0.2) return '#c0392b'; // red — low
    if (level <= 0.5) return '#c79a4b'; // amber — medium
    return '#5aa06a';                   // green — good
  }
  navigator.getBattery().then(b => {
    function render(){
      const pct = Math.round(b.level * 100);
      const color = colorFor(b.level);
      TARGETS.forEach(t => {
        const fillEl = document.getElementById(t.fill);
        const boltEl = document.getElementById(t.bolt);
        const pctEl  = document.getElementById(t.pct);
        const wrapEl = t.wrap ? document.getElementById(t.wrap) : null;
        if (fillEl){ fillEl.setAttribute('width', Math.max(0, b.level * FILL_MAX).toFixed(1)); fillEl.style.fill = color; }
        if (boltEl) boltEl.style.display = b.charging ? '' : 'none';
        if (pctEl)  pctEl.textContent = pct + '%';
        if (wrapEl && t.showDisplay) wrapEl.style.display = t.showDisplay;
      });
    }
    render();
    b.addEventListener('levelchange', render);
    b.addEventListener('chargingchange', render);
  }).catch(()=>{});
})();
(function initDesktopSfx(){
  let ctx, master;
  function ensure(){
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.42;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function bell(freq, dur=0.18, gain=0.22, when=0, detune=0){
    const c = ensure();
    const now = c.currentTime + when;
    const osc = c.createOscillator();
    const g = c.createGain();
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(4200, freq*4);
    osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now); if (detune) osc.detune.value = detune;
    g.gain.setValueAtTime(0.00001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.00001, now + dur);
    osc.connect(lp); lp.connect(g); g.connect(master);
    osc.start(now); osc.stop(now + dur + 0.03);
  }
  function swoosh({dur=0.55, startFreq=1200, endFreq=180, gain=0.28, when=0} = {}){
    const c = ensure();
    const now = c.currentTime + when;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0; i<len; i++) data[i] = (Math.random()*2 - 1) * (1 - i/len);
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(startFreq, now);
    bp.frequency.exponentialRampToValueAtTime(Math.max(60,endFreq), now + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(now); src.stop(now + dur + 0.02);
  }
  window.desktopSfx = {
    select(){ bell(920, 0.09, 0.10); },
    open(){ bell(660, 0.22, 0.16); bell(990, 0.28, 0.10, 0.04); },
    drag(){ bell(520, 0.06, 0.06); },
    drop(){ bell(440, 0.14, 0.13); bell(660, 0.18, 0.08, 0.03); },
    trash(){ swoosh({dur:0.55, startFreq:1400, endFreq:160, gain:0.32}); bell(180, 0.18, 0.08, 0.22); },
    restore(){ bell(520, 0.14, 0.12); bell(780, 0.20, 0.10, 0.05); },
    test(){ bell(760, 0.14, 0.14); }
  };
  let unlocked = false;
  const unlock = async () => {
    if (unlocked) return;
    try {
      ensure();
      if (ctx.state === 'suspended') await ctx.resume();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf; src.connect(ctx.destination); src.start(0);
      unlocked = true;
    } catch(_) {}
  };
  ['pointerdown','pointerup','mousedown','keydown','touchstart','click'].forEach(ev =>
    window.addEventListener(ev, unlock, { capture:true })
  );
  document.addEventListener('pointerdown', unlock, { capture:true });
})();
const THEMES = {
  sky: {
    label: 'Sky',
    video: '/__l5e/assets-v1/4e62b6ae-24d3-4a79-b37d-485f5fc9b4c7/hub-sky-nobg.mp4',
    swatch: 'linear-gradient(135deg,#c7d9ec,#9db8d9)',
    bg: `radial-gradient(ellipse 1200px 500px at 50% 100%, rgba(210,225,238,0.9) 0%, transparent 65%),
         radial-gradient(ellipse 700px 300px at 20% 20%, rgba(255,255,255,0.5) 0%, transparent 70%),
         linear-gradient(180deg, #e6eef7 0%, #d3e0ec 45%, #b8cbe0 100%)`,
    glow: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 45%, transparent 70%)',
    image: 'images/Background.png',
    tagline: 'Vision, inspired by nature.',
    subtitle: 'Systems that see the whole picture.',
    coord: '36.7783° N<br>119.4179° W',
    callouts: ['Canopy — flora layer','Bedrock mass','Crystalline drip']
  },
  forest: {
    label: 'Forest',
    video: '/__l5e/assets-v1/3514b752-2406-4216-bd1a-b58695dcad7c/hub-forest-nobg.mp4',
    swatch: 'linear-gradient(135deg,#8fae83,#4d6b46)',
    bg: `radial-gradient(ellipse 900px 500px at 30% 100%, rgba(80,110,80,0.55) 0%, transparent 65%),radial-gradient(ellipse 700px 300px at 80% 20%, rgba(220,225,205,0.45) 0%, transparent 70%),linear-gradient(180deg, #cfd6c4 0%, #a8b598 40%, #7d8c74 100%)`,
    glow: 'radial-gradient(circle, rgba(210,230,190,0.45) 0%, rgba(210,230,190,0.1) 45%, transparent 70%)',
    image: 'images/2Background.png',
    tagline: 'Growth, inspired by nature.',
    subtitle: 'Depth built up in layers, not shortcuts.',
    coord: '0.9636° S<br>79.6678° W',
    callouts: ['Fern canopy','Moss-bound rock','Root system']
  },
  desert: {
    label: 'Desert',
    video: '/__l5e/assets-v1/917cd1c5-76c2-4c5e-8118-1d0f9917e114/hub-desert-nobg.mp4',
    swatch: 'linear-gradient(135deg,#d9b78a,#a8763f)',
    bg: `radial-gradient(ellipse 1100px 400px at 50% 100%, rgba(200,175,140,0.6) 0%, transparent 65%),radial-gradient(ellipse 800px 250px at 20% 30%, rgba(255,240,220,0.5) 0%, transparent 70%),linear-gradient(180deg, #e8dcc4 0%, #d4bfa0 45%, #b39a7a 100%)`,
    glow: 'radial-gradient(circle, rgba(255,225,175,0.45) 0%, rgba(255,225,175,0.1) 45%, transparent 70%)',
    image: 'images/3Background.png',
    tagline: 'Patience, inspired by nature.',
    subtitle: 'Precision shaped slowly, built to endure.',
    coord: '35.0110° N<br>115.4734° W',
    callouts: ['Dried bloom','Sandstone face','Mineral strata']
  },
  night: {
    label: 'Night',
    video: '/__l5e/assets-v1/64fd6bdd-eef6-4e2b-949e-ad88a8c1c1e9/hub-night.mp4',
    swatch: 'linear-gradient(135deg,#3a4460,#0c1018)',
    bg: `#000`,
    glow: 'radial-gradient(circle, rgba(140,160,220,0.35) 0%, rgba(140,160,220,0.08) 45%, transparent 70%)',
    image: 'images/4Background.png',
    tagline: 'Focus, inspired by nature.',
    subtitle: 'Signal found in stillness and scale.',
    coord: '19.8283° N<br>155.4783° W',
    callouts: ['Cluster core','Signal density','Field of view']
  }
};
const order = ['sky','forest','desert','night'];
let themeIdx = 0;
const SITE_BG_VIDEO = 'images/Background.mp4';
const DYN_WALLPAPER_KEY = 'l5e_dynamic_wallpaper';
let dynamicWallpaper = localStorage.getItem(DYN_WALLPAPER_KEY) === '1';
(function preloadWallpapers(){
  Object.values(THEMES).forEach(t => {
    if (!t.image) return;
    const img = new Image();
    img.src = t.image;
  });
  if (dynamicWallpaper) {
    const v = document.createElement('video');
    v.preload = 'auto';
    v.src = SITE_BG_VIDEO;
  }
})();
const SCRIM = {
  sky:    'linear-gradient(rgba(255,255,255,0.10),rgba(255,255,255,0.18))',
  night:  'linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.45))',
  forest: 'linear-gradient(rgba(0,0,0,0.20),rgba(0,0,0,0.30))',
  desert: 'linear-gradient(rgba(255,255,255,0.10),rgba(255,255,255,0.18))',
};
let __bgLayerFlag = false;
function crossfadeStageLayer(backgroundCss) {
  const a = document.getElementById('bgLayerA');
  const b = document.getElementById('bgLayerB');
  if (!a || !b) return;
  const nextEl = __bgLayerFlag ? a : b;
  const prevEl = __bgLayerFlag ? b : a;
  nextEl.style.background = backgroundCss;
  void nextEl.offsetWidth;
  requestAnimationFrame(() => {
    nextEl.classList.add('active');
    prevEl.classList.remove('active');
  });
  __bgLayerFlag = !__bgLayerFlag;
}
function setDynamicWallpaper(on) {
  dynamicWallpaper = on;
  localStorage.setItem(DYN_WALLPAPER_KEY, on ? '1' : '0');
  const toggle = document.getElementById('dynWallpaperToggle');
  if (toggle) {
    toggle.classList.toggle('on', on);
    toggle.setAttribute('aria-checked', on ? 'true' : 'false');
  }
  applyTheme(document.body.getAttribute('data-theme') || order[0]);
}
function applyTheme(key) {
  const t = THEMES[key];
  if (!t) return;
  document.body.setAttribute('data-theme', key);
  const stage = document.getElementById('stage');
  const bgVideo = document.getElementById('siteBgVideo');
  const swatch = document.getElementById('themeSwatch');
  const label = document.getElementById('themeLabel');
  const coord = document.getElementById('coordText');
  if (stage) {
    stage.style.background = t.bg || '';
    if (dynamicWallpaper) {
      if (bgVideo) {
        if (bgVideo.getAttribute('src') !== SITE_BG_VIDEO) bgVideo.setAttribute('src', SITE_BG_VIDEO);
        bgVideo.classList.add('show');
        bgVideo.play().catch(() => {});
      }
      crossfadeStageLayer(SCRIM[key] || '');
    } else {
      if (bgVideo) { bgVideo.classList.remove('show'); bgVideo.pause(); }
      crossfadeStageLayer(`${SCRIM[key] || ''}, url("${t.image}") center center / cover no-repeat`);
    }
  }
  if (swatch) swatch.style.background = t.swatch;
  if (label) label.textContent = t.label;
  if (coord) coord.innerHTML = t.coord || '';
  if (window.__setMusicTheme) window.__setMusicTheme(key);
  window.requestAnimationFrame(() => { fitLayer(); drawLines(); });
}
applyTheme(order[0]);
(function initDynamicWallpaperToggle(){
  const toggle = document.getElementById('dynWallpaperToggle');
  if (!toggle) return;
  toggle.classList.toggle('on', dynamicWallpaper);
  toggle.setAttribute('aria-checked', dynamicWallpaper ? 'true' : 'false');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setDynamicWallpaper(!dynamicWallpaper);
  });
})();
const CHORD_INTERVALS = {
  maj:[0,4,7,12], min:[0,3,7,12], maj7:[0,4,7,11], min7:[0,3,7,10],
  maj9:[0,4,7,14], min9:[0,3,7,14], sus2:[0,2,7,12], dom7:[0,4,7,10]
};
const MUSIC = {
  sky: { 
    track:'Morning Light', artist:'Sky',
    bpm:82, padWave:'sine', bassWave:'sine', arpWave:'sine', leadWave:'sine',
    padGain:0.09, bassGain:0.09, arpGain:0.06, leadGain:0.07, drums:false, cutoff:2000,
    chords:[{r:60,t:'maj7'},{r:57,t:'min7'},{r:65,t:'maj7'},{r:67,t:'maj'}],
    arp:[0,null,7,null,12,null,7,null, null,14,null,7,null,10,null,7],
    melody:[[0,76],[8,79],[14,81],[22,79],[28,76],[36,74],[44,77],[52,79],[60,72]]
  },
  forest: { 
    track:'Fern Mist', artist:'Forest',
    bpm:64, padWave:'sine', bassWave:'sine', arpWave:'sine', leadWave:'sine',
    padGain:0.10, bassGain:0.11, arpGain:0.05, leadGain:0.07, drums:false, cutoff:1400,
    chords:[{r:57,t:'min9'},{r:62,t:'min9'},{r:65,t:'maj9'},{r:64,t:'min7'}],
    arp:[0,7,null,14,null,10,null,7, null,14,null,17,null,10,null,7],
    melody:[[0,69],[8,76],[14,79],[20,77],[28,74],[36,72],[44,76],[52,79],[60,72]]
  },
  desert: { 
    track:'Amber Hour', artist:'Desert',
    bpm:72, padWave:'sine', bassWave:'sine', arpWave:'sine', leadWave:'triangle',
    padGain:0.08, bassGain:0.09, arpGain:0.05, leadGain:0.06, drums:false, cutoff:1500,
    chords:[{r:62,t:'min9'},{r:58,t:'maj7'},{r:65,t:'maj7'},{r:57,t:'min7'}],
    arp:[0,null,7,null,12,null,10,null, null,7,null,14,null,10,null,7],
    melody:[[0,74],[10,77],[20,79],[30,77],[40,74],[50,72],[60,70]]
  },
  night: { 
    track:'Moonlit Drift', artist:'Night',
    bpm:54, padWave:'sine', bassWave:'sine', arpWave:'sine', leadWave:'sine',
    padGain:0.11, bassGain:0.12, arpGain:0.04, leadGain:0.06, drums:false, cutoff:1000,
    chords:[{r:57,t:'min7'},{r:53,t:'maj7'},{r:55,t:'dom7'},{r:52,t:'min7'}],
    arp:[0,null,7,null,10,null,7,null, 0,null,7,null,14,null,10,null],
    melody:[[0,69],[12,72],[24,76],[38,72],[48,69],[60,64]]
  },
};
(function initMusic(){
  const widget  = document.getElementById('music-widget');
  const playBtn = document.getElementById('mpPlay');
  const nextBtn = document.getElementById('mpNext');
  const prevBtn = document.getElementById('mpPrev');
  const trackEl = document.getElementById('mpTrack');
  const artistEl= document.getElementById('mpArtist');
  const iPlay   = document.getElementById('mpPlayIcon');
  const iPause  = document.getElementById('mpPauseIcon');
  const mtof = n => 440 * Math.pow(2, (n - 69) / 12);
  let ctx=null, master=null, filter=null, verbSend=null;
  let playing=false, currentTheme=document.body.getAttribute('data-theme')||'sky';
  let schedTimer=null, nextStep=0, nextTime=0, LOOKAHEAD=0.1, INTERVAL=25;
  function ensureCtx(){
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    filter = ctx.createBiquadFilter();
    filter.type='lowpass'; filter.Q.value=0.5; filter.frequency.value=1800;
    verbSend = ctx.createGain(); verbSend.gain.value = 0.22;
    const d1 = ctx.createDelay(2.0); d1.delayTime.value = 0.19;
    const d2 = ctx.createDelay(2.0); d2.delayTime.value = 0.33;
    const fb = ctx.createGain(); fb.gain.value = 0.36;
    const verbLp = ctx.createBiquadFilter(); verbLp.type='lowpass'; verbLp.frequency.value=2600;
    verbSend.connect(d1); d1.connect(verbLp); verbLp.connect(fb); fb.connect(d2); d2.connect(fb); d2.connect(master);
    filter.connect(master); filter.connect(verbSend);
    master.connect(ctx.destination);
  }
  function playNote(midi, dur, wave, gain, when, {pad=false}={}){
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = wave; osc.frequency.value = mtof(midi);
    const g = ctx.createGain(); g.gain.value = 0;
    const attack = pad ? 0.6 : 0.008;
    const release = pad ? 1.2 : Math.min(0.6, dur*0.6);
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(gain, when + attack);
    g.gain.setValueAtTime(gain, when + Math.max(attack, dur - release));
    g.gain.linearRampToValueAtTime(0, when + dur);
    osc.connect(g).connect(filter);
    osc.start(when); osc.stop(when + dur + 0.05);
  }
  function playKick(when, gain=0.35){
    if (!ctx) return;
    const osc = ctx.createOscillator(); osc.type='sine';
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(120, when);
    osc.frequency.exponentialRampToValueAtTime(40, when + 0.14);
    g.gain.setValueAtTime(gain, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.25);
    osc.connect(g).connect(master);
    osc.start(when); osc.stop(when + 0.3);
  }
  function playHat(when, gain=0.08){
    if (!ctx) return;
    const bufSize = 0.05 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i=0; i<bufSize; i++) d[i] = (Math.random()*2-1);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=6500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.06);
    src.connect(hp).connect(g).connect(master);
    src.start(when); src.stop(when + 0.08);
  }
  function scheduleStep(step, when){
    const m = MUSIC[currentTheme] || MUSIC.sky;
    const chordIdx = Math.floor(step / 16) % m.chords.length;
    const chord = m.chords[chordIdx];
    const chordIntervals = CHORD_INTERVALS[chord.t] || CHORD_INTERVALS.maj;
    const sixteenth = 60 / m.bpm / 4;
    if (step % 16 === 0){
      const barDur = sixteenth * 16;
      chordIntervals.forEach(iv => {
        playNote(chord.r + iv, barDur * 0.95, m.padWave, m.padGain, when, {pad:true});
      });
    }
    if (step % 8 === 0){
      const bassNote = chord.r - 12 + (step % 16 === 0 ? 0 : 7);
      playNote(bassNote, sixteenth * 6, m.bassWave, m.bassGain, when);
    }
    const arpNote = m.arp[step % 16];
    if (arpNote !== null && arpNote !== undefined){
      playNote(chord.r + arpNote + 12, sixteenth * 1.4, m.arpWave, m.arpGain, when);
    }
    m.melody.forEach(([s, n]) => {
      if (s === step % 64) playNote(n, sixteenth * 3.2, m.leadWave, m.leadGain, when);
    });
    if (m.drums){
      if (step % 8 === 0) playKick(when, 0.42);      
      if (step % 4 === 2) playHat(when, 0.06);        
    }
  }
  function tick(){
    if (!ctx || !playing) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD){
      scheduleStep(nextStep, nextTime);
      const m = MUSIC[currentTheme] || MUSIC.sky;
      const sixteenth = 60 / m.bpm / 4;
      nextTime += sixteenth;
      nextStep = (nextStep + 1) % 64;
    }
  }
  function play(){
    ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const m = MUSIC[currentTheme] || MUSIC.sky;
    filter.frequency.cancelScheduledValues(ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(m.cutoff, ctx.currentTime + 1.0);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.6);
    nextStep = 0;
    nextTime = ctx.currentTime + 0.08;
    playing = true;
    if (schedTimer) clearInterval(schedTimer);
    schedTimer = setInterval(tick, INTERVAL);
    syncUI();
  }
  function pause(){
    playing = false;
    if (schedTimer){ clearInterval(schedTimer); schedTimer = null; }
    if (ctx){
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    }
    syncUI();
  }
  function setTrackFor(theme){
    currentTheme = theme;
    const m = MUSIC[theme] || MUSIC.sky;
    if (trackEl)  trackEl.textContent  = m.track;
    if (artistEl) artistEl.textContent = m.artist;
    if (playing && ctx){
      filter.frequency.cancelScheduledValues(ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(m.cutoff, ctx.currentTime + 0.8);
      nextStep = 0;
    }
  }
  function syncUI(){
    widget.classList.toggle('playing', playing);
    iPlay.style.display  = playing ? 'none' : 'block';
    iPause.style.display = playing ? 'block' : 'none';
  }
  playBtn.addEventListener('click', () => { playing ? pause() : play(); });
  const themes = order;
  function shift(dir){
    const cur = document.body.getAttribute('data-theme') || themes[0];
    let i = themes.indexOf(cur); if (i<0) i = 0;
    const next = themes[(i + dir + themes.length) % themes.length];
    applyTheme(next);
    document.querySelectorAll('#wallpaper-picker .wp-swatch').forEach(b => b.classList.toggle('active', b.dataset.theme === next));
  }
  nextBtn.addEventListener('click', () => shift(+1));
  prevBtn.addEventListener('click', () => shift(-1));
  window.__setMusicTheme = setTrackFor;
  setTrackFor(document.body.getAttribute('data-theme') || 'sky');
  syncUI();
})();
(function initWallpaper(){
  const picker = document.getElementById('wallpaper-picker');
  if (!picker) return;
  const btns = picker.querySelectorAll('.wp-swatch');
  function sync(name){
    btns.forEach(b => b.classList.toggle('active', b.dataset.theme === name));
  }
  btns.forEach(b => {
    b.addEventListener('click', () => {
      const name = b.dataset.theme;
      const idx = order.indexOf(name);
      if (idx >= 0) { themeIdx = idx; applyTheme(name); sync(name); }
    });
  });
  sync(order[0]);
})();
const HUB = { x:1100, y:650 };
const NODE_KEYS = ['case1','case2','case3','case4','sunflower','snorkel','helicopter','joshua','pottery','nyc','book'];
let NODES = {};
function readNodeCenters() {
  const layer = document.getElementById('layer');
  if (!layer) return;
  const layerBox = layer.getBoundingClientRect();
  const scale = layerBox.width ? 2200 / layerBox.width : 1;
  const next = {};
  NODE_KEYS.forEach(key => {
    const el = document.getElementById('n-' + key);
    if (!el) return;
    const box = el.getBoundingClientRect();
    next[key] = {
      x: (box.left + box.width / 2 - layerBox.left) * scale,
      y: (box.top + box.height / 2 - layerBox.top) * scale
    };
  });
  NODES = next;
}
const HUB_EDGES = NODE_KEYS;
const CROSS_EDGES = [
  ['sunflower','snorkel'], ['sunflower','book'], ['book','snorkel'],
  ['sunflower','case1'], ['snorkel','case2'], ['book','case1'], ['book','case2'],
  ['case1','helicopter'], ['helicopter','joshua'], ['joshua','case3'],
  ['case3','pottery'], ['pottery','case4'], ['case4','nyc'], ['nyc','snorkel'],
  ['sunflower','helicopter'], ['snorkel','nyc'], ['nyc','case2'],
  ['helicopter','case3'], ['pottery','nyc'], ['joshua','pottery'],
  ['case1','case3'], ['case2','case4'], ['case1','case4'], ['case2','case3'],
  ['book','helicopter'], ['book','nyc'], ['book','joshua'], ['book','pottery'],
  ['sunflower','joshua'], ['snorkel','pottery'], ['helicopter','pottery'],
  ['nyc','joshua'], ['sunflower','case3'], ['snorkel','case3'],
  ['case1','snorkel'], ['case2','helicopter'], ['case4','joshua'],
  ['sunflower','nyc'], ['book','case3'], ['book','case4']
];
function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function curvePath(x1,y1,x2,y2,seed) {
  const mx = (x1+x2)/2, my = (y1+y2)/2;
  const dx = x2-x1, dy = y2-y1;
  const len = Math.hypot(dx,dy) || 1;
  const px = -dy/len, py = dx/len;
  const amp1 = (seededRand(seed)*2-1) * (len*0.35 + 60);
  const amp2 = (seededRand(seed+1.7)*2-1) * (len*0.35 + 60);
  const t1 = 0.30, t2 = 0.70;
  const c1x = x1 + dx*t1 + px*amp1, c1y = y1 + dy*t1 + py*amp1;
  const c2x = x1 + dx*t2 + px*amp2, c2y = y1 + dy*t2 + py*amp2;
  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
}
function drawLines() {
  const svg = document.getElementById('lineSvg');
  if (!svg) return;
  svg.innerHTML = '';
}
drawLines();
const _themeObserver = new MutationObserver(drawLines);
_themeObserver.observe(document.body, { attributes:true, attributeFilter:['data-theme'] });
function fitLayer() {
  const wrap = document.getElementById('layer-wrap');
  const layer = document.getElementById('layer');
  if (!wrap || !layer) return;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  if (isMobile) {
    layer.style.top = '';
    layer.style.transformOrigin = '';
    layer.style.transform = 'none';
    window.requestAnimationFrame(drawLines);
    return;
  }
  const pad = Math.max(40, Math.min(wrap.clientWidth, wrap.clientHeight) * 0.04);
  const sx = (wrap.clientWidth - pad) / 2200;
  const sy = (wrap.clientHeight - pad) / 1300;
  const minScale = 0.18;
  const s = Math.max(minScale, Math.min(sx, sy, 1.0));
  layer.style.left = (pad / 2) + 'px';
  layer.style.top = '50%';
  layer.style.transformOrigin = 'left center';
  layer.style.transform = `translateY(-50%) scale(${s})`;
  window.requestAnimationFrame(drawLines);
}
fitLayer();
window.addEventListener('resize', fitLayer);
(function autoArrangeMobile(){
  const mq = window.matchMedia('(max-width: 760px)');
  let done = false;
  function maybe(){
    if (!mq.matches) { done = false; return; }
    if (done) return;
    if (typeof window.__arrangeNodes === 'function') {
      window.__arrangeNodes(false);
      done = true;
    }
  }
  setTimeout(maybe, 50);
  mq.addEventListener?.('change', () => { done = false; setTimeout(maybe, 50); });
  window.addEventListener('resize', () => { done = false; setTimeout(maybe, 200); });
})();
document.querySelectorAll('.node').forEach((el,i) => { el.style.animationDelay = (i*0.4)+'s'; });
document.querySelectorAll('.node').forEach(node => {
  const ring = document.createElement('div');
  ring.className = 'selection-ring';
  node.appendChild(ring);
  node.addEventListener('click', e => {
    e.stopPropagation();
    const wasSelected = node.classList.contains('selected');
    document.querySelectorAll('.node.selected').forEach(n => n.classList.remove('selected'));
    if (!wasSelected) node.classList.add('selected');
    window.desktopSfx?.select();
  });
});
document.getElementById('stage').addEventListener('click', () => {
  document.querySelectorAll('.node.selected').forEach(n => n.classList.remove('selected'));
});
(function initRecycleBin(){
  const dockBin = document.getElementById('trashDock');
  const modal = document.getElementById('trashModal');
  const body = document.getElementById('trashBody');
  const closeBtn = document.getElementById('trashClose');
  const trashed = new Map();
  function nameFor(node){
    const label = node.querySelector('.node-label')?.textContent || 'Item';
    const sub = node.querySelector('.node-sub')?.textContent || '';
    return sub ? `${label} · ${sub}` : label;
  }
  function say(text){
    const h = document.getElementById('hedgehog');
    const b = document.getElementById('hedgeBubble');
    if (!h || !b) return;
    b.textContent = text;
    h.classList.add('say');
    clearTimeout(h._sayTimer);
    h._sayTimer = setTimeout(() => h.classList.remove('say'), 2200);
  }
  function render(){
    if (!body) return;
    const items = Array.from(trashed.values());
    body.innerHTML = items.length ? items.map(item => `
      <div class="trash-row">
        <span class="trash-row-name">${item.name}</span>
        <button class="restore-btn" data-id="${item.id}">Restore</button>
      </div>
    `).join('') : `<div class="trash-empty">Recycle bin is empty.</div>`;
    body.querySelectorAll('.restore-btn').forEach(btn => {
      btn.addEventListener('click', () => restore(btn.dataset.id));
    });
  }
  function open(){ modal?.classList.add('open'); render(); window.desktopSfx?.open(); }
  function close(){ modal?.classList.remove('open'); }
  function move(node){
    if (!node || node.classList.contains('trashed')) return;
    trashed.set(node.id, { id:node.id, name:nameFor(node), left:node.style.left, top:node.style.top });
    node.classList.add('trashed');
    node.classList.remove('selected');
    render();
    say('saved to the recycle bin');
    window.desktopSfx?.trash();
  }
  function restore(id){
    const item = trashed.get(id);
    const node = document.getElementById(id);
    if (!item || !node) return;
    node.classList.remove('trashed');
    node.style.left = item.left;
    node.style.top = item.top;
    trashed.delete(id);
    render();
    say('restored to the desktop');
    window.desktopSfx?.restore();
  }
  function isOver(x,y){
    if (!dockBin) return false;
    const r = dockBin.getBoundingClientRect();
    return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 10 && y <= r.bottom + 10;
  }
  dockBin?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal?.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.desktopTrash = { move, restore, isOver, render, say };
})();
(function enableDrag(){
  const layer = document.getElementById('layer');
  const trashDock = document.getElementById('trashDock');
  let dragging = null;
  let startPtr = null;
  let startPos = null;
  let scale = 1;
  let moved = false;
  function currentScale() {
    const m = new DOMMatrixReadOnly(getComputedStyle(layer).transform);
    return m.a || 1;
  }
  function visibleBoundsFor(node) {
    const wrap = document.getElementById('layer-wrap');
    if (!wrap || !layer) return null;
    const s = currentScale();
    const wr = wrap.getBoundingClientRect();
    const lr = layer.getBoundingClientRect();
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const dockSafe = isMobile ? 128 : 0;
    const edge = isMobile ? 14 : 24;
    const nodeW = (node?.offsetWidth || 170);
    const nodeH = (node?.offsetHeight || 170);
    const minX = Math.max(0, (wr.left - lr.left + edge) / s);
    const maxX = Math.min(2200 - nodeW, (wr.right - lr.left - edge) / s - nodeW);
    const minY = Math.max(0, (wr.top - lr.top + edge) / s);
    const maxY = (wr.bottom - lr.top - dockSafe - edge) / s - nodeH;
    return {
      minX,
      maxX: Math.max(minX, maxX),
      minY,
      maxY: Math.max(minY, maxY)
    };
  }
  document.querySelectorAll('.node').forEach(node => {
    node.style.cursor = 'grab';
    node.addEventListener('dragstart', e => e.preventDefault());
    node.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      if (window.matchMedia('(max-width: 760px)').matches) return;
      dragging = node;
      moved = false;
      scale = currentScale();
      startPtr = { x: e.clientX, y: e.clientY };
      const left = parseFloat(node.style.left) || 0;
      const top  = parseFloat(node.style.top)  || 0;
      startPos = { x: left, y: top };
      node.setPointerCapture(e.pointerId);
      node.style.cursor = 'grabbing';
      node.style.zIndex = 50;
      window.desktopSfx?.drag();
    });
    node.addEventListener('pointermove', e => {
      if (dragging !== node) return;
      const dx = (e.clientX - startPtr.x) / scale;
      const dy = (e.clientY - startPtr.y) / scale;
      if (Math.hypot(dx,dy) > 3) moved = true;
      let nextX = startPos.x + dx;
      let nextY = startPos.y + dy;
      if (window.matchMedia('(max-width: 760px)').matches) {
        const b = visibleBoundsFor(node);
        if (b) {
          nextX = Math.min(b.maxX, Math.max(b.minX, nextX));
          nextY = Math.min(b.maxY, Math.max(b.minY, nextY));
        }
      }
      node.style.left = nextX + 'px';
      node.style.top  = nextY + 'px';
      trashDock?.classList.toggle('drag-over', !!window.desktopTrash?.isOver(e.clientX, e.clientY));
      drawLines();
    });
    function endDrag(e){
      if (dragging !== node) return;
      dragging = null;
      node.style.cursor = 'grab';
      node.style.zIndex = '';
      try { node.releasePointerCapture(e.pointerId); } catch(_){}
      const overTrash = !!window.desktopTrash?.isOver(e.clientX, e.clientY);
      trashDock?.classList.remove('drag-over');
      if (moved) {
        const stopClick = ev => { ev.stopPropagation(); ev.preventDefault(); node.removeEventListener('click', stopClick, true); };
        node.addEventListener('click', stopClick, true);
        if (overTrash) window.desktopTrash?.move(node);
        else window.desktopSfx?.drop();
      }
    }
    node.addEventListener('pointerup', endDrag);
    node.addEventListener('pointercancel', endDrag);
  });
})();
const dock = document.getElementById('dock');
(function ctxMenu(){
  const stage = document.getElementById('stage');
  const layer = document.getElementById('layer');
  const menu = document.createElement('div');
  menu.id = 'ctx-menu';
  menu.style.cssText = 'position:fixed;z-index:9999;min-width:200px;padding:6px;border-radius:10px;background:rgba(250,250,252,0.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 10px 40px rgba(0,0,0,0.25),0 0 0 1px rgba(0,0,0,0.08);font:13px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;color:#111;display:none;user-select:none;';
  document.body.appendChild(menu);
  const items = [
    { label:'Clean Up',            act:()=>arrange(false) },
    { label:'Sort by Name',        act:()=>arrange(true) },
    { sep:true },
    { label:'Reset Positions',     act:resetPositions },
  ];
  items.forEach(it => {
    if (it.sep) { const s=document.createElement('div'); s.style.cssText='height:1px;background:rgba(0,0,0,0.08);margin:4px 6px;'; menu.appendChild(s); return; }
    const b = document.createElement('div');
    b.textContent = it.label;
    b.style.cssText='padding:6px 12px;border-radius:6px;cursor:default;';
    b.addEventListener('mouseenter',()=>{b.style.background='#2f7bff';b.style.color='#fff';});
    b.addEventListener('mouseleave',()=>{b.style.background='';b.style.color='';});
    b.addEventListener('click',()=>{hide();it.act();});
    menu.appendChild(b);
  });
  function hide(){ menu.style.display='none'; }
  function show(x,y){
    menu.style.display='block';
    const r = menu.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    menu.style.left = Math.min(x, vw - r.width - 8) + 'px';
    menu.style.top  = Math.min(y, vh - r.height - 8) + 'px';
  }
  const nodes = Array.from(document.querySelectorAll('#layer .node'));
  const original = new Map();
  nodes.forEach(n => original.set(n, { left: n.style.left, top: n.style.top }));
  function arrange(sortByName){
    const list = nodes.slice();
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    if (sortByName) {
      list.sort((a,b)=>{
        const la = (a.querySelector('.node-label')?.textContent || a.id).toLowerCase();
        const lb = (b.querySelector('.node-label')?.textContent || b.id).toLowerCase();
        return la.localeCompare(lb);
      });
    }
    if (isMobile) {
      list.forEach((n, i) => {
        n.style.transition = '';
        n.style.order = sortByName ? i : '';
        n.style.setProperty('--rot','0deg');
      });
      document.getElementById('layer-wrap')?.scrollTo({ top:0, behavior:'smooth' });
      requestAnimationFrame(()=>{ if (typeof drawLines==='function') drawLines(); });
      return;
    }
    const wrap = document.getElementById('layer-wrap');
    const matrix = new DOMMatrixReadOnly(getComputedStyle(layer).transform);
    const s = matrix.a || 1;
    const wr = wrap?.getBoundingClientRect();
    const lr = layer.getBoundingClientRect();
    const dockSafe = isMobile ? 146 : 40;
    const edge = isMobile ? 18 : 40;
    const rail = document.getElementById('widget-rail');
    const wp   = document.getElementById('wallpaper-picker');
    const railR = (!isMobile && rail) ? rail.getBoundingClientRect() : null;
    const wpR   = (!isMobile && wp)   ? wp.getBoundingClientRect()   : null;
    const blocks = [railR, wpR].filter(r => r && r.width > 0 && r.height > 0);
    const startX = wr ? wr.left : 0;
    const endX = wr ? wr.right : window.innerWidth;
    const startY = wr ? wr.top : 0;
    const endY = wr ? wr.bottom - dockSafe : window.innerHeight - dockSafe;
    const nodeFootprint = Math.max(112, Math.max(...list.map(n => n.offsetWidth || 88)));
    const blocked = x => blocks.some(r => x < r.right + 24 && x + (nodeFootprint * s) > r.left - 24);
    let safeStartX = startX;
    let safeEndX = endX;
    while (safeStartX + nodeFootprint * s < safeEndX && blocked(safeStartX + edge)) safeStartX += 16;
    while (safeEndX - nodeFootprint * s > safeStartX && blocked(safeEndX - edge - nodeFootprint * s)) safeEndX -= 16;
    const visible = wr ? {
      x1: Math.max(0, (safeStartX - lr.left + edge) / s),
      y1: Math.max(0, (startY - lr.top + edge) / s),
      x2: Math.min(2200, (safeEndX - lr.left - edge) / s),
      y2: Math.min(1300, (endY - lr.top - edge) / s)
    } : { x1:40, y1:40, x2:2160, y2:1260 };
    if (visible.x2 <= visible.x1) { visible.x1 = 40; visible.x2 = 2160; }
    if (visible.y2 <= visible.y1) { visible.y1 = 40; visible.y2 = 1260; }
    const rectW = visible.x2 - visible.x1;
    const rectH = visible.y2 - visible.y1;
    const originX = visible.x1;
    const originY = visible.y1;
    let colW = isMobile ? 230 : 190;
    let rowH = isMobile ? 240 : 200;
    let cols = Math.max(1, Math.floor(rectW / colW));
    let rows = Math.max(1, Math.ceil(list.length / cols));
    while (rows * rowH > rectH && cols < list.length) {
      cols += 1;
      colW = Math.max(140, Math.floor(rectW / cols));
      rows = Math.ceil(list.length / cols);
    }
    if (rows * rowH > rectH) {
      rowH = Math.max(150, Math.floor(rectH / rows));
    }
    const cellW = rectW / cols;
    const cellH = Math.min(rowH, rectH / rows);
    list.forEach((n, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const nodeW = n.offsetWidth || 88;
      const nodeH = n.offsetHeight || 110;
      n.style.transition = 'left 380ms cubic-bezier(.2,.7,.2,1), top 380ms cubic-bezier(.2,.7,.2,1)';
      n.style.left = (originX + col*cellW + Math.max(0, (cellW - nodeW) / 2)) + 'px';
      n.style.top  = (originY + row*cellH + Math.max(0, (cellH - nodeH) / 2)) + 'px';
      n.style.setProperty('--rot','0deg');
      setTimeout(()=>{ n.style.transition=''; }, 450);
    });
    requestAnimationFrame(()=>{ if (typeof drawLines==='function') drawLines(); });
  }
  window.__arrangeNodes = arrange;
  function resetPositions(){
    nodes.forEach(n => {
      const o = original.get(n); if (!o) return;
      n.style.transition = 'left 380ms cubic-bezier(.2,.7,.2,1), top 380ms cubic-bezier(.2,.7,.2,1)';
      n.style.left = o.left; n.style.top = o.top;
      setTimeout(()=>{ n.style.transition=''; }, 450);
    });
    requestAnimationFrame(()=>{ if (typeof drawLines==='function') drawLines(); });
  }
  let marqueeBox = null;
  let marqueeStart = null;
  let marqueeDragging = false;
  let suppressNextContextMenu = false;
  function ensureMarqueeBox(){
    if (marqueeBox) return marqueeBox;
    marqueeBox = document.createElement('div');
    marqueeBox.id = 'marquee-select';
    document.body.appendChild(marqueeBox);
    return marqueeBox;
  }
  function applyMarqueeSelection(rect){
    nodes.forEach(n => {
      if (n.classList.contains('trashed')) return;
      const r = n.getBoundingClientRect();
      const hit = !(rect.right < r.left || rect.left > r.right || rect.bottom < r.top || rect.top > r.bottom);
      n.classList.toggle('selected', hit);
    });
  }
  stage.addEventListener('mousedown', e => {
    if (e.button !== 0 && e.button !== 2) return;
    if (e.target.closest('#widget-rail, #dock, #topbar, #ctx-menu, .modal, .preview-modal, #collectionModal, .node')) return;
    const button = e.button;
    marqueeStart = { x: e.clientX, y: e.clientY };
    marqueeDragging = false;
    const onMove = (ev) => {
      const dx = ev.clientX - marqueeStart.x;
      const dy = ev.clientY - marqueeStart.y;
      if (!marqueeDragging) {
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        marqueeDragging = true;
        document.body.classList.add('marquee-active');
        ensureMarqueeBox().style.display = 'block';
      }
      const left = Math.min(marqueeStart.x, ev.clientX);
      const top = Math.min(marqueeStart.y, ev.clientY);
      const width = Math.abs(dx);
      const height = Math.abs(dy);
      marqueeBox.style.left = left + 'px';
      marqueeBox.style.top = top + 'px';
      marqueeBox.style.width = width + 'px';
      marqueeBox.style.height = height + 'px';
      applyMarqueeSelection({ left, top, right: left + width, bottom: top + height });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (marqueeDragging) {
        if (button === 2) {
          suppressNextContextMenu = true;
        } else {
          suppressNextStageClick = true;
        }
        if (marqueeBox) marqueeBox.style.display = 'none';
        document.body.classList.remove('marquee-active');
        window.desktopSfx?.select();
      }
      marqueeDragging = false;
      marqueeStart = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
  stage.addEventListener('contextmenu', e => {
    if (suppressNextContextMenu) {
      suppressNextContextMenu = false;
      e.preventDefault();
      return;
    }
    if (e.target.closest('#widget-rail, #dock, #topbar, #ctx-menu, .modal, .preview-modal, #collectionModal')) return;
    e.preventDefault();
    show(e.clientX, e.clientY);
  });
  document.addEventListener('click', hide);
  document.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
})();
const dItems = Array.from(dock.querySelectorAll('.di'));
let rafId;
dock.addEventListener('mousemove', e => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    dItems.forEach(item => {
      const ico = item.querySelector('.di-icon');
      const r = item.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const dist = Math.abs(e.clientX - cx);
      const inf = 70;
      let scale=1, lift=0, push=0;
      if (dist < inf) {
        const t = 1 - dist/inf;
        const ease = Math.sin(t*Math.PI/2);
        scale = 1 + 0.55*ease; lift = -12*ease; push = 12*ease;
      }
      ico.style.transform = `translateY(${lift}px) scale(${scale})`;
      item.style.marginLeft = push+'px'; item.style.marginRight = push+'px';
    });
  });
});
dock.addEventListener('mouseleave', () => {
  dItems.forEach(i => {
    const ico = i.querySelector('.di-icon');
    ico.style.transform = ''; i.style.marginLeft = '0'; i.style.marginRight = '0';
  });
});
dItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.add('active');
    setTimeout(() => item.classList.remove('active'), 1400);
  });
});
(function initPreview(){
  try {
    document.querySelectorAll('.photo-node').forEach(node => {
      const lbl = node.querySelector('.node-label');
      if (!lbl) return;
      const t = lbl.textContent.trim();
      if (/\.(jpg|jpeg|png|pdf)$/i.test(t)) return;
      lbl.textContent = node.id === 'n-resume' ? `${t}.pdf` : `${t}.jpg`;
    });
  } catch(_) {}
  const modal = document.createElement('div');
  modal.id = 'previewModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:5000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);';
  modal.innerHTML = `
    <div style="width:min(460px,92vw);max-height:92vh;background:#f2f2f4;border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,0.55),0 0 0 1px rgba(0,0,0,0.2);display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',sans-serif;overflow:hidden;">
      <div style="height:44px;background:linear-gradient(#ececef,#dcdce0);border-bottom:1px solid rgba(0,0,0,0.1);display:flex;align-items:center;padding:0 12px;gap:8px;position:relative;">
        <button id="pvClose" title="Close" style="width:13px;height:13px;border-radius:50%;background:#ff5f57;border:1px solid rgba(0,0,0,0.18);padding:0;cursor:pointer;"></button>
        <span style="width:13px;height:13px;border-radius:50%;background:#c6c6ca;border:1px solid rgba(0,0,0,0.14);display:inline-block;"></span>
        <span style="width:13px;height:13px;border-radius:50%;background:#c6c6ca;border:1px solid rgba(0,0,0,0.14);display:inline-block;"></span>
        <div id="pvFilename" style="position:absolute;left:0;right:0;text-align:center;font-size:12px;font-weight:600;color:#333;pointer-events:none;"></div>
        <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">
          <span id="pvZoomOut" title="Zoom out" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:22px;border-radius:6px;background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);font-size:11px;color:#555;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.04);cursor:pointer;user-select:none;transition:background .15s,color .15s,opacity .15s;">−</span>
          <span id="pvZoomIn" title="Zoom in" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:22px;border-radius:6px;background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);font-size:11px;color:#555;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.04);cursor:pointer;user-select:none;transition:background .15s,color .15s,opacity .15s;">+</span>
          <span id="pvLensToggle" title="Loupe (click to enable, hover image to zoom)" role="button" tabindex="0" aria-pressed="false" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:22px;border-radius:6px;background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);color:#555;cursor:pointer;transition:background .15s,color .15s;">
            <svg width="12" height="12" viewBox="0 0 24 24"><use href="./images/icons.svg#icon-search"></use></svg>
          </span>
        </div>
      </div>
      <div id="pvScroll" style="overflow:auto;flex:1 1 auto;min-height:0;">
      <div id="pvImgWrap" style="padding:24px 32px 10px;display:flex;align-items:flex-start;justify-content:center;position:relative;">
        <img id="pvImg" alt="" style="max-width:100%;max-height:44vh;object-fit:contain;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,0.18);transition:transform .15s ease;">
        <div id="pvLens" class="pv-lens"></div>
      </div>
      <div style="padding:14px 32px 6px;text-align:center;">
        <div id="pvTitle" style="font-size:24px;font-weight:700;color:#111;letter-spacing:-0.01em;"></div>
        <div id="pvSub" style="font-size:13px;color:#6a6a70;margin-top:4px;"></div>
      </div>
      <div style="padding:14px 40px 22px;">
        <div id="pvMeta" style="display:grid;grid-template-columns:auto 1fr;column-gap:14px;row-gap:6px;font-size:13px;color:#222;"></div>
      </div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // ---------- Zoom (+ / −) ----------
  const zoomOutBtn = modal.querySelector('#pvZoomOut');
  const zoomInBtn  = modal.querySelector('#pvZoomIn');
  const pvImgEl    = modal.querySelector('#pvImg');
  const ZOOM_MIN = 0.5, ZOOM_MAX = 3, ZOOM_STEP = 0.25;
  let zoomLevel = 1;

  const applyZoom = () => {
    pvImgEl.style.transform = `scale(${zoomLevel})`;
    pvImgEl.style.transformOrigin = 'center center';
    const atMin = zoomLevel <= ZOOM_MIN;
    const atMax = zoomLevel >= ZOOM_MAX;
    zoomOutBtn.style.opacity = atMin ? '0.4' : '1';
    zoomOutBtn.style.cursor  = atMin ? 'default' : 'pointer';
    zoomInBtn.style.opacity  = atMax ? '0.4' : '1';
    zoomInBtn.style.cursor   = atMax ? 'default' : 'pointer';
  };
  const resetZoom = () => { zoomLevel = 1; applyZoom(); };

  zoomInBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomLevel = Math.min(ZOOM_MAX, +(zoomLevel + ZOOM_STEP).toFixed(2));
    applyZoom();
  });
  zoomOutBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomLevel = Math.max(ZOOM_MIN, +(zoomLevel - ZOOM_STEP).toFixed(2));
    applyZoom();
  });
  applyZoom();

  // ---------- Magnifying lens ----------
  const lensToggle = modal.querySelector('#pvLensToggle');
  const lensWrap   = modal.querySelector('#pvImgWrap');
  const lensImg    = modal.querySelector('#pvImg');
  const lensGlass  = modal.querySelector('#pvLens');
  const LENS_ZOOM  = 2.5;
  let lensEnabled  = false;

  const setLensToggleVisual = () => {
    lensToggle.style.background = lensEnabled ? '#2f7bff' : 'rgba(255,255,255,0.7)';
    lensToggle.style.color      = lensEnabled ? '#fff' : '#555';
    lensToggle.setAttribute('aria-pressed', String(lensEnabled));
  };
  const hideLens = () => {
    lensGlass.classList.remove('pv-lens-show');
    if (lensRafId != null) { cancelAnimationFrame(lensRafId); lensRafId = null; }
    lensPrimed = false;
  };
  const setLensEnabled = (on) => {
    lensEnabled = on;
    setLensToggleVisual();
    lensImg.style.cursor = on ? 'none' : '';
    if (!on) hideLens();
  };

  // Smooth trailing motion: the lens eases toward the cursor each frame
  // instead of snapping straight to it, via translate3d (GPU-accelerated,
  // no layout thrash) + linear interpolation.
  const LENS_EASE = 0.22;
  let lensTargetX = 0, lensTargetY = 0;
  let lensCurX = 0, lensCurY = 0;
  let lensRafId = null;
  let lensPrimed = false;

  const renderLens = () => {
    lensCurX += (lensTargetX - lensCurX) * LENS_EASE;
    lensCurY += (lensTargetY - lensCurY) * LENS_EASE;
    lensGlass.style.transform = `translate3d(${lensCurX}px, ${lensCurY}px, 0) scale(1)`;

    const closeEnough = Math.abs(lensTargetX - lensCurX) < 0.4 && Math.abs(lensTargetY - lensCurY) < 0.4;
    if (!closeEnough) {
      lensRafId = requestAnimationFrame(renderLens);
    } else {
      lensRafId = null;
    }
  };

  const kickLensLoop = () => {
    if (lensRafId == null) lensRafId = requestAnimationFrame(renderLens);
  };

  const moveLens = (clientX, clientY) => {
    const rect = lensImg.getBoundingClientRect();
    let relX = clientX - rect.left;
    let relY = clientY - rect.top;
    if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height || !rect.width || !rect.height) {
      hideLens();
      return;
    }
    const size = lensGlass.offsetWidth || 150;
    lensGlass.classList.add('pv-lens-show');
    lensGlass.style.backgroundImage = `url("${lensImg.currentSrc || lensImg.src}")`;
    lensGlass.style.backgroundSize = `${rect.width * LENS_ZOOM}px ${rect.height * LENS_ZOOM}px`;
    lensGlass.style.backgroundPosition =
      `${-(relX * LENS_ZOOM - size / 2)}px ${-(relY * LENS_ZOOM - size / 2)}px`;

    lensTargetX = lensImg.offsetLeft + relX - size / 2;
    lensTargetY = lensImg.offsetTop  + relY - size / 2;

    if (!lensPrimed) {
      // First appearance this hover: jump straight there, no easing-in from a stale spot.
      lensCurX = lensTargetX;
      lensCurY = lensTargetY;
      lensGlass.style.transform = `translate3d(${lensCurX}px, ${lensCurY}px, 0) scale(1)`;
      lensPrimed = true;
    } else {
      kickLensLoop();
    }
  };

  lensToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setLensEnabled(!lensEnabled);
  });
  lensToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLensEnabled(!lensEnabled); }
  });
  // Hovering the toggle itself previews the lens over the image without pinning it on.
  lensToggle.addEventListener('mouseenter', () => { if (!lensEnabled) setLensEnabled(true); });

  lensWrap.addEventListener('mousemove', (e) => {
    if (!lensEnabled) return;
    moveLens(e.clientX, e.clientY);
  });
  lensWrap.addEventListener('mouseenter', (e) => {
    if (!lensEnabled) return;
    moveLens(e.clientX, e.clientY);
  });
  lensWrap.addEventListener('mouseleave', hideLens);

  const close = () => { modal.style.display = 'none'; setLensEnabled(false); resetZoom(); };
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  modal.querySelector('#pvClose').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.querySelectorAll('.photo-node').forEach(node => {
    node.addEventListener('dblclick', e => {
      const img = node.querySelector('.thumb img');
      if (!img) return;
      const label = node.querySelector('.node-label')?.textContent || 'Photo';
      const sub   = node.querySelector('.node-sub')?.textContent || '';
      const isResume = node.id === 'n-resume';
      modal.classList.toggle('resume-preview', isResume);
      modal.querySelector('#pvImg').src = img.src;
      modal.querySelector('#pvTitle').textContent = label;
      modal.querySelector('#pvSub').textContent = sub;
      const fnameEl = modal.querySelector('#pvFilename');
      if (fnameEl) {
        const base = (label || 'file').replace(/\.(jpg|jpeg|png|pdf)$/i,'');
        fnameEl.textContent = isResume ? `${base}.pdf` : `${base}.jpg`;
      }
      const kind = isResume ? 'PDF Document'
                 : /portrait|self|head/i.test(label+sub) ? 'Portrait' : 'Photograph';
      const rows = isResume ? [
        ['Kind', 'PDF Document'],
        ['Size', '178 KB'],
        ['Where', 'Desktop'],
        ['Modified', 'Jul 2026'],
      ] : [
        ['Kind', kind],
        ['Where', sub || '—'],
        ['Album', 'Field Research'],
        ['By', 'Shadow'],
      ];
      if (isResume) {
        modal.querySelector('#pvSub').textContent = 'Shadow · Senior Product Designer';
      }
      modal.querySelector('#pvMeta').innerHTML = rows.map(
        ([k,v]) => `<div style="color:#8a8a90;text-align:right;">${k}</div><div style="color:#111;">${v}</div>`
      ).join('');
      setLensEnabled(false);
      resetZoom();
      modal.style.display = 'flex';
    });
  });
  document.querySelectorAll('.photo-node').forEach(node => {
    node.addEventListener('dblclick', () => {
      const isResume = node.id === 'n-resume';
      modal.querySelector('#pvImg').style.maxHeight = isResume ? 'none' : '44vh';
      modal.querySelector('#pvImg').style.width = isResume ? '100%' : '';
      modal.firstElementChild.style.width = isResume ? 'min(760px, 94vw)' : 'min(460px, 92vw)';
      modal.querySelector('#pvScroll').scrollTop = 0;
    });
  });
})();
document.querySelectorAll('a.social, a[href^="http"]').forEach(a => {
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.addEventListener('click', e => {
    const url = a.getAttribute('href');
    if (!url) return;
    e.preventDefault();
    const social = a.classList.contains('social');
    if (social) {
      try { window.top.location.href = url; return; } catch(_) {}
      try { window.parent.location.href = url; return; } catch(_) {}
    }
    try {
      const w = window.open('about:blank', '_blank');
      if (w) { w.opener = null; w.location.href = url; return; }
    } catch(_) {}
    try { window.open(url, '_blank'); } catch(_) { window.location.href = url; }
  });
});
(function initLockScreen(){
  const loader = document.getElementById('loader');
  const hint   = document.getElementById('lockHint');
  if (!loader) return;
  let ready = false;
  function markReady(){
    if (ready) return;
    ready = true;
    if (hint) hint.textContent = 'Click anywhere to unlock';
  }
  (function tickLockClock(){
    const timeEl = document.getElementById('lockTime');
    const dateEl = document.getElementById('lockDate');
    if (!timeEl || !dateEl) return;
    function update(){
      const now = new Date();
timeEl.textContent = now.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});
      dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    update();
    setInterval(update, 1000);
  })();
  function unlock(e){
    if (!ready) return;
    loader.classList.add('hide');
    setTimeout(() => { loader.style.display = 'none'; }, 550);
    window.desktopSfx?.open?.();
  }
  function relock(){
    document.querySelectorAll('#n-resume').forEach(n => n.classList.remove('unlocked'));
    loader.style.display = 'flex';
    void loader.offsetWidth;
    loader.classList.remove('hide');
  }
  loader.addEventListener('click', unlock);
  loader.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); unlock(); } });
  const slider = document.getElementById('lockSlider');
  const knob   = document.getElementById('lockSliderKnob');
  if (slider && knob) {
    let dragging = false, startX = 0, dx = 0, maxX = 0;
    const getMax = () => {
      const track = slider.querySelector('.lock-slider-track');
      return Math.max(0, track.clientWidth - knob.clientWidth - 8);
    };
    const onDown = (e) => {
      if (!ready) return;
      e.stopPropagation();
      dragging = true;
      knob.classList.add('dragging');
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      maxX = getMax();
      window.addEventListener('pointermove', onMove, { passive:false });
      window.addEventListener('pointerup', onUp, { passive:true });
      window.addEventListener('pointercancel', onUp, { passive:true });
    };
    const onMove = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      dx = Math.min(maxX, Math.max(0, x - startX));
      knob.style.transform = `translateX(${dx}px)`;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      knob.classList.remove('dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (dx >= maxX * 0.85) {
        knob.style.transform = `translateX(${maxX}px)`;
        setTimeout(() => { unlock(); knob.style.transform = ''; dx = 0; }, 120);
      } else {
        knob.style.transform = '';
        dx = 0;
      }
    };
    knob.addEventListener('pointerdown', onDown);
    slider.addEventListener('click', (e) => e.stopPropagation());
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(markReady, 350);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(markReady, 300));
  }
  // Failsafe: don't let slow/blocked third-party images, fonts, or video
  // leave the lock screen stuck on "Preparing desktop…" forever.
  window.addEventListener('load', () => setTimeout(markReady, 100));
  setTimeout(markReady, 3000);
  window.__relockDesktop = relock;
  document.addEventListener('DOMContentLoaded', () => {
    const lockBtn = document.querySelector('#menubar .brand-menu .brand-lock');
    if (lockBtn) {
      lockBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); relock(); });
    }
  });
  const lockBtn = document.querySelector('#menubar .brand-menu .brand-lock');
  if (lockBtn) {
    lockBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); relock(); });
  }
})();
(function initAboutModal(){
  const modal = document.getElementById('aboutModal');
  if (!modal) return;
  const open = () => { modal.style.display = 'flex'; window.desktopSfx?.open(); };
  const close = () => { modal.style.display = 'none'; };
  document.getElementById('aboutClose').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  const more = document.getElementById('aboutMore');
  const moreBody = document.getElementById('aboutMoreBody');
  more.addEventListener('click', () => {
    const shown = moreBody.style.display !== 'none';
    moreBody.style.display = shown ? 'none' : 'block';
    more.textContent = shown ? 'More Info…' : 'Less Info';
  });
  window.__openAbout = open;
})();
(function(){
"use strict";

const drawpadModal = document.getElementById('drawpadModal');
if (!drawpadModal) return;

/* ============================================================
   CONSTANTS / STATE
   ============================================================ */
const TOOLS = [
  {id:'brush',    name:'Brush',        key:'B', group:1, icon:'M4 20L14 10M14 10L20 4L21 5.5C21.5 6 21.5 6.8 21 7.3L15.5 12.5M14 10L18.5 14.5,M4 20L6.5 19.5L7 17L4 20Z'},
  {id:'pencil',   name:'Pencil',       key:'N', group:1, icon:'PENCIL'},
  {id:'eraser',   name:'Eraser',       key:'E', group:1, icon:'ERASER'},
  {id:'spray',    name:'Spray',        key:'Y', group:1, icon:'SPRAY'},
  {id:'smudge',   name:'Smudge',       key:'M', group:1, icon:'SMUDGE'},
  {id:'fill',     name:'Fill Bucket',  key:'G', group:2, icon:'BUCKET'},
  {id:'gradient', name:'Gradient',     key:'D', group:2, icon:'GRADIENT'},
  {id:'eyedrop',  name:'Eyedropper',   key:'I', group:2, icon:'EYEDROP'},
  {id:'line',     name:'Line',         key:'L', group:3, icon:'LINE'},
  {id:'rect',     name:'Rectangle',    key:'R', group:3, icon:'RECT'},
  {id:'ellipse',  name:'Ellipse',      key:'O', group:3, icon:'ELLIPSE'},
  {id:'polygon',  name:'Polygon',      key:'P', group:3, icon:'POLY'},
  {id:'star',     name:'Star',         key:'K', group:3, icon:'STAR'},
  {id:'text',     name:'Text',         key:'T', group:4, icon:'TEXT'},
  {id:'select',   name:'Selection',    key:'V', group:4, icon:'SELECT'},
  {id:'pan',      name:'Pan / Hand',   key:'H', group:4, icon:'PAN'},
];

const state = {
  tool:'brush',
  fg:'#1c1f1a', bg:'#ffffff',
  size:14, opacity:100, hardness:100,
  shapeMode:'stroke', // stroke | fill | both
  sides:5,
  tolerance:32,
  symmetry:false,
  grid:false, gridSize:20, snap:false,
  zoom:1,
  canvasW:1200, canvasH:800,
  activeLayer:0,
  layers:[], // {id,name,canvas,ctx,visible,opacity}
  layerIdSeq:1,
  history:[], // {layerIndex, before(ImageData)}
  future:[],
  drawing:false,
  panMode:false,
  lastPointerScreen:{x:0,y:0},
};

const MAX_HISTORY = 30;

/* ============================================================
   DOM refs
   ============================================================ */
const $ = (id)=>document.getElementById(id);
const toolRail = $('toolRail');
const layerStack = $('layerStack');
const canvasFrame = $('canvasFrame');
const canvasViewport = $('canvasViewport');
const canvasZone = $('canvasZone');
const interact = $('interactSurface');
const ictx = interact.getContext('2d', {willReadFrequently:true});
const overlay = $('overlayCanvas');
const octx = overlay.getContext('2d');
const gridOverlay = $('gridOverlay');
const brushCursor = $('brushCursor');
const toast = $('toast');

/* ============================================================
   ICONS (feather-style paths, some custom multi-path via commas)
   ============================================================ */
const ICONS = {
  PENCIL:'M12 20h9,M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z',
  ERASER:'M20 20H9L4.5 15.5a2 2 0 0 1 0-2.8l8-8a2 2 0 0 1 2.8 0l5.2 5.2a2 2 0 0 1 0 2.8L14 19',
  SPRAY:'M7 22V12M4 9a3 3 0 1 1 6 0c0 1.5-1.2 2-3 3-1.8-1-3-1.5-3-3Z,M14 4h1M18 4h1M16 2v1M16 7v1M12 12h.01M15 15h.01M17 18h.01,M12 22h6l1-8H11l1 8Z',
  SMUDGE:'M3 21c4-1 6-4 6-7 0-2-1-3-1-5a4 4 0 0 1 8 0c0 2-1 3-1 5 0 3 2 6 6 7',
  BUCKET:'M19 11l-7-7-8.5 8.5a2 2 0 0 0 0 2.8L9 21l10-10Z,M5 8l7 7,M17 15c0 1.7-1.3 3-3 3',
  GRADIENT:'M4 4h16v16H4z,M4 4l16 16',
  EYEDROP:'M13 21l-5-5,M15.5 3.5a2.1 2.1 0 1 1 3 3L9 16l-4 1 1-4Z,M5 17l2 2',
  LINE:'M5 19L19 5',
  RECT:'M4 5h16v14H4z',
  ELLIPSE:'M12 5a7 8 0 1 0 0 16 7 8 0 1 0 0-16Z' ,
  POLY:'M12 3l8 6-3 10H7L4 9Z',
  STAR:'M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7L6 21l1.6-7L2.2 9.3l7.1-.7Z',
  TEXT:'M5 5h14M12 5v14M9 19h6',
  SELECT:'M5 3l14 6-6 2-2 6-6-14Z',
  PAN:'M8 12V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v6M17 11.5V9a1.5 1.5 0 0 1 3 0v6c0 3.5-2.5 6-6 6h-2c-2 0-3-.6-4.3-2.1L4 13.8c-.5-.6-.4-1.5.2-2 .6-.5 1.5-.4 2 .2L8 14',
};
function iconSVG(spec){
  const paths = spec.split(',').map(d=>`<path d="${d}"/>`).join('');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

/* ============================================================
   BUILD TOOL RAIL
   ============================================================ */
let lastGroup = TOOLS[0].group;
TOOLS.forEach(t=>{
  if(t.group !== lastGroup){
    const div = document.createElement('div');
    div.className='dp-rail-div';
    toolRail.appendChild(div);
    lastGroup = t.group;
  }
  const btn = document.createElement('button');
  btn.className='dp-tool'; btn.dataset.tool = t.id;
  btn.innerHTML = iconSVG(ICONS[t.icon] || t.icon);
  const hint = document.createElement('span');
  hint.className='dp-hint';
  hint.innerHTML = `${t.name} <kbd>${t.key}</kbd>`;
  btn.appendChild(hint);
  btn.addEventListener('click', ()=>selectTool(t.id));
  toolRail.appendChild(btn);
});

/* ============================================================
   SELECTION MARQUEE STATE (declared early â referenced by selectTool)
   ============================================================ */
let selRect = null; // {x,y,w,h}

function selectTool(id){
  state.tool = id;
  document.querySelectorAll('.dp-tool').forEach(b=>b.classList.toggle('dp-active', b.dataset.tool===id));
  const meta = TOOLS.find(t=>t.id===id);
  $('toolNameReadout').textContent = meta.name;
  $('statusTool').textContent = meta.name;
  // contextual panel bits
  $('sidesRow').style.display = (id==='polygon'||id==='star') ? '' : 'none';
  $('fillToleranceRow').style.display = (id==='fill') ? '' : 'none';
  $('shapeFillSeg').style.display = ['rect','ellipse','polygon','star'].includes(id) ? '' : 'none';
  updateCursor();
  clearSelectionMarquee();
}
selectTool('brush');

/* ============================================================
   CANVAS / LAYER SETUP
   ============================================================ */
function makeLayer(name){
  const c = document.createElement('canvas');
  c.width = state.canvasW; c.height = state.canvasH;
  c.className='dp-layer-canvas';
  const ctx = c.getContext('2d', {willReadFrequently:true});
  return {id: state.layerIdSeq++, name, canvas:c, ctx, visible:true, opacity:100};
}

function initCanvas(w,h, keepLayers){
  state.canvasW = w; state.canvasH = h;
  [interact, overlay].forEach(c=>{ c.width=w; c.height=h; });
  canvasFrame.style.width = w+'px';
  canvasFrame.style.height = h+'px';
  gridOverlay.style.width = w+'px';
  gridOverlay.style.height = h+'px';
  $('statusSize').textContent = `${w} × ${h}`;

  if(!keepLayers){
    state.layers = [];
    layerStack.innerHTML = '';
    const bgLayer = makeLayer('Background');
    bgLayer.ctx.fillStyle = '#ffffff';
    bgLayer.ctx.fillRect(0,0,w,h);
    state.layers.push(bgLayer);
    layerStack.appendChild(bgLayer.canvas);
    state.activeLayer = 0;
    state.history = []; state.future = [];
  } else {
    state.layers.forEach(l=>{ l.canvas.width=w; l.canvas.height=h; });
  }
  updateGridBg();
  renderLayerList();
  fitZoom();
}
initCanvas(1200,800,false);

function activeLayer(){ return state.layers[state.activeLayer]; }

/* ============================================================
   LAYER PANEL
   ============================================================ */
function renderLayerList(){
  const list = $('layerList');
  list.innerHTML = '';
  for(let i=state.layers.length-1; i>=0; i--){
    const l = state.layers[i];
    const row = document.createElement('div');
    row.className = 'dp-layer-row' + (i===state.activeLayer?' dp-active':'');
    const thumb = document.createElement('div');
    thumb.className='dp-lthumb';
    const img = document.createElement('img');
    img.src = l.canvas.toDataURL();
    thumb.appendChild(img);
    const nameInput = document.createElement('input');
    nameInput.className='dp-lname'; nameInput.value=l.name;
    nameInput.addEventListener('change',()=>{ l.name = nameInput.value; });
    nameInput.addEventListener('click',e=>e.stopPropagation());
    const vis = document.createElement('div');
    vis.className='dp-lvis';
    vis.innerHTML = l.visible
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.6 20.6 0 0 1 4.2-5.4M9.9 4.24A9.4 9.4 0 0 1 12 4c7 0 11 8 11 8a20.6 20.6 0 0 1-2.5 3.6M14.1 14.1a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>';
    vis.addEventListener('click', e=>{
      e.stopPropagation();
      l.visible = !l.visible;
      l.canvas.style.display = l.visible ? '' : 'none';
      renderLayerList();
    });
    row.appendChild(thumb); row.appendChild(nameInput); row.appendChild(vis);
    row.addEventListener('click', ()=>{
      state.activeLayer = i;
      renderLayerList();
      $('layerOpacitySlider').value = l.opacity;
      $('layerOpacityVal').textContent = l.opacity+'%';
    });
    list.appendChild(row);
  }
  $('layerCountReadout').textContent = state.layers.length;
}

$('btnAddLayer').addEventListener('click', ()=>{
  const l = makeLayer('Layer '+state.layerIdSeq);
  state.layers.push(l);
  layerStack.appendChild(l.canvas);
  state.activeLayer = state.layers.length-1;
  renderLayerList();
  showToast('Layer added');
});
$('btnDupLayer').addEventListener('click', ()=>{
  const src = activeLayer();
  const l = makeLayer(src.name+' copy');
  l.ctx.drawImage(src.canvas,0,0);
  l.opacity = src.opacity; l.canvas.style.opacity = l.opacity/100;
  state.layers.splice(state.activeLayer+1,0,l);
  layerStack.appendChild(l.canvas);
  state.activeLayer++;
  renderLayerList();
  showToast('Layer duplicated');
});
$('btnDelLayer').addEventListener('click', ()=>{
  if(state.layers.length<=1){ showToast("Can't delete the only layer"); return; }
  const l = state.layers[state.activeLayer];
  l.canvas.remove();
  state.layers.splice(state.activeLayer,1);
  state.activeLayer = Math.max(0, state.activeLayer-1);
  renderLayerList();
  showToast('Layer deleted');
});
$('btnMergeLayer').addEventListener('click', ()=>{
  if(state.activeLayer===0){ showToast('No layer below to merge into'); return; }
  const top = state.layers[state.activeLayer];
  const below = state.layers[state.activeLayer-1];
  below.ctx.globalAlpha = top.opacity/100;
  below.ctx.drawImage(top.canvas,0,0);
  below.ctx.globalAlpha = 1;
  top.canvas.remove();
  state.layers.splice(state.activeLayer,1);
  state.activeLayer--;
  renderLayerList();
  showToast('Layer merged down');
});
$('layerOpacitySlider').addEventListener('input', e=>{
  const v = +e.target.value;
  const l = activeLayer();
  l.opacity = v;
  l.canvas.style.opacity = v/100;
  $('layerOpacityVal').textContent = v+'%';
});
$('btnClearLayer').addEventListener('click', ()=>{
  pushHistory();
  const l = activeLayer();
  l.ctx.clearRect(0,0,state.canvasW,state.canvasH);
  renderLayerList();
});

/* ============================================================
   COLOR
   ============================================================ */
const PALETTE = ['#1c1f1a','#ffffff','#b1512f','#c79a4b','#5c7350','#34506b','#7a3b5e','#e3bd7c','#2a2e24','#f4efe1','#8a3324','#3f6b52'];
function buildSwatches(){
  const row = $('swatchRow');
  row.innerHTML='';
  PALETTE.forEach(hex=>{
    const s = document.createElement('div');
    s.className='dp-swatch'; s.style.background=hex;
    s.addEventListener('click', ()=>setFg(hex));
    row.appendChild(s);
  });
  const add = document.createElement('div');
  add.className='dp-swatch dp-add'; add.textContent='+';
  add.title='Add current color to palette';
  add.addEventListener('click', ()=>{
    if(!PALETTE.includes(state.fg)){ PALETTE.push(state.fg); buildSwatches(); }
  });
  row.appendChild(add);
}
buildSwatches();

function setFg(hex){
  state.fg = hex;
  $('fgSwatch').style.background = hex;
  $('fgPicker').value = hex;
  $('hexReadout').textContent = hex.toUpperCase();
}
function setBg(hex){
  state.bg = hex;
  $('bgSwatch').style.background = hex;
  $('bgPicker').value = hex;
}
$('fgPicker').addEventListener('input', e=>setFg(e.target.value));
$('bgPicker').addEventListener('input', e=>setBg(e.target.value));
$('fgSwatch').addEventListener('click', ()=>$('fgPicker').click());
$('bgSwatch').addEventListener('click', ()=>$('bgPicker').click());
$('btnSwapColor').addEventListener('click', ()=>{
  const f = state.fg, b = state.bg;
  setFg(b); setBg(f);
});

/* ============================================================
   SLIDERS / SEGMENTS
   ============================================================ */
$('sizeSlider').addEventListener('input', e=>{ state.size=+e.target.value; $('sizeVal').textContent=state.size+'px'; updateCursor(); });
$('opacitySlider').addEventListener('input', e=>{ state.opacity=+e.target.value; $('opacityVal').textContent=state.opacity+'%'; });
$('hardnessSlider').addEventListener('input', e=>{ state.hardness=+e.target.value; $('hardnessVal').textContent=state.hardness+'%'; });
$('sidesSlider').addEventListener('input', e=>{ state.sides=+e.target.value; $('sidesVal').textContent=state.sides; });
$('toleranceSlider').addEventListener('input', e=>{ state.tolerance=+e.target.value; $('toleranceVal').textContent=state.tolerance; });
$('gridSizeSlider').addEventListener('input', e=>{ state.gridSize=+e.target.value; $('gridSizeVal').textContent=state.gridSize+'px'; updateGridBg(); });

document.querySelectorAll('#shapeFillSeg button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('#shapeFillSeg button').forEach(x=>x.classList.remove('dp-on'));
    b.classList.add('dp-on'); state.shapeMode = b.dataset.v;
  });
});

function toggleEl(el, on, cb){
  el.classList.toggle('dp-on', on);
  cb(on);
}
$('toggleGrid').addEventListener('click', function(){
  state.grid = !state.grid; this.classList.toggle('dp-on', state.grid);
  gridOverlay.classList.toggle('dp-show', state.grid);
});
$('toggleSym').addEventListener('click', function(){
  state.symmetry = !state.symmetry; this.classList.toggle('dp-on', state.symmetry);
});
$('toggleSnap').addEventListener('click', function(){
  state.snap = !state.snap; this.classList.toggle('dp-on', state.snap);
});
function updateGridBg(){
  gridOverlay.style.backgroundSize = `${state.gridSize}px ${state.gridSize}px`;
}

/* ============================================================
   ZOOM / PAN
   ============================================================ */
function applyZoom(){
  canvasViewport.style.transform = `scale(${state.zoom})`;
  $('zoomReadout').textContent = Math.round(state.zoom*100)+'%';
  $('statusZoom').textContent = Math.round(state.zoom*100)+'%';
}
function fitZoom(){
  const availW = canvasZone.clientWidth - 80;
  const availH = canvasZone.clientHeight - 80;
  const z = Math.min(1, availW/state.canvasW, availH/state.canvasH);
  state.zoom = Math.max(0.05, z);
  applyZoom();
}
$('btnZoomIn').addEventListener('click', ()=>{ state.zoom=Math.min(8,state.zoom*1.2); applyZoom(); });
$('btnZoomOut').addEventListener('click', ()=>{ state.zoom=Math.max(0.05,state.zoom/1.2); applyZoom(); });
$('btnZoomReset').addEventListener('click', fitZoom);
canvasZone.addEventListener('wheel', e=>{
  if(e.ctrlKey || e.metaKey){
    e.preventDefault();
    const delta = e.deltaY>0 ? 0.9 : 1.1;
    state.zoom = Math.min(8, Math.max(0.05, state.zoom*delta));
    applyZoom();
  }
}, {passive:false});

let spaceHeld = false;
window.addEventListener('keydown', e=>{
  if(drawpadModal.style.display === 'none') return;
  if(e.code==='Space' && !spaceHeld){
    spaceHeld = true; canvasZone.classList.add('dp-panning');
    e.preventDefault();
  }
});
window.addEventListener('keyup', e=>{
  if(drawpadModal.style.display === 'none') return;
  if(e.code==='Space'){ spaceHeld=false; canvasZone.classList.remove('dp-panning'); }
});

/* ============================================================
   POINTER COORDINATE HELPERS
   ============================================================ */
function getPos(e){
  const rect = interact.getBoundingClientRect();
  let x = (e.clientX - rect.left) * (interact.width/rect.width);
  let y = (e.clientY - rect.top) * (interact.height/rect.height);
  if(state.snap){
    x = Math.round(x/state.gridSize)*state.gridSize;
    y = Math.round(y/state.gridSize)*state.gridSize;
  }
  return {x,y};
}

/* ============================================================
   HISTORY (UNDO / REDO)
   ============================================================ */
function pushHistory(){
  const l = activeLayer();
  const snap = l.ctx.getImageData(0,0,state.canvasW,state.canvasH);
  state.history.push({layerIndex: state.activeLayer, data: snap});
  if(state.history.length>MAX_HISTORY) state.history.shift();
  state.future = [];
  updateUndoButtons();
}
function undo(){
  if(!state.history.length) return;
  const h = state.history.pop();
  const l = state.layers[h.layerIndex];
  if(!l) return;
  const redoSnap = l.ctx.getImageData(0,0,state.canvasW,state.canvasH);
  state.future.push({layerIndex:h.layerIndex, data:redoSnap});
  l.ctx.putImageData(h.data,0,0);
  renderLayerList();
  updateUndoButtons();
}
function redo(){
  if(!state.future.length) return;
  const h = state.future.pop();
  const l = state.layers[h.layerIndex];
  if(!l) return;
  const undoSnap = l.ctx.getImageData(0,0,state.canvasW,state.canvasH);
  state.history.push({layerIndex:h.layerIndex, data:undoSnap});
  l.ctx.putImageData(h.data,0,0);
  renderLayerList();
  updateUndoButtons();
}
function updateUndoButtons(){
  $('btnUndo').disabled = state.history.length===0;
  $('btnRedo').disabled = state.future.length===0;
}
$('btnUndo').addEventListener('click', undo);
$('btnRedo').addEventListener('click', redo);

/* ============================================================
   COLOR UTILS
   ============================================================ */
function hexToRgb(hex){
  const m = hex.replace('#','');
  return {r:parseInt(m.substr(0,2),16), g:parseInt(m.substr(2,2),16), b:parseInt(m.substr(4,2),16)};
}
function rgbToHex(r,g,b){
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}

/* ============================================================
   SYMMETRY HELPER — returns list of mirrored points for a given point
   ============================================================ */
function symmetryPoints(x,y){
  const pts = [{x,y}];
  if(state.symmetry){
    const cx = state.canvasW/2, cy = state.canvasH/2;
    pts.push({x: cx*2-x, y});
    pts.push({x, y: cy*2-y});
    pts.push({x: cx*2-x, y: cy*2-y});
  }
  return pts;
}

/* ============================================================
   BRUSH STAMP (soft/hard edge, opacity-correct per stroke)
   ============================================================ */
let strokeLayerCanvas=null, strokeLayerCtx=null; // offscreen buffer for a single stroke, composited once at end for correct opacity

function beginStrokeBuffer(){
  strokeLayerCanvas = document.createElement('canvas');
  strokeLayerCanvas.width = state.canvasW; strokeLayerCanvas.height = state.canvasH;
  strokeLayerCtx = strokeLayerCanvas.getContext('2d');
}
function stampBrush(ctx,x,y,size,color,hardness){
  const r = size/2;
  if(hardness>=99){
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  } else {
    const grad = ctx.createRadialGradient(x,y,Math.max(0,r*(hardness/100)),x,y,r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, colorAlpha(color,0));
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
}
function colorAlpha(hex,a){
  const {r,g,b} = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

let lastX=0,lastY=0, sprayTimer=null;

/* ============================================================
   FLOOD FILL
   ============================================================ */
function floodFill(ctx, startX, startY, fillHex, tolerance){
  startX = Math.floor(startX); startY = Math.floor(startY);
  const w = state.canvasW, h = state.canvasH;
  if(startX<0||startY<0||startX>=w||startY>=h) return;
  const imgData = ctx.getImageData(0,0,w,h);
  const data = imgData.data;
  const idx = (startY*w+startX)*4;
  const target = [data[idx],data[idx+1],data[idx+2],data[idx+3]];
  const fill = hexToRgb(fillHex);
  const fillA = 255;
  if(Math.abs(target[0]-fill.r)<=tolerance*0.1 && Math.abs(target[1]-fill.g)<=tolerance*0.1 &&
     Math.abs(target[2]-fill.b)<=tolerance*0.1 && target[3]===fillA && tolerance<3) return;

  const tol = tolerance;
  function matches(i){
    return Math.abs(data[i]-target[0])<=tol && Math.abs(data[i+1]-target[1])<=tol &&
           Math.abs(data[i+2]-target[2])<=tol && Math.abs(data[i+3]-target[3])<=tol;
  }
  const stack = [[startX,startY]];
  const visited = new Uint8Array(w*h);
  while(stack.length){
    const [x,y] = stack.pop();
    if(x<0||y<0||x>=w||y>=h) continue;
    const p = y*w+x;
    if(visited[p]) continue;
    const i = p*4;
    if(!matches(i)) continue;
    visited[p]=1;
    data[i]=fill.r; data[i+1]=fill.g; data[i+2]=fill.b; data[i+3]=255;
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
  }
  ctx.putImageData(imgData,0,0);
}

/* ============================================================
   SHAPE DRAWING (final commit)
   ============================================================ */
function drawShapePath(ctx, tool, x0,y0,x1,y1, sides){
  ctx.beginPath();
  if(tool==='rect'){
    ctx.rect(Math.min(x0,x1), Math.min(y0,y1), Math.abs(x1-x0), Math.abs(y1-y0));
  } else if(tool==='ellipse'){
    const cx=(x0+x1)/2, cy=(y0+y1)/2, rx=Math.abs(x1-x0)/2, ry=Math.abs(y1-y0)/2;
    ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
  } else if(tool==='line'){
    ctx.moveTo(x0,y0); ctx.lineTo(x1,y1);
  } else if(tool==='polygon'){
    const cx=(x0+x1)/2, cy=(y0+y1)/2, rx=Math.abs(x1-x0)/2, ry=Math.abs(y1-y0)/2;
    for(let i=0;i<sides;i++){
      const a = -Math.PI/2 + i*2*Math.PI/sides;
      const px = cx+rx*Math.cos(a), py = cy+ry*Math.sin(a);
      i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.closePath();
  } else if(tool==='star'){
    const cx=(x0+x1)/2, cy=(y0+y1)/2, rx=Math.abs(x1-x0)/2, ry=Math.abs(y1-y0)/2;
    const n = sides;
    for(let i=0;i<n*2;i++){
      const a = -Math.PI/2 + i*Math.PI/n;
      const rad = i%2===0?1:0.45;
      const px = cx+rx*rad*Math.cos(a), py = cy+ry*rad*Math.sin(a);
      i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.closePath();
  }
}

/* ============================================================
   SELECTION MARQUEE
   ============================================================ */
function clearSelectionMarquee(){ selRect=null; octx.clearRect(0,0,overlay.width,overlay.height); }

/* ============================================================
   MAIN POINTER INTERACTION
   ============================================================ */
let dragStart=null, movingSelection=false, selMoveOffset=null, selBuffer=null, selOriginRect=null;

interact.addEventListener('pointerdown', e=>{
  if(e.button !== undefined && e.button !== 0) return;
  if(spaceHeld){ startPan(e); return; }
  interact.setPointerCapture(e.pointerId);
  const {x,y} = getPos(e);
  dragStart = {x,y};
  state.drawing = true;

  const l = activeLayer();
  if(!l.visible){ showToast('Active layer is hidden'); }

  switch(state.tool){
    case 'brush': case 'pencil': {
      pushHistory();
      beginStrokeBuffer();
      lastX=x; lastY=y;
      paintDab(x,y);
      refreshStrokePreview();
      break;
    }
    case 'eraser': {
      pushHistory();
      lastX=x; lastY=y;
      eraseDab(x,y);
      break;
    }
    case 'spray': {
      pushHistory();
      sprayAt(x,y);
      sprayTimer = setInterval(()=>sprayAt(lastX,lastY), 45);
      lastX=x; lastY=y;
      break;
    }
    case 'smudge': {
      pushHistory();
      lastX=x; lastY=y;
      break;
    }
    case 'fill': {
      pushHistory();
      floodFill(l.ctx, x, y, state.fg, state.tolerance);
      renderLayerList();
      state.drawing=false;
      break;
    }
    case 'eyedrop': {
      const hex = sampleCompositeColor(x,y);
      if(hex) setFg(hex);
      state.drawing=false;
      break;
    }
    case 'gradient': {
      // handled on up via dragStart -> current
      break;
    }
    case 'line': case 'rect': case 'ellipse': case 'polygon': case 'star': {
      // preview only, commit on up
      break;
    }
    case 'text': {
      state.drawing=false;
      spawnTextEditor(x,y);
      break;
    }
    case 'select': {
      clearSelectionMarquee();
      break;
    }
    case 'pan': startPan(e); break;
  }
});

interact.addEventListener('pointermove', e=>{
  const {x,y} = getPos(e);
  $('statusPos').textContent = `${Math.round(x)}, ${Math.round(y)}`;
  updateCursorPos(e);

  if(!state.drawing) return;
  const l = activeLayer();

  switch(state.tool){
    case 'brush': case 'pencil': {
      paintLine(lastX,lastY,x,y);
      lastX=x; lastY=y;
      refreshStrokePreview();
      break;
    }
    case 'eraser': {
      eraseLine(lastX,lastY,x,y);
      lastX=x; lastY=y;
      break;
    }
    case 'spray': { lastX=x; lastY=y; break; }
    case 'smudge': {
      smudgeAt(lastX,lastY,x,y);
      lastX=x; lastY=y;
      break;
    }
    case 'line': case 'rect': case 'ellipse': case 'polygon': case 'star': {
      octx.clearRect(0,0,overlay.width,overlay.height);
      let ex=x, ey=y;
      if(e.shiftKey){
        if(state.tool==='line'){
          const ang = Math.round(Math.atan2(y-dragStart.y,x-dragStart.x)/(Math.PI/12))*(Math.PI/12);
          const dist = Math.hypot(x-dragStart.x,y-dragStart.y);
          ex = dragStart.x+Math.cos(ang)*dist; ey = dragStart.y+Math.sin(ang)*dist;
        } else {
          const d = Math.max(Math.abs(x-dragStart.x), Math.abs(y-dragStart.y));
          ex = dragStart.x + d*Math.sign(x-dragStart.x||1);
          ey = dragStart.y + d*Math.sign(y-dragStart.y||1);
        }
      }
      octx.save();
      octx.strokeStyle = state.fg; octx.fillStyle = state.fg;
      octx.lineWidth = state.size; octx.globalAlpha = state.opacity/100;
      octx.setLineDash([6,4]);
      drawShapePath(octx, state.tool, dragStart.x, dragStart.y, ex, ey, state.sides);
      if(state.shapeMode!=='stroke') { octx.globalAlpha = state.opacity/100*0.5; octx.fill(); octx.globalAlpha = state.opacity/100; }
      octx.stroke();
      octx.restore();
      break;
    }
    case 'gradient': {
      octx.clearRect(0,0,overlay.width,overlay.height);
      octx.save();
      octx.strokeStyle='rgba(0,0,0,.5)'; octx.lineWidth=1.5; octx.setLineDash([4,4]);
      octx.beginPath(); octx.moveTo(dragStart.x,dragStart.y); octx.lineTo(x,y); octx.stroke();
      octx.restore();
      break;
    }
    case 'select': {
      octx.clearRect(0,0,overlay.width,overlay.height);
      const rx=Math.min(dragStart.x,x), ry=Math.min(dragStart.y,y), rw=Math.abs(x-dragStart.x), rh=Math.abs(y-dragStart.y);
      octx.save();
      octx.strokeStyle='#3ec9c0'; octx.lineWidth=1.5/state.zoom; octx.setLineDash([6,4]);
      octx.fillStyle='rgba(62,201,192,0.12)';
      octx.fillRect(rx,ry,rw,rh); octx.strokeRect(rx,ry,rw,rh);
      octx.restore();
      selRect = {x:rx,y:ry,w:rw,h:rh};
      break;
    }
  }
});

function endStroke(e){
  if(!state.drawing) return;
  state.drawing = false;
  const l = activeLayer();

  switch(state.tool){
    case 'brush': case 'pencil': {
      if(strokeLayerCtx){
        l.ctx.save();
        l.ctx.globalAlpha = state.opacity/100;
        l.ctx.drawImage(strokeLayerCanvas,0,0);
        l.ctx.restore();
        strokeLayerCanvas=null; strokeLayerCtx=null;
      }
      octx.clearRect(0,0,overlay.width,overlay.height);
      renderLayerList();
      break;
    }
    case 'eraser': {
      renderLayerList();
      break;
    }
    case 'spray': { clearInterval(sprayTimer); sprayTimer=null; renderLayerList(); break; }
    case 'smudge': { renderLayerList(); break; }
    case 'line': case 'rect': case 'ellipse': case 'polygon': case 'star': {
      if(dragStart){
        const {x,y} = getPos(e);
        pushHistory();
        octx.clearRect(0,0,overlay.width,overlay.height);
        commitShape(l, dragStart.x, dragStart.y, x, y, e.shiftKey);
      }
      renderLayerList();
      break;
    }
    case 'gradient': {
      if(dragStart){
        const {x,y} = getPos(e);
        pushHistory();
        octx.clearRect(0,0,overlay.width,overlay.height);
        const grad = l.ctx.createLinearGradient(dragStart.x,dragStart.y,x,y);
        grad.addColorStop(0,state.fg); grad.addColorStop(1,state.bg);
        l.ctx.save();
        l.ctx.globalAlpha = state.opacity/100;
        l.ctx.fillStyle = grad;
        if(selRect && selRect.w>2 && selRect.h>2){
          l.ctx.fillRect(selRect.x,selRect.y,selRect.w,selRect.h);
        } else {
          l.ctx.fillRect(0,0,state.canvasW,state.canvasH);
        }
        l.ctx.restore();
      }
      renderLayerList();
      break;
    }
    case 'select': break;
  }
  dragStart = null;
}
interact.addEventListener('pointerup', endStroke);
interact.addEventListener('pointerleave', e=>{ if(state.tool!=='select') { /* keep drawing until up for touch */ } });
window.addEventListener('pointerup', e=>{ if(state.drawing) endStroke(e); });

function commitShape(l, x0,y0,x1,y1, shiftKey){
  let ex=x1, ey=y1;
  if(shiftKey){
    if(state.tool==='line'){
      const ang = Math.round(Math.atan2(y1-y0,x1-x0)/(Math.PI/12))*(Math.PI/12);
      const dist = Math.hypot(x1-x0,y1-y0);
      ex = x0+Math.cos(ang)*dist; ey = y0+Math.sin(ang)*dist;
    } else {
      const d = Math.max(Math.abs(x1-x0), Math.abs(y1-y0));
      ex = x0 + d*Math.sign(x1-x0||1);
      ey = y0 + d*Math.sign(y1-y0||1);
    }
  }
  l.ctx.save();
  l.ctx.globalAlpha = state.opacity/100;
  l.ctx.strokeStyle = state.fg; l.ctx.fillStyle = state.fg;
  l.ctx.lineWidth = state.size; l.ctx.lineJoin='round'; l.ctx.lineCap='round';
  const variants = state.symmetry ? mirrorShapeVariants(x0,y0,ex,ey) : [[x0,y0,ex,ey]];
  variants.forEach(([a,b,c,d])=>{
    drawShapePath(l.ctx, state.tool, a,b,c,d, state.sides);
    if(state.shapeMode==='fill' || state.shapeMode==='both') l.ctx.fill();
    if(state.shapeMode==='stroke' || state.shapeMode==='both') l.ctx.stroke();
  });
  l.ctx.restore();
}
function mirrorShapeVariants(x0,y0,x1,y1){
  const cx=state.canvasW/2, cy=state.canvasH/2;
  return [
    [x0,y0,x1,y1],
    [cx*2-x0,y0,cx*2-x1,y1],
    [x0,cy*2-y0,x1,cy*2-y1],
    [cx*2-x0,cy*2-y0,cx*2-x1,cy*2-y1],
  ];
}

/* ============================================================
   BRUSH PAINTING HELPERS
   ============================================================ */
function paintDab(x,y){
  const ctx = strokeLayerCtx;
  const size = state.tool==='pencil' ? Math.max(1,state.size*0.4) : state.size;
  const hardness = state.tool==='pencil' ? 100 : state.hardness;
  symmetryPoints(x,y).forEach(p=>{
    stampBrush(ctx, p.x, p.y, size, state.fg, hardness);
  });
}
function paintLine(x0,y0,x1,y1){
  const dist = Math.hypot(x1-x0,y1-y0);
  const step = Math.max(1, (state.tool==='pencil'?state.size*0.4:state.size)/4);
  const n = Math.max(1, Math.floor(dist/step));
  for(let i=0;i<=n;i++){
    const t=i/n;
    paintDab(x0+(x1-x0)*t, y0+(y1-y0)*t);
  }
}
function refreshStrokePreview(){
  if(!strokeLayerCtx) return;
  octx.clearRect(0,0,overlay.width,overlay.height);
  octx.save();
  octx.globalAlpha = state.opacity/100;
  octx.drawImage(strokeLayerCanvas,0,0);
  octx.restore();
}
function eraseDab(x,y){
  const l = activeLayer();
  l.ctx.save();
  l.ctx.globalCompositeOperation = 'destination-out';
  l.ctx.globalAlpha = state.opacity/100;
  symmetryPoints(x,y).forEach(p=>{
    stampBrush(l.ctx, p.x, p.y, state.size, '#000000', state.hardness);
  });
  l.ctx.restore();
}
function eraseLine(x0,y0,x1,y1){
  const dist = Math.hypot(x1-x0,y1-y0);
  const step = Math.max(1, state.size/4);
  const n = Math.max(1, Math.floor(dist/step));
  for(let i=0;i<=n;i++){
    const t=i/n;
    eraseDab(x0+(x1-x0)*t, y0+(y1-y0)*t);
  }
}
function sprayAt(x,y){
  const l = activeLayer();
  const density = 18;
  const r = state.size;
  l.ctx.save();
  l.ctx.globalAlpha = state.opacity/100 * 0.7;
  symmetryPoints(x,y).forEach(p=>{
    for(let i=0;i<density;i++){
      const ang = Math.random()*Math.PI*2;
      const rad = Math.random()*r;
      const px = p.x+Math.cos(ang)*rad, py = p.y+Math.sin(ang)*rad;
      l.ctx.fillStyle = state.fg;
      l.ctx.fillRect(px,py,1.4,1.4);
    }
  });
  l.ctx.restore();
}
function smudgeAt(x0,y0,x1,y1){
  const l = activeLayer();
  const r = Math.max(4,state.size/2);
  try{
    const src = l.ctx.getImageData(Math.max(0,x0-r), Math.max(0,y0-r), r*2, r*2);
    l.ctx.save();
    l.ctx.globalAlpha = state.opacity/100*0.6;
    l.ctx.putImageData(src, Math.max(0,x1-r), Math.max(0,y1-r));
    l.ctx.restore();
  }catch(err){ /* out of bounds, ignore */ }
}
function sampleCompositeColor(x,y){
  const tmp = document.createElement('canvas');
  tmp.width=state.canvasW; tmp.height=state.canvasH;
  const tctx = tmp.getContext('2d');
  state.layers.forEach(l=>{
    if(!l.visible) return;
    tctx.globalAlpha = l.opacity/100;
    tctx.drawImage(l.canvas,0,0);
  });
  const data = tctx.getImageData(Math.max(0,Math.floor(x)), Math.max(0,Math.floor(y)),1,1).data;
  if(data[3]===0) return null;
  return rgbToHex(data[0],data[1],data[2]);
}

/* ============================================================
   TEXT TOOL
   ============================================================ */
function spawnTextEditor(x,y){
  const rect = interact.getBoundingClientRect();
  const scale = rect.width/interact.width;
  const ed = document.createElement('textarea');
  ed.className='dp-textedit';
  ed.style.left = (x*scale)+'px';
  ed.style.top = (y*scale)+'px';
  ed.style.fontSize = (state.size*scale)+'px';
  ed.style.color = state.fg;
  canvasFrame.appendChild(ed);
  ed.focus();
  function commit(){
    if(ed.value.trim()){
      pushHistory();
      const l = activeLayer();
      l.ctx.save();
      l.ctx.fillStyle = state.fg;
      l.ctx.globalAlpha = state.opacity/100;
      l.ctx.font = `${state.size}px ${getComputedStyle(document.body).fontFamily}`;
      l.ctx.textBaseline = 'top';
      ed.value.split('\n').forEach((line,i)=>{
        l.ctx.fillText(line, x, y + i*state.size*1.2);
      });
      l.ctx.restore();
      renderLayerList();
    }
    ed.remove();
  }
  ed.addEventListener('blur', commit);
  ed.addEventListener('keydown', e=>{
    if(e.key==='Escape'){ ed.remove(); }
    if(e.key==='Enter' && (e.ctrlKey||e.metaKey)){ commit(); }
  });
}

/* ============================================================
   PANNING (space+drag or hand tool)
   ============================================================ */
function startPan(e){
  const startX=e.clientX, startY=e.clientY;
  const scroll0x = canvasZone.scrollLeft, scroll0y = canvasZone.scrollTop;
  canvasZone.classList.add('dp-panning');
  function move(ev){
    canvasZone.scrollLeft = scroll0x - (ev.clientX-startX);
    canvasZone.scrollTop = scroll0y - (ev.clientY-startY);
  }
  function up(){
    window.removeEventListener('pointermove',move);
    window.removeEventListener('pointerup',up);
    if(!spaceHeld) canvasZone.classList.remove('dp-panning');
  }
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',up);
}

/* ============================================================
   BRUSH CURSOR PREVIEW
   ============================================================ */
function updateCursor(){
  const showCursor = ['brush','pencil','eraser','spray','smudge'].includes(state.tool);
  brushCursor.style.display = showCursor ? 'block' : 'none';
  const rect = interact.getBoundingClientRect();
  const scale = rect.width/interact.width;
  const sz = Math.max(4, state.size*scale);
  brushCursor.style.width = sz+'px';
  brushCursor.style.height = sz+'px';
  brushCursor.style.background = state.tool==='eraser' ? 'rgba(255,255,255,.35)' : 'transparent';
}
function updateCursorPos(e){
  brushCursor.style.left = e.clientX+'px';
  brushCursor.style.top = e.clientY+'px';
}
interact.addEventListener('pointerenter', ()=>{ if(['brush','pencil','eraser','spray','smudge'].includes(state.tool)) brushCursor.style.display='block'; });
interact.addEventListener('pointerleave', ()=>{ brushCursor.style.display='none'; });

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
window.addEventListener('keydown', e=>{
  if(drawpadModal.style.display === 'none') return;
  const tag = document.activeElement.tagName;
  if(tag==='INPUT' || tag==='TEXTAREA') return;
  if(e.ctrlKey || e.metaKey){
    if(e.key.toLowerCase()==='z'){ e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if(e.key.toLowerCase()==='y'){ e.preventDefault(); redo(); return; }
    if(e.key.toLowerCase()==='s'){ e.preventDefault(); saveProject(); return; }
    return;
  }
  const found = TOOLS.find(t=>t.key.toLowerCase()===e.key.toLowerCase());
  if(found){ selectTool(found.id); }
  if(e.key==='['){ state.size=Math.max(1,state.size-2); $('sizeSlider').value=state.size; $('sizeVal').textContent=state.size+'px'; updateCursor(); }
  if(e.key===']'){ state.size=Math.min(300,state.size+2); $('sizeSlider').value=state.size; $('sizeVal').textContent=state.size+'px'; updateCursor(); }
  if((e.key==='Delete'||e.key==='Backspace') && selRect){
    pushHistory();
    activeLayer().ctx.clearRect(selRect.x,selRect.y,selRect.w,selRect.h);
    renderLayerList();
  }
});

/* ============================================================
   EXPORT / SAVE / OPEN / NEW
   ============================================================ */
function compositeAll(){
  const tmp = document.createElement('canvas');
  tmp.width=state.canvasW; tmp.height=state.canvasH;
  const tctx = tmp.getContext('2d');
  state.layers.forEach(l=>{
    if(!l.visible) return;
    tctx.globalAlpha = l.opacity/100;
    tctx.drawImage(l.canvas,0,0);
  });
  return tmp;
}
$('btnExport').addEventListener('click', ()=>{
  const tmp = compositeAll();
  const a = document.createElement('a');
  a.download = 'drawing.png';
  a.href = tmp.toDataURL('image/png');
  a.click();
  showToast('Exported PNG');
});

function saveProject(){
  const payload = {
    w: state.canvasW, h: state.canvasH,
    layers: state.layers.map(l=>({name:l.name, visible:l.visible, opacity:l.opacity, data:l.canvas.toDataURL()})),
  };
  const blob = new Blob([JSON.stringify(payload)], {type:'application/json'});
  const a = document.createElement('a');
  a.download = 'drawing-project.json';
  a.href = URL.createObjectURL(blob);
  a.click();
  showToast('Project saved');
}
$('btnSaveProject').addEventListener('click', saveProject);

$('btnOpenProject').addEventListener('click', ()=>$('fileOpenInput').click());
$('fileOpenInput').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const payload = JSON.parse(reader.result);
      initCanvas(payload.w, payload.h, false);
      state.layers = [];
      layerStack.innerHTML='';
      let remaining = payload.layers.length;
      payload.layers.forEach((ld,idx)=>{
        const l = makeLayer(ld.name);
        l.visible = ld.visible; l.opacity = ld.opacity;
        l.canvas.style.opacity = l.opacity/100;
        l.canvas.style.display = l.visible ? '' : 'none';
        const img = new Image();
        img.onload = ()=>{ l.ctx.drawImage(img,0,0); remaining--; if(remaining===0){ renderLayerList(); } };
        img.src = ld.data;
        state.layers.push(l);
        layerStack.appendChild(l.canvas);
      });
      state.activeLayer = state.layers.length-1;
      showToast('Project loaded');
    }catch(err){ showToast('Could not open file'); }
  };
  reader.readAsText(file);
  e.target.value='';
});

$('btnNew').addEventListener('click', ()=>$('newModalBack').classList.add('dp-show'));
$('btnNewCancel').addEventListener('click', ()=>$('newModalBack').classList.remove('dp-show'));
document.querySelectorAll('.dp-modal .dp-presets button').forEach(b=>{
  b.addEventListener('click', ()=>{ $('newW').value=b.dataset.w; $('newH').value=b.dataset.h; });
});
$('btnNewCreate').addEventListener('click', ()=>{
  const w = Math.max(16, +$('newW').value||1200);
  const h = Math.max(16, +$('newH').value||800);
  initCanvas(w,h,false);
  $('newModalBack').classList.remove('dp-show');
  showToast('New canvas created');
});

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer=null;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('dp-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('dp-show'), 1800);
}

/* ============================================================
   RESIZE
   ============================================================ */
window.addEventListener('resize', fitZoom);

/* ============================================================
   OPEN / CLOSE (matches site's modal + desktop-icon pattern)
   ============================================================ */
updateUndoButtons();

let dpInitialized = false;
function dpOpen(){
  drawpadModal.style.display = 'flex';
  window.desktopSfx?.open();
  if(!dpInitialized){
    dpInitialized = true;
    requestAnimationFrame(fitZoom);
  } else {
    fitZoom();
  }
}
function dpClose(){
  drawpadModal.style.display = 'none';
}
document.getElementById('drawpadClose')?.addEventListener('click', dpClose);
drawpadModal.addEventListener('click', e => { if (e.target === drawpadModal) dpClose(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawpadModal.style.display !== 'none') dpClose();
});
const dpNode = document.getElementById('n-drawpad');
if (dpNode) dpNode.addEventListener('dblclick', e => { e.stopPropagation(); dpOpen(); });
/* ============================================================
   RIGHT-CLICK CONTEXT MENU
   ============================================================ */
const ctxMenu = document.getElementById('dpCtxMenu');
const aboutBack = document.getElementById('dpAboutModalBack');

function ctxIcon(d){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`; }
const CTX_ICONS = {
  save: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  brush: '<path d="M4 20L14 10M14 10L20 4L21 5.5C21.5 6 21.5 6.8 21 7.3L15.5 12.5M14 10L18.5 14.5"/><path d="M4 20L6.5 19.5L7 17L4 20Z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
};

function hideCtxMenu(){ ctxMenu.classList.remove('dp-show'); }

function showCtxMenu(x, y, items){
  ctxMenu.innerHTML = items.map(it => {
    if(it === '-') return '<div class="dp-ctxsep"></div>';
    return `<button type="button" data-action="${it.action}">${ctxIcon(CTX_ICONS[it.icon]||'')}${it.label}</button>`;
  }).join('');
  ctxMenu.querySelectorAll('button[data-action]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      hideCtxMenu();
      runCtxAction(btn.dataset.action);
    });
  });
  ctxMenu.classList.add('dp-show');
  // keep menu on-screen
  const mw = ctxMenu.offsetWidth || 190, mh = ctxMenu.offsetHeight || 90;
  const vw = window.innerWidth, vh = window.innerHeight;
  ctxMenu.style.left = Math.min(x, vw - mw - 8) + 'px';
  ctxMenu.style.top = Math.min(y, vh - mh - 8) + 'px';
}

function runCtxAction(action){
  if(action==='save'){ $('btnExport').click(); }
  else if(action==='brush'){ selectTool('brush'); showToast('Switched to Brush'); }
  else if(action==='about'){ aboutBack.classList.add('dp-show'); }
}

canvasFrame.addEventListener('contextmenu', e=>{
  e.preventDefault();
  showCtxMenu(e.clientX, e.clientY, [
    {label:'Save Image', icon:'save', action:'save'},
    {label:'Change Brush', icon:'brush', action:'brush'},
  ]);
});

drawpadModal.addEventListener('contextmenu', e=>{
  if(e.target.closest('#canvasFrame')) return; // handled above
  e.preventDefault();
  showCtxMenu(e.clientX, e.clientY, [
    {label:'About App', icon:'info', action:'about'},
  ]);
});

window.addEventListener('click', e=>{
  if(!ctxMenu.contains(e.target)) hideCtxMenu();
});
window.addEventListener('blur', hideCtxMenu);
document.addEventListener('keydown', e=>{ if(e.key==='Escape') hideCtxMenu(); });

document.getElementById('dpAboutClose')?.addEventListener('click', ()=>aboutBack.classList.remove('dp-show'));
aboutBack.addEventListener('click', e=>{ if(e.target===aboutBack) aboutBack.classList.remove('dp-show'); });

window.__openDrawpad = dpOpen;

})();
(function initSynth(){
  const modal = document.getElementById('synthModal');
  if (!modal) return;
  const openIcon = document.getElementById('n-synth');
  const closeBtn = document.getElementById('synthClose');
  const kb = document.getElementById('p900-keyboard');
  const leds = [...document.querySelectorAll('#p900-leds .p900-led')];
  leds.forEach(l => l.style.setProperty('--h', l.dataset.hue));
  const params = {
    wave:'sine', detune:0, cutoff:2400, resonance:2,
    attack:15, decay:180, sustain:60, release:420,
    lfoRate:4, lfoDepth:0, delayTime:0.28, delayFb:0.35,
    reverb:0.22, volume:0.6
  };
  let ctx, master, filter, delay, delayFb, dryGain, wetGain, convolver, lfo, lfoGain;
  let octave = 4;
  const active = new Map(); 
  function ensureAudio(){
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = params.volume;
    filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
    filter.frequency.value = params.cutoff; filter.Q.value = params.resonance;
    lfo = ctx.createOscillator(); lfo.frequency.value = params.lfoRate;
    lfoGain = ctx.createGain(); lfoGain.gain.value = params.lfoDepth;
    lfo.connect(lfoGain).connect(filter.frequency); lfo.start();
    delay = ctx.createDelay(1.2); delay.delayTime.value = params.delayTime;
    delayFb = ctx.createGain(); delayFb.gain.value = params.delayFb;
    delay.connect(delayFb).connect(delay);
    convolver = ctx.createConvolver();
    convolver.buffer = makeIR(ctx, 2.2, 2.4);
    dryGain = ctx.createGain(); dryGain.gain.value = 1 - params.reverb;
    wetGain = ctx.createGain(); wetGain.gain.value = params.reverb;
    filter.connect(delay);
    delay.connect(master);
    filter.connect(dryGain).connect(master);
    filter.connect(convolver); convolver.connect(wetGain).connect(master);
    master.connect(ctx.destination);
  }
  function makeIR(ctx, duration, decay){
    const rate = ctx.sampleRate, len = rate * duration;
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++){
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++){
        d[i] = (Math.random()*2 - 1) * Math.pow(1 - i/len, decay);
      }
    }
    return buf;
  }
  function midiToFreq(m){ return 440 * Math.pow(2, (m - 69) / 12); }
  function noteOn(midi, key){
    ensureAudio();
    if (ctx.state === 'suspended') ctx.resume();
    if (active.has(key)) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = params.wave;
    osc.frequency.value = midiToFreq(midi);
    osc.detune.value = params.detune;
    const g = ctx.createGain(); g.gain.value = 0;
    osc.connect(g).connect(filter);
    const a = Math.max(0.005, params.attack/1000);
    const d = Math.max(0.005, params.decay/1000);
    const s = params.sustain/100;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.28, now + a);
    g.gain.linearRampToValueAtTime(0.28 * s, now + a + d);
    osc.start(now);
    active.set(key, { osc, gain: g });
    flashLed(midi);
  }
  function noteOff(key){
    const v = active.get(key); if (!v) return;
    active.delete(key);
    const now = ctx.currentTime;
    const r = Math.max(0.02, params.release/1000);
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setValueAtTime(v.gain.gain.value, now);
    v.gain.gain.linearRampToValueAtTime(0, now + r);
    v.osc.stop(now + r + 0.02);
  }
  function flashLed(midi){
    const led = leds[midi % 12]; if (!led) return;
    led.classList.add('on');
    clearTimeout(led._t);
    led._t = setTimeout(() => led.classList.remove('on'), 260);
  }
  const WHITE = ['C','D','E','F','G','A','B'];
  const BLACK = { 0:'C#', 1:'D#', 3:'F#', 4:'G#', 5:'A#' }; 
  const OCTAVES = 2;
  const totalWhites = WHITE.length * OCTAVES;
  const keyMap = {}; 
  const rowWhite = ['a','s','d','f','g','h','j','k','l',';','\''];
  const rowBlack = { 0:'w', 1:'e', 3:'t', 4:'y', 5:'u', 7:'o', 8:'p' };
  function buildKeys(){
    kb.innerHTML = '';
    const wPct = 100 / totalWhites;
    let whiteIdx = 0;
    for (let o = 0; o < OCTAVES; o++){
      for (let i = 0; i < WHITE.length; i++){
        const midi = 12 * (octave + o) + [0,2,4,5,7,9,11][i];
        const el = document.createElement('div');
        el.className = 'p900-key white';
        el.style.left = `calc(${whiteIdx * wPct}% + 2px)`;
        el.style.width = `calc(${wPct}% - 4px)`;
        el.dataset.midi = midi;
        const kb1 = rowWhite[whiteIdx];
        if (kb1) { keyMap[kb1] = midi; el.innerHTML = `<span class="p900-key-label">${kb1.toUpperCase()}</span>`; }
        attachKey(el, midi);
        kb.appendChild(el);
        whiteIdx++;
      }
    }
    whiteIdx = 0;
    for (let o = 0; o < OCTAVES; o++){
      for (let i = 0; i < WHITE.length; i++){
        if (BLACK[i] !== undefined){
          const midi = 12 * (octave + o) + [1,3,undefined,6,8,10,undefined][i];
          const el = document.createElement('div');
          el.className = 'p900-key black';
          el.style.left = `calc(${(whiteIdx + 1) * wPct}% - ${wPct*0.32}%)`;
          el.style.width = `calc(${wPct * 0.64}%)`;
          el.dataset.midi = midi;
          const kb2 = rowBlack[whiteIdx];
          if (kb2) { keyMap[kb2] = midi; el.innerHTML = `<span class="p900-key-label">${kb2.toUpperCase()}</span>`; }
          attachKey(el, midi);
          kb.appendChild(el);
        }
        whiteIdx++;
      }
    }
  }
  function attachKey(el, midi){
    const k = 'm'+midi;
    const down = e => { e.preventDefault(); el.classList.add('active'); noteOn(midi, k); };
    const up = e => { e.preventDefault(); el.classList.remove('active'); noteOff(k); };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', e => { if (active.has(k)) { el.classList.remove('active'); noteOff(k); } });
  }
  function applyParam(name, value){
    params[name] = value;
    if (!ctx) return;
    if (name === 'volume') master.gain.setTargetAtTime(value, ctx.currentTime, 0.02);
    if (name === 'cutoff') filter.frequency.setTargetAtTime(value, ctx.currentTime, 0.02);
    if (name === 'resonance') filter.Q.setTargetAtTime(value, ctx.currentTime, 0.02);
    if (name === 'lfoRate') lfo.frequency.setTargetAtTime(value, ctx.currentTime, 0.02);
    if (name === 'lfoDepth') lfoGain.gain.setTargetAtTime(value, ctx.currentTime, 0.02);
    if (name === 'delayTime') delay.delayTime.setTargetAtTime(value, ctx.currentTime, 0.03);
    if (name === 'delayFb') delayFb.gain.setTargetAtTime(value, ctx.currentTime, 0.02);
    if (name === 'reverb') {
      wetGain.gain.setTargetAtTime(value, ctx.currentTime, 0.02);
      dryGain.gain.setTargetAtTime(1 - value*0.7, ctx.currentTime, 0.02);
    }
  }
  document.querySelectorAll('#synthModal .p900-knob').forEach(knob => {
    const min = parseFloat(knob.dataset.min);
    const max = parseFloat(knob.dataset.max);
    const curve = knob.dataset.curve;
    const param = knob.dataset.param;
    let val = parseFloat(knob.dataset.value);
    function toAngle(v){
      let t = curve === 'log' ? (Math.log(v/min) / Math.log(max/min)) : (v - min) / (max - min);
      t = Math.max(0, Math.min(1, t));
      return -135 + t * 270;
    }
    function fromT(t){
      t = Math.max(0, Math.min(1, t));
      return curve === 'log' ? min * Math.pow(max/min, t) : min + t*(max-min);
    }
    function render(){ knob.style.transform = `rotate(${toAngle(val)}deg)`; }
    render();
    knob.addEventListener('pointerdown', e => {
      e.preventDefault();
      const startY = e.clientY;
      const startT = curve === 'log' ? (Math.log(val/min) / Math.log(max/min)) : (val - min)/(max-min);
      knob.setPointerCapture(e.pointerId);
      const move = ev => {
        const dy = startY - ev.clientY;
        const t = startT + dy / 180;
        val = fromT(t);
        render();
        applyParam(param, val);
      };
      const up = ev => {
        knob.removeEventListener('pointermove', move);
        knob.removeEventListener('pointerup', up);
      };
      knob.addEventListener('pointermove', move);
      knob.addEventListener('pointerup', up);
    });
  });
  document.querySelectorAll('#synthModal .p900-slider').forEach(sl => {
    sl.addEventListener('input', () => {
      params[sl.dataset.param] = parseFloat(sl.value);
    });
  });
  document.querySelectorAll('#synthModal .p900-wave').forEach(w => {
    w.addEventListener('click', () => {
      document.querySelectorAll('#synthModal .p900-wave').forEach(x => x.classList.remove('selected'));
      w.classList.add('selected');
      params.wave = w.dataset.wave;
    });
  });
  const held = new Set();
  function onKD(e){
    if (modal.style.display !== 'flex') return;
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === 'z') { octave = Math.max(1, octave - 1); buildKeys(); return; }
    if (k === 'x') { octave = Math.min(6, octave + 1); buildKeys(); return; }
    if (keyMap[k] !== undefined && !held.has(k)) {
      held.add(k);
      const midi = keyMap[k];
      const el = kb.querySelector(`.p900-key[data-midi="${midi}"]`);
      if (el) el.classList.add('active');
      noteOn(midi, 'k'+k);
    }
  }
  function onKU(e){
    const k = e.key.toLowerCase();
    if (keyMap[k] !== undefined && held.has(k)) {
      held.delete(k);
      const midi = keyMap[k];
      const el = kb.querySelector(`.p900-key[data-midi="${midi}"]`);
      if (el) el.classList.remove('active');
      noteOff('k'+k);
    }
  }
  window.addEventListener('keydown', onKD);
  window.addEventListener('keyup', onKU);
  buildKeys();
  const presetConfigs = {
    kiln:  { name:'KILN BASS',    wave:'sawtooth', cutoff:900,  reso:6,  vol:0.55 },
    frost: { name:'FROSTLINE',    wave:'sine',     cutoff:5200, reso:2,  vol:0.5 },
    brass: { name:'BRASS DUST',   wave:'square',   cutoff:1800, reso:9,  vol:0.5 },
    night: { name:'NIGHT TRANSIT',wave:'triangle', cutoff:2400, reso:3,  vol:0.5 },
  };
  document.querySelectorAll('#synthModal .p900-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#synthModal .p900-preset').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      const cfg = presetConfigs[btn.dataset.preset]; if (!cfg) return;
      const scopeName = document.getElementById('p900ScopeName');
      if (scopeName) scopeName.textContent = cfg.name;
      document.querySelectorAll('#synthModal .p900-wave').forEach(w => {
        w.classList.toggle('selected', w.dataset.wave === cfg.wave);
      });
      params.wave = cfg.wave;
      applyParam('cutoff', cfg.cutoff);
      applyParam('resonance', cfg.reso);
      applyParam('volume', cfg.vol);
    });
  });
  const stepValues = ['ROOT','+7','+3','+10','ROOT','+12','+7','-2'];
  const semiOffsets = [0, 7, 3, 10, 0, 12, 7, -2];
  const stepOn = [true,true,false,true,true,false,true,true];
  const seqGrid = document.getElementById('p900SeqGrid');
  if (seqGrid) {
    stepValues.forEach((v, i) => {
      const el = document.createElement('div');
      el.className = 'p900-step' + (stepOn[i] ? ' on' : '');
      el.dataset.idx = i;
      el.innerHTML = `<span class="p900-step-num">0${i+1}</span><div class="p900-step-dot"></div><div class="p900-step-val">${v}</div>`;
      el.addEventListener('click', () => { stepOn[i] = !stepOn[i]; el.classList.toggle('on', stepOn[i]); });
      seqGrid.appendChild(el);
    });
  }
  let seqRunning = false, seqIdx = 0, seqTimer = null;
  const seqBtn = document.getElementById('p900SeqRun');
  function seqTick(){
    const steps = [...document.querySelectorAll('#p900SeqGrid .p900-step')];
    steps.forEach(s => s.classList.remove('playing'));
    const cur = steps[seqIdx];
    if (cur) cur.classList.add('playing');
    if (stepOn[seqIdx]) {
      const midi = (octave * 12) + semiOffsets[seqIdx];
      const id = 'seq'+seqIdx+'-'+Date.now();
      noteOn(midi, id);
      setTimeout(() => noteOff(id), 180);
    }
    seqIdx = (seqIdx + 1) % 8;
  }
  if (seqBtn) {
    seqBtn.addEventListener('click', () => {
      if (seqRunning) {
        seqRunning = false; clearInterval(seqTimer); seqTimer = null;
        seqBtn.classList.remove('running'); seqBtn.textContent = '▶ RUN';
        document.querySelectorAll('#p900SeqGrid .p900-step').forEach(s => s.classList.remove('playing'));
      } else {
        ensureAudio(); if (ctx?.state === 'suspended') ctx.resume();
        seqRunning = true; seqIdx = 0;
        seqBtn.classList.add('running'); seqBtn.textContent = '■ STOP';
        seqTick();
        seqTimer = setInterval(seqTick, 240);
      }
    });
  }
  const scopeCanvas = document.getElementById('p900Scope');
  if (scopeCanvas) {
    const sctx = scopeCanvas.getContext('2d');
    const SW = scopeCanvas.width, SH = scopeCanvas.height;
    let t0 = 0;
    function drawScope(){
      if (modal.style.display !== 'flex') { requestAnimationFrame(drawScope); return; }
      t0 += 0.06;
      sctx.clearRect(0,0,SW,SH);
      sctx.strokeStyle = 'rgba(127, 216, 143, 0.08)'; sctx.lineWidth = 1;
      for (let x=0; x<=SW; x+=SW/8) { sctx.beginPath(); sctx.moveTo(x,0); sctx.lineTo(x,SH); sctx.stroke(); }
      for (let y=0; y<=SH; y+=SH/4) { sctx.beginPath(); sctx.moveTo(0,y); sctx.lineTo(SW,y); sctx.stroke(); }
      const activeCount = active.size + (seqRunning ? 1 : 0);
      const amp = activeCount > 0 ? 22 + activeCount*4 : 3;
      sctx.strokeStyle = '#7fd88f';
      sctx.shadowColor = '#7fd88f'; sctx.shadowBlur = 6;
      sctx.lineWidth = 1.4;
      sctx.beginPath();
      const freqA = params.wave === 'square' ? 3 : params.wave === 'sawtooth' ? 2.5 : params.wave === 'triangle' ? 2 : 1.5;
      for (let x=0; x<=SW; x++) {
        const p = (x / SW) * Math.PI * 2 * freqA;
        let y;
        if (params.wave === 'square') y = Math.sign(Math.sin(p + t0)) * amp;
        else if (params.wave === 'sawtooth') y = (((p + t0) / Math.PI) % 2 - 1) * amp;
        else if (params.wave === 'triangle') y = Math.abs(((p + t0)/Math.PI) % 2 - 1) * amp*2 - amp;
        else y = Math.sin(p + t0) * amp;
        y += Math.sin(x*0.11 + t0*0.6) * 1.4;
        if (x === 0) sctx.moveTo(x, SH/2 + y); else sctx.lineTo(x, SH/2 + y);
      }
      sctx.stroke();
      sctx.shadowBlur = 0;
      const vu = document.querySelectorAll('#synthModal .p900-vu span');
      const level = Math.min(1, activeCount * 0.22 + Math.random()*0.05);
      vu.forEach((s, i) => s.classList.toggle('on', i/vu.length < level));
      requestAnimationFrame(drawScope);
    }
    requestAnimationFrame(drawScope);
  }
  function open(){ modal.style.display = 'flex'; window.desktopSfx?.open(); ensureAudio(); if (ctx?.state === 'suspended') ctx.resume(); }
  function close(){ modal.style.display = 'none'; active.forEach((_,k) => noteOff(k)); }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.style.display === 'flex') close(); });
  if (openIcon) {
    openIcon.addEventListener('dblclick', e => { e.stopPropagation(); open(); });
    let lastTap = 0;
    openIcon.addEventListener('click', e => {
      if (window.matchMedia('(hover: none)').matches) { e.stopPropagation(); open(); }
    });
  }
})();
(function initArtboard(){
  const modal = document.getElementById('artboardModal');
  if (!modal) return;
  const openIcon = document.getElementById('n-artboard');
  const closeBtn = document.getElementById('artboardClose');
  const canvas = document.getElementById('mbCanvas');
  if (!canvas) return;
  const canvasWrap = canvas.closest('.mb-canvas-wrap');
  // Tool cursor artwork (from images/icons.svg #icon-tool-*), turned into CSS
  // mask images so .mb-brush-icon can be tinted with the active pigment color.
  const TOOL_ICON_SVG = {
    dropper: { viewBox: '0 0 122.06 122.88', body: '<path d="M95.19,57.99l-4.2-4.2l6.98-6.98c6.22,0.18,12.49-2.1,17.24-6.84c9.14-9.14,9.14-23.97,0-33.11 c-9.14-9.14-23.97-9.14-33.11,0c-4.75,4.75-7.02,11.02-6.84,17.24l-6.98,6.98l-4.51-4.51c-1.51-1.51-3.96-1.51-5.47,0l-2.19,2.19 c-1.51,1.51-1.51,3.96,0,5.47l4.51,4.51l-53.5,53.5L0,122.88l29.82-7.93l53.5-53.5l4.2,4.2c1.51,1.51,3.96,1.51,5.47,0l2.19-2.19 C96.7,61.95,96.7,59.5,95.19,57.99L95.19,57.99z M28.37,108.97l-20.83,6.01l5.45-21.38L59.38,47.2l15.38,15.38L28.37,108.97 L28.37,108.97z"/>' },
    stylus:  { viewBox: '0 0 100 100', body: '<path d="M73.293,28.879l-2.172-2.172c-1.17-1.17-3.072-1.17-4.242,0l-38.05,38.05C26.36,67.227,25,70.509,25,74c0,0.552,0.448,1,1,1c3.491,0,6.774-1.359,9.243-3.829l38.05-38.05C74.463,31.952,74.463,30.048,73.293,28.879z M33.829,69.757c-1.842,1.843-4.219,2.955-6.78,3.194c0.239-2.561,1.352-4.938,3.194-6.78L47.5,48.914l3.586,3.586L33.829,69.757z M71.879,31.707L52.5,51.086L48.914,47.5l19.379-19.379c0.393-0.39,1.021-0.39,1.414,0l2.172,2.172C72.269,30.686,72.269,31.314,71.879,31.707z"/>' },
    comb:    { viewBox: '0 0 96 96', body: '<path d="M90.221,30.228C86.82,25.704,81.408,23,75.752,23H20.248c-5.624,0-11.012,2.676-14.412,7.152c-3.404,4.48-4.532,10.388-3.024,15.804l7.124,25.576c0.056,0.14,0.116,0.256,0.196,0.383c0.088,0.1,0.192,0.172,0.3,0.256c0.112,0.057,0.236,0.084,0.36,0.121c0.128,0.035,0.252,0.075,0.392,0.084c0.096,0,0.18-0.04,0.272-0.061c0.088-0.012,0.176,0.004,0.264-0.02c0.136-0.048,0.252-0.116,0.376-0.196c0.104-0.064,0.208-0.116,0.296-0.195c0.096-0.084,0.172-0.192,0.252-0.297c0.076-0.096,0.152-0.195,0.208-0.304c0.056-0.112,0.084-0.236,0.116-0.353c0.036-0.131,0.072-0.256,0.08-0.399v-28h4v28c0,1.1,0.896,2,2,2s2-0.9,2-2v-28h4v28c0,1.1,0.896,2,2,2s2-0.9,2-2v-28h4v28c0,1.1,0.896,2,2,2s2-0.9,2-2v-28h4v28c0,1.1,0.896,2,2,2s2-0.9,2-2v-28h4v28c0,1.1,0.896,2,2,2c1.1,0,2-0.9,2-2v-28h4v28c0,1.1,0.896,2,2,2c1.1,0,2-0.9,2-2v-28h4v28c0,1.1,0.896,2,2,2c1.1,0,2-0.9,2-2v-28h4v28c0,1.1,0.896,2,2,2c1.1,0,2-0.9,2-2v-28h4v28c0.008,0.145,0.043,0.272,0.084,0.408c0.031,0.124,0.06,0.24,0.111,0.344c0.057,0.117,0.133,0.213,0.204,0.313c0.084,0.104,0.147,0.212,0.252,0.296c0.084,0.084,0.196,0.14,0.3,0.204c0.112,0.076,0.232,0.148,0.364,0.196c0.188,0.057,0.375,0.08,0.56,0.08c0.403,0,0.752-0.148,1.075-0.352c0.064-0.041,0.113-0.072,0.173-0.116c0.288-0.236,0.508-0.54,0.632-0.908l7.356-25.42C94.712,40.692,93.616,34.752,90.221,30.228z"/>' },
    rake:    { viewBox: '0 0 96 96', body: '<rect x="0" y="8" width="96" height="14" rx="4"/><rect x="0" y="22" width="12" height="68" rx="3"/><rect x="21" y="22" width="12" height="68" rx="3"/><rect x="42" y="22" width="12" height="68" rx="3"/><rect x="63" y="22" width="12" height="68" rx="3"/><rect x="84" y="22" width="12" height="68" rx="3"/>' },
    breath:  { viewBox: '0 0 50 50', body: '<path d="M0 0 C6.03228065 -0.07424697 12.06429432 -0.1286483 18.09692383 -0.16479492 C20.14840326 -0.17986622 22.19985056 -0.20032682 24.2512207 -0.22631836 C27.20271748 -0.26277424 30.15378763 -0.27974306 33.10546875 -0.29296875 C34.47761787 -0.31619453 34.47761787 -0.31619453 35.87748718 -0.33988953 C40.74088272 -0.34117017 44.06853822 -0.20797889 48 3 C50.70867441 7.01376299 50.67655958 11.32255102 50 16 C48.20726402 19.12068856 46.75740595 20.54965052 43.6875 22.375 C40.04992671 23.22094728 37.60960985 22.96685978 34 22 C31 19.75 31 19.75 29 17 C29.1875 14.1875 29.1875 14.1875 30 12 C33.79588866 12.54226981 35.47211993 14.20127563 38 17 C39.98 16.34 41.96 15.68 44 15 C44.16677282 11.58343976 44.16677282 11.58343976 44 8 C40.02683055 4.02683055 34.62999284 4.7935546 29.296875 4.68359375 C24.08882644 4.5553745 21.41943902 4.49635642 18.75 4.4375 C16.93749016 4.39429106 15.12498995 4.35067601 13.3125 4.30664062 C8.87509791 4.19971871 4.43759932 4.09838134 0 4 C0 2.68 0 1.36 0 0 Z" transform="translate(0,23)"/><path d="M0 0 C2.1640625 0.3359375 2.1640625 0.3359375 4.7265625 1.7734375 C6.81486431 5.49606246 7.28920338 9.19178507 6.1640625 13.3359375 C3.5151747 16.63564557 2.07452916 18.18034507 -2.1574707 18.90356445 C-3.38812256 18.87738037 -4.61877441 18.85119629 -5.88671875 18.82421875 C-9.97273784 18.77494729 -12.05962226 18.71224569 -14.1484375 18.6484375 C-21.89020611 18.52516196 -25.362803 18.43897435 -28.8359375 18.3359375 C-28.8359375 17.0159375 -28.8359375 15.6959375 -28.8359375 14.3359375 C-23.26461694 14.18055922 -19.92536111 14.07090754 -16.5859375 13.9609375 C-11.95917969 13.82851562 -10.84414063 13.78984375 -9.6953125 13.75 C-6.58496094 13.65478516 -6.58496094 13.65478516 -6.58496094 13.65478516 C-3.86726677 13.33957125 -2.16669315 12.72561399 0.1640625 11.3359375 C0.1640625 9.6859375 0.1640625 8.0359375 0.1640625 6.3359375 C-1.4859375 6.3359375 -3.1359375 6.3359375 -4.8359375 6.3359375 C-5.1659375 6.9959375 -5.4959375 7.6559375 -5.8359375 8.3359375 C-7.4859375 8.3359375 -9.1359375 8.3359375 -10.8359375 8.3359375 C-9.86148132 1.12496175 -6.89683625 -0.29204844 0 0 Z" transform="translate(28.8359375,0.6640625)"/>' },
  };
  function svgMaskUrl(tool){
    const spec = TOOL_ICON_SVG[tool];
    if (!spec) return 'none';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${spec.viewBox}" fill="#000">${spec.body}</svg>`;
    const b64 = (typeof btoa === 'function') ? btoa(unescape(encodeURIComponent(svg))) : '';
    return b64 ? `url("data:image/svg+xml;base64,${b64}")` : 'none';
  }
  const TOOL_ICON_MASKS = {};
  Object.keys(TOOL_ICON_SVG).forEach(tool => { TOOL_ICON_MASKS[tool] = svgMaskUrl(tool); });
  let brushIconEl = null, brushRingEl = null;
  if (canvasWrap) {
    brushIconEl = document.createElement('div');
    brushIconEl.className = 'mb-brush-icon';
    brushRingEl = document.createElement('div');
    brushRingEl.className = 'mb-brush-ring';
    canvasWrap.appendChild(brushRingEl);
    canvasWrap.appendChild(brushIconEl);
  }
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const captionEl = document.getElementById('mbCaption');
  const hintEl = document.getElementById('mbToolHint');
  const sizeEl = document.getElementById('mbSize');
  const sizeValEl = document.getElementById('mbSizeVal');
  const paperFill = '#f6f0dc';
  function fillPaper(){
    ctx.fillStyle = paperFill;
    ctx.fillRect(0,0,W,H);
    const img = ctx.getImageData(0,0,W,H);
    for (let i=0; i<img.data.length; i+=4) {
      const n = (Math.random()-0.5) * 6;
      img.data[i]   = Math.max(0,Math.min(255, img.data[i]+n));
      img.data[i+1] = Math.max(0,Math.min(255, img.data[i+1]+n));
      img.data[i+2] = Math.max(0,Math.min(255, img.data[i+2]+n));
    }
    ctx.putImageData(img, 0, 0);
  }
  const history = [];
  const HIST_MAX = 20;
  function snapshot(){
    try { history.push(canvas.toDataURL('image/png')); if (history.length > HIST_MAX) history.shift(); } catch(e){}
  }
  function restoreLast(){
    if (!history.length) { fillPaper(); return; }
    const url = history.pop();
    const img = new Image();
    img.onload = () => { ctx.clearRect(0,0,W,H); ctx.drawImage(img, 0, 0); };
    img.src = url;
  }
  let currentTool = 'dropper';
  let currentColor = '#1e3a7a';
  let currentColorName = 'Ultramarine';
  let dropSize = 62;
  const captions = {
    dropper: 'The water is clear and still.',
    stylus:  'A single point drags the ink already on the water.',
    comb:    'Eight teeth pull the existing pigment into rows.',
    rake:    'Five heavy teeth sweep and fold what is already there.',
    breath:  'A soft exhale — the water settles, colors soften.',
  };
  const hints = {
    dropper: 'Place a controlled bloom of color.',
    stylus:  'Drop pigment first, then drag it into a thread.',
    comb:    'Drag across a drop to fold it into fine rows.',
    rake:    'Sweep through drops to smear broad bands of colour.',
    breath:  'Hover and drag — a soft diffusion.',
  };
  function setTool(t){
    currentTool = t;
    document.querySelectorAll('#artboardModal .mb-tool').forEach(el => el.classList.toggle('active', el.dataset.tool === t));
    if (captionEl) captionEl.textContent = captions[t] || '';
    if (hintEl) hintEl.textContent = hints[t] || '';
    updateBrushCursor();
  }
  document.querySelectorAll('#artboardModal .mb-tool').forEach(el => {
    el.addEventListener('click', () => setTool(el.dataset.tool));
  });
  document.querySelectorAll('#artboardModal .mb-swatch').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('#artboardModal .mb-swatch').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      currentColor = el.dataset.color;
      currentColorName = el.dataset.name;
      const c = document.getElementById('mbCaption');
      if (c) c.textContent = currentColorName + ' opening on the water.';
      updateBrushCursor();
    });
  });
  sizeEl?.addEventListener('input', () => {
    dropSize = parseInt(sizeEl.value, 10);
    if (sizeValEl) sizeValEl.textContent = dropSize;
    updateBrushCursor();
  });
  if (sizeEl) {
    sizeEl.addEventListener('pointerenter', showBrushCursor);
    sizeEl.addEventListener('pointerleave', hideBrushCursor);
    sizeEl.addEventListener('pointermove', moveBrushCursor);
    sizeEl.addEventListener('mouseenter', showBrushCursor);
    sizeEl.addEventListener('mouseleave', hideBrushCursor);
    sizeEl.addEventListener('mousemove', moveBrushCursor);
    // Keep the cursor visible for the whole drag even if the pointer
    // strays slightly above/below the thin track while dragging the thumb.
    sizeEl.addEventListener('pointerdown', () => {
      showBrushCursor();
      const onMove = (e) => moveBrushCursor(e);
      const onUp = () => {
        hideBrushCursor();
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
  }
  let ringSize = 0;
  const ICON_BOX = 30; // must match .mb-brush-icon width/height in styles.css
  function updateBrushCursor(){
    if (!brushIconEl || !brushRingEl) return;
    brushIconEl.style.webkitMaskImage = TOOL_ICON_MASKS[currentTool] || 'none';
    brushIconEl.style.maskImage = TOOL_ICON_MASKS[currentTool] || 'none';
    brushIconEl.style.backgroundColor = currentColor;
    ringSize = Math.max(10, Math.min(120, dropSize)) * 0.9;
    brushRingEl.style.width = ringSize + 'px';
    brushRingEl.style.height = ringSize + 'px';
    brushRingEl.style.borderColor = currentColor;
    brushRingEl.style.background = withAlpha(currentColor, 0.16);
  }
  function moveBrushCursor(e){
    if (!brushIconEl || !brushRingEl) return;
    const x = e.clientX, y = e.clientY;
    brushIconEl.style.transform = `translate(${x - ICON_BOX/2}px, ${y - ICON_BOX/2}px)`;
    brushRingEl.style.transform = `translate(${x - ringSize/2}px, ${y - ringSize/2}px)`;
  }
  function showBrushCursor(){
    if (canvasWrap) canvasWrap.classList.add('mb-hover');
    if (brushIconEl) brushIconEl.style.display = 'block';
    if (brushRingEl) brushRingEl.style.display = 'block';
  }
  function hideBrushCursor(){
    if (canvasWrap) canvasWrap.classList.remove('mb-hover');
    if (brushIconEl) brushIconEl.style.display = 'none';
    if (brushRingEl) brushRingEl.style.display = 'none';
  }
  if (canvasWrap) {
    canvasWrap.addEventListener('pointerenter', showBrushCursor);
    canvasWrap.addEventListener('pointerleave', hideBrushCursor);
    canvasWrap.addEventListener('pointermove', moveBrushCursor);
    canvasWrap.addEventListener('mouseenter', showBrushCursor);
    canvasWrap.addEventListener('mouseleave', hideBrushCursor);
    canvasWrap.addEventListener('mousemove', moveBrushCursor);
  }
  function withAlpha(hex, a){
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function bloom(x, y, radius, color){
    const passes = 5;
    for (let i = 0; i < passes; i++) {
      const r = radius * (0.5 + i*0.18) * (0.85 + Math.random()*0.3);
      const alpha = i === 0 ? 0.55 : 0.14 - i*0.02;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, withAlpha(color, alpha));
      g.addColorStop(0.6, withAlpha(color, alpha*0.5));
      g.addColorStop(1, withAlpha(color, 0));
      ctx.fillStyle = g;
      const ox = (Math.random()-0.5) * radius*0.3;
      const oy = (Math.random()-0.5) * radius*0.3;
      ctx.beginPath();
      const pts = 14;
      for (let p=0; p<pts; p++){
        const a = (p/pts) * Math.PI*2;
        const rr = r * (0.85 + Math.random()*0.3);
        const px = x + ox + Math.cos(a) * rr;
        const py = y + oy + Math.sin(a) * rr;
        if (p===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  function smearStep(from, to, radius, alpha){
    const dx = to.x - from.x, dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.01) return;
    const stepLen = Math.max(0.6, radius * 0.35);
    const steps = Math.max(1, Math.ceil(dist / stepLen));
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 1; i <= steps; i++){
      const t0 = (i - 1) / steps, t1 = i / steps;
      const sx = from.x + dx * t0, sy = from.y + dy * t0;
      const tx = from.x + dx * t1, ty = from.y + dy * t1;
      ctx.save();
      ctx.beginPath();
      ctx.arc(tx, ty, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(canvas, tx - sx, ty - sy);
      ctx.restore();
    }
    ctx.restore();
  }
  function toothSmear(from, to, teeth, spacing, radius, alpha){
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const half = Math.floor(teeth / 2);
    for (let i = -half; i <= half; i++){
      const off = i * spacing;
      smearStep(
        { x: from.x + nx * off, y: from.y + ny * off },
        { x: to.x   + nx * off, y: to.y   + ny * off },
        radius, alpha
      );
    }
  }
  function breathAt(x, y){
    const r = Math.max(20, dropSize * 0.9);
    const x0 = Math.max(0, Math.floor(x - r));
    const y0 = Math.max(0, Math.floor(y - r));
    const w = Math.min(W - x0, Math.ceil(r*2));
    const h = Math.min(H - y0, Math.ceil(r*2));
    if (w <= 0 || h <= 0) return;
    const img = ctx.getImageData(x0, y0, w, h);
    const d = img.data;
    const cx = x - x0, cy = y - y0;
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const dx = xx - cx, dy = yy - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > r) continue;
        const t = 1 - dist / r; 
        const i = (yy*w + xx) * 4;
        d[i]   = d[i]   + (246 - d[i])   * 0.05 * t;
        d[i+1] = d[i+1] + (240 - d[i+1]) * 0.05 * t;
        d[i+2] = d[i+2] + (220 - d[i+2]) * 0.05 * t;
      }
    }
    ctx.putImageData(img, x0, y0);
  }
  let drawing = false;
  let last = null;
  function toCanvasXY(e){
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (W / r.width);
    const y = (e.clientY - r.top)  * (H / r.height);
    return { x, y };
  }
  function startDraw(e){
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
    snapshot();
    drawing = true;
    last = toCanvasXY(e);
    brushEl?.classList.add('drawing');
    if (currentTool === 'dropper') {
      bloom(last.x, last.y, dropSize * 0.6, currentColor);
    } else if (currentTool === 'breath') {
      breathAt(last.x, last.y);
    }
  }
  canvas.addEventListener('pointerdown', startDraw);
  canvas.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = toCanvasXY(e);
    if (currentTool === 'stylus'){
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d < 0.8) return;
      smearStep(last, p, Math.max(2.5, dropSize * 0.09), 0.9);
    } else if (currentTool === 'comb'){
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d < 0.8) return;
      const r = Math.max(1.6, dropSize * 0.055);
      toothSmear(last, p, 8, dropSize * 0.13, r, 0.85);
    } else if (currentTool === 'rake'){
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d < 0.8) return;
      const r = Math.max(2.4, dropSize * 0.09);
      toothSmear(last, p, 5, dropSize * 0.20, r, 0.9);
    } else if (currentTool === 'breath') {
      breathAt(p.x, p.y);
    } else if (currentTool === 'dropper') {
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d > dropSize * 0.28) bloom(p.x, p.y, dropSize * 0.5, currentColor);
    }
    last = p;
  });
  function endDraw(e){
    if (drawing) {
      drawing = false; last = null;
    }
    brushEl?.classList.remove('drawing');
  }
  canvas.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointercancel', endDraw);
  canvas.addEventListener('pointerleave', endDraw);
  function moveDraw(e){
    if (!drawing) return;
    const p = toCanvasXY(e);
    if (currentTool === 'stylus'){
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d < 0.8) return;
      smearStep(last, p, Math.max(2.5, dropSize * 0.09), 0.9);
    } else if (currentTool === 'comb'){
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d < 0.8) return;
      const r = Math.max(1.6, dropSize * 0.055);
      toothSmear(last, p, 8, dropSize * 0.13, r, 0.85);
    } else if (currentTool === 'rake'){
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d < 0.8) return;
      const r = Math.max(2.4, dropSize * 0.09);
      toothSmear(last, p, 5, dropSize * 0.20, r, 0.9);
    } else if (currentTool === 'breath') {
      breathAt(p.x, p.y);
    } else if (currentTool === 'dropper') {
      const d = Math.hypot(p.x-last.x, p.y-last.y);
      if (d > dropSize * 0.28) bloom(p.x, p.y, dropSize * 0.5, currentColor);
    }
    last = p;
  }
  if (!window.PointerEvent) {
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
  }
  updateBrushCursor();
  document.getElementById('mbClear')?.addEventListener('click', () => { snapshot(); fillPaper(); if (captionEl) captionEl.textContent = 'The water is clear and still.'; });
  document.getElementById('mbUndo')?.addEventListener('click', restoreLast);
  document.getElementById('mbSave')?.addEventListener('click', () => { snapshot(); });
  const impStrip = document.getElementById('mbImpressions');
  document.getElementById('mbMakePrint')?.addEventListener('click', () => {
    if (!impStrip) return;
    const url = canvas.toDataURL('image/png');
    const slot = document.createElement('div');
    slot.className = 'mb-impression-slot';
    slot.innerHTML = `<img src="${url}" alt="print">`;
    impStrip.appendChild(slot);
    while (impStrip.children.length > 5) impStrip.removeChild(impStrip.firstElementChild);
  });
  window.addEventListener('keydown', e => {
    if (modal.style.display !== 'flex') return;
    if (e.key >= '1' && e.key <= '5') {
      const map = ['dropper','stylus','comb','rake','breath'];
      setTool(map[parseInt(e.key,10)-1]);
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault(); restoreLast();
    }
  });
  function open(){ modal.style.display = 'flex'; window.desktopSfx?.open(); }
  function close(){ modal.style.display = 'none'; }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.style.display === 'flex') close(); });
  if (openIcon) {
    openIcon.addEventListener('dblclick', e => { e.stopPropagation(); open(); });
    openIcon.addEventListener('click', e => {
      if (window.matchMedia('(hover: none)').matches) { e.stopPropagation(); open(); }
    });
  }
  fillPaper();
})();
(function initThisPC(){
  const modal = document.getElementById('thisPcModal');
  const openIcon = document.getElementById('n-thispc');
  const closeBtn = document.getElementById('thisPcClose');
  const body = document.getElementById('thisPcBody');
  if (!modal || !openIcon || !body) return;
  function row(label, value) {
    return `<div class="spec-row"><span class="spec-label">${label}</span><span class="spec-value">${value}</span></div>`;
  }
  function section(title) {
    return `<div class="spec-section">${title}</div>`;
  }
  function detectBrowser() {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua)) return 'Microsoft Edge';
    if (/OPR\//.test(ua)) return 'Opera';
    if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return 'Safari';
    return 'Unknown';
  }
  function detectOS() {
    const ua = navigator.userAgent;
    const plat = navigator.platform || '';
    if (/Windows NT 10/.test(ua)) return 'Windows 10 / 11';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac OS X/.test(ua)) return 'macOS';
    if (/Android/.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Linux/.test(plat)) return 'Linux';
    return plat || 'Unknown';
  }
  function getGPU() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'Not available';
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      return renderer || 'Unknown';
    } catch (e) { return 'Not available'; }
  }
  function render() {
    const dpr = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency;
    const ram = navigator.deviceMemory;
    const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let html = '';
    html += section('System');
    html += row('Operating system', detectOS());
    html += row('Browser', detectBrowser());
    html += row('Platform string', navigator.platform || 'Unknown');
    html += row('Language', navigator.language || 'Unknown');
    html += row('Timezone', (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'Unknown');
    html += section('Hardware');
    html += row('CPU cores (logical)', cores || 'Not available in this browser');
    html += row('Memory (approx.)', ram ? (ram + ' GB') : 'Not available in this browser');
    html += row('Graphics (GPU)', getGPU());
    html += row('Touch support', touch ? 'Yes' : 'No');
    html += section('Display');
    html += row('Screen resolution', screen.width + ' × ' + screen.height);
    html += row('Available area', screen.availWidth + ' × ' + screen.availHeight);
    html += row('Pixel ratio', dpr + '×');
    html += row('Color depth', (screen.colorDepth || 24) + '-bit');
    html += section('Connection');
    html += row('Status', navigator.onLine ? 'Online' : 'Offline');
    html += row('Network type', conn && conn.effectiveType ? conn.effectiveType : 'Not available in this browser');
    if (conn && conn.downlink) html += row('Downlink', conn.downlink + ' Mbps (est.)');
    html += section('More');
    html += `<div class="spec-row"><span class="spec-label">Battery</span><span class="spec-value" id="thisPcBattery">Checking…</span></div>`;
    html += `<div class="spec-row"><span class="spec-label">Storage estimate</span><span class="spec-value" id="thisPcStorage">Checking…</span></div>`;
    body.innerHTML = html;
    if (navigator.getBattery) {
      navigator.getBattery().then(b => {
        const el = document.getElementById('thisPcBattery');
        if (el) el.textContent = Math.round(b.level * 100) + '%' + (b.charging ? ' (charging)' : '');
      }).catch(() => {
        const el = document.getElementById('thisPcBattery');
        if (el) el.textContent = 'Not available';
      });
    } else {
      const el = document.getElementById('thisPcBattery');
      if (el) el.textContent = 'Not available in this browser';
    }
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(est => {
        const el = document.getElementById('thisPcStorage');
        if (!el) return;
        const usedMB = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
        const quotaGB = ((est.quota || 0) / (1024 * 1024 * 1024)).toFixed(1);
        el.textContent = `${usedMB} MB used of ~${quotaGB} GB`;
      }).catch(() => {
        const el = document.getElementById('thisPcStorage');
        if (el) el.textContent = 'Not available';
      });
    } else {
      const el = document.getElementById('thisPcStorage');
      if (el) el.textContent = 'Not available in this browser';
    }
  }
  const open = () => { render(); modal.style.display = 'flex'; window.desktopSfx?.open(); };
  const close = () => { modal.style.display = 'none'; };
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  openIcon.addEventListener('dblclick', e => { e.stopPropagation(); open(); });
  openIcon.addEventListener('click', e => {
    if (window.matchMedia('(hover: none)').matches) { e.stopPropagation(); open(); }
  });
})();
(function initMyIP(){
  const modal = document.getElementById('myIpModal');
  const openIcon = document.getElementById('n-myip');
  const closeBtn = document.getElementById('myIpClose');
  const body = document.getElementById('myIpBody');
  if (!modal || !openIcon || !body) return;
  let fetched = false;
  function row(label, value) {
    return `<div class="spec-row"><span class="spec-label">${label}</span><span class="spec-value mono">${value}</span></div>`;
  }
  async function load() {
    body.innerHTML = `<div class="spec-loading">Looking up your IP…</div>`;
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('bad response');
      const d = await res.json();
      if (d.error) throw new Error(d.reason || 'lookup failed');
      let html = `<div class="spec-ip-hero">${d.ip || 'Unknown'}</div>`;
      html += row('City', d.city || 'Unknown');
      html += row('Region', d.region || 'Unknown');
      html += row('Country', d.country_name || 'Unknown');
      html += row('Postal code', d.postal || 'Unknown');
      html += row('ISP / Org', d.org || 'Unknown');
      html += row('Timezone', d.timezone || 'Unknown');
      html += row('ASN', d.asn || 'Unknown');
      body.innerHTML = html;
      fetched = true;
    } catch (e) {
      try {
        const res2 = await fetch('https://api.ipify.org?format=json');
        const d2 = await res2.json();
        body.innerHTML = `<div class="spec-ip-hero">${d2.ip}</div>` +
          `<div class="spec-row"><span class="spec-label">Detail lookup</span><span class="spec-value">Unavailable right now</span></div>`;
        fetched = true;
      } catch (e2) {
        body.innerHTML = `<div class="spec-loading">Couldn't reach the IP lookup service — check your connection and try again.</div>`;
      }
    }
  }
  const open = () => {
    modal.style.display = 'flex';
    window.desktopSfx?.open();
    if (!fetched) load();
  };
  const close = () => { modal.style.display = 'none'; };
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  openIcon.addEventListener('dblclick', e => { e.stopPropagation(); open(); });
  openIcon.addEventListener('click', e => {
    if (window.matchMedia('(hover: none)').matches) { e.stopPropagation(); open(); }
  });
})();
(function initBricks(){
  const BEST_KEY = 'bricksBestV1';
  const widget = document.getElementById('snake-widget');
  const modal = document.getElementById('snakeModal');
  let best = Number(localStorage.getItem(BEST_KEY) || 0);
  function makeGame(canvas, overlay, opts){
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const isNight = () => document.body.dataset.theme === 'night';
    const cols = opts.cols, rows = opts.rows;
    const brickPadding = opts.brickPadding;
    const brickH = opts.brickH;
    const topPad = opts.topPad;
    const sidePad = opts.sidePad;
    const brickW = (W - sidePad*2 - brickPadding*(cols-1)) / cols;
    const paddleW = opts.paddleW, paddleH = opts.paddleH;
    const ballR = opts.ballR;
    const speed = opts.speed;
    const state = {
      running:false, launched:false, over:false,
      paddleX: W/2 - paddleW/2,
      ball: { x: W/2, y: H - paddleH - 20, vx: 0, vy: 0 },
      bricks: [],
      score: 0,
      raf: null,
    };
    function buildBricks(){
      state.bricks = [];
      for (let r=0; r<rows; r++){
        for (let c=0; c<cols; c++){
          state.bricks.push({
            x: sidePad + c*(brickW+brickPadding),
            y: topPad + r*(brickH+brickPadding),
            w: brickW, h: brickH, alive: true, row: r,
          });
        }
      }
    }
    function resetBall(){
      state.launched = false;
      state.ball.x = state.paddleX + paddleW/2;
      state.ball.y = H - paddleH - 20 - ballR;
      state.ball.vx = 0; state.ball.vy = 0;
    }
    function launch(){
      if (state.launched || state.over) return;
      state.launched = true;
      const angle = (Math.random()*0.6 - 0.3) - Math.PI/2; 
      state.ball.vx = Math.cos(angle) * speed;
      state.ball.vy = Math.sin(angle) * speed;
    }
    function newGame(){
      state.over = false;
      state.score = 0;
      buildBricks();
      state.paddleX = W/2 - paddleW/2;
      resetBall();
      updateHud();
      draw();
    }
    function updateHud(){
      const scoreId = opts.big ? 'gameMovesBig' : 'gameMoves';
      const bestId  = opts.big ? 'gameBestBig'  : 'gameBest';
      document.getElementById(scoreId).textContent = state.score;
      document.getElementById(bestId).textContent = best;
    }
    function draw(){
      const fg = isNight() ? '#eaeaea' : '#111';
      const bg = isNight() ? '#0b0c0f' : '#fafaf8';
      const dim = isNight() ? 'rgba(234,234,234,0.18)' : 'rgba(17,17,17,0.14)';
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle = dim; ctx.setLineDash([2,4]); ctx.beginPath();
      ctx.moveTo(sidePad, H - paddleH - 6); ctx.lineTo(W - sidePad, H - paddleH - 6); ctx.stroke();
      ctx.setLineDash([]);
      state.bricks.forEach(b => {
        if (!b.alive) return;
        if (b.row % 2 === 0){
          ctx.fillStyle = fg;
          ctx.fillRect(b.x, b.y, b.w, b.h);
        } else {
          ctx.strokeStyle = fg; ctx.lineWidth = 1;
          ctx.strokeRect(b.x+0.5, b.y+0.5, b.w-1, b.h-1);
        }
      });
      ctx.fillStyle = fg;
      ctx.fillRect(state.paddleX, H - paddleH - 4, paddleW, paddleH);
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, ballR, 0, Math.PI*2);
      ctx.fill();
    }
    function step(){
      if (state.launched){
        state.ball.x += state.ball.vx;
        state.ball.y += state.ball.vy;
        if (state.ball.x < ballR){ state.ball.x = ballR; state.ball.vx *= -1; }
        if (state.ball.x > W - ballR){ state.ball.x = W - ballR; state.ball.vx *= -1; }
        if (state.ball.y < ballR){ state.ball.y = ballR; state.ball.vy *= -1; }
        const py = H - paddleH - 4;
        if (state.ball.y + ballR >= py && state.ball.y + ballR <= py + paddleH + 6 &&
            state.ball.x >= state.paddleX && state.ball.x <= state.paddleX + paddleW &&
            state.ball.vy > 0){
          state.ball.y = py - ballR;
          const hit = (state.ball.x - (state.paddleX + paddleW/2)) / (paddleW/2);
          const angle = hit * (Math.PI/3) - Math.PI/2;
          const sp = Math.hypot(state.ball.vx, state.ball.vy);
          state.ball.vx = Math.cos(angle) * sp;
          state.ball.vy = Math.sin(angle) * sp;
        }
        for (const b of state.bricks){
          if (!b.alive) continue;
          if (state.ball.x > b.x - ballR && state.ball.x < b.x + b.w + ballR &&
              state.ball.y > b.y - ballR && state.ball.y < b.y + b.h + ballR){
            const prevX = state.ball.x - state.ball.vx;
            const prevY = state.ball.y - state.ball.vy;
            const hitFromSide = (prevX < b.x || prevX > b.x + b.w);
            if (hitFromSide) state.ball.vx *= -1; else state.ball.vy *= -1;
            b.alive = false;
            state.score++;
            if (state.score > best){ best = state.score; localStorage.setItem(BEST_KEY, String(best)); }
            updateHud();
            break;
          }
        }
        if (state.ball.y - ballR > H){
          state.over = true;
          setTimeout(() => { newGame(); }, 600);
        }
        if (state.bricks.every(b => !b.alive)){
          buildBricks();
          resetBall();
        }
      } else {
        state.ball.x = state.paddleX + paddleW/2;
      }
      draw();
      state.raf = requestAnimationFrame(step);
    }
    function start(){
      if (state.running) return;
      state.running = true;
      widget.classList.add('playing');
      if (opts.big) modal.classList.add('playing');
      newGame();
      step();
    }
    function stop(){
      state.running = false;
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = null;
      if (opts.big) modal.classList.remove('playing');
      else widget.classList.remove('playing');
    }
    function setPaddleFromClientX(clientX){
      const rect = canvas.getBoundingClientRect();
      const scale = W / rect.width;
      const localX = (clientX - rect.left) * scale;
      state.paddleX = Math.max(0, Math.min(W - paddleW, localX - paddleW/2));
    }
    canvas.addEventListener('pointermove', e => {
      setPaddleFromClientX(e.clientX);
    });
    canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      setPaddleFromClientX(e.clientX);
      if (!state.running) start();
      else if (!state.launched) launch();
    });
    canvas.addEventListener('touchstart', e => { e.preventDefault(); }, {passive:false});
    canvas.addEventListener('touchmove', e => { e.preventDefault(); }, {passive:false});
    newGame();
    return { start, stop, newGame };
  }
  const small = makeGame(
    document.getElementById('brickCanvas'),
    document.getElementById('brickOverlay'),
    { cols:7, rows:4, brickPadding:3, brickH:10, topPad:14, sidePad:8, paddleW:44, paddleH:5, ballR:3, speed:2.4, big:false }
  );
  const big = makeGame(
    document.getElementById('brickCanvasBig'),
    document.getElementById('brickOverlayBig'),
    { cols:9, rows:5, brickPadding:5, brickH:16, topPad:26, sidePad:14, paddleW:78, paddleH:8, ballR:5, speed:3.8, big:true }
  );
  function openBig(){ modal.classList.add('open'); big.newGame(); }
  function closeBig(){ modal.classList.remove('open'); big.stop(); }
  document.getElementById('snakeExpand').addEventListener('click', openBig);
  document.getElementById('snakeModalClose').addEventListener('click', closeBig);
  document.getElementById('gameResetBig').addEventListener('click', () => big.newGame());
  modal.addEventListener('click', e => { if (e.target === modal) closeBig(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeBig();
  });
})();
(function initCollections(){
  const BOOKS = [
    { title: "Rich Dad Poor Dad", sub: "Robert T. Kiyosaki · 1997", isbn: "1612680194" },
    { title: "The 48 Laws of Power", sub: "Robert Greene · 1998", isbn: "0140280197" },
    { title: "Confessions of a Dying Mind", sub: "Haulianlal Guite · 2017", img: "https://m.media-amazon.com/images/I/81vXEVL42CL._SY466_.jpg" },
    { title: "The Ultimate Guide to Rebuilding Civilization", sub: "Lewis Dartnell · 2014", isbn: "0143127047" },
    { title: "How We Die", sub: "Sherwin B. Nuland · 1993", img: "https://m.media-amazon.com/images/I/71zUwiUBF5L._SY466_.jpg" },
    { title: "The Richest Man in Babylon", sub: "George S. Clason · 1926", isbn: "0451205367" },
    { title: "Atomic Habits", sub: "James Clear · 2018", isbn: "0735211299" },
    { title: "Thinking, Fast and Slow", sub: "Daniel Kahneman · 2011", isbn: "0374533555" },
    { title: "Man's Search for Meaning", sub: "Viktor E. Frankl · 1946", isbn: "080701429X" },
    { title: "Project Hail Mary", sub: "Andy Weir · 2021", isbn: "0593135202" },
    { title: "Educated", sub: "Tara Westover · 2018", isbn: "0399590501" },
    { title: "The Psychology of Money", sub: "Morgan Housel · 2020", isbn: "0857197681" }
  ];
  const FILMS = [
    { title:"A Silent Voice", sub:"2016 ‧ Romance/Drama ‧ 2h 10m", poster:"https://i.pinimg.com/1200x/83/5c/d4/835cd4892e3741678f0fb99c0bdee8f5.jpg" },
    { title:"Waiting in the Summer", sub:"2012 ‧ Romance ‧ 1 season", poster:"https://i.pinimg.com/736x/b2/a2/da/b2a2da49cc414979cdbd7a120a6738d7.jpg" },
    { title:"Charlotte", sub:"Pippa Ehrlich & James Reed · 2020", poster:"https://i.pinimg.com/736x/dc/4d/82/dc4d82df6ec7a78a9b39ab5a8466f699.jpg" },
    { title:"The Eminence in Shadow", sub:"Novel series", poster:"https://i.pinimg.com/736x/9a/06/c5/9a06c55f66c706fa0aa818fac24cfe09.jpg" },
    { title:"Gosick", sub:"2011 ‧ Mystery ‧ 2 seasons", poster:"https://i.pinimg.com/1200x/21/d6/30/21d630064f6b58da23b175e1523ebf81.jpg" },
    { title:"Plastic Memories", sub:"2015 ‧ Sci-fi ‧ 1 season", poster:"https://i.pinimg.com/736x/78/27/af/7827af7c1055d6001e9e79fd8721d967.jpg" },
  ];
  const modal = document.getElementById('collectionModal');
  const title = document.getElementById('cmTitle');
  const body  = document.getElementById('cmBody');
  const close = () => modal.classList.remove('open');
  document.getElementById('cmClose').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
function renderBookshelf() {
  const rowSizes = [3, 4, 5]; 
  const rows = [];
  let currentIndex = 0;
  for (let size of rowSizes) {
    if (currentIndex >= BOOKS.length) break;
    rows.push(BOOKS.slice(currentIndex, currentIndex + size));
    currentIndex += size;
  }
  while (currentIndex < BOOKS.length) {
    rows.push(BOOKS.slice(currentIndex, currentIndex + 4)); 
    currentIndex += 4;
  }
  const html = `<div class="bookshelf">` + rows.map(row => `
    <div class="shelf-row">
      ${row.map(b => {
        const src = b.img ? b.img : `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg?default=false`;
        const fallback = b.img ? b.img : `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg?default=false`;
        return `<div class="book" title="${b.title}">
          <span class="caption">${b.title} — ${b.sub}</span>
          <img src="${src}" onerror="this.onerror=null;this.src='${fallback}'" alt="${b.title}">
        </div>`;
      }).join('')}
    </div>
    <div class="shelf-plank"></div>
  `).join('') + `</div>`;
  body.innerHTML = html;
}
  function renderWatchlist() {
    body.innerHTML = `<div class="posters">` + FILMS.map(f => `
      <div class="poster-card" title="${f.title}">
        <div class="poster-img"><img src="${f.poster}" alt="${f.title}" loading="lazy"></div>
        <div class="poster-meta">
          <div class="poster-title">${f.title}</div>
          <div class="poster-sub">${f.sub}</div>
        </div>
      </div>
    `).join('') + `</div>`;
  }
  document.querySelectorAll('.collection-node').forEach(node => {
    node.addEventListener('dblclick', () => {
      const kind = node.getAttribute('data-collection');
      modal.classList.remove('kind-books', 'kind-films', 'kind-photos');
      if (kind === 'books') { title.textContent = 'Bookshelf'; renderBookshelf(); }
      else if (kind === 'films') { title.textContent = 'Watchlist'; renderWatchlist(); }
      else if (kind === 'photos') { title.textContent = 'Photos'; renderPhotos(); }
      modal.classList.add('kind-' + kind);
      modal.classList.add('open');
      body.scrollTop = 0;
    });
  });
  const cmScrollUp = document.getElementById('cmScrollUp');
  const cmScrollDown = document.getElementById('cmScrollDown');
  const scrollBody = (dir) => body.scrollBy({ top: dir * 180, behavior: 'smooth' });
  cmScrollUp?.addEventListener('click', () => scrollBody(-1));
  cmScrollDown?.addEventListener('click', () => scrollBody(1));
  function renderPhotos() {
    const items = [...document.querySelectorAll('.photo-node')]
      .filter(n => n.id !== 'n-resume')
      .map(n => {
        const img = n.querySelector('.thumb img');
        return {
          src: img?.src || '',
          title: n.querySelector('.node-label')?.textContent || 'Photo',
          sub: n.querySelector('.node-sub')?.textContent || ''
        };
      });
    body.innerHTML = `
      <div class="ios-photos">
        <div class="ios-photos-head">
          <div class="ios-photos-title">Library</div>
          <div class="ios-photos-sub">${items.length} items</div>
        </div>
        <div class="ios-photos-grid">
          ${items.map((p,i) => `
            <div class="ios-photo" data-idx="${i}" title="${p.title}">
              <img src="${p.src}" alt="${p.title}" loading="lazy">
            </div>`).join('')}
        </div>
        <div class="ios-photos-tabs">
          <div class="ios-tab active">
            <svg viewBox="0 0 24 24"><use href="./images/icons.svg#icon-tab-library"></use></svg>
            <span>Library</span>
          </div>
          <div class="ios-tab">
            <svg viewBox="0 0 24 24"><use href="./images/icons.svg#icon-tab-collections"></use></svg>
            <span>Collections</span>
          </div>
          <div class="ios-tab">
            <svg viewBox="0 0 24 24"><use href="./images/icons.svg#icon-tab-search"></use></svg>
          </div>
        </div>
      </div>`;
    body.querySelectorAll('.ios-photo').forEach(el => {
      el.addEventListener('click', () => openPhotoLightbox(items, parseInt(el.dataset.idx, 10)));
    });
  }
  function openPhotoLightbox(items, startIdx) {
    let lb = document.getElementById('iosLightbox');
    if (lb) lb.remove();
    lb = document.createElement('div');
    lb.id = 'iosLightbox';
    lb.className = 'ios-lightbox open';
    lb.innerHTML = `
      <div class="ios-lb-top">
        <button type="button" class="ios-lb-close" aria-label="Close">✕ Close</button>
        <span class="ios-lb-count"></span>
        <span style="width:56px"></span>
      </div>
      <div class="ios-lb-stage">
        ${items.map(p => `<div class="ios-lb-slide"><img src="${p.src}" alt="${p.title}" draggable="false"></div>`).join('')}
      </div>
      <div class="ios-lb-strip">
        ${items.map((p,i) => `<div class="ios-lb-thumb" data-idx="${i}"><img src="${p.src}" alt=""></div>`).join('')}
      </div>`;
    document.body.appendChild(lb);
    const stage = lb.querySelector('.ios-lb-stage');
    const count = lb.querySelector('.ios-lb-count');
    const thumbs = [...lb.querySelectorAll('.ios-lb-thumb')];
    const setActive = (i) => {
      count.textContent = `${i + 1} of ${items.length}`;
      thumbs.forEach((t, idx) => t.classList.toggle('active', idx === i));
      const active = thumbs[i];
      if (active) active.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
    };
    requestAnimationFrame(() => {
      stage.scrollLeft = stage.clientWidth * startIdx;
      setActive(startIdx);
    });
    let raf = 0;
    stage.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(stage.scrollLeft / stage.clientWidth);
        setActive(Math.max(0, Math.min(items.length - 1, i)));
      });
    });
    thumbs.forEach(t => t.addEventListener('click', () => {
      const i = parseInt(t.dataset.idx, 10);
      stage.scrollTo({ left: stage.clientWidth * i, behavior:'smooth' });
    }));
    const close = () => lb.remove();
    lb.querySelector('.ios-lb-close').addEventListener('click', close);
    lb.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }
})();
(function makeSproutDraggable(){
  const el = document.getElementById('hedgehog');
  if (!el) return;
  let dragging = false, startPtr, startPos, moved = false;
  el.addEventListener('pointerdown', e => {
    dragging = true; moved = false;
    startPtr = { x:e.clientX, y:e.clientY };
    const r = el.getBoundingClientRect();
    startPos = { x:r.left, y:r.top };
    el.style.setProperty('left', r.left + 'px', 'important');
    el.style.setProperty('top',  r.top  + 'px', 'important');
    el.style.setProperty('right', 'auto', 'important');
    el.style.setProperty('bottom', 'auto', 'important');
    el.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
    window.desktopSfx?.drag();
  });
  el.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startPtr.x, dy = e.clientY - startPtr.y;
    if (Math.hypot(dx,dy) > 3) moved = true;
    el.style.setProperty('left', (startPos.x + dx) + 'px', 'important');
    el.style.setProperty('top',  (startPos.y + dy) + 'px', 'important');
  });
  function end(e){
    if (!dragging) return;
    dragging = false;
    try { el.releasePointerCapture(e.pointerId); } catch(_){}
    el.classList.remove('dragging');
    if (moved) window.desktopSfx?.drop();
    else {
      const msgs = ['hi ✦','drag me!','wanna play snake?','try the recycle bin','pick a wallpaper ↗'];
      const b = document.getElementById('hedgeBubble');
      if (b) b.textContent = msgs[Math.floor(Math.random()*msgs.length)];
      el.classList.add('say');
      clearTimeout(el._t);
      el._t = setTimeout(()=>el.classList.remove('say'), 2000);
    }
  }
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
})();
(function sproutTips(){
  const el = document.getElementById('hedgehog');
  if (!el) return;
  function tip(){
    if (!el.classList.contains('dragging')) {
      const msgs = [
        'right-click to organize the desktop',
        'double-click a folder to open it',
        'drag anything — even me',
        'try the wallpaper picker ↗',
        'drop something in the recycle bin',
        'open the notes for the full story',
        'peek at case 02 — on demand',
        'check out the widget bar →',
        'poke around the widgets on the right'
      ];
      const b = document.getElementById('hedgeBubble');
      if (b) b.textContent = msgs[Math.floor(Math.random()*msgs.length)];
      el.classList.add('say');
      setTimeout(()=>el.classList.remove('say'), 2600);
    }
    setTimeout(tip, 9000 + Math.random()*7000);
  }
  setTimeout(tip, 5000);
})();
(function initMobileDrawer(){
  const drawer = document.getElementById('mobile-drawer');
  const handle = document.getElementById('mdHandle');
  const body   = document.getElementById('mdBody');
  if (!drawer || !body) return;
  const mq = window.matchMedia('(max-width: 760px)');
  const ids = ['music-widget', 'wallpaper-picker', 'snake-widget', 'awards-widget'];
  const originalParents = new Map();
  function moveIn(){
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!originalParents.has(id)) originalParents.set(id, { parent: el.parentNode, next: el.nextSibling });
      body.appendChild(el);
    });
  }
  function moveOut(){
    ids.forEach(id => {
      const el = document.getElementById(id);
      const info = originalParents.get(id);
      if (!el || !info) return;
      if (info.next && info.next.parentNode === info.parent) info.parent.insertBefore(el, info.next);
      else info.parent.appendChild(el);
    });
  }
  function apply(){
    if (mq.matches) moveIn(); else { moveOut(); drawer.classList.remove('open'); }
  }
  apply();
  mq.addEventListener?.('change', apply);
  let startY = null, startOpen = false, dragging = false, moved = false;
  const OPEN_TRANSLATE = 0;
  const height = () => drawer.getBoundingClientRect().height;
  handle.addEventListener('pointerdown', e => {
    if (!mq.matches) return;
    dragging = true; moved = false;
    startY = e.clientY;
    startOpen = drawer.classList.contains('open');
    drawer.style.transition = 'none';
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 4) moved = true;
    const h = height();
    const closedOffset = h - 46;
    let offset = startOpen ? dy : closedOffset + dy;
    offset = Math.max(0, Math.min(closedOffset, offset));
    drawer.style.transform = `translateY(${offset}px)`;
  });
  function endDrag(e){
    if (!dragging) return;
    dragging = false;
    try { handle.releasePointerCapture(e.pointerId); } catch(_){}
    drawer.style.transition = '';
    drawer.style.transform = '';
    if (!moved) {
      drawer.classList.toggle('open');
    } else {
      const dy = e.clientY - startY;
      if (startOpen) {
        if (dy > 60) drawer.classList.remove('open'); else drawer.classList.add('open');
      } else {
        if (dy < -40) drawer.classList.add('open'); else drawer.classList.remove('open');
      }
    }
    window.desktopSfx?.click?.();
  }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  const syncBody = () => document.body.classList.toggle('drawer-open', drawer.classList.contains('open'));
  const mo = new MutationObserver(syncBody);
  mo.observe(drawer, { attributes:true, attributeFilter:['class'] });
  syncBody();
})();
(function(){
  const c = document.getElementById('msClock');
  function tick(){
    if(!c) return;
    const now = new Date();
    const opts = { hour:'numeric', minute:'2-digit', second:'2-digit', hour12:false };
    c.textContent = now.toLocaleTimeString('en-US', opts);
  }
  tick(); setInterval(tick, 1000);
  const btn = document.getElementById('msHamburger');
  const sheet = document.getElementById('mobile-sheet');
  const scrim = document.getElementById('mshScrim');
  const closeBtn = document.getElementById('mshClose');
  const open = () => { sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true'); };
  const close = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false'); };
  btn?.addEventListener('click', () => sheet.classList.contains('open') ? close() : open());
  scrim?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  sheet.querySelectorAll('[data-sheet]').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.getAttribute('data-sheet');
      const map = { about:'about', 'cursor-style':'cursor-style' };
      const target = document.querySelector(`#menubar [data-action="${map[key]}"]`);
      close();
      setTimeout(() => target?.click(), 200);
    });
  });
  sheet.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', () => setTimeout(close, 80)));
})();
(function initWindowManager(){
  const APP_CONFIG = [
    { id:'about',      modalId:'aboutModal',      closeId:'aboutClose',      label:'About' },
    { id:'drawpad',    modalId:'drawpadModal',    closeId:'drawpadClose',    label:'Drawing Pad' },
    { id:'synth',      modalId:'synthModal',      closeId:'synthClose',      label:'Programma 900' },
    { id:'artboard',   modalId:'artboardModal',   closeId:'artboardClose',   label:'Suminagashi Studio' },
    { id:'thisPc',     modalId:'thisPcModal',     closeId:'thisPcClose',     label:'This PC' },
    { id:'myIp',       modalId:'myIpModal',       closeId:'myIpClose',       label:'My IP' },
    { id:'collection', modalId:'collectionModal', closeId:'cmClose',        label:'Collection' },
    { id:'snake',      modalId:'snakeModal',      closeId:'snakeModalClose',label:'Bricks' },
    { id:'trash',      modalId:'trashModal',      closeId:'trashClose',     label:'Recycle Bin' }
  ];
  const CLASS_BASED = new Set(['collection', 'snake', 'trash']);
  const taskbarItems = document.getElementById('taskbarItems');
  const taskbar = document.getElementById('taskbar');
  if (!taskbarItems || !taskbar) return;
  let zCounter = 9000;
  const apps = [];
  function isVisible(modal){
    return getComputedStyle(modal).display !== 'none';
  }
  function buildControls(app){
    const closeBtn = document.getElementById(app.closeId);
    if (!closeBtn) return null;
    const header = closeBtn.parentElement;
    let minBtn = null, maxBtn = null;
    const s1 = closeBtn.nextElementSibling;
    const s2 = s1 ? s1.nextElementSibling : null;
    const looksDecorative = (el) => el && el.tagName === 'SPAN' &&
      /border-radius\s*:\s*50%/i.test(el.getAttribute('style') || '');
    if (looksDecorative(s1) && looksDecorative(s2)) {
      minBtn = s1; maxBtn = s2;
      minBtn.style.cursor = 'pointer';
      maxBtn.style.cursor = 'pointer';
      minBtn.setAttribute('role','button');
      maxBtn.setAttribute('role','button');
      minBtn.setAttribute('aria-label','Minimize');
      maxBtn.setAttribute('aria-label','Maximize');
    } else {
      const cs = getComputedStyle(closeBtn);
      const w = parseFloat(cs.width) || 13;
      const h = parseFloat(cs.height) || 13;
      const dim = Math.min(w, h, 16) + 'px'; 
      minBtn = document.createElement('button');
      minBtn.type = 'button';
      minBtn.className = 'wm-btn wm-min-btn';
      minBtn.style.width = dim; minBtn.style.height = dim;
      minBtn.style.borderRadius = '50%';
      minBtn.style.padding = '0';
      minBtn.setAttribute('aria-label','Minimize');
      maxBtn = document.createElement('button');
      maxBtn.type = 'button';
      maxBtn.className = 'wm-btn wm-max-btn';
      maxBtn.style.width = dim; maxBtn.style.height = dim;
      maxBtn.style.borderRadius = '50%';
      maxBtn.style.padding = '0';
      maxBtn.setAttribute('aria-label','Maximize');
      closeBtn.after(minBtn, maxBtn);
    }
    return { header, closeBtn, minBtn, maxBtn };
  }
  function renderTaskbar(){
    const running = apps.filter(a => a.state === 'open' || a.state === 'minimized');
    taskbarItems.innerHTML = '';
    running.forEach(app => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'tb-item' + (app.state === 'minimized' ? ' minimized' : ' active');
      item.innerHTML = `<span class="tb-dot"></span><span class="tb-label">${app.label}</span><span class="tb-x" title="Close">✕</span>`;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.tb-x')) { e.stopPropagation(); closeApp(app); return; }
        if (app.state === 'minimized') { restoreApp(app); }
        else { minimizeApp(app); }
      });
      taskbarItems.appendChild(item);
    });
    taskbar.classList.toggle('has-apps', running.length > 0);
  }
  function setState(app, state){
    app.state = state;
    renderTaskbar();
  }
  function showModal(app){
    if (app.usesClass) app.modal.classList.add('open');
    else app.modal.style.display = 'flex';
  }
  function hideModal(app){
    if (app.usesClass) app.modal.classList.remove('open');
    else app.modal.style.display = 'none';
  }
  function setBackdropMode(app){
    const card = app.modal.firstElementChild;
    if (app.maximized) {
      app.modal.style.background = '';
      app.modal.style.backdropFilter = '';
      app.modal.style.pointerEvents = '';
      if (card) card.style.pointerEvents = '';
    } else {
      app.modal.style.background = 'transparent';
      app.modal.style.backdropFilter = 'none';
      app.modal.style.pointerEvents = 'none';
      if (card) card.style.pointerEvents = 'auto';
    }
  }
  function minimizeApp(app){
    app.suppressObserver = true;
    hideModal(app);
    setState(app, 'minimized');
    setTimeout(() => { app.suppressObserver = false; }, 0);
  }
  function restoreApp(app){
    app.suppressObserver = true;
    showModal(app);
    app.modal.style.zIndex = ++zCounter;
    setBackdropMode(app);
    setState(app, 'open');
    setTimeout(() => { app.suppressObserver = false; }, 0);
  }
  function closeApp(app){
    if (app.controls?.closeBtn) app.controls.closeBtn.click();
    else hideModal(app);
  }
  function resetWindowPosition(app){
    const card = app.modal.firstElementChild;
    if (!card) return;
    card.style.position = '';
    card.style.left = '';
    card.style.top = '';
    card.style.right = '';
    card.style.margin = '';
    app.draggedPos = null;
  }
  function toggleMaximize(app){
    const card = app.modal.firstElementChild;
    if (!card) return;
    app.maximized = !app.maximized;
    card.classList.toggle('wm-maximized', app.maximized);
    if (!app.maximized) {
      if (app.draggedPos) {
        card.style.position = 'fixed';
        card.style.margin = '0';
        card.style.left = app.draggedPos.left + 'px';
        card.style.top = app.draggedPos.top + 'px';
        card.style.right = 'auto';
      } else {
        resetWindowPosition(app);
      }
    }
    setBackdropMode(app);
    if (app.controls?.maxBtn) app.controls.maxBtn.setAttribute('aria-pressed', app.maximized ? 'true' : 'false');
  }
  function enableDragging(app){
    const header = app.controls?.header;
    if (!header) return;
    header.style.cursor = 'move';
    header.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (app.maximized) return;
      if (e.target.closest('button, input, a, select, textarea')) return;
      const card = app.modal.firstElementChild;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.position = 'fixed';
      card.style.margin = '0';
      card.style.right = 'auto';
      card.style.left = rect.left + 'px';
      card.style.top = rect.top + 'px';
      app.modal.style.zIndex = ++zCounter;
      const startX = e.clientX, startY = e.clientY;
      const startLeft = rect.left, startTop = rect.top;
      const cardW = rect.width, cardH = rect.height;
      let dragging = true;
      header.setPointerCapture(e.pointerId);
      document.body.style.userSelect = 'none';
      function onMove(ev){
        if (!dragging) return;
        const minLeft = -(cardW - 80);
        const maxLeft = window.innerWidth - 80;
        const minTop = 38;
        const maxTop = window.innerHeight - 32;
        let left = startLeft + (ev.clientX - startX);
        let top = startTop + (ev.clientY - startY);
        left = Math.max(minLeft, Math.min(maxLeft, left));
        top = Math.max(minTop, Math.min(maxTop, top));
        card.style.left = left + 'px';
        card.style.top = top + 'px';
        app.draggedPos = { left, top };
      }
      function onUp(ev){
        dragging = false;
        header.releasePointerCapture(ev.pointerId);
        document.body.style.userSelect = '';
        header.removeEventListener('pointermove', onMove);
        header.removeEventListener('pointerup', onUp);
        header.removeEventListener('pointercancel', onUp);
      }
      header.addEventListener('pointermove', onMove);
      header.addEventListener('pointerup', onUp);
      header.addEventListener('pointercancel', onUp);
    });
  }
  APP_CONFIG.forEach(cfg => {
    const modal = document.getElementById(cfg.modalId);
    if (!modal) return;
    const usesClass = CLASS_BASED.has(cfg.id);
    const app = { ...cfg, modal, usesClass, state: 'closed', maximized:false, draggedPos:null, suppressObserver:false };
    app.controls = buildControls(app);
    if (app.controls) {
      app.controls.minBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); minimizeApp(app); });
      app.controls.maxBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleMaximize(app); });
      enableDragging(app);
    }
    apps.push(app);
    modal.addEventListener('mousedown', () => {
      if (app.state === 'open') app.modal.style.zIndex = ++zCounter;
    });
    const observer = new MutationObserver(() => {
      if (app.suppressObserver) return;
      const visible = isVisible(modal);
      if (visible) {
        if (app.state !== 'open') {
          app.modal.style.zIndex = ++zCounter;
          setBackdropMode(app);
          setState(app, 'open');
        }
      } else {
        if (app.state === 'open') {
          setState(app, 'closed');
        }
        if (app.state === 'closed' && (app.maximized || app.draggedPos)) {
          const card = app.modal.firstElementChild;
          if (card) card.classList.remove('wm-maximized');
          app.maximized = false;
          app.modal.style.background = '';
          app.modal.style.backdropFilter = '';
          app.modal.style.pointerEvents = '';
          if (card) card.style.pointerEvents = '';
          resetWindowPosition(app);
        }
      }
    });
    observer.observe(modal, { attributes:true, attributeFilter:['style','class'] });
  });
  window.desktopWM = { minimizeApp, restoreApp, closeApp, toggleMaximize, apps };
})();
