* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:100%; height:100%; overflow:hidden; font-family:"Courier New",monospace; background:#0a0e14; }

/* ============ Pixel vintage custom cursor (SVG data URI) ============ */
html, body, #stage, .node, .folder, .photo-node, .thumb, button, a, .di, .wp-swatch, .mp-btn {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 28 28"><path d="M4 3.2 Q3 2.2 4 2 L23.4 10.4 Q24.6 11 23.3 11.6 L15.2 14 Q14.4 14.3 14 15 L11.2 22.6 Q10.7 24 10 22.7 Z" fill="%23111" stroke="%23fff" stroke-width="1.3" stroke-linejoin="round"/></svg>') 1 1, auto;
}
a, button, .di, .wp-swatch, .mp-btn, .node, .folder, .photo-node .thumb, .book, .poster-card, .snake-expand, .sm-close, .restore-btn {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 28 28"><path d="M4 3.2 Q3 2.2 4 2 L23.4 10.4 Q24.6 11 23.3 11.6 L15.2 14 Q14.4 14.3 14 15 L11.2 22.6 Q10.7 24 10 22.7 Z" fill="%23111" stroke="%23fff" stroke-width="1.3" stroke-linejoin="round"/></svg>') 1 1, pointer;
}

/* ============ Loading screen ============ */
#loader {
  position:fixed; inset:0; z-index:99999;
  background:
    linear-gradient(180deg, #2b4d8c 0%, #3a6aa8 35%, #7ba4c9 70%, #c7dcec 100%);
  display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:22px; padding-bottom:10vh;
  transition:opacity 500ms ease; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;
  cursor:pointer; overflow:hidden; isolation:isolate;
}
#loader::before {
  content:""; position:absolute; inset:-2px; pointer-events:none; z-index:0;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>");
  background-size:240px 240px; opacity:0.28; mix-blend-mode:overlay;
}
#loader > * { position:relative; z-index:1; }
#loader.hide { opacity:0; pointer-events:none; }
#loader .logo { width:88px; height:88px; object-fit:contain; opacity:1; animation:loaderSpin 4s linear infinite; transform-origin:50% 50%; filter:brightness(0) invert(1) drop-shadow(0 6px 18px rgba(20,40,70,0.45)); }
#loader .lock-name { font-size:22px; font-weight:600; letter-spacing:-0.01em; color:#ffffff; margin-top:-6px; text-shadow:0 1px 16px rgba(20,40,70,0.35); }
#loader .lock-role { font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.75); margin-top:-18px; }
#loader .lock-cta { display:inline-flex; align-items:center; gap:10px; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.9); padding:12px 20px; border:1px solid rgba(255,255,255,0.35); border-radius:999px; background:rgba(255,255,255,0.12); backdrop-filter:blur(6px); user-select:none; }
#loader .lock-cta svg { width:12px; height:12px; }
#loader .lock-hint { position:absolute; bottom:28px; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.6); z-index:1; }
/* Slide-to-unlock (mobile/tablet only) */
#loader .lock-slider { display:none; width:min(320px, 78vw); margin-top:4px; user-select:none; -webkit-user-select:none; }
#loader .lock-slider-track { position:relative; height:64px; border-radius:999px; background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.3); backdrop-filter:blur(6px); overflow:hidden; }
#loader .lock-slider-label { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding-left:56px; font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.55); pointer-events:none; background:linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.35) 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; background-size:200% 100%; animation: lockShimmer 2.6s linear infinite; }
#loader .lock-slider-knob { position:absolute; top:4px; left:4px; width:56px; height:56px; border-radius:50%; background:#fff; color:#222; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.28); touch-action:none; cursor:grab; transition:transform 0.28s ease; }
#loader .lock-slider-knob.dragging { transition:none; cursor:grabbing; }
#loader .lock-slider-knob svg { width:22px; height:22px; }
@keyframes lockShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@media (max-width: 1024px), (pointer: coarse) {
  #loader .lock-cta { display:none; }
  #loader .lock-slider { display:block; position:absolute; left:50%; bottom:calc(env(safe-area-inset-bottom, 0px) + 48px); transform:translateX(-50%); margin-top:0; z-index:2; }
  #loader .lock-hint { bottom:20px; }
  /* Keep the spinning logo + identity visible underneath the clock */
  #loader .logo { width:64px; height:64px; margin-top:22vh; }
  #loader .lock-name { font-size:18px; }
  #loader .lock-role { font-size:10px; }
}
/* iPhone/iPad-style lock clock (all viewports) */
#loader .lock-clock {
  display:flex; flex-direction:column; align-items:center; gap:2px;
  position:absolute; left:50%; top:calc(env(safe-area-inset-top, 0px) + 56px);
  transform:translateX(-50%); z-index:2; color:#fff; text-align:center;
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",sans-serif;
  text-shadow:0 2px 24px rgba(20,40,70,0.35);
}
#loader .lock-date { font-size:18px; font-weight:600; letter-spacing:-0.01em; color:rgba(255,255,255,0.95); }
#loader .lock-time { font-size:clamp(84px, 12vw, 128px); font-weight:200; letter-spacing:-0.05em; line-height:0.95; margin-top:-4px; font-variant-numeric:tabular-nums; }
/* On touch/small screens the clock returns to iPhone-style large */
@media (max-width: 1024px), (pointer: coarse) {
  #loader .lock-time { font-size:clamp(110px, 26vw, 190px); }
  #loader { justify-content:flex-end; padding-bottom:16vh; }
}
@keyframes loaderPulse { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
@keyframes loaderSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
#menubar .brand { cursor:pointer; }

.node { position:relative; }
.folder { position:relative; }
/* mobile-only Photos folder */
.photos-mobile { display:none !important; }

/* ============ Mobile iOS-style status bar + hamburger sheet ============ */
#mobile-statusbar { display:none; }
#mobile-sheet { display:none; }
@media (max-width: 760px) {
  /* Hide the desktop macOS-style menubar on mobile */
  #menubar { display:none !important; }
  /* Bump layer down to clear the new status bar */
  #layer-wrap { top:44px !important; }

  #mobile-statusbar {
    display:flex; align-items:center; justify-content:space-between;
    position:fixed; top:0; left:0; right:0; height:44px; z-index:220;
    padding:0 18px 0 22px;
    color:#ffffff; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;
    text-shadow:0 1px 2px rgba(0,0,0,0.18);
    pointer-events:auto;
  }
  body[data-theme="night"] #mobile-statusbar { color:#ffffff; }
  #mobile-statusbar .ms-clock {
    font-size:16px; font-weight:600; letter-spacing:0.01em;
    font-variant-numeric:tabular-nums;
  }
  #mobile-statusbar .ms-logo {
    position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
    width:30px; height:30px; object-fit:contain; pointer-events:none;
    filter:brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.25));
    opacity:0.95;
  }
  #mobile-statusbar .ms-right {
    display:flex; align-items:center; gap:6px;
  }
  #mobile-statusbar .ms-ic { color:currentColor; }
  #mobile-statusbar .ms-signal { width:17px; height:11px; fill:currentColor; }
  #mobile-statusbar .ms-wifi   { width:15px; height:11px; fill:currentColor; }
  #mobile-statusbar .ms-bat    { width:24px; height:13px; }
  #mobile-statusbar .ms-bat-pct { font-size:13px; font-weight:600; font-variant-numeric:tabular-nums; }
  #mobile-statusbar .ms-hamburger {
    margin-left:8px; width:28px; height:28px; border-radius:0;
    background:transparent; border:0; padding:0; cursor:pointer;
    display:inline-grid; grid-template-columns:repeat(2, 6px); grid-template-rows:repeat(2, 6px);
    gap:4px; align-content:center; justify-content:center;
    color:currentColor;
  }
  body[data-theme="night"] #mobile-statusbar .ms-hamburger {
    background:transparent; border:0;
  }
  #mobile-statusbar .ms-hamburger span {
    display:block; width:6px; height:6px; border-radius:50%;
    background:currentColor;
  }

  /* Hamburger sheet */
  #mobile-sheet { display:block; position:fixed; inset:0; z-index:400; pointer-events:none; }
  #mobile-sheet.open { pointer-events:auto; }
  #mobile-sheet .msh-scrim {
    position:absolute; inset:0; background:rgba(10,14,22,0.35);
    opacity:0; transition:opacity .22s ease;
  }
  #mobile-sheet.open .msh-scrim { opacity:1; }
  #mobile-sheet .msh-panel {
    position:absolute; top:0; right:0; bottom:0; width:min(84vw, 340px);
    background:rgba(250,250,252,0.94); backdrop-filter:blur(28px) saturate(1.4);
    -webkit-backdrop-filter:blur(28px) saturate(1.4);
    border-left:1px solid rgba(0,0,0,0.08);
    box-shadow:-24px 0 60px rgba(0,0,0,0.22);
    padding:calc(env(safe-area-inset-top,0) + 18px) 18px 24px;
    transform:translateX(100%); transition:transform .28s cubic-bezier(.4,.14,.3,1);
    display:flex; flex-direction:column; gap:14px;
    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; color:#111;
  }
  body[data-theme="night"] #mobile-sheet .msh-panel {
    background:rgba(22,24,30,0.94); color:#f0f2f6; border-left-color:rgba(255,255,255,0.1);
  }
  #mobile-sheet.open .msh-panel { transform:translateX(0); }
  #mobile-sheet .msh-head { display:flex; align-items:center; justify-content:space-between; }
  #mobile-sheet .msh-brand { display:flex; align-items:center; gap:10px; }
  #mobile-sheet .msh-logo { width:34px; height:34px; object-fit:contain; }
  #mobile-sheet .msh-name { font-weight:700; font-size:15px; letter-spacing:0.01em; }
  #mobile-sheet .msh-role { font-size:11px; opacity:0.6; letter-spacing:0.06em; text-transform:uppercase; }
  #mobile-sheet .msh-close {
    width:32px; height:32px; border-radius:50%; border:0;
    background:rgba(0,0,0,0.06); color:inherit; font-size:22px; line-height:1;
    cursor:pointer;
  }
  #mobile-sheet .msh-nav { display:flex; flex-direction:column; margin-top:6px; }
  #mobile-sheet .msh-nav button,
  #mobile-sheet .msh-nav a {
    display:flex; align-items:center; justify-content:space-between;
    padding:13px 4px; font-size:15px; color:inherit;
    background:transparent; border:0; text-align:left; cursor:pointer;
    border-bottom:1px solid rgba(0,0,0,0.06); text-decoration:none;
    font-family:inherit;
  }
  body[data-theme="night"] #mobile-sheet .msh-nav button,
  body[data-theme="night"] #mobile-sheet .msh-nav a { border-bottom-color:rgba(255,255,255,0.08); }
  #mobile-sheet .msh-nav span { opacity:0.45; font-size:14px; }
  #mobile-sheet .msh-sep { height:14px; }
  #mobile-sheet .msh-social { margin-top:auto; display:flex; gap:16px; padding-top:12px; opacity:0.7; }
  #mobile-sheet .msh-social a { color:inherit; }
  #mobile-sheet .msh-social svg { width:20px; height:20px; }
}

#stage {
  position:relative; z-index:0; width:100%; height:100%; overflow:hidden;
  transition:background 0.6s cubic-bezier(.22,1,.36,1);
}
#siteBgVideo {
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; z-index:-2; opacity:0; pointer-events:none;
  transition:opacity 0.65s cubic-bezier(.22,1,.36,1);
  will-change:opacity;
}
#siteBgVideo.show { opacity:1; }
.bg-layer {
  position:absolute; inset:0; z-index:-1;
  background-position:center center; background-size:cover; background-repeat:no-repeat;
  opacity:0; pointer-events:none;
  transition:opacity 0.65s cubic-bezier(.22,1,.36,1);
  will-change:opacity;
}
.bg-layer.active { opacity:1; }
.grain { position:absolute; inset:0; z-index:2; pointer-events:none; opacity:0.42; mix-blend-mode:multiply; }
body[data-theme="night"] .grain { mix-blend-mode:overlay; opacity:0.55; }

