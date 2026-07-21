(function(){
  // ---- Menubar dropdowns ----
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

  // ---- Cursor Style Picker (file-based, truly animated cursor themes) ----
  // Each theme is a folder under ./cursors containing Arrow.gif (normal/pointer)
  // and Working.gif (hand cursor used on interactive elements).
  //
  // NOTE: browsers only render the FIRST FRAME of an animated GIF when it's
  // used via the CSS `cursor` property (Firefox is the lone exception). To get
  // real animation everywhere, we hide the native cursor and follow the mouse
  // with an <img> element instead, which animates normally like any other GIF.
  const CURSOR_THEMES = ['Anime', 'Cute', 'MacOS', 'Minecraft', 'Minecraft2', 'Normal Black', 'Normal White -soft', 'RGB'];
  const CURSOR_BASE_PATH = 'cursors';
  const CURSOR_INTERACTIVE_SELECTOR = 'a, button, .di, .wp-swatch, .mp-btn, .node, .folder, .photo-node .thumb, .book, .poster-card, .snake-expand, .sm-close, .restore-btn';

  function cursorFilePath(theme, file) {
    return `${CURSOR_BASE_PATH}/${theme}/${file}`;
  }

  const cursorStyleTag = document.createElement('style');
  cursorStyleTag.id = 'custom-cursor-style';
  document.head.appendChild(cursorStyleTag);

  // Floating element that stands in for the real cursor so the GIF can animate.
  const cursorFollower = document.createElement('div');
  cursorFollower.id = 'cursor-follower';
  cursorFollower.style.cssText = 'position:fixed; top:0; left:0; display:none; pointer-events:none; z-index:2147483647;';
  const cursorFollowerImg = document.createElement('img');
  cursorFollowerImg.style.cssText = 'display:block; user-select:none; -webkit-user-drag:none;';
  cursorFollowerImg.draggable = false;
  cursorFollower.appendChild(cursorFollowerImg);
  document.body.appendChild(cursorFollower);

  let activeCursorTheme = null;
  let cursorFollowerFrame = null; // 'arrow' | 'hand'

  function setCursorFollowerFrame(frame) {
    if (!activeCursorTheme || cursorFollowerFrame === frame) return;
    cursorFollowerFrame = frame;
    cursorFollowerImg.src = cursorFilePath(activeCursorTheme, frame === 'hand' ? 'Working.gif' : 'Arrow.gif');
  }

  function onCursorFollowerMove(e) {
    if (!activeCursorTheme) return;
    cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    const overInteractive = !!(e.target && e.target.closest && e.target.closest(CURSOR_INTERACTIVE_SELECTOR));
    setCursorFollowerFrame(overInteractive ? 'hand' : 'arrow');
  }
  document.addEventListener('mousemove', onCursorFollowerMove);
  document.addEventListener('mouseleave', () => { cursorFollower.style.display = 'none'; });
  document.addEventListener('mouseenter', () => { if (activeCursorTheme) cursorFollower.style.display = 'block'; });

  function applyCursorTheme(theme) {
    if (!CURSOR_THEMES.includes(theme)) { resetCursorStyle(); return; }
    activeCursorTheme = theme;
    cursorFollowerFrame = null;
    setCursorFollowerFrame('arrow');
    cursorFollower.style.display = 'block';
    // Hide the native system cursor everywhere so only the animated follower shows.
    cursorStyleTag.textContent = `* { cursor: none !important; }`;
    const label = document.getElementById('cursorStyleCurrent');
    if (label) label.textContent = theme;
    try { localStorage.setItem('cursorThemeV1', theme); } catch(_){}
    updateActiveOption(theme);
  }

  function resetCursorStyle() {
    activeCursorTheme = null;
    cursorFollowerFrame = null;
    cursorFollower.style.display = 'none';
    cursorStyleTag.textContent = '';
    try { localStorage.removeItem('cursorThemeV1'); } catch(_){}
    const label = document.getElementById('cursorStyleCurrent');
    if (label) label.textContent = 'Default';
    updateActiveOption(null);
  }

  // Load saved cursor theme on start
  try {
    const saved = localStorage.getItem('cursorThemeV1');
    if (saved && CURSOR_THEMES.includes(saved)) applyCursorTheme(saved);
  } catch(_){}

  window.__resetCursor = resetCursorStyle;

  // ---- Cursor Picker dialog ----
  const cursorPicker = document.getElementById('cursor-picker');
  const openCursorPicker = () => { cursorPicker.classList.add('show'); };
  const closeCursorPicker = () => cursorPicker.classList.remove('show');
  document.getElementById('cursorPickerClose').addEventListener('click', closeCursorPicker);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCursorPicker(); });

  function updateActiveOption(theme) {
    cursorPicker.querySelectorAll('.cursor-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cursor === theme);
    });
  }

  // Build one option per theme folder, previewing the theme's Arrow.gif
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

  // ---- Wire menu actions ----
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
  const time = d.toLocaleTimeString('en-US', { timeZone:'UTC', hour:'numeric', minute:'2-digit', second:'2-digit', hour12:false });
  clockEl.textContent = time + ' UTC';
  dateEl.textContent = d.toLocaleDateString('en-US', { timeZone:'UTC', month:'short', day:'numeric' });
}
tick(); setInterval(tick, 1000);