/* tech grid overlay — subtle in light themes, prominent in night */
.tech-grid {
  position:absolute; inset:0; z-index:1; pointer-events:none; opacity:0.14;
  background-image:
    linear-gradient(rgba(74,111,160,0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74,111,160,0.16) 1px, transparent 1px),
    linear-gradient(rgba(74,111,160,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74,111,160,0.08) 1px, transparent 1px);
  background-size: 160px 160px, 160px 160px, 32px 32px, 32px 32px;
  transition:opacity 0.6s;
}
/* per-theme accent tokens */
:root { --accent:#4A6FA0; --accent-soft:rgba(74,111,160,0.75); --accent-glow:rgba(74,111,160,0.25); --hub-1:#e7f1fb; --hub-2:#7fa3c8; --hub-3:#24384e; }
body[data-theme="sky"]    { --accent:#4A6FA0; --accent-soft:rgba(74,111,160,0.78); --accent-glow:rgba(74,111,160,0.25); --hub-1:#eef8ff; --hub-2:#87acd3; --hub-3:#2e4963; }
body[data-theme="forest"] { --accent:#4a6b47; --accent-soft:rgba(74,107,71,0.72);   --accent-glow:rgba(74,107,71,0.25); --hub-1:#f0f2dc; --hub-2:#6f8a58; --hub-3:#243f2b; }
body[data-theme="desert"] { --accent:#a97a4a; --accent-soft:rgba(169,122,74,0.72);  --accent-glow:rgba(169,122,74,0.25); --hub-1:#ffe6bf; --hub-2:#bf7f43; --hub-3:#57361f; }
body[data-theme="night"]  { --accent:#ffffff; --accent-soft:rgba(255,255,255,0.7);--accent-glow:rgba(255,255,255,0.3); --hub-1:#ffffff; --hub-2:#d7d7d7; --hub-3:#646464; }

body[data-theme="night"] .tech-grid {
  opacity:0.35;
  background-image:
    linear-gradient(rgba(120,200,255,0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,200,255,0.28) 1px, transparent 1px),
    linear-gradient(rgba(120,200,255,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,200,255,0.12) 1px, transparent 1px);
  background-size: 160px 160px, 160px 160px, 32px 32px, 32px 32px;
}

#layer-wrap { position:absolute; top:38px; left:0; right:0; bottom:102px; overflow:hidden; }

/* ============ TASKBAR (lives inline inside the menubar's center slot) ============ */
#taskbar { gap:8px; max-width:46vw; overflow:hidden; font-size:11px; letter-spacing:0.02em; color:inherit; }
#taskbar .tb-empty { opacity:0.4; font-style:italic; font-size:10.5px; letter-spacing:0.03em; }
#taskbar.has-apps .tb-empty { display:none; }
#taskbarItems { display:flex; align-items:center; gap:6px; overflow-x:auto; scrollbar-width:none; max-width:46vw; }
.tb-item {
  display:flex; align-items:center; gap:6px;
  padding:3px 8px 3px 7px; border-radius:7px; border:1px solid rgba(0,0,0,0.1);
  background:rgba(255,255,255,0.5); cursor:pointer; font-size:10.5px; font-weight:600;
  color:inherit; max-width:130px; flex-shrink:0;
}
body[data-theme="night"] .tb-item { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.14); }
.tb-item:hover { background:rgba(255,255,255,0.85); }
body[data-theme="night"] .tb-item:hover { background:rgba(255,255,255,0.16); }
.tb-item.active { background:rgba(60,120,255,0.16); border-color:rgba(60,120,255,0.4); }
body[data-theme="night"] .tb-item.active { background:rgba(90,150,255,0.22); border-color:rgba(90,150,255,0.5); }
.tb-item.minimized { opacity:0.62; }
.tb-dot { width:6px; height:6px; border-radius:50%; background:#8a97a8; flex-shrink:0; }
.tb-item.active .tb-dot { background:#28c840; }
.tb-item.minimized .tb-dot { background:#febc2e; }
.tb-label { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tb-item .tb-x { opacity:0.5; font-size:10px; margin-left:2px; padding:1px 2px; border-radius:4px; }
.tb-item .tb-x:hover { opacity:1; background:rgba(0,0,0,0.08); }
@media (max-width: 760px) { #taskbar { display:none !important; } }

/* ============ Window-manager injected controls ============ */
.wm-btn { width:13px; height:13px; border-radius:50%; border:1px solid rgba(0,0,0,0.22); padding:0; cursor:pointer; flex-shrink:0; }
.wm-min-btn { background:#febc2e; }
.wm-max-btn { background:#28c840; }
.wm-maximized { position:fixed !important; inset:0 !important; width:100vw !important; height:100vh !important;
  max-width:100vw !important; max-height:100vh !important; border-radius:0 !important; margin:0 !important; top:0 !important; left:0 !important; }
#layer { position:absolute; left:40px; top:50%; width:2200px; height:1300px; padding-top:34px; transform-origin:left center; transform:translateY(-50%); will-change:transform; }

/* ============ TOP MENU BAR ============ */
#menubar { display:flex; justify-content:space-between; align-items:center;
  position:fixed; top:0; left:0; right:0; height:38px; z-index:200;
  padding:0 16px; gap:12px; white-space:nowrap;
  background:rgba(255,255,255,0.5);
  backdrop-filter:blur(16px) saturate(160%);
  border-bottom:1px solid rgba(0,0,0,0.08);
  font-size:11px; letter-spacing:0.04em; color:rgba(40,40,40,0.85);
  transition:background 0.6s, color 0.6s;
}
body[data-theme="night"] #menubar { background:rgba(0,0,0,0.65); color:rgba(220,228,240,0.9); border-bottom:1px solid rgba(255,255,255,0.1); }
#menubar .left { display:flex; align-items:center; gap:2px; flex:1; min-width:0; }
#brand-stack {
  position:fixed; top:48px; left:20px; z-index:180;
  display:flex; flex-direction:column; gap:4px;
  max-width:260px; color:rgba(28,28,32,0.9); pointer-events:auto;
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;
}
body[data-theme="night"] #brand-stack { color:rgba(230,236,245,0.94); }
#brand-stack .avail { display:inline-flex; align-items:center; gap:7px; font-size:10.5px; letter-spacing:0.16em; text-transform:uppercase; font-weight:700; }
#brand-stack .avail .dot { width:7px; height:7px; border-radius:50%; background:#5aa06a; box-shadow:0 0 0 2px rgba(90,160,106,0.22); animation:availPulse 1.15s ease-in-out infinite; }
#brand-stack .hero-lede { font-size:10px; line-height:1.45; margin:0; max-width:260px; opacity:0.72; font-weight:500; letter-spacing:0.01em; }
@media (max-width:760px) {
  #brand-stack { max-width:calc(100vw - 40px); gap:4px; }
  #brand-stack .hero-lede { font-size:9.5px; max-width:calc(100vw - 40px); }
}
@keyframes availPulse {
  0%,100% { box-shadow:0 0 0 2px rgba(90,160,106,0.22), 0 0 0 0 rgba(90,160,106,0.55); }
  50%     { box-shadow:0 0 0 2px rgba(90,160,106,0.22), 0 0 0 8px rgba(90,160,106,0); }
}
#copyright { position:fixed; left:16px; bottom:10px; z-index:180; font-size:10px; letter-spacing:0.08em; color:rgba(40,40,40,0.6); text-transform:uppercase; pointer-events:none; }
body[data-theme="night"] #copyright { color:rgba(220,228,240,0.55); }
#menubar .center { display:flex; align-items:center; justify-content:center; flex:0 0 auto; }
#menubar .right { flex:1; justify-content:flex-end; min-width:0; overflow:hidden; }
#menubar .brand { font-weight:700; letter-spacing:0.05em; display:flex; align-items:center; gap:8px; font-size:12px; }
#menubar .brand-logo { width:18px; height:18px; object-fit:contain; }
#menubar .tagline-inline { font-size:11px; letter-spacing:0.02em; opacity:0.55; font-style:italic; overflow:hidden; text-overflow:ellipsis; }
#menubar .brand { font-size:13px !important; }
#menubar .social { color:inherit; display:inline-flex; opacity:0.65; transition:opacity 0.15s; }
#menubar .social:hover { opacity:1; }
#menubar .social svg { width:14px; height:14px; }
#menubar .menu-item { opacity:0.6; cursor:default; }
#menubar .right { display:flex; align-items:center; gap:14px; opacity:0.85; }
#menubar .status-dot { width:5px; height:5px; border-radius:50%; background:#5aa06a; box-shadow:0 0 0 2px rgba(90,160,106,0.2); }
#menubar .mb-battery { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-variant-numeric:tabular-nums; letter-spacing:0.01em; }
#menubar .mb-bat-icon { width:22px; height:12px; flex:none; }
.bat-fill { fill:#5aa06a; transition:width 0.4s ease, fill 0.4s ease; }
.bat-bolt { fill:#1c1f1a; }

/* ============ macOS-style menubar dropdowns ============ */
#menubar .center { gap:2px; }
.mb-menu { position:relative; }
.mb-menu > .mb-trigger {
  display:inline-flex; align-items:center; padding:3px 10px; border-radius:6px;
  font-size:13px; font-weight:400; letter-spacing:0.01em; color:inherit;
  background:transparent; border:0; cursor:pointer; font-family:inherit;
  transition:background 0.12s;
}
.mb-menu > .mb-trigger:hover,
.mb-menu.open > .mb-trigger { background:rgba(0,0,0,0.06); }
body[data-theme="night"] .mb-menu > .mb-trigger:hover,
body[data-theme="night"] .mb-menu.open > .mb-trigger { background:rgba(255,255,255,0.1); }
.mb-dropdown {
  position:absolute; top:calc(100% + 4px); left:0; min-width:230px;
  background:rgba(245,247,252,0.94); backdrop-filter:blur(24px) saturate(180%);
  border:1px solid rgba(0,0,0,0.1); border-radius:10px;
  box-shadow:0 12px 32px rgba(20,30,60,0.22), 0 2px 6px rgba(0,0,0,0.08);
  padding:5px; z-index:9999; display:none;
  font-size:13px; color:#1a1a1f; letter-spacing:0;
}
.mb-menu.open .mb-dropdown { display:block; }
.mb-dropdown a, .mb-dropdown button {
  display:flex; align-items:center; gap:10px; width:100%;
  padding:6px 10px; border-radius:5px; border:0; background:transparent;
  color:inherit; text-decoration:none; font:inherit; text-align:left;
  cursor:pointer; white-space:nowrap;
}
.mb-dropdown a:hover, .mb-dropdown button:hover { background:#3d7bff; color:#fff; }
.mb-dropdown .mb-sep { height:1px; background:rgba(0,0,0,0.09); margin:5px 6px; }
.mb-dropdown .mb-shortcut { margin-left:auto; opacity:0.55; font-size:11.5px; }
.mb-dropdown .mb-toggle-item {
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  padding:7px 10px; font-size:12.5px; cursor:default;
}
.mb-dropdown .mb-toggle-item .ios-toggle {
  position:relative; display:block; flex:none;
  width:38px; height:22px; padding:0; margin:0; gap:0;
  border:none; border-radius:11px; background:rgba(0,0,0,0.16);
  cursor:pointer; white-space:normal; transition:background 0.25s ease;
}
.mb-dropdown .mb-toggle-item .ios-toggle:hover { background:rgba(0,0,0,0.22); color:inherit; }
.mb-dropdown .mb-toggle-item .ios-toggle.on { background:#34c759; }
.mb-dropdown .mb-toggle-item .ios-toggle.on:hover { background:#2fb350; }
.ios-toggle .ios-toggle-knob {
  position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%;
  background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.35);
  transition:transform 0.25s cubic-bezier(.4,0,.2,1);
}
.ios-toggle.on .ios-toggle-knob { transform:translateX(16px); }
body[data-theme="night"] .mb-dropdown .mb-toggle-item { color:rgba(230,235,245,0.95); }
body[data-theme="night"] .mb-dropdown .mb-toggle-item .ios-toggle { background:rgba(255,255,255,0.18); }
body[data-theme="night"] .mb-dropdown .mb-toggle-item .ios-toggle:hover { background:rgba(255,255,255,0.26); }
body[data-theme="night"] .mb-dropdown .mb-toggle-item .ios-toggle.on { background:#30d158; }
body[data-theme="night"] .mb-dropdown .mb-toggle-item .ios-toggle.on:hover { background:#29b84a; }
body[data-theme="night"] .mb-dropdown { background:rgba(30,32,42,0.94); color:rgba(230,235,245,0.95); border-color:rgba(255,255,255,0.08); }
body[data-theme="night"] .mb-dropdown .mb-sep { background:rgba(255,255,255,0.08); }

/* Brand item — same color as siblings, just bold */
.brand-menu { display:inline-flex; align-items:center; }
.brand-menu > .brand-trigger {
  padding:3px 10px; gap:8px; font-weight:700;
  margin-right:6px;
}
.brand-menu .brand-logo { width:16px; height:16px; opacity:0.9; }
.brand-menu > .brand-lock {
  display:inline-flex; align-items:center; justify-content:center;
  padding:3px 6px; border-radius:6px; background:transparent; border:0;
  cursor:pointer; font-family:inherit; color:inherit;
  transition:background 0.12s;
}
.brand-menu > .brand-lock:hover { background:rgba(0,0,0,0.06); }
body[data-theme="night"] .brand-menu > .brand-lock:hover { background:rgba(255,255,255,0.1); }
.brand-menu > .brand-trigger { margin-left:-2px; }

/* ============ Cursor style picker ============ */
#cursor-picker {
  position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
  z-index:9999; display:none;
  background:rgba(248,249,252,0.98); backdrop-filter:blur(24px) saturate(160%);
  border:1px solid rgba(0,0,0,0.1); border-radius:14px;
  box-shadow:0 20px 60px rgba(0,0,0,0.28); padding:16px 18px 14px;
  width:280px; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;
}
#cursor-picker.show { display:block; }
#cursor-picker h4 { margin:0 0 12px; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#4a4a55; }
#cursor-picker .close-x { position:absolute; top:8px; right:10px; border:0; background:transparent; font-size:18px; color:#888; line-height:1; }
.cursor-picker-grid {
  display:grid; grid-template-columns:repeat(3,1fr); gap:8px;
  max-height:min(50vh, 360px); overflow-y:auto; padding-right:2px;
}
.cursor-option {
  display:flex; flex-direction:column; align-items:center; gap:7px;
  background:rgba(0,0,0,0.04); border:2px solid transparent;
  border-radius:10px; padding:10px 6px 8px; transition:border-color 0.15s, background 0.15s;
}
.cursor-option:hover { background:rgba(60,120,220,0.08); border-color:rgba(60,120,220,0.3); }
.cursor-option.active { border-color:#3a78e8; background:rgba(58,120,232,0.1); }
.cursor-preview {
  width:56px; height:56px; display:flex; align-items:center; justify-content:center;
  border-radius:6px; background:rgba(255,255,255,0.7);
  box-shadow:0 1px 4px rgba(0,0,0,0.1);
}
.cursor-preview svg { display:block; }
.cursor-preview img { max-width:40px; max-height:40px; display:block; }
.cursor-option-label {
  font-size:10px; letter-spacing:0.04em; text-transform:uppercase; color:#6a6a75; font-weight:600;
  text-align:center; line-height:1.25; word-break:break-word;
}
.cursor-picker-hint { margin-top:10px; font-size:10px; color:#9a9aaa; text-align:center; }
body[data-theme="night"] #cursor-picker { background:rgba(28,30,38,0.98); color:#e6ebf5; border-color:rgba(255,255,255,0.08); }
body[data-theme="night"] #cursor-picker h4 { color:#b0b5c2; }
body[data-theme="night"] .cursor-option { background:rgba(255,255,255,0.05); }
body[data-theme="night"] .cursor-option:hover { background:rgba(100,160,255,0.1); }
body[data-theme="night"] .cursor-preview { background:rgba(255,255,255,0.08); }
body[data-theme="night"] .cursor-option-label { color:#8a8a9a; }

/* Floating stuck emojis */
.stuck-emoji {
  position:fixed; z-index:150; font-size:34px; cursor:grab;
  user-select:none; pointer-events:auto;
  filter:drop-shadow(0 4px 10px rgba(0,0,0,0.25));
  animation:emojiPop 0.4s cubic-bezier(.2,.9,.3,1.4);
}
@keyframes emojiPop { from { transform:scale(0.2) rotate(-30deg); opacity:0; } to { transform:scale(1) rotate(0); opacity:1; } }
.stuck-emoji:active { cursor:grabbing; }

@media (max-width:760px) {
  .mb-menu > .mb-trigger { font-size:11px; padding:3px 7px; }
  .mb-dropdown { min-width:200px; font-size:12px; }
  #cursor-picker { width:min(280px, calc(100vw - 24px)); }
}

.theme-toggle {
  display:flex; align-items:center; gap:7px; cursor:pointer;
  padding:4px 10px; border-radius:20px; border:1px solid rgba(0,0,0,0.15);
  background:rgba(255,255,255,0.6); font-size:10px; letter-spacing:0.08em; text-transform:uppercase;
  transition:background 0.2s;
}
body[data-theme="night"] .theme-toggle { border-color:rgba(255,255,255,0.2); background:rgba(255,255,255,0.08); }
.theme-toggle:hover { filter:brightness(1.08); }
.theme-toggle .swatch { width:10px; height:10px; border-radius:50%; transition:background 0.5s; }

/* ============ BLUEPRINT CHROME — constant across every theme ============ */
.bp-line { position:absolute; height:1px; left:0; right:0; background:rgba(74,111,160,0.22); z-index:1; pointer-events:none; transition:background 0.6s; }
body[data-theme="night"] .bp-line { background:rgba(120,180,255,0.14); }
.bp-line.v { height:auto; width:1px; top:0; bottom:0; left:auto; right:auto; }
.crosshair { position:absolute; width:18px; height:18px; z-index:3; pointer-events:none; }
.crosshair::before, .crosshair::after { content:''; position:absolute; background:rgba(74,111,160,0.55); }
body[data-theme="night"] .crosshair::before,
body[data-theme="night"] .crosshair::after { background:rgba(140,200,255,0.5); }
.crosshair::before { left:50%; top:0; width:1px; height:100%; transform:translateX(-50%); }
.crosshair::after  { top:50%; left:0; height:1px; width:100%; transform:translateY(-50%); }
.dot-cluster { position:absolute; z-index:3; pointer-events:none; display:grid; grid-template-columns:repeat(4,5px); grid-auto-rows:5px; gap:5px; }
.dot-cluster span { width:2px; height:2px; border-radius:50%; background:rgba(74,111,160,0.5); }
.coord { position:absolute; z-index:3; pointer-events:none; font-size:10px; letter-spacing:0.08em; color:rgba(51,77,110,0.65); line-height:1.6; }
body[data-theme="night"] .coord { color:rgba(210,220,235,0.7); }

.bp-tagline {
  position:absolute; left:70px; bottom:130px; z-index:3;
  font-size:11px; letter-spacing:0.12em; color:rgba(51,77,110,0.8);
  text-transform:uppercase; display:flex; flex-direction:column; gap:6px;
}
body[data-theme="night"] .bp-tagline { color:rgba(220,228,240,0.85); }
.bp-tagline .row1 { display:flex; align-items:center; gap:18px; }
.bp-tagline .div { width:1px; height:14px; background:currentColor; opacity:0.4; }
.bp-tagline .tags { display:flex; gap:10px; opacity:0.75; }
.bp-tagline .sub { font-size:9px; letter-spacing:0.06em; text-transform:none; opacity:0.6; font-style:italic; }

.callout { position:absolute; z-index:6; pointer-events:none; }
.callout svg { position:absolute; top:0; left:0; overflow:visible; }
.callout-marker { position:absolute; width:7px; height:7px; border:1.3px solid rgba(74,111,160,0.75); transform:translate(-50%,-50%); background:rgba(223,233,245,0.6); }
.callout-label { position:absolute; font-size:8px; letter-spacing:0.1em; color:rgba(74,111,160,0.85); white-space:nowrap; text-transform:uppercase; }
body[data-theme="night"] .callout-marker { background:rgba(20,26,38,0.7); border-color:rgba(210,220,235,0.6); }
body[data-theme="night"] .callout-label { color:rgba(210,220,235,0.8); }

/* ============ ROCK / SPECIMEN CENTERPIECE ============ */
.rock-hub-wrap {
  position:absolute; left:1100px; top:650px; width:640px; height:580px;
  transform:translate(-50%,-50%); z-index:5; pointer-events:none;
  display:flex; align-items:center; justify-content:center;
}
.rock-hub-wrap::before {
  content:''; display:none;
}
.rock-hub {
  position:relative; z-index:1; width:100%; height:100%; object-fit:contain;
  filter:url(desktop.html#knockoutLight) drop-shadow(0 34px 44px rgba(30,50,80,0.28));
  animation:none;
  transform-origin:center center;
  transition:opacity 0.5s;
  mix-blend-mode:normal;
}
.rock-hub:not([src]) { opacity:0; }
body[data-theme="night"] .rock-hub {
  mix-blend-mode:normal;
  filter:url(desktop.html#knockoutDark) drop-shadow(0 0 40px rgba(255,255,255,0.18));
  -webkit-mask-image:none;
          mask-image:none;
}
@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
.rock-glow {
  position:absolute; left:1100px; top:670px; width:460px; height:460px;
  transform:translate(-50%,-50%); z-index:4; pointer-events:none;
  transition:background 1s;
}

/* ============ SHARED NODE CHROME — identical across themes ============ */
.node { position:absolute; display:flex; flex-direction:column; align-items:center; z-index:10; cursor:pointer; transform:rotate(var(--rot,0deg)); }
.node:hover { transform:rotate(var(--rot,0deg)); z-index:50; }
.node-label {
  margin-top:4px; font-size:13px; letter-spacing:0.01em; text-transform:none; font-weight:500;
  color:rgba(35,55,85,0.92); text-align:center; white-space:nowrap;
  padding:2px 7px; border-radius:2px; transition:color 0.3s, background 0.15s;
}
body[data-theme="night"] .node-label { color:rgba(220,228,240,0.75); }
.node-sub { display:none !important; }

.folder {
  position:relative; width:120px; height:96px;
  filter:drop-shadow(0 6px 10px rgba(30,50,80,0.28));
}
/* flat — no hover scale on desktop icons */
.folder .tab {
  position:absolute; top:0; left:0; width:42%; height:14px;
  background:linear-gradient(180deg,#5aa4f2 0%,#3689df 100%);
  border-radius:2px 8px 0 0;
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 0 rgba(20,60,120,0.18);
}
/* Paper sliver peeking between tab and front body */
.folder::before {
  content:''; position:absolute; left:4px; right:6px; top:10px; height:6px; z-index:1;
  background:linear-gradient(180deg,#fdfdfd 0%,#e8ecf1 100%);
  border-radius:2px 2px 0 0;
  box-shadow:0 1px 0 rgba(0,0,0,0.1);
}
.folder .body {
  position:absolute; top:11px; left:0; right:0; bottom:0; z-index:2;
  background:linear-gradient(180deg,#7fb8fb 0%,#3d8be3 55%,#3583dc 100%);
  border-radius:3px 10px 10px 10px;
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.75),
    inset 0 -1px 0 rgba(0,0,0,0.15),
    inset 0 -18px 30px rgba(20,60,120,0.15);
}
.folder .body::after { display:none; }
/* Selection: soft gray rounded backdrop like Finder icon-view */
.node.folder-node.selected .folder,
.node.selected .folder { filter:drop-shadow(0 6px 10px rgba(30,50,80,0.28)); }
.folder-glyph {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  font-size:34px; filter:drop-shadow(0 1px 1px rgba(0,0,0,0.25));
  pointer-events:none;
}
/* Icon-sized tiles — Bookshelf, Watchlist, Notes match dock-icon scale */
.icon-tile {
  width:92px; height:92px; padding:6px; box-sizing:border-box;
  display:flex; align-items:center; justify-content:center;
  background:linear-gradient(180deg,#ffffff,#eef1f5);
  border:1px solid rgba(0,0,0,0.14);
  border-radius:16px;
  box-shadow:0 6px 14px rgba(20,30,50,0.28), inset 0 1px 0 rgba(255,255,255,0.9);
  transition: transform .18s ease;
}
.icon-tile > img, .icon-tile > svg { width:100%; height:100%; object-fit:contain; display:block; }
#n-thispc .icon-tile { background:linear-gradient(160deg,#f5f7fb 0%,#e5eaf3 55%,#cfd8e8 100%); border-color:rgba(130,150,180,0.32); box-shadow:0 8px 18px rgba(120,140,175,0.18), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -6px 14px rgba(140,160,195,0.12); }
#n-myip .icon-tile   { background:linear-gradient(160deg,#f3faf6 0%,#e2f3ea 55%,#c9e8d6 100%); border-color:rgba(110,175,130,0.32); box-shadow:0 8px 18px rgba(110,175,130,0.18), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -6px 14px rgba(120,180,140,0.12); }

/* This PC / My IP modal content */
.spec-grid { display:flex; flex-direction:column; gap:0; font-size:12.5px; }
.spec-row {
  display:flex; align-items:baseline; justify-content:space-between; gap:14px;
  padding:9px 2px; border-bottom:1px solid rgba(0,0,0,0.07);
}
.spec-row:last-child { border-bottom:0; }
.spec-label { color:rgba(20,24,32,0.55); flex:none; }
.spec-value { text-align:right; font-weight:600; word-break:break-word; }
.spec-value.mono { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:12px; }
.spec-section {
  margin:14px 0 4px; padding-top:10px; font-size:10.5px; font-weight:700;
  letter-spacing:0.08em; text-transform:uppercase; color:rgba(20,24,32,0.4);
  border-top:1px solid rgba(0,0,0,0.08);
}
.spec-section:first-child { margin-top:0; padding-top:0; border-top:0; }
.spec-loading { padding:20px 2px; font-size:12.5px; opacity:0.6; }
.spec-ip-hero {
  font-size:26px; font-weight:700; letter-spacing:0.01em; padding:6px 2px 14px;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; word-break:break-all;
}
body[data-theme="night"] .icon-tile { background:linear-gradient(180deg,#2a2a30,#161619); border-color:rgba(255,255,255,0.18); }
/* App-specific tile colors — soft pastel/neumorphic on-brand gradients */
/* Soft, airy, on-brand tile backgrounds. Barely tinted whites so app glyphs pop. */
#n-synth .icon-tile     { background:linear-gradient(160deg,#fafafd 0%,#ece7f5 55%,#d9d0ea 100%); border-color:rgba(150,140,180,0.28); box-shadow:0 8px 18px rgba(120,110,160,0.18), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -6px 14px rgba(150,135,190,0.10); }
#n-bookshelf .icon-tile { background:linear-gradient(160deg,#fffaf2 0%,#fbecd6 55%,#f2d6ae 100%); border-color:rgba(200,160,110,0.32); box-shadow:0 8px 18px rgba(200,155,105,0.18), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -6px 14px rgba(210,165,115,0.12); }
#n-watchlist .icon-tile { background:linear-gradient(160deg,#fffafa 0%,#fbe4e1 55%,#f2c6c1 100%); border-color:rgba(215,170,165,0.32); box-shadow:0 8px 18px rgba(215,165,160,0.18), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -6px 14px rgba(215,160,155,0.10); }
#n-photos .icon-tile    { padding:0; background:#ffffff; border-color:rgba(0,0,0,0.08); overflow:hidden; }
#n-photos .photos-flower { width:76%; height:76%; display:block; margin:auto; }
/* Subtle app-icon lift to distinguish apps from files/folders on desktop */
#n-synth, #n-bookshelf, #n-watchlist, #n-drawpad, #n-artboard { filter:drop-shadow(0 4px 8px rgba(20,30,50,0.18)); }
.node.icon-node.selected .icon-tile { transform: scale(1.06); }
.note-thumb {
  width:72px; height:78px; border-radius:14px; overflow:hidden;
  background:linear-gradient(160deg,#fffdf6 0%,#fbf5df 55%,#f5ead0 100%);
  border:1px solid rgba(200,180,120,0.35);
  box-shadow:0 8px 18px rgba(200,180,120,0.22), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -6px 14px rgba(220,195,140,0.12);
  position:relative; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;
}
.note-thumb::before { content:''; position:absolute; left:6px; right:6px; top:6px; height:8px; background:linear-gradient(180deg,#f8de7e,#efc85a); border-radius:3px; box-shadow:0 1px 2px rgba(160,120,20,0.15); }
.note-thumb::after { content:''; position:absolute; left:12px; right:10px; top:22px; height:34px; background:repeating-linear-gradient(180deg, rgba(120,95,30,0.22) 0 1px, transparent 1px 9px); opacity:0.7; }
.note-thumb span { display:none; }
.lovable-mark { width:100%; height:100%; border-radius:12px; overflow:hidden; display:grid; place-items:center; background:transparent; }
.lovable-mark img { width:100%; height:100%; object-fit:cover; display:block; border-radius:12px; }
/* ============ Collection modal (Bookshelf + Watchlist) ============ */
#collectionModal { position:fixed; inset:0; z-index:6000; display:none; align-items:center; justify-content:center; background:rgba(10,14,22,0.6); backdrop-filter:blur(8px); }
#collectionModal.open { display:flex; }
#collectionModal .cm-card {
  position:relative;
  width:min(900px, 94vw); max-height:90vh; background:#f2f2f2; border-radius:16px; overflow:hidden;
  box-shadow:0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.15);
  display:flex; flex-direction:column; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',sans-serif;
}
#collectionModal .cm-head {
  height:38px; background:linear-gradient(#ececef,#dcdce0); border-bottom:1px solid rgba(0,0,0,0.12);
  display:flex; align-items:center; padding:0 14px; gap:8px; position:relative;
}
#collectionModal .cm-head .dot.close {
  position:relative; z-index:2;
  width:13px; height:13px; border-radius:50%;
  background:#ff5f57; border:1px solid rgba(0,0,0,0.18);
  cursor:pointer; padding:0; display:inline-flex; align-items:center; justify-content:center;
  color:transparent; transition: color .12s ease;
}
#collectionModal .cm-head .dot.close:hover { color:rgba(0,0,0,0.55); }
#collectionModal .cm-head .dot.close svg { display:block; pointer-events:none; }
#collectionModal .cm-head .cm-title { position:absolute; left:0; right:0; text-align:center; font-size:13px; color:#333; font-weight:600; letter-spacing:0.01em; pointer-events:none; }
#collectionModal .cm-body { overflow-y:auto; padding:22px 26px 28px; outline:none; }

/* Watchlist: native scrollbar hidden, ▲/▼ buttons drive scrolling.
   Wheel, trackpad, and keyboard (cm-body has tabindex) scrolling are untouched. */
#collectionModal.kind-films .cm-body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
#collectionModal.kind-films .cm-body::-webkit-scrollbar { display:none; width:0; height:0; }

.cm-scroll-arrows {
  display:none; position:absolute; right:14px; bottom:22px; z-index:5;
  flex-direction:column; gap:6px;
}
#collectionModal.kind-films .cm-scroll-arrows { display:flex; }
.cm-arrow-btn {
  width:30px; height:26px; border-radius:8px; border:1px solid rgba(0,0,0,0.14);
  background:rgba(255,255,255,0.92); box-shadow:0 6px 14px rgba(0,0,0,0.2);
  font-size:11px; line-height:1; color:#444; cursor:pointer; padding:0;
  display:flex; align-items:center; justify-content:center;
  transition:background .15s ease, transform .1s ease, box-shadow .15s ease;
}
.cm-arrow-btn:hover { background:#fff; color:#111; box-shadow:0 8px 18px rgba(0,0,0,0.28); }
.cm-arrow-btn:active { transform:scale(0.92); }

/* Bookshelf: thin ladder scrollbar — a central rail with horizontal rungs */
#collectionModal.kind-books .cm-body {
  scrollbar-width: thin;
  scrollbar-color: #8a5a30 rgba(122,74,36,0.1);
}
#collectionModal.kind-books .cm-body::-webkit-scrollbar { width:14px; }
#collectionModal.kind-books .cm-body::-webkit-scrollbar-track {
  background: rgba(122,74,36,0.08);
  border-radius:3px;
}
#collectionModal.kind-books .cm-body::-webkit-scrollbar-thumb {
  background:
    repeating-linear-gradient(180deg, #a5713c 0 2px, transparent 2px 14px),
    linear-gradient(90deg, transparent 0 6px, #6b3f1d 6px 8px, transparent 8px 14px);
  border-radius:3px;
}
#collectionModal.kind-books .cm-body::-webkit-scrollbar-thumb:hover {
  background:
    repeating-linear-gradient(180deg, #c98a4c 0 2px, transparent 2px 14px),
    linear-gradient(90deg, transparent 0 6px, #8a5a30 6px 8px, transparent 8px 14px);
}

/* Bookshelf: wood shelves with book cover images */
.bookshelf {
  --shelf: #7a4a24;
  display:flex; flex-direction:column; gap:0;
  background:
    radial-gradient(ellipse at top, rgba(122,74,36,0.05), transparent 60%),
    linear-gradient(180deg, #f4ead7 0%, #ecdfc4 100%);
  padding:20px 22px 8px; border-radius:10px;
  box-shadow:inset 0 0 0 1px rgba(122,74,36,0.15);
}
.bookshelf .shelf-row {
  display:flex; align-items:flex-end; justify-content:flex-start; gap:12px;
  padding:4px 6px 0; min-height:170px; flex-wrap:nowrap; overflow-x:auto;
  scrollbar-width:thin;
}
.bookshelf .shelf-plank {
  height:14px; margin:0 -6px 22px; border-radius:2px;
  background:linear-gradient(180deg, #8a5a30 0%, #6b3f1d 50%, #4d2c14 100%);
  box-shadow:0 6px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
}
.bookshelf .book {
  position:relative; flex:0 0 auto; height:160px; width:auto;
  transition:transform 0.18s ease, box-shadow 0.18s ease;
  cursor:pointer; border-radius:2px;
  box-shadow:0 6px 10px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.22);
  background:#ddd;
}
.bookshelf .book img { display:block; height:160px; width:auto; border-radius:2px; }
.bookshelf .book:hover { transform:translateY(-6px) rotate(-1deg); box-shadow:0 14px 22px rgba(0,0,0,0.35); }
.bookshelf .book .caption {
  position:absolute; left:50%; bottom:calc(100% + 8px); transform:translateX(-50%);
  background:rgba(20,20,24,0.92); color:#fff; font-size:11px; letter-spacing:0.02em;
  padding:6px 10px; border-radius:6px; white-space:nowrap; opacity:0; pointer-events:none;
  transition:opacity 0.15s; max-width:220px; overflow:hidden; text-overflow:ellipsis;
}
.bookshelf .book:hover .caption { opacity:1; }

/* Watchlist: poster grid */
.posters { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:20px; }
.poster-card {
  background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 10px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05);
  transition:transform 0.2s ease, box-shadow 0.2s ease; cursor:pointer;
}
.poster-card:hover { transform:translateY(-4px); box-shadow:0 18px 34px rgba(0,0,0,0.28); }
.poster-card .poster-img { width:100%; aspect-ratio:2/3; background:#222; overflow:hidden; }
.poster-card .poster-img img { width:100%; height:100%; object-fit:cover; display:block; }
.poster-card .poster-meta { padding:10px 12px 12px; }
.poster-card .poster-title { font-size:14px; font-weight:600; color:#111; letter-spacing:-0.005em; }
.poster-card .poster-sub { font-size:11px; color:#6a6a70; margin-top:2px; }

/* iOS Photos "Library" view */
.ios-photos { position:relative; }
.ios-photos-head { padding:2px 2px 14px; }
.ios-photos-title { font-size:32px; font-weight:800; letter-spacing:-0.01em; color:#111; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif; }
.ios-photos-sub { font-size:12px; color:rgba(0,0,0,0.5); margin-top:2px; letter-spacing:0.02em; }
body[data-theme="night"] .ios-photos-title { color:#f2f4f8; }
body[data-theme="night"] .ios-photos-sub { color:rgba(255,255,255,0.55); }
.ios-photos-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:2px; border-radius:6px; overflow:hidden; }
.ios-photo { position:relative; aspect-ratio:1/1; background:#0a0a0a; overflow:hidden; }
.ios-photo img { width:100%; height:100%; object-fit:cover; display:block; }
.ios-photos-tabs {
  display:flex; align-items:center; justify-content:space-around;
  margin:18px auto 2px; padding:10px 14px; max-width:340px;
  background:rgba(240,240,245,0.85); backdrop-filter:blur(20px);
  border-radius:999px; color:rgba(0,0,0,0.55);
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; font-size:11px; letter-spacing:0.02em;
  box-shadow:0 8px 24px rgba(0,0,0,0.08);
}
body[data-theme="night"] .ios-photos-tabs { background:rgba(30,32,38,0.75); color:rgba(255,255,255,0.6); }
.ios-photos-tabs .ios-tab { display:flex; flex-direction:column; align-items:center; gap:2px; padding:2px 8px; }
.ios-photos-tabs .ios-tab svg { width:20px; height:20px; }
.ios-photos-tabs .ios-tab.active { color:#1877e6; font-weight:600; }
@media (max-width:560px) { .ios-photos-title { font-size:26px; } }

/* Photo carousel/lightbox — iOS-style full screen viewer */
.ios-lightbox {
  position:fixed; inset:0; z-index:1200; background:#000;
  display:none; flex-direction:column;
  animation:iosLbIn 0.18s ease-out;
}
.ios-lightbox.open { display:flex; }
@keyframes iosLbIn { from { opacity:0; transform:scale(0.98); } to { opacity:1; transform:scale(1); } }
.ios-lb-top {
  position:absolute; top:0; left:0; right:0; z-index:2;
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px; color:#fff;
  background:linear-gradient(180deg, rgba(0,0,0,0.55), transparent);
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; font-size:14px;
}
.ios-lb-top .ios-lb-close { background:transparent; border:0; color:#fff; font-size:16px; cursor:pointer; padding:6px 10px; }
.ios-lb-count { font-variant-numeric:tabular-nums; letter-spacing:0.02em; }
.ios-lb-stage {
  flex:1; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory;
  display:flex; scrollbar-width:none;
}
.ios-lb-stage::-webkit-scrollbar { display:none; }
.ios-lb-slide {
  flex:0 0 100%; scroll-snap-align:center;
  display:flex; align-items:center; justify-content:center; padding:44px 8px;
}
.ios-lb-slide img { max-width:100%; max-height:100%; object-fit:contain; user-select:none; -webkit-user-drag:none; }
.ios-lb-strip {
  display:flex; gap:4px; overflow-x:auto; padding:10px 12px 14px;
  background:rgba(0,0,0,0.85); scrollbar-width:none;
}
.ios-lb-strip::-webkit-scrollbar { display:none; }
.ios-lb-thumb {
  flex:0 0 44px; height:44px; border-radius:4px; overflow:hidden;
  opacity:0.5; transition:opacity 0.15s, transform 0.15s; cursor:pointer;
  border:2px solid transparent;
}
.ios-lb-thumb.active { opacity:1; border-color:#fff; transform:scale(1.05); }
.ios-lb-thumb img { width:100%; height:100%; object-fit:cover; }
.ios-photo { cursor:pointer; }
.ios-photo:active { opacity:0.85; }

.photo-node .thumb {
  position:relative; width:var(--pw,140px); height:var(--ph,140px); border:none; background:transparent; padding:0;
  border-radius:3px; overflow:hidden;
  box-shadow:0 10px 22px rgba(20,30,50,0.32), 0 3px 6px rgba(20,30,50,0.18), 0 1px 0 rgba(255,255,255,0.15) inset;
}
/* smaller, icon-scale photos so they don't compete with app icons */
.photo-node .thumb { width:calc(var(--pw,140px) * 0.6); height:calc(var(--ph,140px) * 0.6); }
/* flat — no hover lift on desktop photos */
.photo-node .thumb img { display:block; width:100%; height:100%; object-fit:cover; -webkit-user-drag:none; user-drag:none; user-select:none; pointer-events:none; }
.node, .node * { -webkit-user-drag:none; }
/* Finder-style selection: soft gray rounded backdrop + blue label pill */
.node .selection-ring { position:absolute; inset:-8px -10px -6px -10px; border-radius:10px; background:rgba(120,130,145,0.32); backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px); opacity:0; pointer-events:none; transition:opacity 0.08s; z-index:-1; }
.node.selected .selection-ring { opacity:1; }
body[data-theme="night"] .node .selection-ring { background:rgba(180,190,205,0.28); }
.photo-node .thumb::after { display:none; }

/* ---- Right-click-drag marquee (rubber-band) selection box ---- */
:root {
  --marquee-border: rgba(24,119,230,0.9);
  --marquee-fill: rgba(24,119,230,0.14);
}
body[data-theme="sky"]    { --marquee-border: rgba(24,119,230,0.9);  --marquee-fill: rgba(24,119,230,0.14); }
body[data-theme="forest"] { --marquee-border: rgba(86,168,96,0.92);  --marquee-fill: rgba(86,168,96,0.16); }
body[data-theme="desert"] { --marquee-border: rgba(196,132,58,0.92); --marquee-fill: rgba(196,132,58,0.17); }
body[data-theme="night"]  { --marquee-border: rgba(150,178,255,0.92); --marquee-fill: rgba(150,178,255,0.16); }
#marquee-select {
  position: fixed;
  left: 0; top: 0; width: 0; height: 0;
  display: none;
  border: 1px solid var(--marquee-border);
  background: var(--marquee-fill);
  border-radius: 2px;
  z-index: 9000;
  pointer-events: none;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.15) inset;
}
body.marquee-active,
body.marquee-active * {
  user-select: none !important;
  -webkit-user-select: none !important;
}
body.marquee-active { cursor: crosshair; }
.node.selected .node-label { background:#1877e6; color:#fff; border-radius:6px; padding:2px 9px; text-shadow:none; }
.node.selected .node-sub { color:rgba(255,255,255,0.9); background:#1877e6; border-radius:6px; padding:1px 7px; }
.node.trashed { display:none !important; }
@media (max-width:560px) {
  #previewModal { padding:6px; }
  #previewModal.resume-preview > div { width:min(94vw, 360px) !important; max-height:92dvh !important; border-radius:10px !important; }
  #previewModal.resume-preview #pvScroll { overflow:hidden !important; }
  #previewModal.resume-preview #pvScroll > div:first-child { padding:8px !important; }
  #previewModal.resume-preview #pvImg { width:auto !important; max-width:100% !important; max-height:66dvh !important; object-fit:contain !important; }
  #previewModal.resume-preview #pvScroll > div:nth-child(3) { display:none !important; }
  #previewModal.resume-preview #pvTitle { font-size:18px !important; }
  #previewModal.resume-preview #pvSub { font-size:11px !important; }
  #previewModal.resume-preview #pvScroll > div:nth-child(2) { padding:8px 16px 12px !important; }
}

.note-doc { color:#2b2722; }
.note-doc h2 { font-size:22px; margin:0 0 10px; letter-spacing:0; }
.note-doc p { margin:0 0 10px; font-size:14px; line-height:1.55; }
.note-doc ul { margin:8px 0 0 18px; font-size:13px; line-height:1.6; }

@keyframes drift { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-4px); } }

#lineSvg { position:absolute; inset:0; width:2200px; height:1300px; z-index:3; pointer-events:none; overflow:visible; }

/* ============ DOCK ============ */
.dock-wrap { position:fixed; bottom:0; left:0; right:0; z-index:300; display:flex; flex-direction:column; align-items:center; padding-bottom:14px; pointer-events:none; }
.dock-section-label { font-size:8px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(51,77,110,0.55); margin-bottom:6px; transition:color 0.5s; }
body[data-theme="night"] .dock-section-label { color:rgba(210,220,235,0.5); }
.dock {
  pointer-events:auto; display:flex; align-items:flex-end; gap:8px;
  background:rgba(223,233,245,0.55); backdrop-filter:blur(22px) saturate(160%);
  border:1px solid rgba(255,255,255,0.5); border-radius:16px; padding:9px 14px;
  box-shadow:0 10px 34px rgba(30,50,80,0.18), inset 0 1px 0 rgba(255,255,255,0.6);
  transition:background 0.5s;
}
body[data-theme="night"] .dock { background:rgba(20,26,40,0.6); border-color:rgba(255,255,255,0.12); }
.di { display:flex; flex-direction:column; align-items:center; position:relative; cursor:pointer; transform-origin:bottom center; }
.di-lbl {
  position:absolute; bottom:calc(100% + 22px); left:50%; transform:translateX(-50%) translateY(6px);
  background:rgba(20,25,35,0.95); color:#fff; font-size:11px; letter-spacing:0.05em; font-weight:500;
  padding:6px 12px; border-radius:6px; white-space:nowrap; opacity:0; z-index:400;
  transition:opacity 0.15s, transform 0.15s; pointer-events:none;
  box-shadow:0 4px 16px rgba(0,0,0,0.35);
}
.di-lbl::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:4px solid transparent; border-top-color:rgba(30,50,80,0.9); }
.di:hover .di-lbl { opacity:1; transform:translateX(-50%) translateY(0); }
.di-icon {
  width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center;
  background:transparent; box-shadow:0 3px 10px rgba(30,50,80,0.22);
  transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); transform-origin:bottom center;
  overflow:hidden;
}
.di:hover .di-icon { transform:translateY(-10px) scale(1.18); box-shadow:0 8px 18px rgba(30,50,80,0.28); }
body[data-theme="night"] .di-icon { background:transparent; }
.di-icon svg { width:60%; height:60%; }
.di-icon img { width:100%; height:100%; object-fit:cover; border-radius:12px; display:block; }
.di-dot { width:3px; height:3px; border-radius:50%; background:rgba(74,111,160,0.6); margin-top:4px; opacity:0; transition:opacity 0.15s; }
.di.active .di-dot { opacity:1; }
.ddiv { width:1px; height:30px; background:rgba(74,111,160,0.25); margin:0 3px; align-self:center; }

/* NIGHT: monochrome white details on pure black */
body[data-theme="night"] { background:#000; }
body[data-theme="night"] .bp-line { background:rgba(255,255,255,0.13); }
body[data-theme="night"] .crosshair::before,
body[data-theme="night"] .crosshair::after { background:rgba(255,255,255,0.55); }
body[data-theme="night"] .coord { color:rgba(255,255,255,0.7); }
body[data-theme="night"] .dot-cluster span { background:rgba(255,255,255,0.55); }
body[data-theme="night"] .node-label { color:rgba(255,255,255,0.85); }
body[data-theme="night"] .node-sub { color:rgba(255,255,255,0.5); }
body[data-theme="night"] .folder .tab { background:rgba(255,255,255,0.85) !important; }
body[data-theme="night"] .folder .tab { background:#ffffff !important; }
body[data-theme="night"] .folder .body { background:linear-gradient(180deg,#ffffff 0%,#e8e8e8 100%); border-color:rgba(255,255,255,0.9); }
body[data-theme="night"] .folder .body::after { border-color:rgba(0,0,0,0.15); }
body[data-theme="night"] .dock-section-label { color:rgba(255,255,255,0.55); }
body[data-theme="night"] .dock { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.15); }
body[data-theme="night"]  { --accent:#ffffff; --accent-soft:rgba(255,255,255,0.55); --accent-glow:rgba(255,255,255,0.3); }
body[data-theme="night"] .tech-grid { opacity:0.42; }

/* FOREST: dark scrim behind text so labels stay legible over green hills */
body[data-theme="forest"] .node-label,
body[data-theme="forest"] .node-sub {
  color:#ffffff;
  text-shadow:0 1px 3px rgba(0,0,0,0.75), 0 0 8px rgba(0,0,0,0.55);
}
body[data-theme="forest"] .bp-tagline,
body[data-theme="forest"] #brand-stack,
body[data-theme="forest"] #copyright {
  color:#ffffff;
  text-shadow:0 1px 2px rgba(0,0,0,0.6);
}
body[data-theme="forest"] #copyright { color:rgba(255,255,255,0.92); }

/* SKY: bright wallpaper — force white copy with soft shadow for legibility */
body[data-theme="sky"] .node-label,
body[data-theme="sky"] .node-sub {
  color:#ffffff;
  text-shadow:0 1px 3px rgba(30,50,80,0.6), 0 0 10px rgba(30,50,80,0.35);
}
body[data-theme="sky"] #brand-stack,
body[data-theme="sky"] .bp-tagline,
body[data-theme="sky"] #copyright {
  color:#ffffff;
  text-shadow:0 1px 3px rgba(30,50,80,0.5);
}
body[data-theme="sky"] #brand-stack .avail { color:#ffffff; }

/* Tech Stack dock label — brighten on colorful wallpapers */
body[data-theme="sky"] .dock-section-label,
body[data-theme="forest"] .dock-section-label,
body[data-theme="desert"] .dock-section-label {
  color:rgba(255,255,255,0.9);
  text-shadow:0 1px 3px rgba(30,40,60,0.45);
}

/* ============ Per-theme folder colors ============ */
body[data-theme="sky"] .folder .tab   { background:linear-gradient(180deg,#5aa7ff,#3d8fe8); }
body[data-theme="sky"] .folder .body  { background:linear-gradient(180deg,#7ab8ff 0%,#4a95e8 100%); }
body[data-theme="forest"] .folder .tab  { background:linear-gradient(180deg,#94b47a,#6c8e55); }
body[data-theme="forest"] .folder .body { background:linear-gradient(180deg,#a9c58a 0%,#6e8e57 100%); }
body[data-theme="desert"] .folder .tab  { background:linear-gradient(180deg,#e9a58c,#c9765f); }
body[data-theme="desert"] .folder .body { background:linear-gradient(180deg,#f0b79f 0%,#c97a63 100%); }

@media (max-width: 760px) {
  #menubar { height:42px; padding:0 10px; gap:8px; font-size:9px; }
  #menubar .brand { font-size:11px !important; gap:6px; }
  #menubar .brand-logo { width:18px; height:18px; }
  #menubar .tagline-inline, #menubar .status-dot, #menubar .right > span:nth-of-type(1) { display:none; }
  #menubar .right { gap:8px; flex:0 1 auto; }
  #layer-wrap { top:42px; bottom:0; }
  .di-icon { width:56px; height:56px; border-radius:14px; }
  .di-icon img { border-radius:14px; }
  .dock { gap:5px; padding:8px 10px; max-width:calc(100vw - 18px); }
}

/* Mobile: compact wallpaper pill; keep hero copy clear of right-edge overlays;
   widget rail is centered/stacked below the hero (see later override). */
@media (max-width: 760px) {
  #wallpaper-picker {
    top:50px; right:10px; width:auto; padding:5px 8px; gap:6px;
    box-shadow:0 6px 16px rgba(30,50,80,0.18);
  }
  #wallpaper-picker .wp-title { display:none; }
  #wallpaper-picker .wp-grid { gap:5px; }
  .wp-swatch { width:22px; height:22px; }
  .wp-swatch svg { width:12px; height:12px; }
  #brand-stack {
    top:56px; left:12px;
    max-width:calc(100vw - 160px);
  }
  #brand-stack .hero-lede {
    max-width:calc(100vw - 160px);
    font-size:9px; line-height:1.4;
  }
  #brand-stack .avail { font-size:9px; letter-spacing:0.12em; }
}

/* ============ Wallpaper picker (aligned to widget rail width) ============ */
#wallpaper-picker {
  position:fixed; top:48px; right:14px; z-index:210; width:300px; box-sizing:border-box;
  background:rgba(255,255,255,0.55); backdrop-filter:blur(18px) saturate(160%);
  border:1px solid rgba(0,0,0,0.08); border-radius:14px; padding:8px 12px;
  box-shadow:0 10px 30px rgba(30,50,80,0.14);
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  font-family:"Courier New",monospace;
  transition:background 0.4s, color 0.4s, border-color 0.4s;
}
body[data-theme="night"] #wallpaper-picker { background:rgba(0,0,0,0.55); border-color:rgba(255,255,255,0.14); color:#fff; }
#wallpaper-picker .wp-title {
  font-size:9px; letter-spacing:0.16em; text-transform:uppercase;
  color:rgba(40,40,40,0.7); flex:0 0 auto;
}
body[data-theme="night"] #wallpaper-picker .wp-title { color:rgba(220,228,240,0.8); }
#wallpaper-picker .wp-grid { display:flex; gap:6px; }
.wp-swatch {
  width:26px; height:26px; border-radius:50%; cursor:pointer; padding:0; overflow:hidden;
  border:1.5px solid rgba(255,255,255,0.85); position:relative;
  display:inline-flex; align-items:center; justify-content:center;
  color:rgba(60,60,70,0.9);
  box-shadow:0 1px 4px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.35);
  transition:filter 0.15s, border-color 0.15s, box-shadow 0.15s;
}
body[data-theme="night"] .wp-swatch { color:rgba(230,235,245,0.95); }
.wp-swatch:hover { filter:brightness(1.08); box-shadow:0 2px 6px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.5); }
.wp-swatch.active { border-color:#ffffff; box-shadow:0 0 0 2px rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.2); }
.wp-swatch svg { width:15px; height:15px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
/* pastel-colored icon tint per swatch — soft, scene-matched */
.wp-swatch[data-theme="sky"]    { color:#f2b45c; }   /* soft sun */
.wp-swatch[data-theme="forest"] { color:#6fae7a; }   /* fern */
.wp-swatch[data-theme="desert"] { color:#d47a86; }   /* dusty rose */
.wp-swatch[data-theme="night"]  { color:#eef1f8; }   /* crescent moon on dark */
.wp-swatch[data-theme="night"] { border-color:rgba(255,255,255,0.4); }

/* ============ Right-side widget rail ============ */
#widget-rail { position:fixed; top:104px; right:14px; z-index:200; display:flex; flex-direction:column; gap:10px; width:300px; max-height:calc(100vh - 120px); }
.widget {
  background:rgba(255,255,255,0.55); backdrop-filter:blur(18px) saturate(160%);
  border:1px solid rgba(0,0,0,0.08); border-radius:14px; padding:10px;
  box-shadow:0 10px 30px rgba(30,50,80,0.14);
  font-family:"Courier New",monospace; color:rgba(30,40,60,0.9);
  transition:background 0.4s, color 0.4s, border-color 0.4s;
}
body[data-theme="night"] .widget { background:rgba(0,0,0,0.55); border-color:rgba(255,255,255,0.14); color:#fff; }
.widget .w-title { font-size:9px; letter-spacing:0.14em; text-transform:uppercase; opacity:0.65; margin-bottom:6px; }
#music-widget { padding:12px 12px 14px; display:grid; grid-template-columns:56px 1fr; grid-template-rows:auto auto; gap:6px 12px; align-items:center; }
#music-widget .w-title { grid-column:1 / -1; }
.mp-cover { grid-row:2 / span 2; width:56px; height:56px; border-radius:50%; background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(0,0,0,0) 55%), var(--accent, #4A6FA0); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.25); overflow:hidden; }
.mp-disc { width:100%; height:100%; border-radius:50%; background:repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0 2px, transparent 2px 4px), #1a1a1e; display:flex; align-items:center; justify-content:center; animation:mpspin 8s linear infinite paused; }
#music-widget.playing .mp-disc { animation-play-state:running; }
.mp-hole { width:12px; height:12px; border-radius:50%; background:var(--accent, #4A6FA0); box-shadow:0 0 0 2px rgba(0,0,0,0.4); }
@keyframes mpspin { to { transform:rotate(360deg); } }
.mp-meta { min-width:0; }
.mp-track { font-size:12px; font-weight:600; letter-spacing:0.03em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mp-artist { font-size:10px; opacity:0.65; letter-spacing:0.08em; text-transform:uppercase; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mp-controls { display:flex; align-items:center; gap:8px; }
.mp-btn { width:26px; height:26px; border-radius:50%; border:1px solid rgba(0,0,0,0.12); background:rgba(255,255,255,0.55); display:inline-flex; align-items:center; justify-content:center; cursor:pointer; color:inherit; padding:0; transition:transform .12s, background .15s; }
.mp-btn:hover { transform:scale(1.06); background:rgba(255,255,255,0.85); }
.mp-btn.mp-play { width:32px; height:32px; background:var(--accent,#4A6FA0); color:#fff; border-color:transparent; }
.mp-btn.mp-play:hover { background:var(--accent,#4A6FA0); filter:brightness(1.08); }
body[data-theme="night"] .mp-btn { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.18); color:#fff; }
body[data-theme="night"] .mp-btn.mp-play { background:#fff; color:#000; }
/* Bricks game widget (monochrome brick breaker) */
#snake-widget { padding:10px; }
#snake-widget .brick-wrap { position:relative; border-radius:10px; overflow:hidden; background:#fafaf8; border:1px solid rgba(0,0,0,0.08); touch-action:none; user-select:none; }
body[data-theme="night"] #snake-widget .brick-wrap { background:#0b0c0f; border-color:rgba(255,255,255,0.08); }
#snake-widget canvas { display:block; width:100%; height:auto; cursor:crosshair; touch-action:none; user-select:none; }
#snake-widget .brick-overlay {
  position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:4px; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.85;
  background:rgba(250,250,248,0.6); backdrop-filter:blur(2px); pointer-events:none; transition:opacity 0.2s;
}
body[data-theme="night"] #snake-widget .brick-overlay { background:rgba(11,12,15,0.55); color:#eaeaea; }
#snake-widget .brick-overlay .k { font-size:18px; letter-spacing:0; }
#snake-widget.playing .brick-overlay { opacity:0; }
#snake-widget .game-meta { display:flex; justify-content:space-between; margin-top:8px; font-size:9px; letter-spacing:0.14em; text-transform:uppercase; opacity:0.7; }
#snake-widget .game-expand { cursor:pointer; opacity:0.7; }
#snake-widget .game-expand:hover { opacity:1; }
/* Bricks fullscreen modal */
#snakeModal { position:fixed; inset:0; z-index:1000; display:none; align-items:center; justify-content:center; background:rgba(20,20,20,0.55); backdrop-filter:blur(12px); }
#snakeModal.open { display:flex; }
#snakeModal .sm-card { background:#fafaf8; color:#111; border:1px solid rgba(0,0,0,0.08); border-radius:18px; padding:22px; box-shadow:0 30px 80px rgba(0,0,0,0.35); max-width:min(560px,94vw); width:100%; }
body[data-theme="night"] #snakeModal .sm-card { background:#0b0c0f; color:#eaeaea; border-color:rgba(255,255,255,0.1); }
#snakeModal .sm-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; font-family:"SF Pro Text",-apple-system,sans-serif; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.75; gap:12px; }
#snakeModal .sm-close { cursor:pointer; opacity:0.7; background:none; border:none; color:inherit; font-size:18px; }
#snakeModal .sm-close:hover { opacity:1; }
#snakeModal .brick-wrap.large { position:relative; border-radius:14px; overflow:hidden; background:#fafaf8; border:1px solid rgba(0,0,0,0.08); touch-action:none; user-select:none; }
body[data-theme="night"] #snakeModal .brick-wrap.large { background:#0b0c0f; border-color:rgba(255,255,255,0.08); }
#snakeModal canvas { display:block; width:100%; height:auto; cursor:crosshair; touch-action:none; user-select:none; }
#snakeModal .brick-overlay { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; opacity:0.9; background:rgba(250,250,248,0.55); backdrop-filter:blur(2px); pointer-events:none; transition:opacity 0.2s; }
body[data-theme="night"] #snakeModal .brick-overlay { background:rgba(11,12,15,0.5); color:#eaeaea; }
#snakeModal .brick-overlay .k { font-size:26px; letter-spacing:0; }
#snakeModal.playing .brick-overlay { opacity:0; }
#snakeModal .gm-reset { background:none; border:1px solid currentColor; color:inherit; font:inherit; padding:4px 10px; border-radius:999px; cursor:pointer; opacity:0.7; letter-spacing:0.14em; text-transform:uppercase; font-size:10px; }
#snakeModal .gm-reset:hover { opacity:1; }
/* prevent hover-repaint glitches around the right rail */
#widget-rail, #wallpaper-picker { contain:layout paint; isolation:isolate; will-change:transform; }
#widget-rail .widget { transform:translateZ(0); isolation:isolate; }
/* Awards widget */
#awards-widget .w-title { display:flex; justify-content:space-between; align-items:center; }
#awards-widget .w-title .aw-count { opacity:0.55; letter-spacing:0.14em; }
#awards-widget .aw-grid { display:flex; gap:12px; margin-top:6px; align-items:center; justify-content:flex-start; }
.aw-badge { position:relative; display:block; width:58px; height:58px; border-radius:50%; overflow:hidden; transition:transform 0.18s ease, box-shadow 0.18s ease; flex:0 0 auto; }
.aw-badge:hover { transform:translateY(-2px) scale(1.08); box-shadow:0 8px 18px rgba(0,0,0,0.25); }
.aw-badge img { width:100%; height:100%; display:block; }
.aw-badge .aw-day { display:block; }
.aw-badge .aw-night { display:none; }
body[data-theme="night"] .aw-badge .aw-day { display:none; }
body[data-theme="night"] .aw-badge .aw-night { display:block; }
.aw-caption { font-size:9px; opacity:0.6; letter-spacing:0.06em; margin-top:8px; text-align:left; }
/* Hide broken-image icon for locked assets before signed URLs load */
img[data-locked][src=""] { visibility:hidden; }
.photo-node[data-kind="resume"] .thumb {
  background:
    linear-gradient(180deg, #fdfcf7 0%, #f2ede0 100%);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.12);
  position:relative;
}
.photo-node[data-kind="resume"] .thumb::before {
  content:"";
  position:absolute; inset:14% 18%;
  background:
    linear-gradient(#c8c0aa, #c8c0aa) top/100% 8% no-repeat,
    repeating-linear-gradient(180deg, transparent 0 6px, rgba(60,50,30,0.18) 6px 7px);
  opacity:0.55;
  pointer-events:none;
}
body[data-theme="night"] .photo-node[data-kind="resume"] .thumb {
  background:linear-gradient(180deg, #2b2b30 0%, #1e1e22 100%);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px rgba(0,0,0,0.4);
}

/* Mobile drawer is hidden on desktop/tablet */
#mobile-drawer { display:none; }

/* ============ Recycle bin + hedgehog ============ */
.trash-di .di-icon { background:rgba(255,255,255,0.32); }
.trash-di.drag-over .di-icon { transform:translateY(-12px) scale(1.22) !important; box-shadow:0 0 0 2px rgba(47,123,255,0.65), 0 12px 24px rgba(30,50,80,0.28); }
#trashModal { position:fixed; inset:0; z-index:6200; display:none; align-items:center; justify-content:center; background:rgba(10,14,22,0.54); backdrop-filter:blur(8px); }
#trashModal.open { display:flex; }
#trashModal .trash-card { width:min(520px,92vw); max-height:78vh; background:#f6f3ee; border-radius:16px; overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(0,0,0,0.12); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
#trashModal .trash-head { height:38px; background:linear-gradient(#ececef,#dcdce0); border-bottom:1px solid rgba(0,0,0,0.12); display:flex; align-items:center; padding:0 14px; gap:8px; position:relative; }
#trashModal .trash-close { width:13px; height:13px; border-radius:50%; background:#ff5f57; border:1px solid rgba(0,0,0,0.18); padding:0; }
#trashModal .trash-title { position:absolute; left:0; right:0; text-align:center; font-size:13px; color:#333; font-weight:600; pointer-events:none; }
#trashModal .trash-body { padding:16px; overflow:auto; max-height:calc(78vh - 38px); }
.trash-empty { padding:34px 16px; text-align:center; color:#777; font-size:13px; }
.trash-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; border-radius:10px; background:#fff; box-shadow:0 1px 0 rgba(0,0,0,0.06); margin-bottom:8px; }
.trash-row-name { font-size:13px; color:#222; }
.restore-btn { border:0; border-radius:999px; padding:6px 10px; background:#111; color:#fff; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; }
#hedgehog { position:fixed; left:16px; right:auto; top:auto; bottom:36px; z-index:260; width:58px; height:58px; display:flex; align-items:center; justify-content:center; pointer-events:auto; filter:drop-shadow(0 10px 18px rgba(0,0,0,0.28)); touch-action:none; user-select:none; }
@media (max-width:900px) { #hedgehog { left:16px; right:auto; top:auto; bottom:120px; } }
#hedgehog .critter { width:52px; height:52px; overflow:visible; animation:critterBob 3.4s ease-in-out infinite; transition:transform .12s; }
#hedgehog.dragging { filter:drop-shadow(0 18px 26px rgba(0,0,0,0.35)); }
#hedgehog.dragging .critter { animation:none; transform:scale(1.08); }
#hedgehog .critter .body { fill: var(--sprout-body, #f6c9a8); transition:fill .6s ease; }
#hedgehog .critter .foot { fill: var(--sprout-foot, #e8a983); transition:fill .6s ease; }
#hedgehog .critter .cheek { fill: var(--sprout-cheek, #f2a68f); transition:fill .6s ease; }
#hedgehog .critter .leaf1 { fill: var(--sprout-leaf1, #7bbf7a); transition:fill .6s ease; }
#hedgehog .critter .leaf2 { fill: var(--sprout-leaf2, #8fd18e); transition:fill .6s ease; }
body[data-theme="sky"]    { --sprout-body:#dbeaf7; --sprout-foot:#afc8df; --sprout-cheek:#8fb7d9; --sprout-leaf1:#6895bd; --sprout-leaf2:#93b9d8; }
body[data-theme="forest"] { --sprout-body:#d7e6cf; --sprout-foot:#a9c199; --sprout-cheek:#c4a068; --sprout-leaf1:#7fa663; --sprout-leaf2:#a0c47f; }
body[data-theme="desert"] { --sprout-body:#efd4b4; --sprout-foot:#c99c74; --sprout-cheek:#d98266; --sprout-leaf1:#a05e3a; --sprout-leaf2:#c58a5a; }
body[data-theme="night"]  { --sprout-body:#2e3450; --sprout-foot:#20263e; --sprout-cheek:#5a4a78; --sprout-leaf1:#8a9bd0; --sprout-leaf2:#b8c4e6; }
#hedgehog .hedge-bubble { position:absolute; left:52px; right:auto; top:-8px; bottom:auto; min-width:150px; background:rgba(255,250,242,0.96); color:#2b2320; border:1px solid rgba(0,0,0,0.08); border-radius:12px; padding:8px 11px; font:11px/1.3 -apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; box-shadow:0 10px 24px rgba(0,0,0,0.18); opacity:0; transform:translateY(6px); transition:opacity .2s, transform .2s; pointer-events:none; white-space:nowrap; }
#hedgehog.say .hedge-bubble, #hedgehog:hover .hedge-bubble { opacity:1; transform:translateY(0); }
body[data-theme="night"] #hedgehog .hedge-bubble { background:rgba(20,20,20,0.94); color:#fff7ec; border-color:rgba(255,255,255,0.12); }
@keyframes critterBob { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-3px); } }
@keyframes critterBlink { 0%,92%,100%{ transform:scaleY(1); } 95%{ transform:scaleY(0.1); } }
#hedgehog .eye { transform-origin:center; animation:critterBlink 4.2s ease-in-out infinite; }
@media (max-width: 760px) {
  /* --------- MOBILE LAYOUT (final) ---------
     Bottom is a drag-up drawer. When closed, only a slim handle peeks
     above the dock. Drag/tap the handle to reveal music /
     wallpaper / snake. Sprout sits above the drawer on the left. */

  /* Mobile: uniform 72px rounded-square tiles (iPhone home-screen rhythm).
     All specifics live below inside #layer overrides so folders, photos,
     notes, and icon tiles share the same footprint. */
  /* Mobile desktop: use a real scrollable grid instead of squeezing the
     2200px desktop canvas into the phone. The old scaled canvas was what
     created the hard horizontal clipping band where icons seemed to vanish. */
  #stage { overflow:hidden; }
  #layer-wrap {
    top:42px !important; bottom:0 !important;
    overflow:hidden !important;
    /* extra top padding so first icon row clears the hero copy */
    padding:130px 8px 130px;
  }
  #layer {
    position:relative !important;
    left:auto !important; top:auto !important;
    width:100% !important; height:100% !important;
    padding:0 !important;
    transform:none !important; transform-origin:top left !important; will-change:auto;
    display:grid; grid-template-columns:repeat(4, minmax(0, 1fr));
    column-gap:6px; row-gap:14px; align-items:start; align-content:start; justify-items:center;
    grid-auto-rows:max-content;
  }
  #lineSvg, .bp-line, .crosshair, .dot-cluster, .coord { display:none !important; }
  #layer .node {
    position:relative !important; left:auto !important; top:auto !important;
    width:76px; justify-self:center;
    display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
    transform:none !important;
    min-height:88px;
  }
  #layer .node:hover { transform:none !important; }
  #layer .node-label {
    font-size:10.5px !important; line-height:1.2 !important;
    margin-top:5px !important; width:76px; text-align:center;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  #layer .node-sub {
    display:none !important;
  }
  /* iPhone home-screen rhythm: every tile is a uniform 60px rounded square */
  #layer .folder,
  #layer .photo-node .thumb,
  #layer .note-thumb,
  #layer .icon-tile {
    width:60px !important;
    height:60px !important;
    border-radius:14px !important;
    box-sizing:border-box;
  }
  #layer .icon-tile { padding:6px !important; }
  /* Photos: rainbow glyph fills the tile edge-to-edge like other apps */
  #layer #n-photos .icon-tile {
    padding:0 !important; background:#ffffff !important;
    display:flex !important; align-items:center !important; justify-content:center !important;
  }
  #layer #n-photos .photos-flower {
    width:78% !important; height:78% !important;
    display:block !important; margin:0 !important;
    object-fit:contain;
  }
  /* Note-thumb: hide desktop paper-line decorations at this small size */
  #layer .note-thumb::before { left:4px; right:4px; top:4px; height:5px; border-radius:2px; }
  #layer .note-thumb::after { display:none; }
  /* Photo thumbs: square, filling the tile */
  #layer .photo-node .thumb { border-radius:14px; }
  #layer .photo-node[data-kind="resume"] .thumb { border-radius:14px; }
  /* case study folders sit in the same uniform square footprint as other tiles */
  /* order: utility icons first, case studies drop to bottom rows */
  #layer .node { order: 5; }
  #layer #n-photos    { order: 1; }
  #layer #n-drawpad  { order: 2; }
  #layer #n-artboard  { order: 3; }
  #layer #n-bookshelf { order: 4; }
  #layer #n-watchlist { order: 5; }
  #layer #n-synth     { order: 6; }
  #layer #n-resume    { order: 7; }
  /* Hide individual photos on mobile — replaced by aggregated Photos folder. Keep resume (a PDF). */
  #layer .photo-node:not(#n-resume) { display:none !important; }
  #layer .photos-mobile { display:flex !important; }

  /* Dock — bottom, above copyright, sitting on the drawer handle */
  .dock-wrap {
    position:fixed; top:auto; left:0; right:0;
    bottom:78px; z-index:210; padding-bottom:0;
  }
  .dock-section-label { display:none; }
  .dock {
    gap:5px; padding:6px 9px; border-radius:16px;
    max-width:calc(100vw - 16px); overflow:visible;
    flex-wrap:nowrap;
  }
  .dock::-webkit-scrollbar { display:none; }
  .di { position:relative; }
  .di-icon { width:30px; height:30px; border-radius:8px; }
  .di-icon img { border-radius:8px; }
  .di:hover .di-icon, .di:active .di-icon { transform:translateY(-6px) scale(1.15); z-index:5; }
  .di-lbl { font-size:10px; padding:4px 8px; bottom:calc(100% + 10px); z-index:20; }

  /* ------- Bottom Drawer (mobile only) ------- */
  #mobile-drawer {
    display:flex; flex-direction:column;
    position:fixed; left:0; right:0; bottom:0; z-index:180;
    height:calc(100vh - 44px); padding:0 10px 10px;
    background:rgba(255,255,255,0.72);
    backdrop-filter:blur(22px) saturate(1.2);
    -webkit-backdrop-filter:blur(22px) saturate(1.2);
    border-top:1px solid rgba(255,255,255,0.5);
    border-radius:22px 22px 0 0;
    box-shadow:0 -12px 30px rgba(0,0,0,0.14);
    transform:translateY(calc(100% - 46px));
    transition:transform .32s cubic-bezier(.4,.14,.3,1);
    touch-action:none;
  }
  body[data-theme="night"] #mobile-drawer {
    background:rgba(20,22,28,0.78); border-top-color:rgba(255,255,255,0.08);
  }
  #mobile-drawer.open { transform:translateY(0); z-index:350; }
  /* When drawer is open, hide everything behind it */
  body.drawer-open .dock-wrap,
  body.drawer-open #hedgehog,
  body.drawer-open #copyright,
  body.drawer-open #stage,
  body.drawer-open #wallpaper-picker-desktop { visibility:hidden; }
  #mobile-drawer .md-handle {
    height:46px; display:flex; align-items:center; justify-content:center;
    cursor:grab; flex-shrink:0;
  }
  #mobile-drawer .md-handle:active { cursor:grabbing; }
  #mobile-drawer .md-grip {
    width:44px; height:5px; border-radius:3px;
    background:rgba(0,0,0,0.28);
  }
  body[data-theme="night"] #mobile-drawer .md-grip { background:rgba(255,255,255,0.4); }
  #mobile-drawer .md-body {
    flex:1; min-height:0; overflow:hidden;
    display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto auto auto;
    gap:8px; padding:2px 4px 6px;
  }

  /* Reset the widgets so they flow inside the drawer grid */
  #widget-rail {
    position:static !important; top:auto; right:auto; left:auto; bottom:auto;
    display:contents; width:auto; max-width:none; max-height:none;
    padding:0; contain:none; will-change:auto; pointer-events:auto;
  }
  #widget-rail .widget { transform:none !important; pointer-events:auto; }
  #music-widget {
    position:static !important; width:auto; min-width:0;
    grid-column:1 / 2; grid-row:2;
    grid-template-columns:36px 1fr; gap:4px 8px; padding:8px 10px;
  }
  .mp-cover { width:36px; height:36px; }
  .mp-hole { width:9px; height:9px; }
  .mp-track { font-size:11px; }
  .mp-artist { font-size:9px; }
  .mp-controls { gap:6px; }
  .mp-btn { width:22px; height:22px; }
  .mp-btn.mp-play { width:26px; height:26px; }
  #music-widget .w-title { font-size:8px; margin-bottom:3px; }

  #wallpaper-picker {
    position:static !important; top:auto !important; right:auto !important;
    left:auto !important; bottom:auto !important; margin:0;
    grid-column:2 / 3; grid-row:2;
    width:auto; padding:8px 10px;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
  }
  #wallpaper-picker .wp-title { display:none; }
  #wallpaper-picker .wp-grid {
    display:grid; grid-template-columns:repeat(2, auto); gap:6px;
  }
  .wp-swatch { width:26px; height:26px; }
  .wp-swatch svg { width:13px; height:13px; }

  #snake-widget {
    display:block; position:static !important;
    grid-column:1 / -1; grid-row:3;
    width:auto; padding:10px 12px 14px;
  }
  #snake-widget .game-board { grid-template-columns:repeat(4,1fr); }

  #awards-widget {
    position:static !important;
    grid-column:1 / -1;
    width:auto; padding:10px 12px;
  }
  #awards-widget .aw-grid { justify-content:flex-start; gap:16px; }

  /* Sprout — perched above the drawer on the LEFT */
  #hedgehog {
    left:12px !important; right:auto !important; top:auto !important;
    bottom:130px !important;
  }

  /* Copyright: bottom-center, above the drawer handle */
  #copyright { left:0; right:0; bottom:56px; text-align:center; z-index:181; }
}

/* ------- Tablet: lift the dock so copyright is visible ------- */
@media (min-width:761px) and (max-width:1024px) {
  .dock-wrap { padding-bottom:34px; }
  #copyright { bottom:12px; }
}



/* Programma 900: dark/orange terminal-style scrollbar */
#synthModal .p900-body {
  scrollbar-width: thin;
  scrollbar-color: #ff8a34 #0a0a0d;
}
#synthModal .p900-body::-webkit-scrollbar { width:12px; }
#synthModal .p900-body::-webkit-scrollbar-track {
  background:#0a0a0d; border-radius:6px;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.8);
}
#synthModal .p900-body::-webkit-scrollbar-thumb {
  background:linear-gradient(180deg,#ff9d4d,#e0631f);
  border-radius:6px; border:2px solid #0a0a0d;
  transition: background .2s ease, box-shadow .2s ease;
}
#synthModal .p900-body::-webkit-scrollbar-thumb:hover {
  background:linear-gradient(180deg,#ffb066,#ff7a2e);
  box-shadow:0 0 8px 2px rgba(255,138,52,0.7);
}

.p900-panel { background:linear-gradient(180deg,#f2efe6,#e2ded1); border-radius:6px; padding:8px 10px 12px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.35); position:relative; min-height:118px; }
.p900-panel-accent { background:linear-gradient(180deg,#f27a35,#c94a1a); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.5); }
.p900-panel-accent .p900-knob { border-color:rgba(0,0,0,0.35); }
.p900-panel-head { display:flex; align-items:center; gap:6px; margin-bottom:8px; font-size:7px; letter-spacing:0.22em; text-transform:uppercase; color:#8a8478; font-weight:600; }
.p900-panel-num { color:#c9a84c; opacity:0.9; }
.p900-panel-tag { margin-left:auto; color:#8a8478; }
.p900-label { font-size:8px; letter-spacing:0.28em; color:#3a3a44; font-weight:700; text-transform:uppercase; }
.p900-sub { font-size:8px; letter-spacing:0.22em; color:#a8a294; font-weight:600; text-align:center; margin-top:4px; text-transform:uppercase; }

/* Memory preset strip */
.p900-memory { display:grid; grid-template-columns:auto repeat(4,1fr); gap:0; align-items:stretch; background:linear-gradient(180deg,#1a1a20,#0e0e14); border:1px solid rgba(0,0,0,0.5); border-radius:6px; margin-bottom:6px; overflow:hidden; }
.p900-mem-label { padding:8px 12px; font-size:8px; color:#8a8478; letter-spacing:0.18em; text-transform:uppercase; font-weight:700; line-height:1.35; border-right:1px solid rgba(255,255,255,0.06); background:#0a0a10; display:flex; flex-direction:column; justify-content:center; min-width:110px; }
.p900-preset { display:flex; align-items:stretch; gap:8px; background:transparent; border:0; border-right:1px solid rgba(255,255,255,0.06); padding:6px 10px 6px 0; color:#e8e4d8; text-align:left; cursor:pointer; font-family:inherit; }
.p900-preset:last-child { border-right:0; }
.p900-preset-tag { width:3px; align-self:stretch; background:#3a3a44; border-radius:0; margin-right:6px; opacity:0.35; }
.p900-preset.active .p900-preset-tag { opacity:1; box-shadow:0 0 8px currentColor; }
.p900-preset .pn { font-size:10px; letter-spacing:0.14em; font-weight:700; text-transform:uppercase; color:#f2efe6; }
.p900-preset:not(.active) .pn { color:#8a8478; }
.p900-preset .ps { font-size:8px; letter-spacing:0.08em; color:#5a5a60; text-transform:lowercase; margin-top:2px; }
.p900-rowmarks { display:flex; justify-content:space-between; font-size:7px; letter-spacing:0.32em; color:#5a5a60; text-transform:uppercase; padding:0 4px 6px; }

/* Trace monitor scope */
.p900-scope { background:#0d0f0a; border:1px solid rgba(0,0,0,0.4); border-radius:3px; padding:6px; height:78px; box-shadow:inset 0 0 12px rgba(0,0,0,0.6); }
.p900-scope canvas { display:block; width:100%; height:100%; }
.p900-scope-foot { display:flex; justify-content:space-between; font-size:7px; letter-spacing:0.22em; color:#8a8478; text-transform:uppercase; margin-top:4px; padding:0 2px; }

/* VU meter for master */
.p900-vu { display:flex; gap:2px; padding:3px 4px; background:rgba(0,0,0,0.35); border-radius:2px; }
.p900-vu span { width:6px; height:5px; background:rgba(255,255,255,0.15); border-radius:1px; }
.p900-vu span.on { background:#ffdca8; box-shadow:0 0 4px #ffb08a; }

/* 8-step sequencer */
.p900-seq { margin-top:8px; padding:10px 12px 12px; background:linear-gradient(180deg,#141419,#0e0e14); border-radius:6px; border:1px solid rgba(0,0,0,0.5); }
.p900-seq-head { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
.p900-seq-run { background:#e85d3a; color:#fff; border:0; padding:6px 16px; font:700 10px 'SF Mono',ui-monospace,monospace; letter-spacing:0.22em; border-radius:2px; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.4); }
.p900-seq-run.running { background:#3a3a44; color:#e85d3a; }
.p900-seq-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:4px; }
.p900-step { background:#1a1a20; border:1px solid rgba(0,0,0,0.5); border-radius:3px; padding:12px 4px 6px; text-align:center; font-family:inherit; color:#8a8478; cursor:pointer; position:relative; box-shadow:inset 0 0 8px rgba(0,0,0,0.5); }
.p900-step-num { position:absolute; top:3px; left:4px; font-size:7px; letter-spacing:0.14em; color:#5a5a60; }
.p900-step-dot { width:8px; height:8px; border-radius:50%; background:#2a2a30; margin:8px auto 8px; box-shadow:inset 0 0 3px rgba(0,0,0,0.7); }
.p900-step.on .p900-step-dot { background:#e85d3a; box-shadow:0 0 8px #e85d3a, inset 0 0 3px rgba(255,255,255,0.3); }
.p900-step.playing { border-color:#c9a84c; }
.p900-step-val { font-size:9px; letter-spacing:0.14em; color:#a8a294; }
.p900-step.on .p900-step-val { color:#e8e4d8; }

.p900-knob { width:54px; height:54px; border-radius:50%; background:radial-gradient(circle at 32% 28%, #f8f6f0, #d8d3c6 55%, #b8b2a3 100%); position:relative; cursor:ns-resize; box-shadow:0 4px 10px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.15), inset 0 2px 3px rgba(255,255,255,0.7); border:1px solid rgba(0,0,0,0.08); }
.p900-knob::after { content:""; position:absolute; inset:8px; border-radius:50%; background:inherit; box-shadow:inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.15); pointer-events:none; }
.p900-knob.small { width:42px; height:42px; }
.p900-knob.small::after { inset:6px; }
/* OP-1 style colored jewel knobs */
.p900-knob[data-param="detune"]    { background:radial-gradient(circle at 32% 28%, #6ba8e0, #2c6ab8 55%, #123f7a 100%); border-color:rgba(0,0,0,0.25); }
.p900-knob[data-param="cutoff"]    { background:radial-gradient(circle at 32% 28%, #ffffff, #e6e3d8 55%, #b8b2a3 100%); }
.p900-knob[data-param="resonance"] { background:radial-gradient(circle at 32% 28%, #7fd88f, #2f9a4a 55%, #145a2a 100%); border-color:rgba(0,0,0,0.25); }
.p900-knob[data-param="reverb"]    { background:radial-gradient(circle at 32% 28%, #ffb08a, #e85d3a 55%, #8a2a15 100%); border-color:rgba(0,0,0,0.25); }
.p900-knob[data-param="volume"]    { background:radial-gradient(circle at 32% 28%, #3a3a44, #14141c 70%); border-color:rgba(0,0,0,0.4); }
.p900-knob-dot { position:absolute; left:50%; top:3px; width:3px; height:10px; background:#1a1a24; border-radius:2px; transform:translateX(-50%); z-index:2; box-shadow:0 0 2px rgba(0,0,0,0.3); }
.p900-knob[data-param="detune"] .p900-knob-dot,
.p900-knob[data-param="resonance"] .p900-knob-dot,
.p900-knob[data-param="reverb"] .p900-knob-dot,
.p900-knob[data-param="volume"] .p900-knob-dot { background:#f6f4ee; }
.p900-knob.small .p900-knob-dot { top:3px; height:8px; }
.p900-wave { width:34px; height:16px; background:#f6f4ee; border:1px solid rgba(0,0,0,0.15); border-radius:4px; color:#8a8478; display:flex; align-items:center; justify-content:center; padding:0; cursor:pointer; transition:all .15s; }
.p900-wave svg { width:22px; height:8px; }
.p900-wave.selected { background:#e85d3a; color:#f6f4ee; border-color:rgba(0,0,0,0.25); box-shadow:0 0 6px rgba(232,93,58,0.5), inset 0 1px 0 rgba(255,255,255,0.3); }
.p900-slider-col { display:flex; flex-direction:column; align-items:center; gap:4px; }
.p900-slider { -webkit-appearance:none; appearance:none; width:16px; height:74px; writing-mode:vertical-lr; direction:rtl; background:transparent; cursor:pointer; }
.p900-slider::-webkit-slider-runnable-track { width:4px; height:74px; background:linear-gradient(180deg,#1a1a24,#3a3a52); border-radius:2px; }
.p900-slider::-moz-range-track { width:4px; height:74px; background:linear-gradient(180deg,#1a1a24,#3a3a52); border-radius:2px; }
.p900-slider::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:14px; background:linear-gradient(180deg,#4a4a62,#1a1a24); border:1px solid rgba(0,0,0,0.5); border-radius:3px; box-shadow:0 1px 3px rgba(0,0,0,0.5); margin-left:-9px; }
.p900-slider::-moz-range-thumb { width:22px; height:14px; background:linear-gradient(180deg,#4a4a62,#1a1a24); border:1px solid rgba(0,0,0,0.5); border-radius:3px; box-shadow:0 1px 3px rgba(0,0,0,0.5); }
.p900-led { width:12px; height:12px; border-radius:50%; background:#1a1a24; box-shadow:inset 0 1px 2px rgba(0,0,0,0.8); transition:background .12s, box-shadow .12s; }
.p900-led.on { background:hsl(var(--h),95%,60%); box-shadow:0 0 10px hsl(var(--h),95%,60%), 0 0 20px hsl(var(--h),95%,55%), inset 0 0 3px rgba(255,255,255,0.6); }
.p900-key { position:absolute; top:8px; bottom:8px; background:linear-gradient(180deg,#f8f6f0 0%, #ece9de 60%, #d4cfbe 100%); border:1px solid rgba(0,0,0,0.35); border-radius:2px 2px 4px 4px; cursor:pointer; box-shadow:inset 0 -6px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 3px rgba(0,0,0,0.3); transition:background .06s, transform .04s; user-select:none; }
.p900-key.black { background:linear-gradient(180deg,#2a2a34 0%, #14141c 60%, #050508 100%); height:62%; z-index:2; border-color:#000; box-shadow:inset 0 -5px 8px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15), 0 3px 4px rgba(0,0,0,0.6); border-radius:1px 1px 3px 3px; }
.p900-key.active { background:linear-gradient(180deg,#ffb08a,#e85d3a); box-shadow:inset 0 -4px 8px rgba(0,0,0,0.2), 0 0 10px rgba(232,93,58,0.7); transform:translateY(1px); }
.p900-key.black.active { background:linear-gradient(180deg,#e85d3a,#7a2a15); }
.p900-key-label { position:absolute; bottom:6px; left:0; right:0; text-align:center; font-size:9px; color:#a8a294; font-weight:600; letter-spacing:0.05em; pointer-events:none; text-transform:uppercase; }
.p900-key.black .p900-key-label { color:rgba(255,255,255,0.5); bottom:4px; }
@media (max-width: 720px) {
  .synth-card { font-size:13px; }
  .p900-panel { padding:8px 8px 10px; }
  .p900-knob { width:42px; height:42px; }
  .p900-knob.small { width:34px; height:34px; }
}
@media (max-width: 560px) {
  #synthModal { padding:6px; align-items:center; }
  #synthModal .synth-card { width:min(96vw, 390px) !important; max-height:none !important; border-radius:12px !important; font-size:9px; }
  #synthModal .synth-titlebar { height:28px !important; padding:0 9px !important; }
  #synthModal .synth-titlebar span[style*="position:absolute"] { font-size:8px !important; letter-spacing:0.14em !important; }
  #synthModal .synth-card > div[style*="padding:14px 16px 16px"] { padding:6px !important; max-height:none !important; overflow:hidden !important; }
  .p900-memory { grid-template-columns:repeat(4, minmax(0,1fr)) !important; gap:3px !important; padding:5px !important; margin-bottom:5px !important; }
  .p900-memory .p900-mem-label { display:none; }
  #synthModal .p900-preset { min-width:0; padding:4px 3px !important; gap:3px !important; }
  #synthModal .p900-preset-tag { width:5px !important; height:16px !important; }
  #synthModal .p900-preset .pn { font-size:6.5px !important; letter-spacing:0.06em !important; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .p900-rowmarks { display:none !important; }
  #synthModal div[style*="grid-template-columns:1fr 1.35fr 1fr"] {
    grid-template-columns:repeat(3, minmax(0,1fr)) !important; gap:4px !important;
  }
  #synthModal div[style*="grid-template-columns:0.9fr 0.9fr 1.1fr 0.85fr"] {
    grid-template-columns:repeat(4, minmax(0,1fr)) !important; gap:4px !important; margin-top:4px !important;
  }
  .p900-panel { min-height:58px; padding:4px 5px 5px; }
  .p900-panel-head { margin-bottom:3px; gap:3px; font-size:5.5px; letter-spacing:0.1em; }
  .p900-panel-tag { display:none; }
  #synthModal .p900-panel > div[style*="display:flex"] { gap:3px !important; }
  #synthModal .p900-panel div[style*="flex-direction:column"] { gap:2px !important; }
  .p900-sub { font-size:5.5px; letter-spacing:0.08em; }
  .p900-scope { height:42px; padding:3px; }
  .p900-scope canvas { width:100%; height:auto; }
  .p900-scope-foot { display:none; }
  .p900-knob { width:26px; height:26px; }
  .p900-knob::after { inset:4px; }
  .p900-knob.small { width:22px; height:22px; }
  .p900-knob.small::after { inset:3px; }
  .p900-knob-dot { top:2px; width:2px; height:6px; }
  .p900-knob.small .p900-knob-dot { top:2px; height:5px; }
  .p900-wave { width:25px; height:11px; }
  .p900-wave svg { width:18px; height:6px; }
  .p900-slider { width:12px; height:38px; }
  .p900-slider::-webkit-slider-runnable-track,
  .p900-slider::-moz-range-track { height:38px; }
  .p900-slider::-webkit-slider-thumb { width:16px; height:10px; margin-left:-6px; }
  .p900-slider::-moz-range-thumb { width:16px; height:10px; }
  .p900-seq, #p900-leds, #p900-keyboard + div, #synthModal div[style*="font-size:8px;letter-spacing:0.28em"] { display:none !important; }
  #p900-keyboard { height:82px !important; margin-top:4px; border-radius:6px !important; padding:5px !important; }
  .p900-key { top:5px; bottom:5px; }
  .p900-key-label { display:none; }
  #synthModal .p900-preset .ps { display:none; }
}



.mb-card { width:min(1120px,96vw); max-height:94vh; background:#e7ddc8; border-radius:14px; overflow:hidden; box-shadow:0 40px 100px rgba(60,40,15,0.55), 0 0 0 1px rgba(0,0,0,0.14); font-family:'Inter','Helvetica Neue',sans-serif; color:#3a2e1e; display:flex; flex-direction:column; }
.mb-titlebar { display:flex; align-items:center; gap:10px; height:38px; padding:0 14px; background:linear-gradient(180deg,#ecdfc6,#dccfb4); border-bottom:1px solid rgba(0,0,0,0.1); }
.mb-crumbs { font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:#8a7a54; font-weight:600; }
.mb-title-serif { font-family:'Instrument Serif','Playfair Display',Georgia,serif; font-size:20px; font-weight:400; font-style:italic; color:#2e2314; margin-left:14px; }
.mb-titlebar-right { margin-left:auto; display:flex; align-items:center; gap:8px; }
.mb-icon-btn { background:transparent; border:0; padding:4px 6px; font:600 10px 'Inter',sans-serif; letter-spacing:0.14em; color:#5a4a2a; cursor:pointer; border-radius:4px; }
.mb-icon-btn:hover { background:rgba(60,40,10,0.06); }
.mb-icon-btn[disabled] { opacity:0.3; cursor:not-allowed; }
.mb-titlebar-sep { width:1px; height:16px; background:rgba(0,0,0,0.12); margin:0 4px; }

.mb-body { flex:1; display:grid; grid-template-columns:200px 1fr 220px; gap:0; min-height:0; }
.mb-rail { padding:16px 18px 18px; background:transparent; overflow:auto; min-width:0; }
.mb-rail-left { border-right:1px solid rgba(0,0,0,0.05); }
.mb-rail-right { border-left:1px solid rgba(0,0,0,0.05); }
.mb-rail-head { font-size:9px; letter-spacing:0.24em; text-transform:uppercase; color:#8a7a54; font-weight:700; margin-bottom:12px; }
.mb-rail-sep { height:1px; background:rgba(0,0,0,0.08); margin:16px 0; }

.mb-tool { display:flex; align-items:center; gap:10px; width:100%; background:transparent; border:0; padding:5px 4px; color:#5a4a2a; font:500 12px 'Inter',sans-serif; cursor:pointer; border-radius:4px; text-align:left; font-family:'Instrument Serif',Georgia,serif; }
.mb-tool .mb-tool-ico { width:20px; text-align:center; font-size:14px; color:#8a7a54; font-family:'Inter',sans-serif; }
.mb-tool .mb-tool-name { font-size:13px; line-height:1.15; }
.mb-tool .mb-tool-num { margin-left:auto; font:500 10px 'Inter',sans-serif; color:#a89773; }
.mb-tool.active { color:#2e2314; }
.mb-tool.active .mb-tool-ico { color:#2e2314; }
.mb-tool.active { border-left:2px solid #2e2314; padding-left:2px; }

.mb-slider-label { display:flex; justify-content:space-between; font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:#8a7a54; font-weight:600; margin-bottom:4px; }
.mb-slider-h { -webkit-appearance:none; appearance:none; width:100%; height:2px; background:rgba(60,40,10,0.2); outline:none; }
.mb-slider-h::-webkit-slider-thumb { -webkit-appearance:none; width:10px; height:10px; border-radius:50%; background:#2e2314; cursor:none; border:2px solid #e7ddc8; box-shadow:0 0 0 1px rgba(0,0,0,0.15); }
.mb-slider-h::-moz-range-thumb { width:10px; height:10px; border-radius:50%; background:#2e2314; cursor:none; border:2px solid #e7ddc8; }
.mb-tool-hint { font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:12px; color:#7a6a44; margin-top:12px; line-height:1.4; }

.mb-center { padding:14px 20px; display:flex; flex-direction:column; gap:12px; min-width:0; }
.mb-caption { font-family:'Instrument Serif',Georgia,serif; font-size:13px; color:#7a6a44; font-style:italic; letter-spacing:0.01em; }
.mb-caption-num { font-family:'Inter',sans-serif; font-size:9px; letter-spacing:0.24em; text-transform:uppercase; color:#a89773; font-style:normal; font-weight:600; margin-right:8px; }
.mb-canvas-wrap { position:relative; background:#f6f0dc; border-radius:8px; box-shadow:inset 0 2px 8px rgba(0,0,0,0.08), 0 12px 30px rgba(60,40,15,0.15); overflow:hidden; aspect-ratio:820/500; }
#mbCanvas { display:block; width:100%; height:100%; touch-action:none; cursor:none; }

/* ---- New icon-based brush cursor (replaces the old plain-circle .mb-brush) ---- */
#artboardModal,
#artboardModal * {
  cursor: none !important;
}
.mb-brush-icon {
  position: fixed;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  pointer-events: none;
  z-index: 2147483647;
  display: none;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
  transform: translate(-4px, -4px); /* tip alignment, tune per icon */
}
.mb-brush-ring {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.35);
  pointer-events: none;
  z-index: 2147483646;
  display: none;
}

.mb-impressions { display:flex; align-items:center; gap:12px; padding:6px 4px; }
.mb-impressions-label { font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:13px; color:#5a4a2a; }
.mb-impressions-sub { font-size:10px; color:#a89773; letter-spacing:0.06em; }
.mb-impressions-strip { display:flex; gap:6px; margin-left:auto; }
.mb-impression-slot { width:44px; height:32px; background:#f0e7cf; border:1px dashed rgba(60,40,10,0.15); border-radius:3px; }
.mb-impression-slot img { width:100%; height:100%; object-fit:cover; border-radius:2px; }

.mb-pigment-heading { font-family:'Instrument Serif',Georgia,serif; font-size:16px; color:#2e2314; margin-bottom:4px; }
.mb-pigment-desc { font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:11px; color:#7a6a44; line-height:1.4; margin-bottom:12px; }
.mb-swatches { display:flex; gap:6px; margin-bottom:6px; }
.mb-swatch { width:22px; height:22px; border-radius:50%; border:2px solid #e7ddc8; box-shadow:0 0 0 1px rgba(0,0,0,0.15); padding:0; cursor:pointer; transition:transform .12s; }
.mb-swatch.active { transform:scale(1.15); box-shadow:0 0 0 1px rgba(0,0,0,0.4), 0 0 0 4px rgba(0,0,0,0.05); }
.mb-swatch-names { display:flex; gap:6px; font-size:7px; letter-spacing:0.02em; color:#8a7a54; }
.mb-swatch-names span { width:22px; text-align:center; line-height:1.1; }

.mb-paper-row { display:flex; align-items:center; gap:10px; }
.mb-paper-swatch { width:26px; height:20px; background:#f2ead1; border:1px solid rgba(60,40,10,0.15); border-radius:2px; }
.mb-paper-label { font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:#8a7a54; font-weight:700; }
.mb-paper-sub { font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:11px; color:#7a6a44; }
.mb-guided { font-size:9px; letter-spacing:0.24em; text-transform:uppercase; color:#8a7a54; font-weight:700; }

.mb-footer { display:flex; align-items:center; justify-content:space-between; padding:8px 16px; background:linear-gradient(180deg,#dccfb4,#c8b998); border-top:1px solid rgba(0,0,0,0.08); font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:#5a4a2a; font-weight:600; }
.mb-footer-mid { color:#8a7a54; letter-spacing:0.16em; }
.mb-print-btn { background:linear-gradient(180deg,#a88656,#8a6a44); color:#f6f0dc; border:0; padding:8px 16px; border-radius:3px; font:600 11px 'Inter',sans-serif; letter-spacing:0.16em; cursor:pointer; box-shadow:0 2px 6px rgba(60,40,10,0.3); }

.artboard-thumb {
  background:#efe8d8 !important;
  border-radius:8px !important;
  padding:0 !important;
}
.artboard-thumb::before, .artboard-thumb::after { display:none !important; }
.artboard-thumb > svg { width:100%; height:100%; display:block; }

@media (max-width: 820px) {
  .mb-card { max-height:96vh; }
  .mb-body { grid-template-columns:1fr; }
  .mb-rail { max-height:180px; }
  .mb-rail-left, .mb-rail-right { border:0; border-top:1px solid rgba(0,0,0,0.06); }
  .mb-title-serif { font-size:16px; margin-left:8px; }
  .mb-titlebar-right .mb-icon-btn { font-size:9px; padding:3px 4px; }
}
@media (max-width: 560px) {
  #artboardModal { padding:6px; align-items:center; }
  .mb-card { width:min(96vw, 390px); max-height:none; height:auto; border-radius:10px; }
  .mb-titlebar { height:30px; padding:0 8px; gap:6px; }
  .mb-title-serif { font-size:15px; margin-left:4px; white-space:nowrap; }
  .mb-crumbs, .mb-titlebar-sep { display:none; }
  .mb-titlebar-right { gap:3px; }
  .mb-titlebar-right .mb-icon-btn { width:23px; height:23px; padding:0; overflow:hidden; font-size:12px; letter-spacing:0; display:inline-flex; align-items:center; justify-content:center; }
  #mbSave { color:transparent; position:relative; }
  #mbSave::before { content:'◱'; color:#5a4a2a; position:absolute; inset:0; display:grid; place-items:center; }
  .mb-body { display:flex; flex-direction:column; min-height:0; }
  .mb-rail { padding:7px 9px; max-height:none; overflow:hidden; }
  .mb-rail-left { order:1; display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:4px; border:0; border-bottom:1px solid rgba(0,0,0,0.06); }
  .mb-rail-head, .mb-rail-sep, .mb-tool-hint, .mb-tool-num, .mb-slider-label, .mb-slider-h { display:none !important; }
  .mb-tool { justify-content:center; padding:5px 2px; gap:0; }
  .mb-tool .mb-tool-ico { width:auto; font-size:14px; }
  .mb-tool .mb-tool-name { font-size:0; }
  .mb-tool.active { border-left:0; border-bottom:2px solid #2e2314; padding-left:2px; }
  .mb-center { order:2; padding:8px 10px; gap:6px; }
  .mb-caption { font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mb-caption-num { font-size:7px; letter-spacing:0.14em; margin-right:4px; }
  .mb-canvas-wrap { border-radius:6px; aspect-ratio:820/500; }
  .mb-impressions { display:none; }
  .mb-rail-right { order:3; display:flex; align-items:center; gap:8px; border:0; border-top:1px solid rgba(0,0,0,0.06); }
  .mb-pigment-heading { font-size:13px; margin:0; flex:0 0 auto; }
  .mb-pigment-desc, .mb-swatch-names, .mb-paper-row, .mb-guided { display:none !important; }
  .mb-swatches { margin:0; gap:7px; }
  .mb-swatch { width:20px; height:20px; }
  .mb-footer { padding:6px 8px; font-size:7px; letter-spacing:0.08em; gap:8px; }
  .mb-footer-mid, .mb-footer > span:first-child { display:none; }
  .mb-print-btn { margin-left:auto; padding:6px 9px; font-size:9px; letter-spacing:0.08em; white-space:nowrap; }
}

/* ============ Drawing Pad (Studio Edition) ============ */
#drawpadModal{
    --ink:#1c1f1a;
    --ink-2:#262a22;
    --rail:#2a2e24;
    --rail-2:#343a2b;
    --paper:#f4efe1;
    --paper-shadow:#d9d0b8;
    --brass:#c79a4b;
    --brass-light:#e3bd7c;
    --brass-dim:#8a6a34;
    --moss:#5c7350;
    --clay:#b1512f;
    --ivory:#f6f2e6;
    --ivory-dim:#c9c2ab;
    --line:rgba(0,0,0,.14);
    --line-light:rgba(255,255,255,.08);
    --font-display:"Fraunces", serif;
    --font-body:"Inter", -apple-system, sans-serif;
    --font-mono:"IBM Plex Mono", monospace;
  }
  #drawpadModal *{box-sizing:border-box;}
  #drawpadModal .dp-app{
    margin:0; padding:0; height:100%; width:100%; overflow:hidden;
    background:var(--ink);
    font-family:var(--font-body);
    color:var(--ivory);
    -webkit-font-smoothing:antialiased;
  }
  #drawpadModal button{font-family:inherit; color:inherit;}
  #drawpadModal input, #drawpadModal select{font-family:inherit;}

  /* ===================== MODAL CARD (site integration) ===================== */
  #drawpadModal{
    position:fixed; inset:0; z-index:6480; display:none;
    align-items:center; justify-content:center;
    background:rgba(10,10,8,0.55); backdrop-filter:blur(8px);
  }
  #drawpadModal .dp-card{
    width:min(1180px, 96vw); height:min(760px, 92vh);
    border-radius:12px; overflow:hidden; position:relative;
    box-shadow:0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.3);
  }
  #drawpadModal .dp-card .dp-app{ height:100%; }


  /* ===================== APP SHELL ===================== */
  .dp-app{
    display:grid;
    grid-template-rows:52px 1fr 30px;
    grid-template-columns:64px 1fr 232px;
    grid-template-areas:
      "header header header"
      "rail   canvas panel"
      "footer footer footer";
    height:100%; width:100%;
    background:
      radial-gradient(ellipse at 20% -10%, #33392b 0%, transparent 55%),
      var(--ink);
  }

  /* ===================== HEADER ===================== */
  .dp-header{
    grid-area:header;
    display:flex; align-items:center; gap:14px;
    padding:0 16px;
    background:linear-gradient(180deg, var(--rail-2), var(--rail));
    border-bottom:1px solid var(--line-light);
    box-shadow:0 1px 0 rgba(0,0,0,.35);
    z-index:20;
  }
  .dp-brand{
    display:flex; align-items:baseline; gap:8px;
    font-family:var(--font-display);
    font-weight:600; font-size:17px; letter-spacing:.2px;
    color:var(--ivory);
    padding-right:12px;
    border-right:1px solid var(--line-light);
    white-space:nowrap;
  }
  .dp-brand .dp-mark{
    display:inline-flex; width:26px; height:26px; border-radius:6px;
    background:linear-gradient(155deg, var(--brass-light), var(--brass-dim));
    align-items:center; justify-content:center;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.35), 0 1px 2px rgba(0,0,0,.4);
  }
  .dp-brand .dp-mark svg{width:15px; height:15px;}
  .dp-brand small{font-family:var(--font-mono); font-size:9px; font-weight:400; color:var(--ivory-dim); letter-spacing:1px; text-transform:uppercase;}

  .dp-hgroup{display:flex; align-items:center; gap:6px;}
  .dp-hbtn{
    display:flex; align-items:center; justify-content:center; gap:6px;
    height:32px; padding:0 11px; border-radius:7px;
    background:rgba(255,255,255,.03); border:1px solid var(--line-light);
    cursor:pointer; font-size:12.5px; font-weight:500; color:var(--ivory-dim);
    transition:background .12s, color .12s, border-color .12s;
  }
  .dp-hbtn:hover{background:rgba(255,255,255,.08); color:var(--ivory); border-color:rgba(255,255,255,.16);}
  .dp-hbtn:active{transform:translateY(1px);}
  .dp-hbtn:disabled{opacity:.35; cursor:not-allowed; pointer-events:none;}
  .dp-hbtn svg{width:15px; height:15px; flex:none;}
  .dp-hbtn.dp-primary{
    background:linear-gradient(180deg, var(--brass-light), var(--brass));
    color:#2a2013; border-color:transparent; font-weight:600;
  }
  .dp-hbtn.dp-primary:hover{filter:brightness(1.08);}

  .dp-zoom-readout{
    font-family:var(--font-mono); font-size:11px; color:var(--ivory-dim);
    min-width:44px; text-align:center;
  }
  .dp-header-spacer{flex:1;}
  .dp-header .dp-hgroup + .dp-hgroup{padding-left:10px; border-left:1px solid var(--line-light);}

  /* ===================== TOOL RAIL ===================== */
  .dp-rail{
    grid-area:rail;
    background:linear-gradient(180deg, var(--rail-2), var(--rail) 8%, var(--rail));
    border-right:1px solid var(--line-light);
    box-shadow:inset -6px 0 14px -12px rgba(0,0,0,.6);
    display:flex; flex-direction:column; align-items:center;
    padding:10px 0; gap:3px; overflow-y:auto; overflow-x:hidden;
    position:relative;
  }
  .dp-rail::-webkit-scrollbar{width:0;}
  .dp-rail-div{
    width:34px; height:1px; background:var(--line-light); margin:6px 0;
  }
  .dp-tool{
    width:44px; height:44px; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    background:transparent; border:1px solid transparent;
    cursor:pointer; position:relative; flex:none;
    transition:background .12s, border-color .12s;
  }
  .dp-tool svg{width:20px; height:20px; stroke:var(--ivory-dim); transition:stroke .12s;}
  .dp-tool:hover{background:rgba(255,255,255,.06);}
  .dp-tool:hover svg{stroke:var(--ivory);}
  .dp-tool.dp-active{
    background:linear-gradient(155deg, var(--brass-light), var(--brass-dim));
    border-color:rgba(0,0,0,.25);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.4), 0 2px 6px rgba(0,0,0,.35);
  }
  .dp-tool.dp-active svg{stroke:#2a2013;}
  .dp-tool .dp-hint{
    position:absolute; left:52px; top:50%; transform:translateY(-50%);
    background:#141712; color:var(--ivory); font-size:11px; font-weight:500;
    padding:5px 9px; border-radius:6px; white-space:nowrap;
    opacity:0; pointer-events:none; transition:opacity .1s, transform .1s;
    box-shadow:0 4px 12px rgba(0,0,0,.5); z-index:50;
    border:1px solid var(--line-light);
    display:flex; align-items:center; gap:6px;
  }
  .dp-tool .dp-hint kbd{
    font-family:var(--font-mono); font-size:9px; background:rgba(255,255,255,.12);
    padding:1px 4px; border-radius:3px; color:var(--ivory-dim);
  }
  .dp-tool:hover .dp-hint{opacity:1; transform:translateY(-50%) translateX(2px);}

  /* ===================== CANVAS ZONE ===================== */
  .dp-canvas-zone{
    grid-area:canvas;
    position:relative; overflow:auto;
    background:
      radial-gradient(ellipse at 50% 0%, #24281f 0%, #191c15 70%);
    display:flex; align-items:center; justify-content:center;
  }
  .dp-canvas-zone.dp-panning{cursor:grab;}
  .dp-canvas-zone.dp-panning:active{cursor:grabbing;}
  .dp-canvas-viewport{
    position:relative;
    transform-origin:center center;
    flex:none;
  }
  .dp-canvas-frame{
    position:relative;
    box-shadow:
      0 30px 60px -20px rgba(0,0,0,.65),
      0 10px 24px -8px rgba(0,0,0,.5),
      0 0 0 1px rgba(0,0,0,.3);
    background:var(--paper);
  }
  .dp-canvas-frame::before{
    content:"";
    position:absolute; inset:0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(0,0,0,.025) 0, transparent 3%),
      radial-gradient(circle at 70% 65%, rgba(0,0,0,.02) 0, transparent 4%),
      repeating-linear-gradient(90deg, rgba(0,0,0,.012) 0px, transparent 1px, transparent 2px);
    pointer-events:none; mix-blend-mode:multiply;
  }
  .dp-tape{
    position:absolute; width:64px; height:26px;
    background:linear-gradient(100deg, rgba(230,220,190,.55), rgba(230,220,190,.35));
    border:1px solid rgba(255,255,255,.25);
    box-shadow:0 3px 6px rgba(0,0,0,.25);
    z-index:5; pointer-events:none;
  }
  .dp-tape.dp-tl{top:-12px; left:22px; transform:rotate(-8deg);}
  .dp-tape.dp-br{bottom:-12px; right:22px; transform:rotate(-6deg);}

  .dp-layer-canvas{
    position:absolute; top:0; left:0;
    image-rendering:pixelated;
  }
  #interactSurface{
    position:absolute; top:0; left:0; z-index:10; touch-action:none;
  }
  #overlayCanvas{position:absolute; top:0; left:0; z-index:9; pointer-events:none;}

  .dp-grid-overlay{
    position:absolute; inset:0; pointer-events:none; z-index:8;
    background-image:
      linear-gradient(rgba(0,0,0,.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,.09) 1px, transparent 1px);
    display:none;
  }
  .dp-grid-overlay.dp-show{display:block;}

  .dp-brush-cursor{
    position:fixed; border-radius:50%; border:1.5px solid rgba(0,0,0,.65);
    box-shadow:0 0 0 1px rgba(255,255,255,.85);
    pointer-events:none; z-index:6520; transform:translate(-50%,-50%);
    display:none;
  }

  /* ===================== SIDE PANEL ===================== */
  .dp-panel{
    grid-area:panel;
    background:linear-gradient(180deg, var(--rail-2), var(--rail));
    border-left:1px solid var(--line-light);
    box-shadow:inset 6px 0 14px -12px rgba(0,0,0,.6);
    overflow-y:auto; padding:14px 12px 20px;
    display:flex; flex-direction:column; gap:16px;
  }
  /* ===================== THEMED SCROLLBARS (Drawing Pad only) ===================== */
  .dp-canvas-zone, .dp-layer-list, .dp-panel{
    scrollbar-width:thin;
    scrollbar-color:var(--brass-dim) rgba(0,0,0,.28);
  }
  .dp-canvas-zone::-webkit-scrollbar, .dp-layer-list::-webkit-scrollbar, .dp-panel::-webkit-scrollbar{
    width:10px; height:10px;
  }
  .dp-canvas-zone::-webkit-scrollbar-track, .dp-layer-list::-webkit-scrollbar-track, .dp-panel::-webkit-scrollbar-track{
    background:rgba(0,0,0,.28);
  }
  .dp-canvas-zone::-webkit-scrollbar-thumb, .dp-layer-list::-webkit-scrollbar-thumb, .dp-panel::-webkit-scrollbar-thumb{
    background:linear-gradient(180deg, var(--brass-light), var(--brass-dim));
    border-radius:20px; border:2px solid transparent; background-clip:padding-box;
  }
  .dp-canvas-zone::-webkit-scrollbar-thumb:hover, .dp-layer-list::-webkit-scrollbar-thumb:hover, .dp-panel::-webkit-scrollbar-thumb:hover{
    background:var(--brass);
  }
  .dp-canvas-zone::-webkit-scrollbar-corner, .dp-panel::-webkit-scrollbar-corner{
    background:transparent;
  }

  .dp-pblock{display:flex; flex-direction:column; gap:9px;}
  .dp-plabel{
    font-family:var(--font-display); font-size:12.5px; font-weight:600;
    color:var(--brass-light); letter-spacing:.3px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .dp-plabel .dp-mini{
    font-family:var(--font-mono); font-size:9.5px; color:var(--ivory-dim); font-weight:400;
  }

  .dp-swatch-row{display:flex; flex-wrap:wrap; gap:6px; align-items:center;}
  .dp-swatch{
    width:22px; height:22px; border-radius:6px; cursor:pointer;
    border:1.5px solid rgba(255,255,255,.15);
    box-shadow:0 1px 2px rgba(0,0,0,.4);
    position:relative; flex:none;
  }
  .dp-swatch.dp-active::after{
    content:""; position:absolute; inset:-4px; border-radius:9px;
    border:1.5px solid var(--brass-light);
  }
  .dp-swatch.dp-add{
    display:flex; align-items:center; justify-content:center;
    background:rgba(255,255,255,.06); border-style:dashed;
    color:var(--ivory-dim); font-size:14px;
  }

  .dp-color-main{display:flex; gap:10px; align-items:center;}
  .dp-color-pair{position:relative; width:44px; height:44px; flex:none;}
  .dp-color-pair .dp-cbig, .dp-color-pair .dp-csmall{
    position:absolute; border-radius:8px; border:2px solid #1a1c15;
    box-shadow:0 2px 5px rgba(0,0,0,.4); cursor:pointer; overflow:hidden;
  }
  .dp-color-pair .dp-cbig{width:32px; height:32px; top:0; left:0; z-index:2;}
  .dp-color-pair .dp-csmall{width:24px; height:24px; bottom:-4px; right:-4px; z-index:1; background:#fff;}
  .dp-color-pair input[type=color]{opacity:0; position:absolute; inset:0; width:100%; height:100%; border:none; cursor:pointer;}
  .dp-color-swap{
    width:22px; height:22px; border-radius:5px; border:1px solid var(--line-light);
    background:rgba(255,255,255,.05); display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--ivory-dim); flex:none;
  }
  .dp-color-swap:hover{color:var(--ivory); background:rgba(255,255,255,.1);}
  .dp-color-swap svg{width:12px; height:12px;}
  .dp-hexval{
    font-family:var(--font-mono); font-size:10.5px; color:var(--ivory-dim);
    background:rgba(0,0,0,.25); border:1px solid var(--line-light);
    border-radius:5px; padding:4px 6px; width:100%; text-align:center;
    margin-top:6px;
  }

  .dp-slider-row{display:flex; flex-direction:column; gap:4px;}
  .dp-slider-row .dp-srow-top{display:flex; justify-content:space-between; font-size:11px; color:var(--ivory-dim);}
  .dp-slider-row .dp-srow-top b{color:var(--ivory); font-weight:500; font-family:var(--font-mono);}
  input[type=range]{
    -webkit-appearance:none; width:100%; height:4px; border-radius:2px;
    background:rgba(255,255,255,.14); outline:none; cursor:pointer;
  }
  input[type=range]::-webkit-slider-thumb{
    -webkit-appearance:none; width:14px; height:14px; border-radius:50%;
    background:var(--brass-light); border:2px solid #241d10;
    box-shadow:0 1px 3px rgba(0,0,0,.5); cursor:pointer; margin-top:-5px;
  }
  input[type=range]::-moz-range-thumb{
    width:14px; height:14px; border-radius:50%; background:var(--brass-light);
    border:2px solid #241d10; cursor:pointer;
  }

  .dp-seg{display:flex; background:rgba(0,0,0,.25); border-radius:7px; padding:2px; gap:2px; border:1px solid var(--line-light);}
  .dp-seg button{
    flex:1; border:none; background:transparent; color:var(--ivory-dim);
    padding:6px 4px; font-size:10.5px; font-weight:600; border-radius:5px; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:4px;
  }
  .dp-seg button svg{width:13px; height:13px;}
  .dp-seg button.dp-on{background:linear-gradient(180deg, var(--brass-light), var(--brass)); color:#241d10;}

  .dp-check-row{display:flex; align-items:center; justify-content:space-between; font-size:11.5px; color:var(--ivory-dim);}
  .dp-toggle{
    width:34px; height:19px; border-radius:20px; background:rgba(0,0,0,.35);
    border:1px solid var(--line-light); position:relative; cursor:pointer; flex:none;
    padding:0; margin:0; -webkit-appearance:none; appearance:none; font:inherit; outline:none;
  }
  .dp-toggle .dp-knob{
    position:absolute; top:1px; left:1px; width:15px; height:15px; border-radius:50%;
    background:var(--ivory-dim); transition:left .14s, background .14s;
  }
  .dp-toggle.dp-on{background:linear-gradient(90deg, var(--brass-dim), var(--brass));}
  .dp-toggle.dp-on .dp-knob{left:16px; background:#241d10;}

  .num-input{
    width:52px; background:rgba(0,0,0,.25); border:1px solid var(--line-light);
    color:var(--ivory); border-radius:5px; padding:4px 5px; font-family:var(--font-mono); font-size:11px;
  }

  /* ===================== LAYERS ===================== */
  .dp-layer-list{display:flex; flex-direction:column; gap:5px; max-height:220px; overflow-y:auto;}
  .dp-layer-row{
    display:flex; align-items:center; gap:7px; padding:6px 7px; border-radius:7px;
    background:rgba(255,255,255,.03); border:1px solid transparent; cursor:pointer;
  }
  .dp-layer-row.dp-active{border-color:var(--brass-dim); background:rgba(199,154,75,.1);}
  .dp-layer-row .dp-lthumb{
    width:30px; height:30px; border-radius:4px; background:#fff repeating-conic-gradient(#e6e0cf 0 25%, #fff 0 50%) 0/8px 8px;
    border:1px solid rgba(0,0,0,.3); flex:none; overflow:hidden; position:relative;
  }
  .dp-layer-row .dp-lthumb img{width:100%; height:100%; object-fit:contain;}
  .dp-layer-row .dp-lname{
    flex:1; font-size:11.5px; color:var(--ivory); background:transparent; border:none;
    outline:none; font-family:var(--font-body); min-width:0;
  }
  .dp-layer-row .dp-lvis{
    width:22px; height:22px; display:flex; align-items:center; justify-content:center;
    color:var(--ivory-dim); cursor:pointer; flex:none; border-radius:4px;
  }
  .dp-layer-row .dp-lvis svg{width:14px; height:14px;}
  .dp-layer-row .dp-lvis:hover{background:rgba(255,255,255,.08);}
  .dp-layer-tools{display:flex; gap:5px;}
  .dp-ltbtn{
    flex:1; display:flex; align-items:center; justify-content:center; gap:5px;
    height:26px; border-radius:6px; background:rgba(255,255,255,.05);
    border:1px solid var(--line-light); color:var(--ivory-dim); cursor:pointer; font-size:10.5px;
  }
  .dp-ltbtn:hover{background:rgba(255,255,255,.1); color:var(--ivory);}
  .dp-ltbtn svg{width:12px; height:12px;}

  /* ===================== FOOTER ===================== */
  .dp-footer{
    grid-area:footer;
    display:flex; align-items:center; gap:16px; padding:0 14px;
    background:var(--rail); border-top:1px solid var(--line-light);
    font-family:var(--font-mono); font-size:10.5px; color:var(--ivory-dim);
  }
  .dp-footer b{color:var(--brass-light); font-weight:500;}
  .dp-footer .dp-fspacer{flex:1;}
  .dp-footer .dp-fkeys{display:flex; gap:10px; opacity:.75;}
  .dp-footer .dp-fkeys kbd{background:rgba(255,255,255,.08); padding:1px 5px; border-radius:3px; margin-right:3px;}

  /* ===================== MISC OVERLAYS ===================== */
  .dp-toast{
    position:fixed; bottom:44px; left:50%; transform:translateX(-50%) translateY(10px);
    background:#181b13; color:var(--ivory); padding:9px 16px; border-radius:8px;
    font-size:12px; border:1px solid var(--line-light); box-shadow:0 8px 20px rgba(0,0,0,.4);
    opacity:0; pointer-events:none; transition:opacity .2s, transform .2s; z-index:6521;
  }
  .dp-toast.dp-show{opacity:1; transform:translateX(-50%) translateY(0);}

  .dp-modal-back{
    position:fixed; inset:0; background:rgba(10,10,8,.6); backdrop-filter:blur(3px);
    display:none; align-items:center; justify-content:center; z-index:6522;
  }
  .dp-modal-back.dp-show{display:flex;}
  .dp-modal{
    background:var(--rail-2); border:1px solid var(--line-light); border-radius:12px;
    padding:22px; width:300px; box-shadow:0 20px 50px rgba(0,0,0,.5);
  }
  .dp-modal h3{margin:0 0 14px; font-family:var(--font-display); font-size:16px; color:var(--ivory);}
  .dp-modal .dp-row{display:flex; gap:10px; margin-bottom:12px;}
  .dp-modal .dp-row label{flex:1; display:flex; flex-direction:column; gap:5px; font-size:11px; color:var(--ivory-dim);}
  .dp-modal input[type=number], .dp-modal input[type=text]{
    background:rgba(0,0,0,.3); border:1px solid var(--line-light); color:var(--ivory);
    border-radius:6px; padding:7px 8px; font-family:var(--font-mono); font-size:12px;
  }
  .dp-modal .dp-presets{display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;}
  .dp-modal .dp-presets button{
    background:rgba(255,255,255,.05); border:1px solid var(--line-light); color:var(--ivory-dim);
    border-radius:6px; padding:5px 8px; font-size:10.5px; cursor:pointer;
  }
  .dp-modal .dp-presets button:hover{color:var(--ivory); background:rgba(255,255,255,.1);}
  .dp-modal .dp-actions{display:flex; justify-content:flex-end; gap:8px; margin-top:6px;}

  /* ===================== CONTEXT MENU ===================== */
  .dp-ctxmenu{
    position:fixed; z-index:6530; display:none;
    min-width:180px; padding:5px; border-radius:9px;
    background:linear-gradient(180deg, var(--rail-2), var(--rail));
    border:1px solid var(--line-light);
    box-shadow:0 14px 34px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.3);
  }
  .dp-ctxmenu.dp-show{display:block;}
  .dp-ctxmenu button{
    display:flex; align-items:center; gap:9px; width:100%;
    padding:8px 10px; border-radius:6px; border:none; background:transparent;
    color:var(--ivory); font-size:12.5px; font-family:var(--font-body);
    cursor:pointer; text-align:left;
  }
  .dp-ctxmenu button:hover{background:rgba(255,255,255,.08);}
  .dp-ctxmenu button svg{width:14px; height:14px; flex:none; color:var(--brass-light);}
  .dp-ctxmenu .dp-ctxsep{height:1px; background:var(--line-light); margin:4px 6px;}

  .dp-textedit{
    position:absolute; background:transparent; border:1px dashed var(--clay);
    outline:none; color:#000; resize:none; overflow:hidden; z-index:40;
    font-family:var(--font-body); padding:2px; min-width:60px; min-height:20px;
  }

  #drawpadModal ::selection{background:var(--brass); color:#1a1509;}


/* ===================== IMAGE PREVIEW — MAGNIFYING LENS ===================== */
.pv-lens{
  position:absolute;
  width:150px; height:150px;
  border-radius:50%;
  pointer-events:none;
  z-index:10;
  border:3px solid rgba(255,255,255,0.9);
  box-shadow:0 8px 32px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(0,0,0,0.15);
  background-repeat:no-repeat;
  background-color:#fff;
  opacity:0;
  left:0; top:0;
  transform:translate3d(-9999px,-9999px,0) scale(0.58);
  transition:opacity .3s ease;
  will-change:opacity, transform;
}
.pv-lens.pv-lens-show{
  opacity:1;
}
.pv-lens::after{
  content:'';
  position:absolute;
  inset:0;
  border-radius:50%;
  background:radial-gradient(circle at center, transparent 60%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0.2) 80%, transparent 100%);
  pointer-events:none;
}