/* ============ Soft interaction sounds (unlocked by user gestures) ============ */
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
  // gentle, sine-based bell with soft attack/decay
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
  // soft filtered-noise swoosh — used for trash / paper-crumple feel
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
  // Unlock AudioContext on first user gesture (iframe/browser policy)
  let unlocked = false;
  const unlock = async () => {
    if (unlocked) return;
    try {
      ensure();
      if (ctx.state === 'suspended') await ctx.resume();
      // silent buffer to satisfy iframe autoplay policy
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

/* ============ THEMES — same grid/lines/nodes always; this data drives what's allowed to change ============ */
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

/* ============ Site background ============ */
/* Each theme has its own static wallpaper image (t.image, set per-theme
   above: images/Background.png, images/2Background.png, images/3Background.png,
   images/4Background.png for Sky/Forest/Desert/Night respectively).
   Switching themes crossfades smoothly between two stacked layers so there's
   never an abrupt cut.

   "Dynamic Wallpaper" (Edit menu toggle) swaps in a single looping video,
   images/Background.mp4, that plays continuously behind a crossfading
   theme-tinted scrim — so toggling it, or changing themes while it's on,
   both stay smooth. */
const SITE_BG_VIDEO = 'images/Background.mp4';
const DYN_WALLPAPER_KEY = 'l5e_dynamic_wallpaper';
let dynamicWallpaper = localStorage.getItem(DYN_WALLPAPER_KEY) === '1';

// Warm the browser cache for every theme's wallpaper right away so switching
// themes (or first paint) never has to wait on a network fetch.
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

// Two stacked layers so a background change fades the new one in over the
// old one instead of popping instantly.
let __bgLayerFlag = false;
function crossfadeStageLayer(backgroundCss) {
  const a = document.getElementById('bgLayerA');
  const b = document.getElementById('bgLayerB');
  if (!a || !b) return;
  const nextEl = __bgLayerFlag ? a : b;
  const prevEl = __bgLayerFlag ? b : a;
  nextEl.style.background = backgroundCss;
  // Force a reflow so the opacity change is picked up as a transition, not
  // an instant jump, then flip visibility.
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
    // Base fallback color/gradient in case the wallpaper image is missing.
    stage.style.background = t.bg || '';
    if (dynamicWallpaper) {
      if (bgVideo) {
        if (bgVideo.getAttribute('src') !== SITE_BG_VIDEO) bgVideo.setAttribute('src', SITE_BG_VIDEO);
        bgVideo.classList.add('show');
        bgVideo.play().catch(() => {});
      }
      // Only the theme-tinted scrim crossfades; the video keeps playing underneath.
      crossfadeStageLayer(SCRIM[key] || '');
    } else {
      if (bgVideo) { bgVideo.classList.remove('show'); bgVideo.pause(); }
      crossfadeStageLayer(`${SCRIM[key] || ''}, url("${t.image}") center center / cover no-repeat`);
    }
  }
  if (swatch) swatch.style.background = t.swatch;
  if (label) label.textContent = t.label;
  if (coord) coord.innerHTML = t.coord || '';
  // callouts removed
  if (window.__setMusicTheme) window.__setMusicTheme(key);
  window.requestAnimationFrame(() => { fitLayer(); drawLines(); });
}
applyTheme(order[0]);

/* Dynamic Wallpaper toggle wiring (Edit menu) */
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

/* ============ Music (Web Audio sequenced songs — chords, bass, arps, melody, drums) ============ */
/* Each theme is a proper looping song with distinct tempo, key, mood.
   Sky = upbeat & cute · Forest = dreamy fog · Desert = warm groove · Night = slow moonlit. */
const CHORD_INTERVALS = {
  maj:[0,4,7,12], min:[0,3,7,12], maj7:[0,4,7,11], min7:[0,3,7,10],
  maj9:[0,4,7,14], min9:[0,3,7,14], sus2:[0,2,7,12], dom7:[0,4,7,10]
};
const MUSIC = {
  sky: { // soft & sunny — Cmaj7 → Am7 → Fmaj7 → G, gentle piano-like sine, no drums
    track:'Morning Light', artist:'Sky',
    bpm:82, padWave:'sine', bassWave:'sine', arpWave:'sine', leadWave:'sine',
    padGain:0.09, bassGain:0.09, arpGain:0.06, leadGain:0.07, drums:false, cutoff:2000,
    chords:[{r:60,t:'maj7'},{r:57,t:'min7'},{r:65,t:'maj7'},{r:67,t:'maj'}],
    // sparse, floating arp — rests between notes
    arp:[0,null,7,null,12,null,7,null, null,14,null,7,null,10,null,7],
    melody:[[0,76],[8,79],[14,81],[22,79],[28,76],[36,74],[44,77],[52,79],[60,72]]
  },
  forest: { // dreamy foggy — Am9 → Dm9 → Fmaj9 → Em7 slow pad + bell melody
    track:'Fern Mist', artist:'Forest',
    bpm:64, padWave:'sine', bassWave:'sine', arpWave:'sine', leadWave:'sine',
    padGain:0.10, bassGain:0.11, arpGain:0.05, leadGain:0.07, drums:false, cutoff:1400,
    chords:[{r:57,t:'min9'},{r:62,t:'min9'},{r:65,t:'maj9'},{r:64,t:'min7'}],
    arp:[0,7,null,14,null,10,null,7, null,14,null,17,null,10,null,7],
    melody:[[0,69],[8,76],[14,79],[20,77],[28,74],[36,72],[44,76],[52,79],[60,72]]
  },
  desert: { // warm & sunlit — Dm9 → Bbmaj7 → Fmaj7 → Am7, soft sine, no drums
    track:'Amber Hour', artist:'Desert',
    bpm:72, padWave:'sine', bassWave:'sine', arpWave:'sine', leadWave:'triangle',
    padGain:0.08, bassGain:0.09, arpGain:0.05, leadGain:0.06, drums:false, cutoff:1500,
    chords:[{r:62,t:'min9'},{r:58,t:'maj7'},{r:65,t:'maj7'},{r:57,t:'min7'}],
    arp:[0,null,7,null,12,null,10,null, null,7,null,14,null,10,null,7],
    melody:[[0,74],[10,77],[20,79],[30,77],[40,74],[50,72],[60,70]]
  },
  night: { // slow moonlit — Am7 → Fmaj7 → G → Em7, deep, sparse
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
    // simple feedback-delay "reverb" via ConvolverNode alternative — use a delay chain
    verbSend = ctx.createGain(); verbSend.gain.value = 0.22;
    const d1 = ctx.createDelay(2.0); d1.delayTime.value = 0.19;
    const d2 = ctx.createDelay(2.0); d2.delayTime.value = 0.33;
    const fb = ctx.createGain(); fb.gain.value = 0.36;
    const verbLp = ctx.createBiquadFilter(); verbLp.type='lowpass'; verbLp.frequency.value=2600;
    verbSend.connect(d1); d1.connect(verbLp); verbLp.connect(fb); fb.connect(d2); d2.connect(fb); d2.connect(master);
    filter.connect(master); filter.connect(verbSend);
    master.connect(ctx.destination);
  }

  // one-shot voice
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
  // noise-based drum
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

    // Pad on chord change (step 0 of each bar) — sustained across the bar
    if (step % 16 === 0){
      const barDur = sixteenth * 16;
      chordIntervals.forEach(iv => {
        playNote(chord.r + iv, barDur * 0.95, m.padWave, m.padGain, when, {pad:true});
      });
    }
    // Bass on beat 1 and 3 of the bar (steps 0 and 8)
    if (step % 8 === 0){
      const bassNote = chord.r - 12 + (step % 16 === 0 ? 0 : 7);
      playNote(bassNote, sixteenth * 6, m.bassWave, m.bassGain, when);
    }
    // Arpeggio
    const arpNote = m.arp[step % 16];
    if (arpNote !== null && arpNote !== undefined){
      playNote(chord.r + arpNote + 12, sixteenth * 1.4, m.arpWave, m.arpGain, when);
    }
    // Melody
    m.melody.forEach(([s, n]) => {
      if (s === step % 64) playNote(n, sixteenth * 3.2, m.leadWave, m.leadGain, when);
    });
    // Drums
    if (m.drums){
      if (step % 8 === 0) playKick(when, 0.42);      // kick on 1 and 3
      if (step % 4 === 2) playHat(when, 0.06);        // hat on off-beats
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

/* Wallpaper picker wiring */
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

/* ============ grid/line system — identical every time, never touched by theme ============ */
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

// deterministic seeded jitter so curves stay stable across redraws
function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function curvePath(x1,y1,x2,y2,seed) {
  const mx = (x1+x2)/2, my = (y1+y2)/2;
  const dx = x2-x1, dy = y2-y1;
  const len = Math.hypot(dx,dy) || 1;
  // perpendicular unit vector
  const px = -dy/len, py = dx/len;
  // two control points offset from midline for S-curve chaos
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
  // connector lines removed per design
}
drawLines();

/* redraw lines on theme change so night stroke colors apply */
const _themeObserver = new MutationObserver(drawLines);
_themeObserver.observe(document.body, { attributes:true, attributeFilter:['data-theme'] });

/* responsive: scale the fixed 2200x1300 layer to fit the viewport */
function fitLayer() {
  const wrap = document.getElementById('layer-wrap');
  const layer = document.getElementById('layer');
  if (!wrap || !layer) return;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  if (isMobile) {
    // Mobile uses a native CSS grid; don't scale or translate the layer.
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
  // Left-align the canvas (small fixed margin) instead of horizontally
  // centering it, so left-side icons sit close to the real screen edge
  // rather than floating in the middle of unused letterbox space.
  layer.style.left = (pad / 2) + 'px';
  layer.style.top = '50%';
  layer.style.transformOrigin = 'left center';
  layer.style.transform = `translateY(-50%) scale(${s})`;
  window.requestAnimationFrame(drawLines);
}
fitLayer();
window.addEventListener('resize', fitLayer);

// On mobile, auto-tidy nodes into a grid that fits the visible viewport
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
  // add selection ring element
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

/* ============ recycle bin: drag nodes in, restore from modal ============ */
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

/* ============ drag & drop nodes; lines follow ============ */
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
        // suppress the click-select that would otherwise fire
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

/* ============ Right-click context menu: Clean Up / Sort ============ */
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
  // Store original positions once nodes are laid out
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
      // Mobile is CSS-grid based, so sorting/cleanup should never push icons
      // outside the viewport. We only change grid order and let the scroller
      // reveal every item naturally.
      list.forEach((n, i) => {
        n.style.transition = '';
        n.style.order = sortByName ? i : '';
        n.style.setProperty('--rot','0deg');
      });
      document.getElementById('layer-wrap')?.scrollTo({ top:0, behavior:'smooth' });
      requestAnimationFrame(()=>{ if (typeof drawLines==='function') drawLines(); });
      return;
    }
    // Compute the visible layer rect from actual DOM geometry so cleanup stays out from under fixed UI.
    const wrap = document.getElementById('layer-wrap');
    const matrix = new DOMMatrixReadOnly(getComputedStyle(layer).transform);
    const s = matrix.a || 1;
    const wr = wrap?.getBoundingClientRect();
    const lr = layer.getBoundingClientRect();
    const dockSafe = isMobile ? 146 : 40;
    const edge = isMobile ? 18 : 40;
    // Reserve space for right-side widget rail and left-side wallpaper picker
    // so cleaned-up icons never line up behind them on desktop / iPad.
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
    // Start with preferred cell size; shrink so ALL nodes fit inside the visible band.
    let colW = isMobile ? 230 : 190;
    let rowH = isMobile ? 240 : 200;
    let cols = Math.max(1, Math.floor(rectW / colW));
    let rows = Math.max(1, Math.ceil(list.length / cols));
    // If rows overflow the visible height, add columns / shrink rows until they fit.
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
  // Expose so we can auto-tidy on mobile
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
  stage.addEventListener('contextmenu', e => {
    // Skip when right-clicking inside toolbar/widgets/dock
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

/* ============ Preview modal (macOS Preview-style) ============ */
(function initPreview(){
  // Append file extensions to labels so files vs. apps are visually differentiated.
  // Photos become <name>.jpg, resume becomes resume.pdf. Runs once on load.
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
          <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:22px;border-radius:6px;background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);font-size:11px;color:#555;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.04);">−</span>
          <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:22px;border-radius:6px;background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);font-size:11px;color:#555;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.04);">+</span>
          <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:22px;border-radius:6px;background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);color:#555;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          </span>
        </div>
      </div>
      <div id="pvScroll" style="overflow-y:auto;flex:1 1 auto;min-height:0;">
      <div style="padding:24px 32px 10px;display:flex;align-items:flex-start;justify-content:center;">
        <img id="pvImg" alt="" style="max-width:100%;max-height:44vh;object-fit:contain;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,0.18);">
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
  const close = () => { modal.style.display = 'none'; };
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
      modal.style.display = 'flex';
    });
  });

  // Adjust modal size per node type (resume → taller/wider so it isn't cut off)
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

/* ============ Robust external links (works inside sandboxed iframes) ============ */
document.querySelectorAll('a.social, a[href^="http"]').forEach(a => {
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.addEventListener('click', e => {
    const url = a.getAttribute('href');
    if (!url) return;
    e.preventDefault();
    const social = a.classList.contains('social');
    if (social) {
      // Social sites block iframe embedding; force a top-level user navigation first.
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

/* ============ Lock screen — click to unlock; re-lock from brand logo ============ */
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
  /* Live UTC clock on the lock screen (mobile / tablet only) */
  (function tickLockClock(){
    const timeEl = document.getElementById('lockTime');
    const dateEl = document.getElementById('lockDate');
    if (!timeEl || !dateEl) return;
    const tzOpts = { timeZone: 'UTC' };
    function update(){
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', { ...tzOpts, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false }) + ' UTC';
      dateEl.textContent = now.toLocaleDateString('en-US', { ...tzOpts, weekday: 'short', month: 'short', day: 'numeric' });
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
    // force reflow so the transition replays
    void loader.offsetWidth;
    loader.classList.remove('hide');
  }
  loader.addEventListener('click', unlock);
  loader.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); unlock(); } });
  /* Slide-to-unlock (mobile / touch) */
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
      // Prevent the loader's click handler from firing on tap
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
    // Swallow clicks on the slider so tapping the track doesn't trigger loader click-to-unlock
    slider.addEventListener('click', (e) => e.stopPropagation());
  }
  if (document.readyState === 'complete') setTimeout(markReady, 350);
  else window.addEventListener('load', () => setTimeout(markReady, 300));
  // expose relock; the brand logo binding lives below
  window.__relockDesktop = relock;
  // Wire the top-bar brand → re-lock (desktop returns to lock screen)
  document.addEventListener('DOMContentLoaded', () => {
    const lockBtn = document.querySelector('#menubar .brand-menu .brand-lock');
    if (lockBtn) {
      lockBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); relock(); });
    }
  });
  // Also try immediately in case DOMContentLoaded already fired
  const lockBtn = document.querySelector('#menubar .brand-menu .brand-lock');
  if (lockBtn) {
    lockBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); relock(); });
  }
})();

/* ============ About modal (Shadow menu) ============ */
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

/* ============ Stickies (draw a sticky note) ============ */
(function initStickies(){
  const modal = document.getElementById('stickiesModal');
  if (!modal) return;
  const canvas = document.getElementById('stCanvas');
  const ctx = canvas.getContext('2d');
  let color = '#3a2f10';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 4;
  let drawing = false, lx = 0, ly = 0;
  let hasStrokes = false;
  const pt = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x:(e.clientX - r.left) * (canvas.width / r.width), y:(e.clientY - r.top) * (canvas.height / r.height) };
  };
  canvas.addEventListener('pointerdown', (e) => {
    drawing = true; canvas.setPointerCapture(e.pointerId);
    const p = pt(e); lx = p.x; ly = p.y;
    ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx+0.1, ly+0.1); ctx.stroke();
    hasStrokes = true;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const p = pt(e);
    ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(p.x, p.y); ctx.stroke();
    lx = p.x; ly = p.y;
  });
  const stop = () => { drawing = false; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
  canvas.addEventListener('pointerleave', stop);
  document.querySelectorAll('.st-color').forEach(b => {
    b.addEventListener('click', () => { color = b.dataset.c; });
  });
  document.getElementById('stClear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokes = false;
  });

  // ---- Shared wall (Lovable Cloud) ----
  const SUPA_URL = 'https://kuchgwvwhjmrqaebrpej.supabase.co';
  const SUPA_KEY = 'sb_publishable_ehqNa8MYfg0HmnOQUY0xxQ_nWs4A6pz';
  const REST = `${SUPA_URL}/rest/v1/stickies`;
  const supaHeaders = { apikey: SUPA_KEY, 'content-type': 'application/json' };

  const params = new URLSearchParams(location.search);
  const adminToken = params.get('admin') || '';
  const isAdmin = adminToken.length > 0;

  const drawPane = document.getElementById('stDrawPane');
  const wallPane = document.getElementById('stWallPane');
  const drawTools = document.getElementById('stDrawTools');
  const status = document.getElementById('stPostStatus');
  const grid = document.getElementById('stWallGrid');
  const meta = document.getElementById('stWallMeta');
  const tabs = document.querySelectorAll('.st-tab');

  function setStatus(msg, tone) {
    status.textContent = msg;
    status.style.color = tone === 'error' ? '#b23a3a' : tone === 'ok' ? '#3a6f2a' : '#8a7a3a';
  }

  function setTab(name) {
    tabs.forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle('active', active);
      t.style.background = active ? 'rgba(0,0,0,0.12)' : 'transparent';
      t.style.color = active ? '#3a2f10' : '#5b4d10';
    });
    if (name === 'draw') {
      drawPane.style.display = 'flex';
      wallPane.style.display = 'none';
      drawTools.style.display = 'flex';
    } else {
      drawPane.style.display = 'none';
      wallPane.style.display = 'flex';
      drawTools.style.display = 'none';
      loadWall();
    }
  }
  tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function renderCard(s) {
    const name = escapeHtml(s.name?.trim()) || 'anon';
    const message = escapeHtml(s.message?.trim());
    const hideBtn = isAdmin
      ? `<button type="button" class="st-hide" data-id="${s.id}" style="position:absolute;top:6px;right:6px;padding:2px 8px;border-radius:6px;border:0;background:rgba(20,20,20,0.85);color:#fff;font:600 10px inherit;cursor:pointer;letter-spacing:0.02em;">Hide</button>`
      : '';
    return `
      <div style="position:relative;background:#fff8a8;border-radius:6px;padding:8px;box-shadow:0 3px 8px rgba(0,0,0,0.12),0 0 0 1px rgba(0,0,0,0.06);transform:rotate(${(Math.random()*4-2).toFixed(2)}deg);">
        ${hideBtn}
        <img src="${s.image_data}" alt="Sticky by ${name}" style="display:block;width:100%;height:110px;object-fit:contain;background:#fff8a8;border-radius:3px;">
        <div style="margin-top:6px;font:700 11px inherit;color:#3a2f10;">${name}</div>
        ${message ? `<div style="font-size:11px;color:#6b5a1e;line-height:1.35;margin-top:2px;word-wrap:break-word;">${message}</div>` : ''}
      </div>
    `;
  }

  async function loadWall() {
    meta.querySelector('span').textContent = 'Loading the wall…';
    try {
      const res = await fetch(`${REST}?select=id,name,message,image_data,created_at&order=created_at.desc&limit=60`, {
        headers: supaHeaders,
      });
      const rows = await res.json();
      if (!Array.isArray(rows)) throw new Error('bad');
      if (rows.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px 12px;color:#8a7a3a;font-size:12px;">No stickies yet — be the first to say hi 👋</div>';
      } else {
        grid.innerHTML = rows.map(renderCard).join('');
      }
      meta.querySelector('span').textContent = `${rows.length} sticky${rows.length === 1 ? '' : 's'} · a little wall of hellos.`;
      if (isAdmin) {
        grid.querySelectorAll('.st-hide').forEach(b => b.addEventListener('click', () => hideSticky(b.dataset.id, b)));
      }
    } catch (e) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px 12px;color:#b23a3a;font-size:12px;">Couldn\'t load the wall. Try again.</div>';
      meta.querySelector('span').textContent = 'A little wall of hellos from everyone who\'s passed through.';
    }
  }

  async function hideSticky(id, btn) {
    if (!confirm('Hide this sticky from the wall?')) return;
    btn.disabled = true; btn.textContent = 'Hiding…';
    try {
      const res = await fetch('/api/public/stickies/hide', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, token: adminToken, hidden: true }),
      });
      if (!res.ok) throw new Error('failed');
      loadWall();
    } catch {
      btn.disabled = false; btn.textContent = 'Hide';
      alert('Could not hide that sticky.');
    }
  }

  document.getElementById('stRefresh').addEventListener('click', loadWall);

  // ---- Post sticky ----
  document.getElementById('stPost').addEventListener('click', async () => {
    if (!hasStrokes) { setStatus('Draw something first ✏️', 'error'); return; }
    const nameEl = document.getElementById('stName');
    const msgEl = document.getElementById('stMessage');
    const name = nameEl.value.trim().slice(0, 40) || null;
    const message = msgEl.value.trim().slice(0, 200) || null;

    // downscale before upload
    const out = document.createElement('canvas');
    out.width = 560; out.height = 410;
    const octx = out.getContext('2d');
    octx.fillStyle = '#fff8a8'; octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(canvas, 0, 0, out.width, out.height);
    const image_data = out.toDataURL('image/jpeg', 0.82);
    if (image_data.length > 380000) { setStatus('Sticky is a bit big — try a simpler drawing.', 'error'); return; }

    setStatus('Posting…');
    try {
      const res = await fetch(REST, {
        method: 'POST',
        headers: { ...supaHeaders, Prefer: 'return=minimal' },
        body: JSON.stringify({ name, message, image_data }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('Posted! Thanks for saying hi 👋', 'ok');
      nameEl.value = ''; msgEl.value = '';
      ctx.clearRect(0, 0, canvas.width, canvas.height); hasStrokes = false;
      setTimeout(() => setTab('wall'), 500);
    } catch (e) {
      console.error(e);
      setStatus('Couldn\'t post. Try again in a moment.', 'error');
    }
  });

  const open = () => { modal.style.display = 'flex'; window.desktopSfx?.open(); };
  const close = () => { modal.style.display = 'none'; };
  document.getElementById('stickiesClose').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  const node = document.getElementById('n-stickies');
  if (node) node.addEventListener('dblclick', e => { e.stopPropagation(); open(); });
})();

/* ============ Programma 900 synth ============ */
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
  const active = new Map(); // key -> {osc, gain}

  function ensureAudio(){
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = params.volume;
    filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
    filter.frequency.value = params.cutoff; filter.Q.value = params.resonance;

    // LFO -> filter freq
    lfo = ctx.createOscillator(); lfo.frequency.value = params.lfoRate;
    lfoGain = ctx.createGain(); lfoGain.gain.value = params.lfoDepth;
    lfo.connect(lfoGain).connect(filter.frequency); lfo.start();

    // Delay
    delay = ctx.createDelay(1.2); delay.delayTime.value = params.delayTime;
    delayFb = ctx.createGain(); delayFb.gain.value = params.delayFb;
    delay.connect(delayFb).connect(delay);

    // Convolution reverb (algorithmic impulse)
    convolver = ctx.createConvolver();
    convolver.buffer = makeIR(ctx, 2.2, 2.4);
    dryGain = ctx.createGain(); dryGain.gain.value = 1 - params.reverb;
    wetGain = ctx.createGain(); wetGain.gain.value = params.reverb;

    // Routing: filter -> [dry -> master] + [delay -> master] + [convolver -> wet -> master]
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

  // ===== Build keyboard (2 octaves) =====
  const WHITE = ['C','D','E','F','G','A','B'];
  const BLACK = { 0:'C#', 1:'D#', 3:'F#', 4:'G#', 5:'A#' }; // index in WHITE
  const OCTAVES = 2;
  const totalWhites = WHITE.length * OCTAVES;
  const keyMap = {}; // qwerty -> midi offset from base
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
    // black keys overlay
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

  // ===== Knobs (drag vertically to change) =====
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
    // detune / wave / envelope applied to new notes
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

  // Envelope sliders
  document.querySelectorAll('#synthModal .p900-slider').forEach(sl => {
    sl.addEventListener('input', () => {
      params[sl.dataset.param] = parseFloat(sl.value);
    });
  });

  // Wave selectors
  document.querySelectorAll('#synthModal .p900-wave').forEach(w => {
    w.addEventListener('click', () => {
      document.querySelectorAll('#synthModal .p900-wave').forEach(x => x.classList.remove('selected'));
      w.classList.add('selected');
      params.wave = w.dataset.wave;
    });
  });

  // Keyboard input
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

  // ---- Memory presets (visual + a light param sweep) ----
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
      // Select wave button
      document.querySelectorAll('#synthModal .p900-wave').forEach(w => {
        w.classList.toggle('selected', w.dataset.wave === cfg.wave);
      });
      params.wave = cfg.wave;
      applyParam('cutoff', cfg.cutoff);
      applyParam('resonance', cfg.reso);
      applyParam('volume', cfg.vol);
    });
  });

  // ---- 8-step sequencer (visual/audio) ----
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

  // ---- Trace monitor scope ----
  const scopeCanvas = document.getElementById('p900Scope');
  if (scopeCanvas) {
    const sctx = scopeCanvas.getContext('2d');
    const SW = scopeCanvas.width, SH = scopeCanvas.height;
    let t0 = 0;
    function drawScope(){
      if (modal.style.display !== 'flex') { requestAnimationFrame(drawScope); return; }
      t0 += 0.06;
      sctx.clearRect(0,0,SW,SH);
      // grid
      sctx.strokeStyle = 'rgba(127, 216, 143, 0.08)'; sctx.lineWidth = 1;
      for (let x=0; x<=SW; x+=SW/8) { sctx.beginPath(); sctx.moveTo(x,0); sctx.lineTo(x,SH); sctx.stroke(); }
      for (let y=0; y<=SH; y+=SH/4) { sctx.beginPath(); sctx.moveTo(0,y); sctx.lineTo(SW,y); sctx.stroke(); }
      // waveform
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
        // gentle wobble
        y += Math.sin(x*0.11 + t0*0.6) * 1.4;
        if (x === 0) sctx.moveTo(x, SH/2 + y); else sctx.lineTo(x, SH/2 + y);
      }
      sctx.stroke();
      sctx.shadowBlur = 0;
      // VU meter
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
    // mobile: single tap opens (matches other collection nodes on touch)
    let lastTap = 0;
    openIcon.addEventListener('click', e => {
      if (window.matchMedia('(hover: none)').matches) { e.stopPropagation(); open(); }
    });
  }
})();

/* ============ Artboard — Marbling Atelier ============ */
(function initArtboard(){
  const modal = document.getElementById('artboardModal');
  if (!modal) return;
  const openIcon = document.getElementById('n-artboard');
  const closeBtn = document.getElementById('artboardClose');
  const canvas = document.getElementById('mbCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const captionEl = document.getElementById('mbCaption');
  const hintEl = document.getElementById('mbToolHint');
  const sizeEl = document.getElementById('mbSize');
  const sizeValEl = document.getElementById('mbSizeVal');

  const paperFill = '#f6f0dc';
  function fillPaper(){
    // slightly warm paper with subtle noise
    ctx.fillStyle = paperFill;
    ctx.fillRect(0,0,W,H);
    // very subtle grain
    const img = ctx.getImageData(0,0,W,H);
    for (let i=0; i<img.data.length; i+=4) {
      const n = (Math.random()-0.5) * 6;
      img.data[i]   = Math.max(0,Math.min(255, img.data[i]+n));
      img.data[i+1] = Math.max(0,Math.min(255, img.data[i+1]+n));
      img.data[i+2] = Math.max(0,Math.min(255, img.data[i+2]+n));
    }
    ctx.putImageData(img, 0, 0);
  }

  // History (simple snapshot stack, capped)
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
    });
  });

  sizeEl?.addEventListener('input', () => {
    dropSize = parseInt(sizeEl.value, 10);
    if (sizeValEl) sizeValEl.textContent = dropSize;
  });

  // --- Drawing helpers ---
  function withAlpha(hex, a){
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function bloom(x, y, radius, color){
    // Layered soft radial bloom for water-color feel
    const passes = 5;
    for (let i = 0; i < passes; i++) {
      const r = radius * (0.5 + i*0.18) * (0.85 + Math.random()*0.3);
      const alpha = i === 0 ? 0.55 : 0.14 - i*0.02;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, withAlpha(color, alpha));
      g.addColorStop(0.6, withAlpha(color, alpha*0.5));
      g.addColorStop(1, withAlpha(color, 0));
      ctx.fillStyle = g;
      // slight organic offset
      const ox = (Math.random()-0.5) * radius*0.3;
      const oy = (Math.random()-0.5) * radius*0.3;
      ctx.beginPath();
      // wobbly polygon
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
  // Smudge/smear: displaces existing pigment along the stroke direction
  // by clipping to a circle at the destination and drawing the canvas
  // shifted from the source. Repeated in small sub-steps so the ink
  // "drags" continuously rather than teleporting.
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
      // draw the canvas onto itself, offset so pixels at (sx,sy) land at (tx,ty)
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
    // sample and blur locally by averaging pixels with paper
    const r = Math.max(20, dropSize * 0.9);
    const x0 = Math.max(0, Math.floor(x - r));
    const y0 = Math.max(0, Math.floor(y - r));
    const w = Math.min(W - x0, Math.ceil(r*2));
    const h = Math.min(H - y0, Math.ceil(r*2));
    if (w <= 0 || h <= 0) return;
    const img = ctx.getImageData(x0, y0, w, h);
    const d = img.data;
    // simple box blur pass with paper mix
    const cx = x - x0, cy = y - y0;
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const dx = xx - cx, dy = yy - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > r) continue;
        const t = 1 - dist / r; // stronger at center
        const i = (yy*w + xx) * 4;
        // pull toward paper color slightly
        d[i]   = d[i]   + (246 - d[i])   * 0.05 * t;
        d[i+1] = d[i+1] + (240 - d[i+1]) * 0.05 * t;
        d[i+2] = d[i+2] + (220 - d[i+2]) * 0.05 * t;
      }
    }
    ctx.putImageData(img, x0, y0);
  }

  // --- Pointer handling ---
  let drawing = false;
  let last = null;
  function toCanvasXY(e){
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (W / r.width);
    const y = (e.clientY - r.top)  * (H / r.height);
    return { x, y };
  }
  canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    snapshot();
    drawing = true;
    last = toCanvasXY(e);
    if (currentTool === 'dropper') {
      bloom(last.x, last.y, dropSize * 0.6, currentColor);
    } else if (currentTool === 'breath') {
      breathAt(last.x, last.y);
    }
  });
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
  }
  canvas.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointercancel', endDraw);
  canvas.addEventListener('pointerleave', endDraw);

  // Toolbar buttons
  document.getElementById('mbClear')?.addEventListener('click', () => { snapshot(); fillPaper(); if (captionEl) captionEl.textContent = 'The water is clear and still.'; });
  document.getElementById('mbUndo')?.addEventListener('click', restoreLast);
  document.getElementById('mbSave')?.addEventListener('click', () => { snapshot(); });

  // Make print — snapshot into an impression slot
  const impStrip = document.getElementById('mbImpressions');
  document.getElementById('mbMakePrint')?.addEventListener('click', () => {
    if (!impStrip) return;
    const url = canvas.toDataURL('image/png');
    const slot = document.createElement('div');
    slot.className = 'mb-impression-slot';
    slot.innerHTML = `<img src="${url}" alt="print">`;
    // keep 5 slots max
    impStrip.appendChild(slot);
    while (impStrip.children.length > 5) impStrip.removeChild(impStrip.firstElementChild);
  });

  // Keyboard shortcuts
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

  // Initial paper
  fillPaper();
})();

/* ============ This PC (device info, read live from the visitor's browser) ============ */
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

/* ============ My IP (public network info, via a free IP lookup API) ============ */
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

/* ============ Bricks game (monochrome brick-breaker — widget + fullscreen modal) ============ */
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
      const angle = (Math.random()*0.6 - 0.3) - Math.PI/2; // upward
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
      // dashed baseline
      ctx.strokeStyle = dim; ctx.setLineDash([2,4]); ctx.beginPath();
      ctx.moveTo(sidePad, H - paddleH - 6); ctx.lineTo(W - sidePad, H - paddleH - 6); ctx.stroke();
      ctx.setLineDash([]);
      // bricks
      state.bricks.forEach(b => {
        if (!b.alive) return;
        // Alternate outlined vs filled per row for aesthetic
        if (b.row % 2 === 0){
          ctx.fillStyle = fg;
          ctx.fillRect(b.x, b.y, b.w, b.h);
        } else {
          ctx.strokeStyle = fg; ctx.lineWidth = 1;
          ctx.strokeRect(b.x+0.5, b.y+0.5, b.w-1, b.h-1);
        }
      });
      // paddle
      ctx.fillStyle = fg;
      ctx.fillRect(state.paddleX, H - paddleH - 4, paddleW, paddleH);
      // ball
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, ballR, 0, Math.PI*2);
      ctx.fill();
    }
    function step(){
      if (state.launched){
        state.ball.x += state.ball.vx;
        state.ball.y += state.ball.vy;
        // walls
        if (state.ball.x < ballR){ state.ball.x = ballR; state.ball.vx *= -1; }
        if (state.ball.x > W - ballR){ state.ball.x = W - ballR; state.ball.vx *= -1; }
        if (state.ball.y < ballR){ state.ball.y = ballR; state.ball.vy *= -1; }
        // paddle
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
        // bricks
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
        // lose
        if (state.ball.y - ballR > H){
          state.over = true;
          setTimeout(() => { newGame(); }, 600);
        }
        // win → new wave
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
    // controls
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

    // initial paint
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

/* ============ Bookshelf + Watchlist collections ============ */
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
      if (kind === 'books') { title.textContent = 'Bookshelf'; renderBookshelf(); }
      else if (kind === 'films') { title.textContent = 'Watchlist'; renderWatchlist(); }
      else if (kind === 'photos') { title.textContent = 'Photos'; renderPhotos(); }
      modal.classList.add('open');
    });
  });

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
    // iOS Photos "Library" style — dense square grid, hairline gaps, no captions
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="1.6" fill="currentColor" stroke="none"/><path d="M21 16 l-5 -6 -5 6 -3 -3 -5 5"/></svg>
            <span>Library</span>
          </div>
          <div class="ios-tab">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M6 7 V5 h12 v2"/></svg>
            <span>Collections</span>
          </div>
          <div class="ios-tab">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="M20 20 l-4.5 -4.5"/></svg>
          </div>
        </div>
      </div>`;
    // Attach click-to-open carousel
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

/* ============ Draggable creature (Sprout) ============ */
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
      // small speech on tap
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

/* ============ Sprout idle speech (perched, no walking) ============ */
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

/* ============ Mobile bottom drawer ============ */
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

  // Toggle + drag to open/close
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
      // If dragged up meaningfully → open; down → close
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

  // Sync body class with drawer state so we can hide everything behind it
  const syncBody = () => document.body.classList.toggle('drawer-open', drawer.classList.contains('open'));
  const mo = new MutationObserver(syncBody);
  mo.observe(drawer, { attributes:true, attributeFilter:['class'] });
  syncBody();
})();



(function(){
  // Mobile iOS-style clock (matches menubar clock) — live UTC time
  const c = document.getElementById('msClock');
  function tick(){
    if(!c) return;
    const now = new Date();
    const opts = { hour:'numeric', minute:'2-digit', second:'2-digit', hour12:false, timeZone:'UTC' };
    c.textContent = now.toLocaleTimeString('en-US', opts) + ' UTC';
  }
  tick(); setInterval(tick, 1000);

  // Hamburger sheet
  const btn = document.getElementById('msHamburger');
  const sheet = document.getElementById('mobile-sheet');
  const scrim = document.getElementById('mshScrim');
  const closeBtn = document.getElementById('mshClose');
  const open = () => { sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true'); };
  const close = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false'); };
  btn?.addEventListener('click', () => sheet.classList.contains('open') ? close() : open());
  scrim?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  // Route sheet actions to existing menubar buttons
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

/* ============ Window manager: minimize / maximize / close + taskbar ============ */
(function initWindowManager(){
  const APP_CONFIG = [
    { id:'about',      modalId:'aboutModal',      closeId:'aboutClose',      label:'About' },
    { id:'stickies',   modalId:'stickiesModal',   closeId:'stickiesClose',   label:'Stickies' },
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
    // Try to reuse two existing decorative dot siblings right after close (macOS traffic-light pattern)
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
      // Match the injected buttons' size to this modal's actual close button,
      // so they never look oversized/undersized relative to the app's own chrome.
      const cs = getComputedStyle(closeBtn);
      const w = parseFloat(cs.width) || 13;
      const h = parseFloat(cs.height) || 13;
      const dim = Math.min(w, h, 16) + 'px'; // cap so it never balloons past a normal traffic-light dot
      minBtn = document.createElement('button');
      minBtn.type = 'button';
      minBtn.className = 'wm-btn wm-min-btn';
      minBtn.style.width = dim; minBtn.style.height = dim;
      minBtn.setAttribute('aria-label','Minimize');
      maxBtn = document.createElement('button');
      maxBtn.type = 'button';
      maxBtn.className = 'wm-btn wm-max-btn';
      maxBtn.style.width = dim; maxBtn.style.height = dim;
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
    setState(app, 'open');
    setTimeout(() => { app.suppressObserver = false; }, 0);
  }

  function closeApp(app){
    if (app.controls?.closeBtn) app.controls.closeBtn.click();
    else hideModal(app);
  }

  function toggleMaximize(app){
    const card = app.modal.firstElementChild;
    if (!card) return;
    const maximized = card.classList.toggle('wm-maximized');
    if (app.controls?.maxBtn) app.controls.maxBtn.setAttribute('aria-pressed', maximized ? 'true' : 'false');
  }

  APP_CONFIG.forEach(cfg => {
    const modal = document.getElementById(cfg.modalId);
    if (!modal) return;
    const usesClass = CLASS_BASED.has(cfg.id);
    const app = { ...cfg, modal, usesClass, state: 'closed', suppressObserver:false };
    app.controls = buildControls(app);
    if (app.controls) {
      app.controls.minBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); minimizeApp(app); });
      app.controls.maxBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleMaximize(app); });
    }
    apps.push(app);

    const observer = new MutationObserver(() => {
      if (app.suppressObserver) return;
      const visible = isVisible(modal);
      if (visible) {
        if (app.state !== 'open') {
          app.modal.style.zIndex = ++zCounter;
          setState(app, 'open');
        }
      } else {
        if (app.state === 'open') {
          setState(app, 'closed');
        }
        // if state was already 'minimized' or 'closed', nothing to do
      }
    });
    observer.observe(modal, { attributes:true, attributeFilter:['style','class'] });
  });

  window.desktopWM = { minimizeApp, restoreApp, closeApp, toggleMaximize, apps };
})();
