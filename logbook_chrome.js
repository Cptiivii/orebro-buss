// logbook_chrome.js — Shared chrome: dual sidebars, theme, clock, crew manifest
// Reads window.LB_BASE (e.g. '../' or '') and window.LB_ACTIVE (nav key)
(function () {
  var BASE   = (typeof window.LB_BASE   !== 'undefined') ? window.LB_BASE   : '';
  var ACTIVE = (typeof window.LB_ACTIVE !== 'undefined') ? window.LB_ACTIVE : '';

  // ── 1. Google Fonts ────────────────────────────────────────────────────────
  var lnk = document.createElement('link');
  lnk.rel = 'stylesheet';
  lnk.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600&family=Orbitron:wght@400;700&display=swap';
  document.head.appendChild(lnk);

  var prc = document.createElement('link');
  prc.rel = 'preconnect';
  prc.href = 'https://fonts.googleapis.com';
  document.head.insertBefore(prc, lnk);

  // ── 2. Shared CSS ──────────────────────────────────────────────────────────
  var css = document.createElement('style');
  css.textContent = [
    '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',

    /* CSS custom properties — dark theme */
    ':root {',
    '  --bg:        #040d1a;',
    '  --panel:     #071428;',
    '  --border:    #0d2d50;',
    '  --cyan:      #00d4ff;',
    '  --cyan-dim:  rgba(0,212,255,0.10);',
    '  --cyan-glow: rgba(0,212,255,0.25);',
    '  --amber:     #f0a500;',
    '  --green:     #00ff88;',
    '  --red:       #ff4444;',
    '  --text:      #d8eeff;',
    '  --text-hi:   #f0f8ff;',
    '  --muted:     #7ab0c8;',
    '  --gold:      #c9a84c;',
    '  --sw:        230px;',
    '  --rsw:       320px;',
    '}',

    /* Light theme — content area only */
    '[data-theme="light"] {',
    '  --bg:        #dce8f2;',
    '  --panel:     #eaf2f8;',
    '  --border:    #a8c4d8;',
    '  --cyan:      #006fa8;',
    '  --cyan-dim:  rgba(0,111,168,0.10);',
    '  --cyan-glow: rgba(0,111,168,0.20);',
    '  --amber:     #c07800;',
    '  --green:     #007a45;',
    '  --red:       #c0392b;',
    '  --text:      #1a3a52;',
    '  --text-hi:   #0a1e2e;',
    '  --muted:     #4a7a96;',
    '  --gold:      #b8922a;',
    '}',

    /* Sidebars always dark */
    '[data-theme="light"] .bridge,',
    '[data-theme="light"] .right-sidebar {',
    '  --bg:        #040d1a;',
    '  --panel:     #071428;',
    '  --border:    #0d2d50;',
    '  --cyan:      #00d4ff;',
    '  --cyan-dim:  rgba(0,212,255,0.10);',
    '  --cyan-glow: rgba(0,212,255,0.25);',
    '  --amber:     #f0a500;',
    '  --green:     #00ff88;',
    '  --text:      #d8eeff;',
    '  --text-hi:   #f0f8ff;',
    '  --muted:     #7ab0c8;',
    '}',
    '[data-theme="light"] .bridge {',
    '  background: linear-gradient(180deg, #020810 0%, #040d1a 100%);',
    '  border-right-color: #0d2d50;',
    '}',
    '[data-theme="light"] .right-sidebar {',
    '  background: linear-gradient(180deg, #020810 0%, #040d1a 100%);',
    '  border-left-color: #0d2d50;',
    '}',
    '[data-theme="light"] .rsb-spin-sec { background: rgba(2,8,16,0.4); }',
    '[data-theme="light"] .rsb-gauges   { background: rgba(2,8,16,0.2); }',
    '[data-theme="light"] .rsb-sweep    { mix-blend-mode: screen; }',

    /* Scanlines */
    'body::after {',
    '  content: \'\'; position: fixed; inset: 0;',
    '  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px);',
    '  pointer-events: none; z-index: 9999;',
    '}',
    '[data-theme="light"] body::after {',
    '  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,60,100,0.02) 2px, rgba(0,60,100,0.02) 4px);',
    '}',

    /* Body base */
    'body {',
    '  background: var(--bg); color: var(--text);',
    '  font-family: \'Exo 2\', sans-serif; font-size: 21px;',
    '  min-height: 100vh; overflow-x: hidden;',
    '}',

    /* HUD panel */
    '.hud { background: var(--panel); border: 1px solid var(--border); position: relative; overflow: hidden; }',
    '.hud::before { content: \'\'; position: absolute; top: -1px; left: -1px; width: 13px; height: 13px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); z-index: 2; }',
    '.hud::after  { content: \'\'; position: absolute; top: -1px; right: -1px; width: 13px; height: 13px; border-top: 2px solid var(--cyan); border-right: 2px solid var(--cyan); z-index: 2; }',
    '.hud-br { position: absolute; bottom: -1px; right: -1px; width: 13px; height: 13px; border-bottom: 2px solid var(--cyan); border-right: 2px solid var(--cyan); z-index: 2; }',
    '.hud-bl { position: absolute; bottom: -1px; left: -1px; width: 13px; height: 13px; border-bottom: 2px solid var(--cyan); border-left: 2px solid var(--cyan); z-index: 2; }',

    /* HUD label */
    '.hud-label { font-family: \'Rajdhani\', sans-serif; font-size: 17px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cyan); padding: 7px 12px 5px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }',
    '.hud-label .hl-r { color: var(--muted); font-size: 16px; letter-spacing: 0.1em; }',

    /* Bridge sidebar */
    '.bridge { position: fixed; left: 0; top: 0; bottom: 0; width: var(--sw); background: linear-gradient(180deg, #020810 0%, #040d1a 100%); border-right: 1px solid var(--border); z-index: 200; display: flex; flex-direction: column; }',
    '.bridge-logo { padding: 16px 14px 12px; border-bottom: 1px solid var(--border); text-align: center; flex-shrink: 0; }',
    '.bridge-logo img { width: 80px; height: 80px; border-radius: 50%; border: 1px solid var(--cyan); object-fit: cover; object-position: 52% 18%; box-shadow: 0 0 20px var(--cyan-glow), 0 0 6px var(--cyan-glow); display: block; margin: 0 auto; background: #3c5fad; }',
    '.bridge-callsign { font-family: \'Orbitron\', monospace; font-size: 16px; letter-spacing: 0.16em; color: var(--cyan); text-transform: uppercase; margin-top: 8px; }',
    '.bridge-rank { font-size: 16px; color: var(--muted); margin-top: 3px; letter-spacing: 0.05em; }',
    '.bridge-section { font-size: 16px; letter-spacing: 0.18em; color: var(--muted); text-transform: uppercase; padding: 11px 16px 5px; flex-shrink: 0; }',
    '.bridge-sub-section { font-size: 10px; letter-spacing: 0.2em; color: var(--cyan); text-transform: uppercase; padding: 10px 16px 3px; opacity: 0.55; border-top: 1px solid rgba(0,212,255,0.1); margin-top: 6px; flex-shrink: 0; }',
    '.bridge-nav { padding: 2px 0; }',
    '.bridge-scroll { flex: 1; overflow-y: auto; }',
    /* Global scrollbars — cyan tint, both themes */
    '::-webkit-scrollbar { width: 5px; height: 5px; }',
    '::-webkit-scrollbar-track { background: transparent; }',
    '::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.28); border-radius: 3px; }',
    '::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.55); }',
    '[data-theme="light"] ::-webkit-scrollbar-thumb { background: rgba(0,111,168,0.28); }',
    '[data-theme="light"] ::-webkit-scrollbar-thumb:hover { background: rgba(0,111,168,0.55); }',
    '.bridge-scroll::-webkit-scrollbar { width: 3px; }',
    '.bridge-scroll::-webkit-scrollbar-track { background: transparent; }',
    '.bridge-scroll::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.35); }',

    /* Bridge item */
    '.bridge-item { display: flex; align-items: center; gap: 9px; padding: 9px 16px; font-family: \'Exo 2\', sans-serif; font-size: 18px; font-weight: 500; color: var(--muted); text-decoration: none; letter-spacing: 0.04em; border-left: 2px solid transparent; transition: all 0.15s; }',
    '.bridge-item:hover  { color: var(--cyan); background: var(--cyan-dim); border-left-color: rgba(0,212,255,0.4); }',
    '.bridge-item.active { color: var(--cyan); background: var(--cyan-dim); border-left-color: var(--cyan); }',
    '.bridge-item-icon { display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; flex-shrink: 0; opacity: 0.7; }',
    '.bridge-item-icon svg { width: 16px; height: 16px; }',
    '.bridge-theme-btn { width: 100%; background: none; border: none; border-left: 2px solid transparent; cursor: pointer; text-align: left; color: var(--muted); }',
    '.bridge-theme-btn:hover { color: var(--cyan); background: var(--cyan-dim); border-left-color: rgba(0,212,255,0.4); }',
    '.bridge-refresh-btn { width:100%; background:none; border:none; border-left:2px solid rgba(240,165,0,0.5); cursor:pointer; text-align:left; color:var(--amber); font-family:\'Exo 2\',sans-serif; font-size:18px; font-weight:500; letter-spacing:0.04em; padding:9px 16px; display:flex; align-items:center; gap:9px; }',
    '.bridge-refresh-btn:hover { color:var(--amber); background:rgba(240,165,0,0.12); border-left-color:var(--amber); }',
    '.bridge-refresh-btn:disabled { opacity:0.5; cursor:not-allowed; }',
    '@keyframes lb-spin-cw { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }',
    '.lb-refresh-spin { display:inline-block !important; animation:lb-spin-cw 0.6s linear infinite; }',
    '.bridge-footer { padding: 11px 16px; border-top: 1px solid var(--border); font-size: 16px; color: var(--muted); letter-spacing: 0.1em; text-align: center; flex-shrink: 0; }',
    '.lb-print-btn { position:fixed; top:14px; right:24px; z-index:150; display:flex; align-items:center; gap:0; background:rgba(4,13,26,0.92); border:1px solid rgba(0,212,255,0.35); color:rgba(0,212,255,0.80); font-family:\'Exo 2\',sans-serif; font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; padding:7px 14px; cursor:pointer; border-radius:3px; transition:all 0.18s; box-shadow:0 0 12px rgba(0,212,255,0.08); }',
    '.lb-print-btn:hover { background:rgba(0,212,255,0.12); border-color:var(--cyan); color:var(--cyan); box-shadow:0 0 18px rgba(0,212,255,0.22); }',
    '@media (max-width:700px) { .lb-print-btn { top:14px; right:14px; font-size:12px; padding:6px 11px; } }',
    '@media (min-width:1201px) { .lb-print-btn { right:calc(var(--rsw) + 24px); } }',

    /* Trek separator */
    '.bridge-trek-sep { padding: 10px 10px 8px; display: flex; flex-direction: column; align-items: center; gap: 6px; }',
    '.bts-scan { width: 100%; height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 35%, rgba(0,212,255,0.4) 65%, transparent 100%); }',
    '.bts-hud { width: 100%; max-width: 180px; height: auto; color: rgba(0,212,255,0.60); filter: drop-shadow(0 0 6px rgba(0,212,255,0.25)); }',
    '.bts-registry { font-family: \'Share Tech Mono\', monospace; font-size: 14px; color: rgba(0,212,255,0.28); letter-spacing: 0.38em; text-transform: uppercase; }',

    '@keyframes hudSweep { from { transform: rotate(0deg); transform-origin: 90px 70px; } to { transform: rotate(360deg); transform-origin: 90px 70px; } }',
    '@keyframes hudPulse  { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }',
    '.hud-sweep     { animation: hudSweep 6s linear infinite; transform-origin: 90px 70px; }',
    '.hud-dot-pulse { animation: hudPulse 2.8s ease-in-out infinite; }',

    /* Bridge overlay + hamburger */
    '.bridge-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.72); z-index: 190; }',
    '.bridge-overlay.open { display: block; }',
    '.bridge.open { transform: translateX(0) !important; }',
    '.hamburger { display: none; position: fixed; top: 14px; left: 14px; z-index: 300; background: rgba(4,13,26,0.95); border: 1px solid var(--border); width: 36px; height: 36px; align-items: center; justify-content: center; cursor: pointer; flex-direction: column; gap: 5px; padding: 7px; border-radius: 2px; }',
    '.hamburger span { display: block; width: 18px; height: 2px; background: var(--cyan); border-radius: 2px; }',

    /* Right sidebar */
    '.right-sidebar { display: none; position: fixed; right: 0; top: 0; bottom: 32px; width: var(--rsw); background: linear-gradient(180deg, #020810 0%, #040d1a 100%); border-left: 1px solid var(--border); z-index: 150; flex-direction: column; overflow-y: auto; overflow-x: hidden; }',

    /* Radar */
    '.rsb-spin-sec { padding: 14px 15px 10px; display: flex; flex-direction: column; align-items: center; border-bottom: 1px solid var(--border); background: rgba(2,8,16,0.4); flex-shrink: 0; }',
    '.rsb-spin-sec.hud { background: rgba(2,8,16,0.4); }',
    '.rsb-sweep-wrap { position: relative; width: 290px; height: 290px; }',
    '.rsb-sweep-svg  { width: 100%; height: 100%; display: block; }',
    '.rsb-sweep { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 0deg 335deg, rgba(0,212,255,0.12) 335deg 350deg, rgba(0,212,255,0.48) 350deg 360deg); animation: radarSpin 4s linear infinite; mix-blend-mode: screen; }',
    '@keyframes radarSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
    '.rsb-spin-lbl { font-size: 14px; letter-spacing: 0.18em; color: var(--muted); text-transform: uppercase; margin-top: 6px; font-family: \'Rajdhani\', sans-serif; }',

    /* Gauges */
    '.rsb-gauges { display: flex; justify-content: space-around; padding: 12px 6px 10px; border-bottom: 1px solid var(--border); background: rgba(2,8,16,0.2); flex-shrink: 0; }',
    '.rsb-gauges.hud { background: rgba(2,8,16,0.2); }',
    '.gauge-wrap  { display: flex; flex-direction: column; align-items: center; gap: 4px; }',
    '.gauge-ring  { width: 82px; height: 82px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }',
    '.gauge-inner { width: 60px; height: 60px; border-radius: 50%; background: var(--bg); border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; }',
    '.gauge-val   { font-family: \'Orbitron\', monospace; font-size: 22px; color: var(--text-hi); line-height: 1; }',
    '.gauge-lbl   { font-size: 14px; color: var(--muted); letter-spacing: 0.07em; }',
    '.gauge-name  { font-size: 15px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }',

    /* RSB crew */
    '.rsb-crew { flex: 1; overflow-y: auto !important; display: flex; flex-direction: column; min-height: 0; }',
    '.rsb-crew .hud-label { position: sticky; top: 0; z-index: 1; background: var(--panel); }',

    /* Agent rows */
    '.rsb-agent-cat { font-family: \'Rajdhani\', sans-serif; font-size: 16px; letter-spacing: 0.14em; text-transform: uppercase; padding: 6px 10px 4px 12px; display: flex; align-items: center; gap: 7px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(13,45,80,0.4); color: var(--cc, var(--cyan)); }',
    '.rsb-agent-cat::before { content: \'\'; width: 5px; height: 5px; border-radius: 50%; background: var(--cc, var(--cyan)); flex-shrink: 0; }',
    '.rsb-agent-row { display: flex; align-items: center; gap: 8px; padding: 5px 10px 5px 12px; border-bottom: 1px solid rgba(13,45,80,0.2); min-width: 0; }',
    '.rsb-agent-row:hover { background: rgba(0,212,255,0.04); }',
    '.rsb-agent-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--cc, var(--cyan)); }',
    '.rsb-agent-dot.active { opacity: 1; box-shadow: 0 0 5px var(--cc, var(--cyan)); animation: activePulse 1.1s ease-in-out infinite; }',
    '.rsb-agent-dot.idle   { opacity: 0.45; box-shadow: 0 0 3px var(--cc, var(--cyan)); animation: idleGlow 3.5s ease-in-out infinite; }',
    '.rsb-agent-name { font-size: 17px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text); font-family: \'Share Tech Mono\', monospace; }',
    '.rsb-agent-name.active { color: var(--text-hi); }',
    '.rsb-agent-status { font-family: \'Rajdhani\', sans-serif; font-size: 15px; letter-spacing: 0.08em; flex-shrink: 0; text-transform: uppercase; }',
    '.rsb-agent-status.active { color: var(--amber); }',
    '.rsb-agent-status.idle   { color: var(--muted); }',
    '.rsb-agent-task { font-size: 15px; color: var(--cyan); padding: 0 10px 5px 28px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
    '.rsb-agent-task-last { color: var(--muted); opacity: 0.65; font-style: italic; }',
    '.rsb-agent-world { display: flex; gap: 3px; flex-shrink: 0; align-items: center; }',
    '.rsb-world-badge { font-family: \'Orbitron\', monospace; font-size: 12px; font-weight: 700; width: 16px; height: 16px; border-radius: 2px; display: flex; align-items: center; justify-content: center; letter-spacing: 0; }',
    '.rsb-world-badge.badge-m-on { color: #ef4444; border: 1px solid rgba(239,68,68,0.65); text-shadow: 0 0 7px rgba(239,68,68,0.9); box-shadow: 0 0 5px rgba(239,68,68,0.25) inset; }',
    '.rsb-world-badge.badge-c-on { color: #00d4ff; border: 1px solid rgba(0,212,255,0.65); text-shadow: 0 0 7px rgba(0,212,255,0.9); box-shadow: 0 0 5px rgba(0,212,255,0.25) inset; }',
    '.rsb-world-badge.badge-off  { color: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.05); }',
    '.crew-world-filter { display:flex; gap:4px; padding:6px 8px 4px; border-bottom:1px solid var(--border); }',
    '.cwf-btn { flex:1; font-family:\'Orbitron\',monospace; font-size:11px; font-weight:700; letter-spacing:0.08em; padding:5px 0; background:none; border:1px solid rgba(255,255,255,0.08); color:var(--muted); cursor:pointer; border-radius:2px; transition:all 0.12s; }',
    '.cwf-btn:hover { background:rgba(255,255,255,0.05); color:var(--text); }',
    '.cwf-btn.cwf-active-all { border-color:rgba(0,212,255,0.6); color:var(--cyan); }',
    '.cwf-btn.cwf-active-m   { border-color:rgba(239,68,68,0.6); color:#ef4444; }',
    '.cwf-btn.cwf-active-c   { border-color:rgba(0,212,255,0.6); color:var(--cyan); }',

    /* Crew claire header */
    '.crew-claire { margin-bottom: 6px; padding: 8px 10px; background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.2); text-align: center; }',
    '.crew-claire-name { font-family: \'Orbitron\', monospace; font-size: 17px; color: var(--cyan); letter-spacing: 0.14em; }',
    '.crew-claire-rank { font-size: 16px; color: var(--muted); margin-top: 3px; }',

    /* Progress bar */
    '.crew-progress { display: flex; align-items: center; gap: 8px; padding: 2px 8px 6px 10px; }',
    '.crew-progress-lbl { font-size: 14px; color: var(--muted); letter-spacing: 0.14em; text-transform: uppercase; min-width: 56px; }',
    '.crew-progress-track { display: flex; gap: 3px; flex: 1; }',
    '.crew-progress-seg { flex: 1; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; }',
    '.crew-progress-seg.filled { background: var(--cc, var(--cyan)); box-shadow: 0 0 5px var(--cc, var(--cyan)); }',
    '.crew-progress-val { font-family: \'Orbitron\', monospace; font-size: 15px; min-width: 32px; text-align: right; }',

    /* Sig dot */
    '.sig-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 7px var(--green); animation: blink 2s infinite; margin-right: 5px; vertical-align: middle; }',
    '@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }',
    '@keyframes activePulse { 0%,100%{ transform:scale(1);   opacity:1; } 50%{ transform:scale(1.5); opacity:0.7; } }',
    '@keyframes idleGlow    { 0%,100%{ opacity:0.38; box-shadow:0 0 3px var(--cc,var(--cyan)); } 50%{ opacity:0.65; box-shadow:0 0 9px var(--cc,var(--cyan)); } }',

    /* Horizon */
    '.horizon { position: fixed; bottom: 0; left: var(--sw); right: 0; height: 32px; background: linear-gradient(180deg, #020810 0%, #000 100%); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; font-size: 16px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; z-index: 100; }',
    '.hz-sig { display: flex; align-items: center; gap: 6px; }',
    '[data-theme="light"] .horizon { background: linear-gradient(180deg, #000 0%, #020810 100%); }',

    /* Page content */
    '.page-content { margin-left: var(--sw); min-height: 100vh; padding: 20px 24px 72px; }',
    '.page-content h1 { font-family: \'Orbitron\', monospace; font-size: 26px; color: var(--cyan); letter-spacing: 0.1em; text-shadow: 0 0 16px var(--cyan-glow); margin-bottom: 8px; }',
    '.page-content h2 { font-family: \'Rajdhani\', sans-serif; font-size: 22px; color: var(--cyan); text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin: 28px 0 12px; }',
    '.page-content h3 { font-family: \'Exo 2\', sans-serif; font-size: 20px; font-weight: 600; color: var(--text-hi); margin: 20px 0 8px; }',
    '.page-content p  { font-size: 20px; color: var(--text); line-height: 1.65; margin-bottom: 14px; }',
    '.page-content ul, .page-content ol { margin: 6px 0 14px 24px; }',
    '.page-content li { font-size: 20px; color: var(--text); line-height: 1.65; margin-bottom: 4px; }',
    '.page-content table { width: 100%; border-collapse: collapse; margin: 10px 0 18px; background: var(--panel); border: 1px solid var(--border); }',
    '.page-content th { font-family: \'Rajdhani\', sans-serif; color: var(--cyan); text-transform: uppercase; letter-spacing: 0.08em; padding: 9px 14px; background: rgba(0,0,0,0.35); border-bottom: 1px solid var(--border); text-align: left; white-space: nowrap; }',
    '.page-content td { color: var(--text); padding: 9px 14px; border-bottom: 1px solid rgba(13,45,80,0.5); overflow-wrap: break-word; }',
    '.page-content table { min-width: 0; }',
    '.page-content tr:last-child td { border-bottom: none; }',
    '.page-content pre { font-family: \'Share Tech Mono\', monospace; font-size: 18px; background: rgba(2,8,16,0.85); border: 1px solid var(--border); border-left: 3px solid var(--cyan); padding: 14px 16px; overflow-x: auto; line-height: 1.6; margin: 10px 0 18px; color: #c8e8ff; }',
    '.page-content strong { font-weight: 700; color: var(--text-hi); }',
    '.page-content hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }',
    '.page-content a { color: var(--cyan); text-decoration: none; }',
    '.page-content a:hover { text-decoration: underline; }',
    '.page-content .footer { font-family: \'Share Tech Mono\', monospace; font-size: 16px; color: var(--muted); margin-top: 32px; font-style: italic; }',
    '.page-content .subtitle { font-family: \'Exo 2\', sans-serif; font-size: 19px; color: var(--muted); font-style: italic; margin-bottom: 24px; }',
    '.page-content .source-list { list-style: none; margin-left: 0; }',
    '.page-content .source-list li { padding: 3px 0; }',
    '.page-content .source-list a { font-size: 19px; color: var(--cyan); }',
    /* Light theme overrides for page-content */
    '[data-theme="light"] .page-content pre { border-color: rgba(0,111,168,0.35); border-left-color: var(--cyan); }',
    '[data-theme="light"] .page-content th  { background: rgba(8,22,42,0.82); color: #00d4ff; }',
    '[data-theme="light"] .page-content td  { border-bottom-color: rgba(0,80,130,0.15); }',

    /* Responsive */
    '@media (max-width: 700px) {',
    '  :root { --sw: 0px; }',
    '  .bridge { transform: translateX(-100%); transition: transform 0.25s; width: 220px; }',
    '  .bridge.open { transform: translateX(0); }',
    '  .hamburger { display: flex; }',
    '  .horizon { left: 0; }',
    '  .page-content { padding-left: 16px; padding-right: 16px; padding-top: 56px; }',
    '  .page-content table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }',
    '  .page-content h1 { font-size: 22px; letter-spacing: 0.06em; }',
    '  .tab-nav { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 2px; }',
    '  .tab-btn { flex-shrink: 0; padding: 9px 13px; font-size: 0.78rem; }',
    '}',
    '@media (min-width: 701px) and (max-width: 900px) {',
    '  :root { --sw: 180px; }',
    '  .bridge { width: 180px; }',
    '  .page-content table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }',
    '}',
    '@media (min-width: 901px) and (max-width: 1200px) {',
    '  :root { --sw: 190px; }',
    '  .bridge { width: 190px; }',
    '}',
    '@media (min-width: 1201px) {',
    '  .right-sidebar { display: flex; }',
    '  .page-content  { margin-right: var(--rsw); }',
    '  .horizon       { right: var(--rsw); }',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  // ── 3. Restore theme ──────────────────────────────────────────────────────
  // Light theme is desktop-only — mobile always stays dark
  (function () {
    var t = localStorage.getItem('lb-theme');
    if (t === 'light' && window.innerWidth > 700) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (window.innerWidth <= 700) {
      document.documentElement.removeAttribute('data-theme');
    }
  })();

  // ── 4. Inject HTML ────────────────────────────────────────────────────────
  var NAV_ITEMS = [
    { key: 'status',        label: 'Status',        href: BASE + 'index.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="6.5" opacity="0.35"/><circle cx="8" cy="8" r="3.8" opacity="0.55"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" opacity="0.85"/><line x1="8" y1="8" x2="12.5" y2="4.5" opacity="0.7"/><circle cx="12.5" cy="4.5" r="1" fill="currentColor" stroke="none" opacity="0.7"/></svg>' },
    { key: 'reminders',     label: 'Påminnelser', href: BASE + 'index.html#reminders',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2.5 12 A7 7 0 0 1 13.5 12" opacity="0.3"/><path d="M2.5 12 A7 7 0 0 1 10 5" stroke-width="1.8" opacity="0.8" stroke-linecap="round"/><circle cx="8" cy="12" r="1.1" fill="currentColor" stroke="none" opacity="0.6"/><line x1="8" y1="10.8" x2="11.5" y2="7" stroke-width="1" opacity="0.65" stroke-linecap="round"/></svg>' },
    { key: 'captains-log',  label: "Captain's Log", href: BASE + 'captains_log.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1"><rect x="1.5" y="1.5" width="13" height="13" rx="1" opacity="0.35"/><line x1="1.5" y1="5.5" x2="14.5" y2="5.5" opacity="0.45"/><line x1="1.5" y1="9" x2="14.5" y2="9" opacity="0.45"/><line x1="6" y1="5.5" x2="6" y2="14.5" opacity="0.45"/><rect x="3" y="3" width="2" height="1.5" fill="currentColor" stroke="none" opacity="0.7" rx="0.3"/><rect x="6.5" y="3" width="5" height="1.5" fill="currentColor" stroke="none" opacity="0.4" rx="0.3"/></svg>' },
    { key: 'crew',          label: 'Crew Manifest', href: BASE + 'crew.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" opacity="0.7"/><circle cx="8" cy="2.5" r="1.5" opacity="0.6"/><circle cx="13.2" cy="11" r="1.5" opacity="0.6"/><circle cx="2.8" cy="11" r="1.5" opacity="0.6"/><line x1="8" y1="4" x2="8" y2="6" opacity="0.5"/><line x1="9.9" y1="9.1" x2="11.7" y2="10" opacity="0.5"/><line x1="6.1" y1="9.1" x2="4.3" y2="10" opacity="0.5"/></svg>' },
    { key: 'spark',         label: 'SPARK',         href: BASE + 'index.html#spark',
      icon: '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="0.9" opacity="0.3" stroke-dasharray="2 2"/><polygon points="9.5,1.5 5,8.5 7.8,8.5 6.5,14.5 11,7.5 8.2,7.5" fill="currentColor" opacity="0.7"/></svg>' },
    { key: 'claire',        label: 'Claire',        href: BASE + 'claire.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="5.5" r="3" opacity="0.7"/><path d="M2 14.5 C2 11.5 4.7 9 8 9 C11.3 9 14 11.5 14 14.5" opacity="0.5" stroke-linecap="round"/><circle cx="13" cy="3" r="2" fill="currentColor" stroke="none" opacity="0.5"/><line x1="13" y1="3" x2="13" y2="5" stroke-width="1.2" opacity="0.6" stroke-linecap="round"/><line x1="11.5" y1="3" x2="9.5" y2="3" stroke-width="1.2" opacity="0.55" stroke-linecap="round"/></svg>' }
  ];
  var TOOL_ITEMS = [
    { key: 'doctrine', label: 'Doctrine Hub', href: BASE + 'doctrine.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="7" opacity="0.28"/><circle cx="8" cy="8" r="4.5" opacity="0.45"/><circle cx="8" cy="8" r="2" opacity="0.65"/><circle cx="8" cy="8" r="0.9" fill="currentColor" stroke="none" opacity="0.9"/><line x1="8" y1="1" x2="8" y2="5.5" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/><line x1="8" y1="10.5" x2="8" y2="15" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/><line x1="1" y1="8" x2="5.5" y2="8" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/><line x1="10.5" y1="8" x2="15" y2="8" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/><polygon points="8,1 7,3.5 8,3 9,3.5" fill="currentColor" stroke="none" opacity="0.85"/></svg>' },
    { key: 'strategy-library', label: 'Strategy Library', href: BASE + 'strategy_library.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="2" width="8" height="11" rx="0.5" opacity="0.45"/><rect x="3.5" y="2" width="8" height="11" rx="0.5" opacity="0.55"/><rect x="5" y="2" width="8" height="11" rx="0.5" opacity="0.75"/><line x1="7" y1="5.5" x2="11" y2="5.5" stroke-linecap="round" opacity="0.65"/><line x1="7" y1="7.5" x2="11" y2="7.5" stroke-linecap="round" opacity="0.5"/><line x1="7" y1="9.5" x2="9.5" y2="9.5" stroke-linecap="round" opacity="0.4"/></svg>' },
    { key: 'ai-toolkit', label: 'AI Toolkit', href: BASE + 'ai_toolkit.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="2.5" width="14" height="10" rx="1" opacity="0.4"/><circle cx="8" cy="7.5" r="2.5" opacity="0.75"/><line x1="1" y1="7.5" x2="5.5" y2="7.5" stroke-linecap="round" opacity="0.45"/><line x1="10.5" y1="7.5" x2="15" y2="7.5" stroke-linecap="round" opacity="0.45"/><line x1="4" y1="13" x2="4" y2="15" stroke-linecap="round" opacity="0.5"/><line x1="12" y1="13" x2="12" y2="15" stroke-linecap="round" opacity="0.5"/><line x1="4" y1="15" x2="12" y2="15" stroke-linecap="round" opacity="0.35"/></svg>' },
    { key: 'project-viz', label: 'Project Viz', href: BASE + 'project_viz.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="3" width="14" height="2" rx="0.5" opacity="0.65"/><rect x="1" y="7" width="9" height="2" rx="0.5" opacity="0.78"/><rect x="1" y="11" width="12" height="2" rx="0.5" opacity="0.55"/><line x1="12" y1="4" x2="15" y2="4" stroke-width="1.4" stroke-linecap="round" opacity="0.95"/><line x1="11" y1="8" x2="15" y2="8" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/><line x1="14" y1="12" x2="15" y2="12" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/></svg>' }
  ];
  var INTEL_ITEMS = [
    { key: 'linkedin', label: 'LinkedIn Hub', href: BASE + 'linkedin.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="1" width="14" height="14" rx="2" opacity="0.35"/><rect x="2.5" y="6" width="3" height="8" rx="0.5" opacity="0.7"/><circle cx="4" cy="3.5" r="1.3" opacity="0.7"/><rect x="7" y="6" width="3" height="8" rx="0.5" opacity="0.55"/><path d="M10 8.5 C10 7 11 6 12 6 C13 6 13.5 7 13.5 8.5 L13.5 14" stroke-linecap="round" opacity="0.55"/></svg>' },
    { key: 'pinterest', label: 'Pinterest Hub', href: BASE + 'pinterest.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="6.5" opacity="0.3"/><path d="M8 1.5 C8 1.5 5 5 5 8 C5 9.5 5.7 11 8 12" stroke-linecap="round" opacity="0.65"/><path d="M8 1.5 C8 1.5 11 5 11 8 C11 9.5 10.3 11 8 12" stroke-linecap="round" opacity="0.35"/><line x1="3" y1="8" x2="13" y2="8" opacity="0.3"/><circle cx="8" cy="12" r="1.2" fill="currentColor" stroke="none" opacity="0.55"/><line x1="8" y1="12" x2="8" y2="14.5" stroke-linecap="round" opacity="0.45"/><line x1="6" y1="14.5" x2="10" y2="14.5" stroke-linecap="round" opacity="0.35"/></svg>' },
    { key: 'intel', label: 'Intel Archive', href: BASE + 'reports/index.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="11.5" width="12" height="3" rx="0.5" opacity="0.45"/><rect x="3" y="7.5" width="10" height="3.5" rx="0.5" opacity="0.55"/><rect x="4.5" y="3.5" width="7" height="3.5" rx="0.5" opacity="0.65"/><rect x="6" y="0.5" width="4" height="2.5" fill="currentColor" stroke="none" opacity="0.75" rx="0.5"/></svg>' },
    { key: 'gallery', label: 'Gallery', href: BASE + 'bildarkiv.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="3" width="14" height="10" rx="1" opacity="0.4"/><circle cx="5.5" cy="7.5" r="1.8" opacity="0.65"/><path d="M1 11.5 L5 8.5 L8 11 L11 8 L15 11.5" opacity="0.55" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="1" width="5" height="3.5" rx="0.5" fill="currentColor" stroke="none" opacity="0.3"/><line x1="11" y1="2.5" x2="14" y2="2.5" stroke="white" stroke-width="0.8" opacity="0.5"/></svg>' },
    { key: 'websites', label: 'Websites', href: BASE + 'reports/index.html?cat=WEBBPLATS',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="6.5" opacity="0.55"/><path d="M8 1.5 C6 4 5.5 6 5.5 8 C5.5 10 6 12 8 14.5" opacity="0.5"/><path d="M8 1.5 C10 4 10.5 6 10.5 8 C10.5 10 10 12 8 14.5" opacity="0.5"/><line x1="1.5" y1="8" x2="14.5" y2="8" opacity="0.45"/><line x1="2.5" y1="5" x2="13.5" y2="5" opacity="0.35"/><line x1="2.5" y1="11" x2="13.5" y2="11" opacity="0.35"/></svg>' }
  ];
  var MOBILIX_ITEMS = [
    { key: 'csm-handover', label: 'CSM Handover', href: BASE + 'mobilix_csm_handover.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="4" cy="4.5" r="2" opacity="0.6"/><path d="M1.5 11.5 C1.5 9 6.5 9 6.5 11.5" stroke-linecap="round" opacity="0.55"/><circle cx="12" cy="4.5" r="2" opacity="0.6"/><path d="M9.5 11.5 C9.5 9 14.5 9 14.5 11.5" stroke-linecap="round" opacity="0.55"/><path d="M7 7 L9 7" stroke-linecap="round" stroke-dasharray="1.5,1" opacity="0.5"/><polyline points="8,5.5 9.5,7 8,8.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/></svg>' },
    { key: 'mobilix-analys', label: 'Mobilix Analys', href: BASE + 'reports/mobilix_produktanalys_20260611.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="8" width="3" height="7" rx="0.8" opacity="0.5"/><rect x="5.5" y="5" width="3" height="10" rx="0.8" opacity="0.65"/><rect x="10" y="2" width="3" height="13" rx="0.8" opacity="0.8"/><path d="M2.5 8 L7 5 L11.5 2" stroke-linecap="round" stroke-dasharray="1.5,1.5" opacity="0.4"/></svg>' },
    { key: 'fardbevis-rapport', label: 'Färdbevis Rapport', href: BASE + 'reports/fardbevis_se.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="1.5" width="12" height="13" rx="1" opacity="0.35"/><line x1="5" y1="5" x2="11" y2="5" stroke-linecap="round" opacity="0.65"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke-linecap="round" opacity="0.55"/><line x1="5" y1="10" x2="8.5" y2="10" stroke-linecap="round" opacity="0.45"/><circle cx="11" cy="11.5" r="2.5" opacity="0.6"/><path d="M10 11.5 L11 12.5 L12.5 10.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/></svg>' },
    { key: 'mobilix-ot-analys', label: 'Östergötland', href: BASE + 'reports/ostergotland_analys.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="2" width="12" height="12" rx="1.5" opacity="0.35"/><path d="M4 5 L8 5 M4 7.5 L10 7.5 M4 10 L7 10" stroke-linecap="round" opacity="0.65"/><circle cx="12" cy="11" r="2.5" opacity="0.6"/><path d="M11 11 L12 12 L13.5 10" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/></svg>' },
    { key: 'mobilix-skane-analys', label: 'Skånetrafiken', href: BASE + 'reports/skane_analys.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="2" width="12" height="12" rx="1.5" opacity="0.35"/><path d="M4 5 L8 5 M4 7.5 L10 7.5 M4 10 L7 10" stroke-linecap="round" opacity="0.65"/><circle cx="12" cy="11" r="2.5" opacity="0.6"/><path d="M11 11 L12 12 L13.5 10" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/></svg>' },
    { key: 'mobilix-sormland', label: 'Sörmlandstrafiken', href: BASE + 'reports/sormlandstrafiken_pipedrive_20260622.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="4" width="10" height="7" rx="1" opacity="0.5"/><path d="M11 6.5 L15 4.5 L15 11 L11 9 Z" opacity="0.7"/><circle cx="3.5" cy="13" r="1" opacity="0.75"/><circle cx="8.5" cy="13" r="1" opacity="0.75"/><line x1="4.5" y1="11" x2="4.5" y2="13" stroke-linecap="round" opacity="0.45"/><line x1="8.5" y1="11" x2="8.5" y2="13" stroke-linecap="round" opacity="0.45"/></svg>' },
    { key: 'mobilix-vastmanland', label: 'Region Västmanland', href: BASE + 'reports/region_vastmanland_pipedrive_20260622.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="4" width="10" height="7" rx="1" opacity="0.5"/><path d="M11 6.5 L15 4.5 L15 11 L11 9 Z" opacity="0.7"/><circle cx="3.5" cy="13" r="1" opacity="0.75"/><circle cx="8.5" cy="13" r="1" opacity="0.75"/><line x1="4.5" y1="11" x2="4.5" y2="13" stroke-linecap="round" opacity="0.45"/><line x1="8.5" y1="11" x2="8.5" y2="13" stroke-linecap="round" opacity="0.45"/></svg>' }
  ];
  var BT_ITEMS = [
    /* ── Övergripande ─────────────────────────────────────── */
    { type: 'divider', label: 'Övergripande' },
    { key: 'blekinge-intel', label: 'Blekinge Intel', href: BASE + 'blekinge_intel.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><polygon points="8,1.5 14.5,13 1.5,13" opacity="0.35"/><line x1="8" y1="5" x2="8" y2="9.5" stroke-linecap="round" opacity="0.75"/><circle cx="8" cy="11.2" r="0.8" fill="currentColor" stroke="none" opacity="0.75"/></svg>' },
    { key: 'blekinge-verksamhetsstyrning', label: 'Verksamhetsstyrning', href: BASE + 'bt_verksamhetsstyrning.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="2.5" opacity="0.7"/><path d="M8 1.5L8 3M8 13L8 14.5M1.5 8L3 8M13 8L14.5 8" stroke-linecap="round" opacity="0.5"/><path d="M3.5 3.5L4.6 4.6M11.4 11.4L12.5 12.5M12.5 3.5L11.4 4.6M4.6 11.4L3.5 12.5" stroke-linecap="round" opacity="0.4"/></svg>' },
    { key: 'blekinge-onboarding', label: 'BD Onboarding', href: BASE + 'blekinge_onboarding.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M8 2L14 5.5L8 9L2 5.5Z" opacity="0.6"/><path d="M5 7.5V11.5C6 12.5 10 12.5 11 11.5V7.5" stroke-linecap="round" opacity="0.65"/><line x1="14" y1="5.5" x2="14" y2="9.5" stroke-linecap="round" opacity="0.45"/></svg>' },
    { key: 'blekinge-pm3', label: 'BTpm3 Systemhandbok', href: BASE + 'blekinge_pm3.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1.5" y="1.5" width="5" height="5" rx="0.8" opacity="0.65"/><rect x="9.5" y="1.5" width="5" height="5" rx="0.8" opacity="0.65"/><rect x="1.5" y="9.5" width="5" height="5" rx="0.8" opacity="0.65"/><rect x="9.5" y="9.5" width="5" height="5" rx="0.8" opacity="0.65"/></svg>' },
    { key: 'blekinge-dokumentbibliotek', label: 'Dokumentbibliotek', href: BASE + 'blekinge_dokumentbibliotek.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M2 13.5A2 2 0 0 1 4 11.5H14"/><path d="M4 2H14v14H4A2 2 0 0 1 2 14V4A2 2 0 0 1 4 2z" opacity="0.45"/><line x1="6" y1="5.5" x2="12" y2="5.5" opacity="0.6"/><line x1="6" y1="8" x2="12" y2="8" opacity="0.5"/><line x1="6" y1="10.5" x2="9" y2="10.5" opacity="0.4"/></svg>' },
    /* ── Strategi & Planering ────────────────────────────── */
    { type: 'divider', label: 'Strategi & Planering' },
    { key: 'blekinge-flarsplan', label: 'Flerårsplan 2027–2031', href: BASE + 'blekinge_flarsplan.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><line x1="2" y1="14" x2="14" y2="14" opacity="0.4"/><line x1="2" y1="14" x2="2" y2="2" opacity="0.4"/><rect x="3" y="9" width="2.5" height="5" rx="0.3" opacity="0.6"/><rect x="6.5" y="6" width="2.5" height="8" rx="0.3" opacity="0.7"/><rect x="10" y="3" width="2.5" height="11" rx="0.3" opacity="0.8"/><polyline points="3,9 7.5,6 11.5,3" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/><circle cx="11.5" cy="3" r="1.2" fill="currentColor" stroke="none" opacity="0.7"/></svg>' },
    /* ── Marknad & Försäljning ────────────────────────────── */
    { type: 'divider', label: 'Marknad & Försäljning' },
    { key: 'blekinge-arbetsuppgifter', label: 'Arbetsuppgifter', href: BASE + 'bt_arbetsuppgifter.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="2" width="12" height="12" rx="1.5" opacity="0.35"/><line x1="5" y1="5.5" x2="11" y2="5.5" opacity="0.6"/><line x1="5" y1="8.5" x2="9" y2="8.5" opacity="0.5"/><polyline points="9,7 10.5,9 13,5.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" opacity="0.85"/></svg>' },
    { key: 'blekinge-bd', label: 'BD-Uppgifter', href: BASE + 'blekinge_bd.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="2" width="12" height="12" rx="1.5" opacity="0.35"/><line x1="5" y1="5.5" x2="11" y2="5.5" opacity="0.5"/><line x1="5" y1="8" x2="11" y2="8" opacity="0.5"/><line x1="5" y1="10.5" x2="8.5" y2="10.5" opacity="0.4"/><polyline points="9.5,9.2 11,11 13.5,7.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/></svg>' },
    { key: 'blekinge-bd-strategi', label: 'BD Strategi', href: BASE + 'blekinge_bd_strategi.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="5" r="3" opacity="0.55"/><path d="M3 14 C3 11 5 10 8 10 C11 10 13 11 13 14" stroke-linecap="round" opacity="0.7"/><polyline points="10,4 12,6 15,2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" opacity="0.85"/></svg>' },
    { key: 'blekinge-behov', label: 'Nytt Behov — Portföljkontoret', href: BASE + 'blekinge_behov.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="1.5" width="12" height="13" rx="1.2" opacity="0.4"/><line x1="5" y1="5" x2="11" y2="5" stroke-linecap="round" opacity="0.8"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke-linecap="round" opacity="0.6"/><line x1="5" y1="10" x2="8.5" y2="10" stroke-linecap="round" opacity="0.45"/><circle cx="11.5" cy="11.5" r="2.8" opacity="0.7"/><polyline points="10.5,11.5 11.5,12.5 13.2,10.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" opacity="0.9"/></svg>' },
    { key: 'blekinge-forsaljning', label: 'Målområde Försäljning', href: BASE + 'malomrade_forsaljning.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1.5" y="9" width="3" height="5.5" rx="0.5" opacity="0.7"/><rect x="6" y="6" width="3" height="8.5" rx="0.5" opacity="0.7"/><rect x="10.5" y="3" width="3" height="11.5" rx="0.5" opacity="0.7"/><circle cx="12" cy="2" r="1.5" stroke-width="1.2" opacity="0.8"/><polyline points="3,7 7.5,5 12,2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/></svg>' },
    { key: 'blekinge-pipedrive', label: 'BT Pipedrive', href: BASE + 'reports/blekingetrafiken_pipedrive_20260622.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="5" r="3" opacity="0.55"/><circle cx="4" cy="11" r="1.8" opacity="0.7"/><circle cx="12" cy="11" r="1.8" opacity="0.7"/><line x1="8" y1="8" x2="4" y2="9.2" stroke-linecap="round" opacity="0.4"/><line x1="8" y1="8" x2="12" y2="9.2" stroke-linecap="round" opacity="0.4"/></svg>' },
    { key: 'division-collab', label: 'Division Samarbete', href: BASE + 'division_collab.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="2.5" opacity="0.7"/><circle cx="2.5" cy="4" r="1.5" opacity="0.55"/><circle cx="13.5" cy="4" r="1.5" opacity="0.55"/><circle cx="2.5" cy="12" r="1.5" opacity="0.55"/><circle cx="13.5" cy="12" r="1.5" opacity="0.55"/><circle cx="8" cy="1.5" r="1.3" opacity="0.5"/><line x1="4" y1="5" x2="6.5" y2="6.5" opacity="0.35"/><line x1="12" y1="5" x2="9.5" y2="6.5" opacity="0.35"/><line x1="4" y1="11" x2="6.5" y2="9.5" opacity="0.35"/><line x1="12" y1="11" x2="9.5" y2="9.5" opacity="0.35"/><line x1="8" y1="2.8" x2="8" y2="5.5" opacity="0.35"/></svg>' },
    { key: 'division-multiproject', label: 'Flerprojekt', href: BASE + 'division_multiproject.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="3" width="14" height="2" rx="0.5" opacity="0.5"/><rect x="1" y="7" width="10" height="2" rx="0.5" opacity="0.65"/><rect x="1" y="11" width="12" height="2" rx="0.5" opacity="0.5"/><circle cx="13.5" cy="4" r="1.2" fill="currentColor" stroke="none" opacity="0.75"/><circle cx="13.5" cy="8" r="1.2" fill="currentColor" stroke="none" opacity="0.55" style="fill:#f0a500"/><circle cx="13.5" cy="12" r="1.2" fill="currentColor" stroke="none" opacity="0.55" style="fill:#e05252"/></svg>' },
    /* ── Webb & Kampanj ───────────────────────────────────── */
    { type: 'divider', label: 'Webb & Kampanj' },
    { key: 'blekinge-kampanj', label: 'Kampanjstudio', href: BASE + 'blekinge_kampanj.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M2 12 L5 8 L8 10 L11 5 L14 7" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/><circle cx="14" cy="7" r="1.3" fill="currentColor" stroke="none" opacity="0.65"/><line x1="2" y1="14" x2="14" y2="14" opacity="0.3"/><rect x="4" y="12" width="2" height="2" rx="0.3" fill="currentColor" stroke="none" opacity="0.45"/><rect x="7.5" y="10" width="2" height="4" rx="0.3" fill="currentColor" stroke="none" opacity="0.45"/><rect x="11" y="7" width="2" height="7" rx="0.3" fill="currentColor" stroke="none" opacity="0.45"/></svg>' },
    { key: 'blekinge-reklamblad', label: 'Reklamblad', href: BASE + 'blekinge_reklamblad.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="1.5" width="12" height="13" rx="1" opacity="0.4"/><line x1="4.5" y1="5" x2="11.5" y2="5" stroke-linecap="round" opacity="0.7"/><line x1="4.5" y1="7.5" x2="11.5" y2="7.5" stroke-linecap="round" opacity="0.6"/><line x1="4.5" y1="10" x2="8.5" y2="10" stroke-linecap="round" opacity="0.5"/><circle cx="10.5" cy="11" r="2" opacity="0.55"/><polyline points="9.5,11 10.5,12 12.5,9.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" opacity="0.8"/></svg>' },
    { key: 'blekinge-brief', label: 'Kampanjbrief', href: BASE + 'blekinge_brief.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="1.5" width="12" height="13" rx="1.2" opacity="0.4"/><line x1="5" y1="5" x2="11" y2="5" stroke-linecap="round" opacity="0.85"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke-linecap="round" opacity="0.65"/><line x1="5" y1="10" x2="8" y2="10" stroke-linecap="round" opacity="0.45"/><circle cx="11" cy="11.5" r="2.5" opacity="0.7"/><path d="M10.2 11.5 L11 12.3 L12.2 10.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/></svg>' },
    { key: 'blekinge-webbanalys', label: 'Webbanalys RKM', href: BASE + 'blekinge_webbanalys.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1.5" y="2.5" width="13" height="9" rx="1.2" opacity="0.55"/><line x1="5.5" y1="11.5" x2="10.5" y2="11.5" stroke-linecap="round" opacity="0.7"/><line x1="8" y1="11.5" x2="8" y2="13.5" stroke-linecap="round" opacity="0.6"/><line x1="4" y1="13.5" x2="12" y2="13.5" stroke-linecap="round" opacity="0.5"/><line x1="4" y1="5.5" x2="12" y2="5.5" stroke-linecap="round" opacity="0.7"/><line x1="4" y1="8" x2="9" y2="8" stroke-linecap="round" opacity="0.5"/></svg>' },
    /* ── Företagsportal & Tjänsteresor ───────────────────── */
    { type: 'divider', label: 'Företagsportal & Tjänsteresor' },
    { key: 'blekinge-benify', label: 'Benify-partnerskap', href: BASE + 'blekinge_benify.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1.5" y="4" width="13" height="9" rx="1.2" opacity="0.5"/><path d="M4 4 V2.5 Q4 1.5 5 1.5 H11 Q12 1.5 12 2.5 V4" opacity="0.6"/><line x1="8" y1="7" x2="8" y2="10" stroke-linecap="round" opacity="0.8"/><line x1="6" y1="8.5" x2="10" y2="8.5" stroke-linecap="round" opacity="0.8"/></svg>' },
    { key: 'blekinge-trafiknat', label: 'Trafiknät', href: BASE + 'blekinge_trafiknat.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="2.5" opacity="0.6"/><circle cx="2.5" cy="4" r="1.3" opacity="0.55"/><circle cx="13.5" cy="4" r="1.3" opacity="0.55"/><circle cx="2.5" cy="12" r="1.3" opacity="0.55"/><circle cx="13.5" cy="12" r="1.3" opacity="0.55"/><line x1="3.7" y1="4.7" x2="6" y2="6.5" opacity="0.4"/><line x1="12.3" y1="4.7" x2="10" y2="6.5" opacity="0.4"/><line x1="3.7" y1="11.3" x2="6" y2="9.5" opacity="0.4"/><line x1="12.3" y1="11.3" x2="10" y2="9.5" opacity="0.4"/></svg>' },
    { key: 'blekinge-hub-btapp', label: 'BT-appen i IT-hubben', href: BASE + 'blekinge_hub_btapp.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2.5" y="3.5" width="11" height="8" rx="1.2" opacity="0.5"/><line x1="5" y1="11.5" x2="5" y2="13" stroke-linecap="round" opacity="0.55"/><line x1="11" y1="11.5" x2="11" y2="13" stroke-linecap="round" opacity="0.55"/><line x1="3.5" y1="13" x2="12.5" y2="13" stroke-linecap="round" opacity="0.45"/><circle cx="8" cy="7.5" r="2" opacity="0.65"/><line x1="8" y1="6" x2="8" y2="9" stroke-linecap="round" opacity="0.8"/><line x1="6.5" y1="7.5" x2="9.5" y2="7.5" stroke-linecap="round" opacity="0.8"/></svg>' },
    /* ── Omvärldsanalys ───────────────────────────────────── */
    { type: 'divider', label: 'Omvärldsanalys' },
    { key: 'blekinge-omvarldsanalys', label: 'Omvärldsanalys', href: BASE + 'blekinge_omvarldsanalys.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="5.5" opacity="0.35"/><path d="M8 2.5 C5.5 5 5.5 11 8 13.5 C10.5 11 10.5 5 8 2.5" opacity="0.55"/><line x1="2.5" y1="8" x2="13.5" y2="8" opacity="0.4"/><line x1="3" y1="5.5" x2="13" y2="5.5" opacity="0.25"/><line x1="3" y1="10.5" x2="13" y2="10.5" opacity="0.25"/></svg>' },
    { key: 'blekinge-run', label: 'RUN Politiker', href: BASE + 'blekinge_run.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="7" width="12" height="8" rx="1" opacity="0.4"/><path d="M2 9h12" opacity="0.4"/><circle cx="5" cy="12" r="1.5" opacity="0.65"/><circle cx="8" cy="12" r="1.5" opacity="0.65"/><circle cx="11" cy="12" r="1.5" opacity="0.65"/><path d="M5 7V4a3 3 0 0 1 6 0v3" opacity="0.55"/></svg>' },
    { key: 'blekinge-kommunanalys', label: 'Kommunanalys', href: BASE + 'blekinge_kommunanalys.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1.5" y="1.5" width="13" height="13" rx="1" opacity="0.35"/><line x1="7" y1="1.5" x2="7" y2="14.5" stroke-linecap="round" opacity="0.45"/><line x1="1.5" y1="8" x2="14.5" y2="8" stroke-linecap="round" opacity="0.45"/><circle cx="4" cy="4.5" r="1.1" fill="currentColor" stroke="none" opacity="0.65"/><circle cx="11" cy="4.5" r="1.1" fill="currentColor" stroke="none" opacity="0.65"/><circle cx="4" cy="11.5" r="1.1" fill="currentColor" stroke="none" opacity="0.65"/><circle cx="11" cy="11.5" r="1.1" fill="currentColor" stroke="none" opacity="0.65"/></svg>' },
    { key: 'blekinge-rapport', label: 'Trendrapport', href: BASE + 'blekinge_kollektivtrafik_rapport.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="1.5" width="12" height="13" rx="1" opacity="0.35"/><line x1="5" y1="5" x2="11" y2="5" stroke-linecap="round" opacity="0.6"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke-linecap="round" opacity="0.6"/><line x1="5" y1="10" x2="8.5" y2="10" stroke-linecap="round" opacity="0.5"/><polyline points="9,9 10.5,11 13,7.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" opacity="0.8"/></svg>' },
    { key: 'blekinge-ltp', label: 'LTP 2026–2037', href: BASE + 'blekinge_ltp.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M2 10.5h12M2 5.5h12" opacity="0.3" stroke-linecap="round"/><path d="M4 2.5L3 13.5M7 2.5L6 13.5M11 2.5L10 13.5" opacity="0.6" stroke-linecap="round"/><circle cx="8" cy="8" r="2.5" fill="rgba(0,0,0,0)" stroke="currentColor" stroke-width="1.1" opacity="0.8"/></svg>' },
    { key: 'blekinge-forskning', label: 'Forskningsunderlag', href: BASE + 'blekinge_forskning.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="6.5" cy="6.5" r="4" opacity="0.55"/><line x1="9.5" y1="9.5" x2="14" y2="14" stroke-linecap="round" opacity="0.8"/><line x1="4.5" y1="6.5" x2="8.5" y2="6.5" stroke-linecap="round" opacity="0.6"/><line x1="6.5" y1="4.5" x2="6.5" y2="8.5" stroke-linecap="round" opacity="0.6"/></svg>' },
    /* ── Undersökningar ───────────────────────────────────── */
    { type: 'divider', label: 'Undersökningar' },
    { key: 'blekinge-nki', label: 'NKI-guide', href: BASE + 'blekinge_nki.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="5.5" opacity="0.4"/><path d="M5 8.5 L7 10.5 L11 6" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/></svg>' },
    { key: 'blekinge-anbaro', label: 'ANBARO 2020–25', href: BASE + 'blekinge_anbaro.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="5.5" opacity="0.35"/><circle cx="8" cy="8" r="3" opacity="0.55"/><path d="M5 11 L7 8 L9 9.5 L11 6.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/></svg>' },
    { key: 'blekinge-kollbar', label: 'KollBar 2020–26', href: BASE + 'blekinge_kollbar.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><polyline points="2,12 5,8 8,10 11,6 14,8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/><circle cx="5" cy="8" r="1" fill="currentColor" stroke="none" opacity="0.6"/><circle cx="11" cy="6" r="1" fill="currentColor" stroke="none" opacity="0.6"/></svg>' },
    /* ── KPI & Måldokument ────────────────────────────────── */
    { type: 'divider', label: 'KPI & Måldokument' },
    { key: 'blekinge-kpi', label: 'KPI-utvärdering', href: BASE + 'blekinge_kpi_utvardering.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="9" width="2.5" height="5" rx="0.4" opacity="0.6"/><rect x="6" y="6" width="2.5" height="8" rx="0.4" opacity="0.6"/><rect x="10" y="3.5" width="2.5" height="10.5" rx="0.4" opacity="0.6"/><line x1="1.5" y1="7" x2="14.5" y2="7" stroke-dasharray="2,1.5" opacity="0.4"/><path d="M4.5 4.5 L6.5 6 L10 3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/></svg>' },
    { key: 'blekinge-ekonomi', label: 'Ekonomiöversikt', href: BASE + 'blekinge_ekonomi.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1.5" y="9" width="3" height="5.5" rx="0.5" opacity="0.7"/><rect x="6" y="6" width="3" height="8.5" rx="0.5" opacity="0.7"/><rect x="10.5" y="2.5" width="3" height="12" rx="0.5" opacity="0.7"/><polyline points="3,7 7.5,4.5 12,1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/></svg>' },
    { key: 'blekinge-tfp', label: 'TFP 2024–2031', href: BASE + 'blekinge_tfp.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="1.5" width="12" height="13" rx="1" opacity="0.35"/><path d="M5 5.5 Q8 4 11 5.5" stroke-linecap="round" opacity="0.65"/><path d="M5 8 Q8 6.5 11 8" stroke-linecap="round" opacity="0.55"/><line x1="5" y1="10.5" x2="11" y2="10.5" stroke-linecap="round" opacity="0.4"/><circle cx="5" cy="5.5" r="0.9" fill="currentColor" stroke="none" opacity="0.7"/><circle cx="11" cy="5.5" r="0.9" fill="currentColor" stroke="none" opacity="0.7"/></svg>' },
    /* ── Analyser & Rapporter ─────────────────────────────── */
    { type: 'divider', label: 'Analyser & Rapporter' },
    { key: 'blekinge-beslutsanalys', label: 'BT Beslutsanalys', href: BASE + 'reports/blekingetrafiken_analys.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><polygon points="8,1.5 14.5,13 1.5,13" opacity="0.35"/><line x1="8" y1="5" x2="8" y2="9.5" stroke-linecap="round" opacity="0.75"/><circle cx="8" cy="11.2" r="0.8" fill="currentColor" stroke="none" opacity="0.75"/></svg>' },
    { key: 'blekinge-pagatagen', label: 'Pågatågen', href: BASE + 'pagatagen.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="5" width="12" height="8" rx="1.5" opacity="0.4"/><rect x="3.5" y="6.5" width="3" height="2.5" rx="0.4" opacity="0.7"/><rect x="7" y="6.5" width="3" height="2.5" rx="0.4" opacity="0.7"/><line x1="2" y1="9.5" x2="14" y2="9.5" opacity="0.35"/><circle cx="5" cy="14" r="1" opacity="0.65"/><circle cx="11" cy="14" r="1" opacity="0.65"/><path d="M5 13v-1.5M11 13v-1.5" stroke-linecap="round" opacity="0.45"/><path d="M1 7h1.5M13.5 7H15" stroke-linecap="round" opacity="0.45"/></svg>' },
    { key: 'blekinge-zoner', label: 'Zoner & Intäktsanalys', href: BASE + 'blekinge_zoner_analys.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="5.5" opacity="0.35"/><circle cx="8" cy="8" r="3" opacity="0.5"/><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" opacity="0.8"/><path d="M8 2.5L8 5M8 11L8 13.5M2.5 8L5 8M11 8L13.5 8" stroke-linecap="round" opacity="0.35"/><circle cx="4" cy="5" r="1.1" opacity="0.7"/><circle cx="12" cy="5" r="1.1" opacity="0.7"/><circle cx="12" cy="11" r="1.1" opacity="0.7"/><circle cx="4" cy="11" r="1.1" opacity="0.7"/><circle cx="8" cy="2.5" r="1.1" opacity="0.6"/></svg>' }
  ];
  var SVEA_ITEMS = [
    { key: 'orebro-stadsbuss', label: 'Örebro Stadsbussar', href: BASE + 'orebro_stadsbuss.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="1" y="4" width="11" height="8" rx="1.5" opacity="0.5"/><path d="M12 7h2.5v4H12"/><circle cx="4" cy="13" r="1.2" opacity="0.8"/><circle cx="9.5" cy="13" r="1.2" opacity="0.8"/><line x1="2" y1="7.5" x2="10" y2="7.5" stroke-linecap="round" opacity="0.4"/><line x1="4.5" y1="4" x2="4.5" y2="7.5" opacity="0.35"/><line x1="7.5" y1="4" x2="7.5" y2="7.5" opacity="0.35"/></svg>' }
  ];
  var PERPLEXITY_ITEMS = [
    { key: 'perplexity', label: 'Perplexity Hub', href: BASE + 'perplexity.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="8" cy="8" r="5.5" opacity="0.4"/><circle cx="8" cy="8" r="3" opacity="0.65"/><path d="M8 2.5 L8 5 M8 11 L8 13.5 M2.5 8 L5 8 M11 8 L13.5 8" stroke-linecap="round" opacity="0.4"/><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" opacity="0.85"/><path d="M5.5 5.5 L6.5 6.5 M9.5 9.5 L10.5 10.5 M10.5 5.5 L9.5 6.5 M6.5 9.5 L5.5 10.5" stroke-linecap="round" opacity="0.3"/></svg>' }
  ];
  var FRISTÅENDE_ITEMS = [
    { key: 'din-mamma-ai', label: 'Din Mamma AI', href: BASE + 'reports/din_mamma_ai.html',
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="3" width="12" height="10" rx="1.5" opacity="0.4"/><path d="M5 7.5 C5 6 6 5 7.5 5.5 C8 5.7 8.5 6.5 8 7.5 C7.5 8.5 6.5 9 7 10 L9 10" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/><circle cx="9" cy="11" r="0.8" fill="currentColor" stroke="none" opacity="0.65"/></svg>' }
  ];
  var SETTINGS_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="2.5" opacity="0.7"/><path d="M8 1.5 L8 3" opacity="0.5"/><path d="M8 13 L8 14.5" opacity="0.5"/><path d="M1.5 8 L3 8" opacity="0.5"/><path d="M13 8 L14.5 8" opacity="0.5"/><path d="M3.5 3.5 L4.6 4.6" opacity="0.4"/><path d="M11.4 11.4 L12.5 12.5" opacity="0.4"/><path d="M12.5 3.5 L11.4 4.6" opacity="0.4"/><path d="M4.6 11.4 L3.5 12.5" opacity="0.4"/></svg>';
  var REFRESH_ICON_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 8A5.5 5.5 0 1 1 10.3 3.2"/><polyline points="10.3,1.2 10.3,3.6 12.7,3.6"/></svg>';
  var THEME_ICON_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="3" opacity="0.7"/><line x1="8" y1="1.5" x2="8" y2="3" opacity="0.5"/><line x1="8" y1="13" x2="8" y2="14.5" opacity="0.5"/><line x1="1.5" y1="8" x2="3" y2="8" opacity="0.5"/><line x1="13" y1="8" x2="14.5" y2="8" opacity="0.5"/><line x1="3.5" y1="3.5" x2="4.6" y2="4.6" opacity="0.4"/><line x1="11.4" y1="11.4" x2="12.5" y2="12.5" opacity="0.4"/><line x1="12.5" y1="3.5" x2="11.4" y2="4.6" opacity="0.4"/><line x1="4.6" y1="11.4" x2="3.5" y2="12.5" opacity="0.4"/></svg>';

  function navItem(item, section) {
    if (item.type === 'divider') {
      return '<div class="bridge-sub-section">' + item.label + '</div>';
    }
    var isActive = (ACTIVE === item.key);
    var cls = 'bridge-item' + (isActive ? ' active' : '');
    return '<a href="' + item.href + '" class="' + cls + '">'
      + '<span class="bridge-item-icon">' + item.icon + '</span> ' + item.label
      + '</a>';
  }

  var bridgeHTML = [
    '<div class="bridge-overlay" id="lb-bridge-overlay"></div>',
    '<button class="hamburger" id="lb-hamburger" aria-label="Open Bridge"><span></span><span></span><span></span></button>',
    '<div class="bridge" id="lb-bridge">',
    '  <div class="bridge-logo">',
    '    <img src="' + BASE + 'assets/images/captain_iivii_nobg.png" alt="Captain iivii">',
    '    <div class="bridge-callsign">Captain iivii</div>',
    '    <div class="bridge-rank">CPT-IIVII · THE LOGBOOK</div>',
    '  </div>',
    '  <div class="bridge-scroll">',
    '    <div class="bridge-section">Navigation</div>',
    '    <nav class="bridge-nav">',
    NAV_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <nav class="bridge-nav">',
    '      <button class="bridge-refresh-btn" onclick="this.style.opacity=\'0.5\';location.href=location.pathname+\'?_r=\'+Date.now()" title="Tvinga omladdning från servern">',
    '        <span class="bridge-item-icon" style="opacity:1"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 8A5.5 5.5 0 1 0 5.7 3.2"/><polyline points="5.7,1.2 5.7,3.6 3.3,3.6"/><line x1="8" y1="5.5" x2="8" y2="8.5" stroke-width="1.8"/><circle cx="8" cy="10.5" r="0.8" fill="currentColor" stroke="none"/></svg></span> Hard Refresh',
    '      </button>',
    '    </nav>',
    '    <div class="bridge-trek-sep">',
    '      <div class="bts-scan"></div>',
    '      <svg class="bts-hud" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">',
    '        <path d="M4 4 L4 18 M4 4 L18 4" stroke="currentColor" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>',
    '        <path d="M176 4 L176 18 M176 4 L162 4" stroke="currentColor" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>',
    '        <path d="M4 136 L4 122 M4 136 L18 136" stroke="currentColor" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>',
    '        <path d="M176 136 L176 122 M176 136 L162 136" stroke="currentColor" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>',
    '        <circle cx="90" cy="70" r="54" stroke="currentColor" stroke-width="0.6" opacity="0.18"/>',
    '        <circle cx="90" cy="70" r="40" stroke="currentColor" stroke-width="0.8" opacity="0.28"/>',
    '        <circle cx="90" cy="70" r="40" stroke="currentColor" stroke-width="1.5" opacity="0.12" stroke-dasharray="4 8"/>',
    '        <circle cx="90" cy="70" r="27" stroke="currentColor" stroke-width="0.9" opacity="0.38"/>',
    '        <circle cx="90" cy="70" r="14" stroke="currentColor" stroke-width="1" opacity="0.5"/>',
    '        <circle cx="90" cy="70" r="5" fill="rgba(0,212,255,0.35)" stroke="currentColor" stroke-width="0.8"/>',
    '        <ellipse cx="90" cy="70" rx="40" ry="13" stroke="currentColor" stroke-width="0.5" opacity="0.18"/>',
    '        <ellipse cx="90" cy="70" rx="40" ry="24" stroke="currentColor" stroke-width="0.4" opacity="0.12"/>',
    '        <g class="hud-sweep">',
    '          <line x1="90" y1="70" x2="90" y2="31" stroke="rgba(0,212,255,0.7)" stroke-width="1" stroke-linecap="round"/>',
    '          <path d="M90 31 A39 39 0 0 1 129 70" stroke="rgba(0,212,255,0.18)" stroke-width="18" fill="none"/>',
    '        </g>',
    '        <circle cx="90" cy="16" r="2.5" fill="#00d4ff" opacity="0.85" class="hud-dot-pulse"/>',
    '        <circle cx="144" cy="70" r="2.5" fill="#00d4ff" opacity="0.65"/>',
    '        <circle cx="90" cy="124" r="2" fill="#00d4ff" opacity="0.4"/>',
    '        <circle cx="36" cy="70" r="2.5" fill="#00d4ff" opacity="0.65"/>',
    '        <path d="M90 30 A40 40 0 0 1 130 70" stroke="#00d4ff" stroke-width="2" opacity="0.6" stroke-linecap="round"/>',
    '        <line x1="90" y1="15" x2="90" y2="19" stroke="currentColor" stroke-width="1" opacity="0.35"/>',
    '        <line x1="128.3" y1="31.7" x2="125.5" y2="34.5" stroke="currentColor" stroke-width="1" opacity="0.25"/>',
    '        <line x1="144" y1="70" x2="140" y2="70" stroke="currentColor" stroke-width="1" opacity="0.35"/>',
    '        <line x1="128.3" y1="108.3" x2="125.5" y2="105.5" stroke="currentColor" stroke-width="1" opacity="0.25"/>',
    '        <line x1="90" y1="125" x2="90" y2="121" stroke="currentColor" stroke-width="1" opacity="0.25"/>',
    '        <line x1="51.7" y1="108.3" x2="54.5" y2="105.5" stroke="currentColor" stroke-width="1" opacity="0.25"/>',
    '        <line x1="36" y1="70" x2="40" y2="70" stroke="currentColor" stroke-width="1" opacity="0.35"/>',
    '        <line x1="51.7" y1="31.7" x2="54.5" y2="34.5" stroke="currentColor" stroke-width="1" opacity="0.25"/>',
    '        <rect x="10" y="114" width="3" height="16" fill="currentColor" opacity="0.25" rx="1"/>',
    '        <rect x="15" y="109" width="3" height="21" fill="currentColor" opacity="0.3" rx="1"/>',
    '        <rect x="20" y="112" width="3" height="18" fill="currentColor" opacity="0.3" rx="1"/>',
    '        <rect x="25" y="106" width="3" height="24" fill="#00d4ff" opacity="0.45" rx="1"/>',
    '        <rect x="30" y="110" width="3" height="20" fill="currentColor" opacity="0.25" rx="1"/>',
    '        <path d="M155 130 A22 22 0 0 1 170 109" stroke="currentColor" stroke-width="1.2" opacity="0.22"/>',
    '        <path d="M155 130 A22 22 0 0 1 166 112" stroke="#f0a500" stroke-width="2.5" opacity="0.55" stroke-linecap="round"/>',
    '        <line x1="4" y1="62" x2="28" y2="62" stroke="currentColor" stroke-width="0.7" opacity="0.28"/>',
    '        <line x1="4" y1="66" x2="22" y2="66" stroke="currentColor" stroke-width="0.7" opacity="0.18"/>',
    '        <line x1="4" y1="70" x2="30" y2="70" stroke="currentColor" stroke-width="0.7" opacity="0.22"/>',
    '        <line x1="152" y1="62" x2="176" y2="62" stroke="currentColor" stroke-width="0.7" opacity="0.28"/>',
    '        <line x1="158" y1="66" x2="176" y2="66" stroke="currentColor" stroke-width="0.7" opacity="0.18"/>',
    '        <line x1="150" y1="70" x2="176" y2="70" stroke="currentColor" stroke-width="0.7" opacity="0.22"/>',
    '      </svg>',
    '      <div class="bts-scan"></div>',
    '    </div>',
    '    <div class="bridge-section">DOCTRINE</div>',
    '    <nav class="bridge-nav">',
    TOOL_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <div class="bridge-section">Intel</div>',
    '    <nav class="bridge-nav">',
    INTEL_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <div class="bridge-section">Perplexity</div>',
    '    <nav class="bridge-nav">',
    PERPLEXITY_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <div class="bridge-section">MOBILIX</div>',
    '    <nav class="bridge-nav">',
    MOBILIX_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <div class="bridge-section"><svg viewBox="0 0 13 9" fill="none" stroke="currentColor" stroke-width="1.1" width="13" height="9" style="vertical-align:middle;margin-right:5px;opacity:0.7"><rect x="0.5" y="0.5" width="12" height="6.5" rx="1.5"/><rect x="2" y="1.5" width="3.5" height="2.5" rx="0.4" opacity="0.7"/><rect x="7.5" y="1.5" width="3.5" height="2.5" rx="0.4" opacity="0.7"/><circle cx="3" cy="8" r="1" opacity="0.8"/><circle cx="10" cy="8" r="1" opacity="0.8"/></svg>Blekingetrafiken</div>',
    '    <nav class="bridge-nav">',
    BT_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <div class="bridge-section"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1" width="13" height="13" style="vertical-align:middle;margin-right:5px;opacity:0.7"><rect x="1" y="4" width="11" height="8" rx="1.5" opacity="0.5"/><path d="M12 7h2.5v4H12"/><circle cx="4" cy="13" r="1.2" opacity="0.8"/><circle cx="9.5" cy="13" r="1.2" opacity="0.8"/><line x1="2" y1="7.5" x2="10" y2="7.5" stroke-linecap="round" opacity="0.4"/></svg>Svealandstrafiken</div>',
    '    <nav class="bridge-nav">',
    SVEA_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <div class="bridge-section"><svg viewBox="0 0 16 11" fill="none" stroke="currentColor" stroke-width="1.1" width="14" height="10" style="vertical-align:middle;margin-right:5px;opacity:0.7"><rect x="0.5" y="2.5" width="15" height="7" rx="1.5"/><rect x="2" y="0.5" width="5" height="3.5" rx="0.8" opacity="0.7"/><rect x="9" y="0.5" width="5" height="3.5" rx="0.8" opacity="0.7"/><circle cx="3.5" cy="10" r="1.3" opacity="0.85"/><circle cx="12.5" cy="10" r="1.3" opacity="0.85"/><line x1="6" y1="5.5" x2="10" y2="5.5" stroke-linecap="round" opacity="0.45"/><line x1="6" y1="7.5" x2="10" y2="7.5" stroke-linecap="round" opacity="0.35"/></svg>BilPool RB</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'bilpool_analys.html" class="bridge-item' + (ACTIVE === "bilpool-analys" ? " active" : "") + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="9" width="3" height="5.5" rx="0.5" opacity="0.7"/><rect x="6" y="6" width="3" height="8.5" rx="0.5" opacity="0.7"/><rect x="10.5" y="3" width="3" height="11.5" rx="0.5" opacity="0.7"/><polyline points="3,7 7.5,5 12,2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/></svg></span> Översikt',
    '      </a>',
    '      <a href="' + BASE + 'bilpool_monsteranalys.html" class="bridge-item' + (ACTIVE === "bilpool-monster" ? " active" : "") + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1" y="1" width="6" height="6" rx="1" opacity="0.6"/><rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6"/><rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6"/><rect x="9" y="9" width="6" height="6" rx="1" opacity="0.6"/><circle cx="4" cy="4" r="1.3" fill="currentColor" stroke="none" opacity="0.8"/><circle cx="12" cy="4" r="0.8" fill="currentColor" stroke="none" opacity="0.5"/><circle cx="4" cy="12" r="0.8" fill="currentColor" stroke="none" opacity="0.5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" opacity="0.8"/></svg></span> Mönsteranalys',
    '      </a>',
    '      <a href="' + BASE + 'bilpool_analys_light.html" target="_blank" class="bridge-item' + (ACTIVE === "bilpool-print-overview" ? " active" : "") + '" title="Öppna ljus version i nytt fönster — Ctrl+P för PDF">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="1.5" width="10" height="8" rx="1" opacity="0.5"/><rect x="2" y="5" width="12" height="8" rx="1" opacity="0.65"/><rect x="4.5" y="9" width="7" height="1.2" rx="0.4" fill="currentColor" stroke="none" opacity="0.55"/><rect x="4.5" y="11" width="5" height="1.2" rx="0.4" fill="currentColor" stroke="none" opacity="0.4"/><circle cx="12.5" cy="7" r="0.9" fill="currentColor" stroke="none" opacity="0.7"/></svg></span> ⎙ Skriv ut Översikt',
    '      </a>',
    '      <a href="' + BASE + 'bilpool_monsteranalys_light.html" target="_blank" class="bridge-item' + (ACTIVE === "bilpool-print-monster" ? " active" : "") + '" title="Öppna ljus version i nytt fönster — Ctrl+P för PDF">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="1.5" width="10" height="8" rx="1" opacity="0.5"/><rect x="2" y="5" width="12" height="8" rx="1" opacity="0.65"/><rect x="4.5" y="9" width="7" height="1.2" rx="0.4" fill="currentColor" stroke="none" opacity="0.55"/><rect x="4.5" y="11" width="5" height="1.2" rx="0.4" fill="currentColor" stroke="none" opacity="0.4"/><circle cx="12.5" cy="7" r="0.9" fill="currentColor" stroke="none" opacity="0.7"/></svg></span> ⎙ Skriv ut Mönster',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">System</div>',
    '    <nav class="bridge-nav">',
    '      <button id="lb-refresh-btn" class="bridge-refresh-btn" onclick="window.lbRefreshCrew&&window.lbRefreshCrew()" title="Ladda om agenter">',
    '        <span class="bridge-item-icon" style="opacity:1"><span id="lb-refresh-ico">' + REFRESH_ICON_SVG + '</span></span> Agenter',
    '      </button>',
    '      <button id="lb-tasks-btn" class="bridge-refresh-btn" onclick="window.lbRunnerRefresh&&window.lbRunnerRefresh(\'run-reminders\',\'lb-tasks-btn\',\'lb-tasks-ico\')" title="Hämta Task Matrix från Apple Reminders">',
    '        <span class="bridge-item-icon" style="opacity:1"><span id="lb-tasks-ico">' + REFRESH_ICON_SVG + '</span></span> Task Matrix',
    '      </button>',
    '      <button id="lb-cal-btn" class="bridge-refresh-btn" onclick="window.lbRunnerRefresh&&window.lbRunnerRefresh(\'run-calendar\',\'lb-cal-btn\',\'lb-cal-ico\')" title="Hämta kalender från iCal">',
    '        <span class="bridge-item-icon" style="opacity:1"><span id="lb-cal-ico">' + REFRESH_ICON_SVG + '</span></span> Kalender',
    '      </button>',
    '      <button id="lb-linkedin-btn" class="bridge-refresh-btn" onclick="window.lbRunnerRefresh&&window.lbRunnerRefresh(\'run-linkedin\',\'lb-linkedin-btn\',\'lb-linkedin-ico\')" title="Hämta nya LinkedIn-poster från export">',
    '        <span class="bridge-item-icon" style="opacity:1"><span id="lb-linkedin-ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="1.5" width="13" height="13" rx="2.5"/><line x1="4.5" y1="6.5" x2="4.5" y2="11.5"/><circle cx="4.5" cy="4.3" r="0.9" fill="currentColor" stroke="none"/><path d="M7.5 11.5V8.8c0-1.3.9-2.3 2-2.3s2 1 2 2.3v2.7"/><line x1="7.5" y1="6.5" x2="7.5" y2="11.5"/></svg></span></span> LinkedIn',
    '      </button>',
    '      <button id="lb-li-img-btn" class="bridge-refresh-btn" onclick="window.lbRunnerRefresh&&window.lbRunnerRefresh(\'run-linkedin-images\',\'lb-li-img-btn\',\'lb-li-img-ico\')" title="Hämta bilder för LinkedIn-inlägg via Playwright (~8 min)">',
    '        <span class="bridge-item-icon" style="opacity:1"><span id="lb-li-img-ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="1.5" width="13" height="13" rx="2"/><circle cx="6" cy="6" r="1.5"/><path d="M1.5 11l3.5-3.5 2.5 2.5 2-2 4 4"/></svg></span></span> LI Bilder',
    '      </button>',
    '      <button id="lb-pinterest-btn" class="bridge-refresh-btn" onclick="window.lbRunnerRefresh&&window.lbRunnerRefresh(\'run-pinterest\',\'lb-pinterest-btn\',\'lb-pinterest-ico\')" title="Hämta nya Pinterest-pins från export">',
    '        <span class="bridge-item-icon" style="opacity:1"><span id="lb-pinterest-ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="4.5"/><path d="M6 14c.5-2 1-4 1.5-5.5" stroke-width="1.3"/><path d="M5.5 9.5C5 10.5 4.5 11 4 10.5s-.5-2 .5-3.5S7 4.5 9 5s2.5 2 2 3.5-1.5 2-2.5 1.8" stroke-width="1.2"/></svg></span></span> Pinterest',
    '      </button>',
    '      <a href="' + BASE + 'kevii_users.html" class="bridge-item' + (ACTIVE === 'kevii-users' ? ' active' : '') + '" title="Hantera användare på kevii.com">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2" stroke-linecap="round"/></svg></span> KEVII Users',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">Hem</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'irisborg.html" class="bridge-item' + (ACTIVE === 'irisborg' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8L8 2l6 6" opacity="0.75"/><rect x="4" y="8" width="8" height="7" rx="0.5" opacity="0.65"/><rect x="6.5" y="11" width="3" height="4" rx="0.3" opacity="0.8"/></svg></span> Irisborg',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">Utredning</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'adhd_analys.html" class="bridge-item' + (ACTIVE === 'adhd-analys' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="1" width="10" height="14" rx="1.5" opacity="0.4"/><line x1="5.5" y1="5" x2="10.5" y2="5" stroke-linecap="round" opacity="0.85"/><line x1="5.5" y1="7.5" x2="10.5" y2="7.5" stroke-linecap="round" opacity="0.65"/><line x1="5.5" y1="10" x2="8.5" y2="10" stroke-linecap="round" opacity="0.45"/><circle cx="12" cy="12" r="2.5" opacity="0.7"/><line x1="13.8" y1="13.8" x2="15" y2="15" stroke-linecap="round" opacity="0.8"/></svg></span> NP-Analys',
    '      </a>',
    '      <a href="' + BASE + 'eliana_utredning.html" class="bridge-item' + (ACTIVE === 'eliana-utredning' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="5" r="3" opacity="0.7"/><path d="M3 14c0-3 2.5-4.5 5-4.5s5 1.5 5 4.5" opacity="0.55"/><path d="M11 7.5 L14 10 M14 7.5 L11 10" stroke-width="1" opacity="0.8"/></svg></span> Eliana — Utredning',
    '      </a>',
    '      <a href="' + BASE + 'autism_spektrum.html" class="bridge-item' + (ACTIVE === 'autism-spektrum' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6" opacity="0.4"/><circle cx="8" cy="8" r="3" opacity="0.7"/><line x1="8" y1="2" x2="8" y2="5" opacity="0.8"/><line x1="8" y1="11" x2="8" y2="14" opacity="0.8"/><line x1="2" y1="8" x2="5" y2="8" opacity="0.8"/><line x1="11" y1="8" x2="14" y2="8" opacity="0.8"/></svg></span> Autismspektrumet',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">KPD Media</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'kpd_media.html" class="bridge-item' + (ACTIVE === 'kpd-media' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="14" height="10" rx="1.5" opacity="0.55"/><circle cx="8" cy="8" r="2.5" opacity="0.9"/><path d="M11.5 3.5 L13 2" opacity="0.5"/></svg></span> KPD.media Hub',
    '      </a>',
    '      <a href="' + BASE + 'kpd_filming_pricing.html" class="bridge-item' + (ACTIVE === 'kpd-filming' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="10" height="8" rx="1.2" opacity="0.6"/><path d="M11 6.5 L15 4.5 L15 11.5 L11 9.5 Z" opacity="0.85"/></svg></span> Event Filming',
    '      </a>',
    '      <a href="' + BASE + 'kpd_market_analysis.html" class="bridge-item' + (ACTIVE === 'kpd-market' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12 L5 8 L8 10 L11 5 L14 3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/><circle cx="14" cy="3" r="1.5" fill="currentColor" opacity="0.6"/></svg></span> Market Analysis',
    '      </a>',
    '      <a href="' + BASE + 'kpd_photography_pricing.html" class="bridge-item' + (ACTIVE === 'kpd-photo' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="12" height="10" rx="1.5" opacity="0.6"/><circle cx="8" cy="9" r="2.8" opacity="0.85"/><path d="M6 4 L6 2 L10 2 L10 4" stroke-linecap="round" opacity="0.7"/></svg></span> Photography',
    '      </a>',
    '      <a href="' + BASE + 'kpd_local_marketing.html" class="bridge-item' + (ACTIVE === 'kpd-local-marketing' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="6" r="3" opacity="0.7"/><path d="M2 14 C2 11 4.7 9 8 9 C11.3 9 14 11 14 14" stroke-linecap="round" opacity="0.6"/><path d="M11 4 L13 3 L13 6 L11 5 Z" opacity="0.85"/></svg></span> Local Marketing',
    '      </a>',
    '      <a href="' + BASE + 'kpd_concepts.html" class="bridge-item' + (ACTIVE === 'kpd-concepts' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="1" width="6" height="6" rx="1" opacity="0.7"/><rect x="9" y="1" width="6" height="6" rx="1" opacity="0.7"/><rect x="1" y="9" width="6" height="6" rx="1" opacity="0.85"/><rect x="9" y="9" width="6" height="6" rx="1" opacity="0.85"/></svg></span> Concepts',
    '      </a>',
    '      <a href="' + BASE + 'kpd_equipment.html" class="bridge-item' + (ACTIVE === 'kpd-equipment' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="10" height="8" rx="1.2" opacity="0.6"/><path d="M11 6.5 L15 4.5 L15 11.5 L11 9.5 Z" opacity="0.85"/><circle cx="5" cy="2.5" r="1.2" fill="currentColor" opacity="0.5"/><line x1="3.5" y1="2.5" x2="7.5" y2="2.5" stroke-linecap="round" opacity="0.4"/></svg></span> Equipment List',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">KPD Clients</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'kpd_xylem.html" class="bridge-item' + (ACTIVE === 'kpd-xylem' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2 C8 2 3 8 3 11 C3 13.8 5.2 15 8 15 C10.8 15 13 13.8 13 11 C13 8 8 2 8 2 Z" opacity="0.85"/><path d="M8 9 C8 9 7 10.5 7 11.5 C7 12.3 7.4 13 8 13" stroke-linecap="round" opacity="0.5"/></svg></span> Xylem Analysis',
    '      </a>',
    '      <a href="' + BASE + 'kpd_flygt125y.html" class="bridge-item' + (ACTIVE === 'kpd-flygt125' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="10" height="8" rx="1.2" opacity="0.6"/><path d="M11 6.5 L15 4.5 L15 11.5 L11 9.5 Z" opacity="0.85"/><path d="M3 7 L7 7 M3 9 L6 9" stroke-linecap="round" opacity="0.5"/></svg></span> Flygt 125Y',
    '      </a>',
    '      <a href="' + BASE + 'kpd_flygt_history.html" class="bridge-item' + (ACTIVE === 'kpd-flygt-history' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6" opacity="0.4"/><path d="M8 2 L8 8 L11 11" stroke-linecap="round" opacity="0.85"/><circle cx="8" cy="8" r="1.2" fill="currentColor" opacity="0.7"/></svg></span> Flygt History',
    '      </a>',
    '      <a href="' + BASE + 'kpd_flygt_storyboard.html" class="bridge-item' + (ACTIVE === 'kpd-flygt-storyboard' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="2" width="14" height="3" rx="0.8" opacity="0.45"/><rect x="1" y="6.5" width="14" height="3" rx="0.8" opacity="0.65"/><rect x="1" y="11" width="14" height="3" rx="0.8" opacity="0.85"/><line x1="3" y1="3.5" x2="5" y2="3.5" stroke-linecap="round" opacity="0.7"/><line x1="3" y1="8" x2="7" y2="8" stroke-linecap="round" opacity="0.7"/><line x1="3" y1="12.5" x2="6" y2="12.5" stroke-linecap="round" opacity="0.7"/></svg></span> Flygt Storyboard',
    '      </a>',
    '      <a href="' + BASE + 'kpd_flygt_storyboard_client.html" class="bridge-item' + (ACTIVE === 'kpd-flygt-storyboard-client' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="2" width="14" height="12" rx="1.5" opacity="0.35"/><line x1="4" y1="5.5" x2="12" y2="5.5" stroke-linecap="round" opacity="0.8"/><line x1="4" y1="8" x2="10" y2="8" stroke-linecap="round" opacity="0.6"/><line x1="4" y1="10.5" x2="8" y2="10.5" stroke-linecap="round" opacity="0.4"/></svg></span> Storyboard Client',
    '      </a>',
    '      <a href="' + BASE + 'kpd_flygt_script.html" class="bridge-item' + (ACTIVE === 'kpd-flygt-script' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="1" width="12" height="14" rx="1.2" opacity="0.35"/><line x1="5" y1="5" x2="11" y2="5" stroke-linecap="round" opacity="0.8"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke-linecap="round" opacity="0.6"/><line x1="5" y1="10" x2="8.5" y2="10" stroke-linecap="round" opacity="0.4"/><circle cx="11.5" cy="11.5" r="2.5" fill="none" stroke-width="1.1" opacity="0.7"/><line x1="13.5" y1="13.5" x2="14.5" y2="14.5" stroke-linecap="round" opacity="0.7"/></svg></span> Script & Strategy',
    '      </a>',
    '      <a href="' + BASE + 'kpd_flygt125y_quote_v3.html" class="bridge-item' + (ACTIVE === 'kpd-flygt-quote' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="1" width="12" height="14" rx="1.2" opacity="0.35"/><line x1="5" y1="4.5" x2="11" y2="4.5" stroke-linecap="round" opacity="0.85"/><line x1="5" y1="7" x2="11" y2="7" stroke-linecap="round" opacity="0.65"/><line x1="5" y1="9.5" x2="9" y2="9.5" stroke-linecap="round" opacity="0.45"/><path d="M5 12 L7 12 M7 11 L7 13" stroke-linecap="round" opacity="0.7"/></svg></span> Flygt Quote',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">Lärande</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'orebro_busslanding.html" class="bridge-item' + (ACTIVE === 'orebro-busslanding' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="6.5" opacity=".4"/><path d="M5 8h6M8 5v6" stroke-linecap="round" opacity=".8"/></svg></span> Buss Chaufförsportal',
    '      </a>',
    '      <a href="' + BASE + 'orebro_buss_quiz.html" class="bridge-item' + (ACTIVE === 'orebro-buss-quiz' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1" y="5" width="14" height="8" rx="2" opacity=".4"/><path d="M3 5V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" opacity=".6"/><circle cx="4.5" cy="14" r="1.5" opacity=".8"/><circle cx="11.5" cy="14" r="1.5" opacity=".8"/><line x1="7" y1="9" x2="9" y2="9" stroke-linecap="round" opacity=".7"/></svg></span> Buss-quiz Örebro',
    '      </a>',
    '      <a href="' + BASE + 'gulahasten.html" class="bridge-item' + (ACTIVE === 'gulahasten' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><ellipse cx="8" cy="9" rx="5.5" ry="4" opacity="0.45"/><path d="M3.5 9 C3.5 9 3 6 5 4.5 C6.5 3.5 8 4 8 4" stroke-linecap="round" opacity="0.7"/><path d="M8 4 C8 4 9 2.5 10.5 3 C12 3.5 12.5 5.5 12.5 9" stroke-linecap="round" opacity="0.55"/><line x1="5.5" y1="13" x2="5.5" y2="15" stroke-linecap="round" opacity="0.6"/><line x1="10.5" y1="13" x2="10.5" y2="15" stroke-linecap="round" opacity="0.6"/><path d="M7 4 L7 2 L9 2" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/></svg></span> Gula Hästen',
    '      </a>',
    '      <a href="' + BASE + 'powerbi_kurs.html" class="bridge-item' + (ACTIVE === 'powerbi-kurs' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1" y="8" width="3.5" height="7" rx="1" opacity="0.6"/><rect x="6" y="4" width="3.5" height="11" rx="1" opacity="0.8"/><rect x="11" y="1" width="3.5" height="14" rx="1"/></svg></span> Power BI',
    '      </a>',
    '      <a href="' + BASE + 'excel_kurs.html" class="bridge-item' + (ACTIVE === 'excel-kurs' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" opacity="0.3"/><line x1="1.5" y1="6" x2="14.5" y2="6" stroke-linecap="round" opacity="0.4"/><line x1="1.5" y1="10" x2="14.5" y2="10" stroke-linecap="round" opacity="0.4"/><line x1="6" y1="1.5" x2="6" y2="14.5" stroke-linecap="round" opacity="0.4"/><path d="M3 13 L5 9.5 L7.5 11.5 L10 7 L13 12" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Excel',
    '      </a>',
    '      <a href="' + BASE + 'spanska_kurs.html" class="bridge-item' + (ACTIVE === 'spanska-kurs' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3 C2 2 3 2 4 2 L13 2 C14 2 14.5 2.5 14.5 3.5 L14.5 9.5 C14.5 10.5 14 11 13 11 L9 11 L6 14 L6 11 L4 11 C3 11 2 10.5 2 9.5 Z" opacity="0.8"/><line x1="5" y1="5.5" x2="12" y2="5.5" opacity="0.9"/><line x1="5" y1="7.5" x2="10" y2="7.5" opacity="0.6"/></svg></span> Spanska',
    '      </a>',
    '      <a href="' + BASE + 'copilot_guide.html" class="bridge-item' + (ACTIVE === 'copilot-guide' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="5.5" opacity="0.5"/><circle cx="8" cy="8" r="2.5" opacity="0.8"/><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/><path d="M8 2.5v1.5M8 12v1.5M2.5 8H4M12 8h1.5" stroke-linecap="round" opacity="0.45"/></svg></span> Copilot Guide',
    '      </a>',
    '      <a href="' + BASE + 'planner_guide.html" class="bridge-item' + (ACTIVE === 'planner-guide' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="2" width="13" height="12" rx="1.2" opacity="0.3"/><line x1="1.5" y1="5.5" x2="14.5" y2="5.5" opacity="0.5"/><rect x="3.5" y="7.5" width="3" height="2.5" rx="0.5" opacity="0.8"/><rect x="7" y="7.5" width="3" height="2.5" rx="0.5" opacity="0.6"/><rect x="10.5" y="7.5" width="2" height="2.5" rx="0.5" opacity="0.4"/><line x1="5" y1="3" x2="5" y2="2" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/><line x1="11" y1="3" x2="11" y2="2" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/></svg></span> Planner',
    '      </a>',
    '      <a href="' + BASE + 'outlook_guide.html" class="bridge-item' + (ACTIVE === 'outlook-guide' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1" y="3" width="14" height="10" rx="1.2" opacity="0.3"/><path d="M1.5 4 L8 9 L14.5 4" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/><line x1="1" y1="10" x2="5.5" y2="7" opacity="0.4" stroke-linecap="round"/><line x1="15" y1="10" x2="10.5" y2="7" opacity="0.4" stroke-linecap="round"/></svg></span> Outlook Guide',
    '      </a>',
    '      <a href="' + BASE + 'bt_sharepoint.html" class="bridge-item' + (ACTIVE === 'blekinge-sharepoint' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="2" y="1.5" width="12" height="13" rx="1.5" opacity="0.4"/><rect x="4" y="4" width="5" height="4" rx="0.5" opacity="0.65"/><line x1="10.5" y1="4.5" x2="12" y2="4.5" stroke-linecap="round" opacity="0.5"/><line x1="10.5" y1="6.5" x2="12" y2="6.5" stroke-linecap="round" opacity="0.5"/><line x1="4" y1="10.5" x2="12" y2="10.5" stroke-linecap="round" opacity="0.4"/><line x1="4" y1="12" x2="9" y2="12" stroke-linecap="round" opacity="0.35"/></svg></span> SharePoint',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">Equine</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'horses/index.html" class="bridge-item' + (ACTIVE === 'horses' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 13 C2 13 3 10 4 9 C5 8 6 8 7 7 C8 6 8 5 9 4" stroke-linecap="round" opacity="0.7"/><path d="M9 4 C9.5 3 10.5 2.5 11.5 3 C12.5 3.5 13 5 12.5 6.5 C12 8 11 9 10 10 C9 11 8 12 8 13" stroke-linecap="round" opacity="0.85"/><path d="M9 4 L9 2 L11 2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/><line x1="5" y1="13" x2="5" y2="15" stroke-linecap="round" opacity="0.5"/><line x1="8" y1="13" x2="8" y2="15" stroke-linecap="round" opacity="0.5"/></svg></span> Breeding Export',
    '      </a>',
    '      <a href="' + BASE + 'horses/sa_horse_market.html" class="bridge-item' + (ACTIVE === 'horses-market' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 13 C2 13 3 10 4 9 C5 8 6 8 7 7 C8 6 8 5 9 4" stroke-linecap="round" opacity="0.7"/><path d="M9 4 C9.5 3 10.5 2.5 11.5 3 C12.5 3.5 13 5 12.5 6.5 C12 8 11 9 10 10 C9 11 8 12 8 13" stroke-linecap="round" opacity="0.85"/><path d="M9 4 L9 2 L11 2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/><line x1="5" y1="13" x2="5" y2="15" stroke-linecap="round" opacity="0.5"/><line x1="8" y1="13" x2="8" y2="15" stroke-linecap="round" opacity="0.5"/></svg></span> SA Market',
    '      </a>',
    '      <a href="' + BASE + 'horses/kokstad_plan.html" class="bridge-item' + (ACTIVE === 'horses-plan' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="2" width="12" height="12" rx="1.5" opacity="0.5"/><line x1="5" y1="6" x2="11" y2="6" stroke-linecap="round"/><line x1="5" y1="9" x2="9" y2="9" stroke-linecap="round" opacity="0.7"/><line x1="5" y1="12" x2="7.5" y2="12" stroke-linecap="round" opacity="0.5"/></svg></span> Business Plan',
    '      </a>',
    '      <a href="' + BASE + 'horses/endurance_guide.html" class="bridge-item' + (ACTIVE === 'horses-endurance' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M1 8 C2 5 3 4 5 4 C7 4 7 8 8 8 C9 8 9 4 11 4 C13 4 14 5 15 8" stroke-linecap="round"/></svg></span> Endurance Guide',
    '      </a>',
    '      <a href="' + BASE + 'horses/riding_school.html" class="bridge-item' + (ACTIVE === 'horses-school' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="5" cy="4" r="1.5" opacity="0.7"/><path d="M5 6 L5 10 M3 7.5 L7 7.5 M5 10 L3 13 M5 10 L7 13" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/><path d="M9 8 L11 6 L13 8 L11 10 Z" opacity="0.6"/><path d="M11 10 L11 13" stroke-linecap="round" opacity="0.5"/></svg></span> Riding School',
    '      </a>',
    '      <a href="' + BASE + 'horses/farm_inventory.html" class="bridge-item' + (ACTIVE === 'horses-inventory' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="2" width="5" height="5" rx="1" opacity="0.6"/><rect x="9" y="2" width="5" height="5" rx="1" opacity="0.6"/><rect x="2" y="9" width="5" height="5" rx="1" opacity="0.85"/><rect x="9" y="9" width="5" height="5" rx="1" opacity="0.85"/></svg></span> Farm Inventory',
    '      </a>',
    '      <a href="' + BASE + 'horses/revenue_roadmap.html" class="bridge-item' + (ACTIVE === 'horses-roadmap' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 13 L6 8 L10 10 L14 4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/><circle cx="14" cy="4" r="1.5" fill="currentColor" opacity="0.6"/></svg></span> Revenue Roadmap',
    '      </a>',
    '      <a href="' + BASE + 'horses/endurance_adventures.html" class="bridge-item' + (ACTIVE === 'horses-adventures' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M1 11 L5 6 L8 9 L11 5 L15 3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/><path d="M13 3 L15 3 L15 5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/></svg></span> Endurance Adventures',
    '      </a>',
    '      <a href="' + BASE + 'horses/james_muller.html" class="bridge-item' + (ACTIVE === 'horses-muller' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="5" r="2.5" opacity="0.85"/><path d="M4 13 L4 11 Q4 9 8 9 Q12 9 12 11 L12 13" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/><path d="M6 2 L8 1 L10 2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/></svg></span> James Muller',
    '      </a>',
    '    </nav>',
    '    <div class="bridge-section">Frist&#229;ende</div>',
    '    <nav class="bridge-nav">',
    FRISTÅENDE_ITEMS.map(navItem).join('\n'),
    '    </nav>',
    '    <div class="bridge-section">Display</div>',
    '    <nav class="bridge-nav">',
    '      <a href="' + BASE + 'settings.html" class="bridge-item' + (ACTIVE === 'settings' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon">' + SETTINGS_ICON + '</span> Settings',
    '      </a>',
    '      <a href="' + BASE + 'claude_account_guide.html" class="bridge-item' + (ACTIVE === 'claude-account' ? ' active' : '') + '">',
    '        <span class="bridge-item-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="4" width="12" height="9" rx="1" opacity="0.5"/><circle cx="8" cy="8.5" r="2.2" opacity="0.85"/><path d="M5 4 V3 Q5 2 8 2 Q11 2 11 3 V4" opacity="0.5"/><circle cx="8" cy="8.5" r="0.7" fill="currentColor" stroke="none" opacity="0.6"/></svg></span> Account Guide',
    '      </a>',
    '    </nav>',
    '    <button id="lb-themeToggle" class="bridge-item bridge-theme-btn" onclick="lbToggleTheme()" title="Switch theme" aria-label="Toggle light/dark theme">',
    '      <span class="bridge-item-icon" id="lb-themeIcon">' + THEME_ICON_SVG + '</span> Theme',
    '    </button>',
    '  </div>',
    '  <div class="bridge-footer"><span class="sig-dot"></span>CPT-IIVII · ONLINE</div>',
    '</div>'
  ].join('\n');

  var rightSidebarHTML = [
    '<div class="right-sidebar" id="lb-right-sidebar">',
    '  <div class="rsb-spin-sec hud">',
    '    <div class="hud-br"></div><div class="hud-bl"></div>',
    '    <div class="hud-label" style="width:100%">Crew Scan <span class="hl-r">RANGE 360° · ACTIVE</span></div>',
    '    <div class="rsb-sweep-wrap">',
    '      <svg class="rsb-sweep-svg" viewBox="0 0 300 300">',
    '        <circle cx="150" cy="150" r="146" fill="rgba(0,8,20,0.97)" stroke="rgba(0,212,255,0.28)" stroke-width="1.5"/>',
    '        <circle cx="150" cy="150" r="37"  fill="none" stroke="rgba(0,212,255,0.10)" stroke-width="1"/>',
    '        <circle cx="150" cy="150" r="73"  fill="none" stroke="rgba(0,212,255,0.10)" stroke-width="1"/>',
    '        <circle cx="150" cy="150" r="109" fill="none" stroke="rgba(0,212,255,0.13)" stroke-width="1"/>',
    '        <circle cx="150" cy="150" r="146" fill="none" stroke="rgba(0,212,255,0.22)" stroke-width="1.5"/>',
    '        <line x1="4"   y1="150" x2="296" y2="150" stroke="rgba(0,212,255,0.07)" stroke-width="1"/>',
    '        <line x1="150" y1="4"   x2="150" y2="296" stroke="rgba(0,212,255,0.07)" stroke-width="1"/>',
    '        <line x1="47"  y1="47"  x2="253" y2="253" stroke="rgba(0,212,255,0.04)" stroke-width="1"/>',
    '        <line x1="253" y1="47"  x2="47"  y2="253" stroke="rgba(0,212,255,0.04)" stroke-width="1"/>',
    '        <g id="lb-rsb-degMarks"></g>',
    '        <g id="lb-rsb-blips"></g>',
    '        <circle cx="150" cy="150" r="9" fill="none" stroke="rgba(0,212,255,0.4)" stroke-width="1"/>',
    '        <circle cx="150" cy="150" r="3" fill="var(--cyan)" opacity="0.9"/>',
    '      </svg>',
    '      <div class="rsb-sweep"></div>',
    '    </div>',
    '  </div>',
    '  <div class="rsb-gauges hud">',
    '    <div class="hud-br"></div><div class="hud-bl"></div>',
    '    <div class="gauge-wrap">',
    '      <div class="gauge-ring" id="lb-gauge-online" style="background:conic-gradient(var(--green) 360deg,rgba(0,255,136,0.08) 0deg)">',
    '        <div class="gauge-inner">',
    '          <div class="gauge-val" id="lb-online-val" style="color:var(--green)">—</div>',
    '          <div class="gauge-lbl">ONLINE</div>',
    '        </div>',
    '      </div>',
    '      <div class="gauge-name">AGENTER</div>',
    '    </div>',
    '    <div class="gauge-wrap">',
    '      <div class="gauge-ring" id="lb-gauge-active" style="background:conic-gradient(var(--amber) 0deg,rgba(240,165,0,0.08) 0deg)">',
    '        <div class="gauge-inner">',
    '          <div class="gauge-val" id="lb-active-val" style="color:var(--amber)">—</div>',
    '          <div class="gauge-lbl">AKTIVA</div>',
    '        </div>',
    '      </div>',
    '      <div class="gauge-name">JOBBAR</div>',
    '    </div>',
    '  </div>',
    '  <div class="rsb-crew hud" id="lb-crew">',
    '    <div class="hud-br"></div><div class="hud-bl"></div>',
    '    <div class="hud-label">Crew Manifest <span class="hl-r" id="lb-crew-count">— UNITS</span></div>',
    '    <div class="crew-world-filter">',
    '      <button class="cwf-btn cwf-active-all" id="lb-cwf-all"      onclick="lbSetWorldFilter(\'all\')"      title="Visa alla agenter">ALL</button>',
    '      <button class="cwf-btn"                id="lb-cwf-mobilix"  onclick="lbSetWorldFilter(\'mobilix\')"   title="Visa Mobilix-agenter">M</button>',
    '      <button class="cwf-btn"                id="lb-cwf-cptiivii" onclick="lbSetWorldFilter(\'cptiivii\')" title="Visa CPTiivii-agenter">C</button>',
    '    </div>',
    '    <div id="lb-crew-grid">',
    '      <div style="color:var(--muted);font-size:15px;text-align:center;padding:16px;">Laddar bessättning…</div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  var horizonHTML = [
    '<div class="horizon" id="lb-horizon">',
    '  <span>CPTiivii · Captain iivii</span>',
    '  <div class="hz-sig"><span class="sig-dot"></span><span>All systems nominal</span></div>',
    '  <span id="lb-hz-time">--:-- · --- ---</span>',
    '</div>'
  ].join('\n');

  var container = document.createElement('div');
  container.innerHTML = bridgeHTML + rightSidebarHTML + horizonHTML;
  while (container.firstChild) {
    document.body.insertBefore(container.firstChild, document.body.firstChild);
  }

  // ── 5. Theme toggle ───────────────────────────────────────────────────────
  function lbUpdateThemeBtn() {
    var icon = document.getElementById('lb-themeIcon');
    if (!icon) return;
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    icon.innerHTML = isLight
      ? '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M13 9.5A5.5 5.5 0 0 1 6 2.5a5.5 5.5 0 1 0 7 7z" opacity="0.8"/></svg>'
      : THEME_ICON_SVG;
  }

  window.lbToggleTheme = function () {
    var html    = document.documentElement;
    var goLight = html.getAttribute('data-theme') !== 'light';
    if (goLight) {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('lb-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('lb-theme', 'dark');
    }
    lbUpdateThemeBtn();
  };
  // Alias for backward-compat with older pages that call toggleTheme()
  if (typeof window.toggleTheme === 'undefined') {
    window.toggleTheme = window.lbToggleTheme;
  }

  document.addEventListener('DOMContentLoaded', lbUpdateThemeBtn);
  lbUpdateThemeBtn();

  // ── 6. Clock ──────────────────────────────────────────────────────────────
  (function () {
    var MO = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var n = new Date();
      var h = pad(n.getHours()), m = pad(n.getMinutes()), d = pad(n.getDate());
      var mo = MO[n.getMonth()];
      var el = document.getElementById('lb-hz-time');
      if (el) el.textContent = h + ':' + m + ' · ' + d + ' ' + mo;
    }
    tick();
    setInterval(tick, 1000);
  })();

  // ── 7. Hamburger ──────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var bridge  = document.getElementById('lb-bridge');
    var overlay = document.getElementById('lb-bridge-overlay');
    var burger  = document.getElementById('lb-hamburger');
    if (!bridge || !overlay || !burger) return;
    function open()  { bridge.classList.add('open');    overlay.classList.add('open'); }
    function close() { bridge.classList.remove('open'); overlay.classList.remove('open'); }
    burger.addEventListener('click', function () { bridge.classList.contains('open') ? close() : open(); });
    overlay.addEventListener('click', close);
    bridge.querySelectorAll('.bridge-item[href]').forEach(function (a) {
      a.addEventListener('click', function () { if (window.innerWidth <= 700) close(); });
    });
  });

  // ── 8. Radar degree marks ─────────────────────────────────────────────────
  (function () {
    var markG = document.getElementById('lb-rsb-degMarks');
    if (!markG) return;
    var ns = 'http://www.w3.org/2000/svg';
    var cx = 150, cy = 150;
    for (var deg = 0; deg < 360; deg += 30) {
      var rad = deg * Math.PI / 180;
      var ln  = document.createElementNS(ns, 'line');
      ln.setAttribute('x1', (cx + 138 * Math.cos(rad)).toFixed(1));
      ln.setAttribute('y1', (cy + 138 * Math.sin(rad)).toFixed(1));
      ln.setAttribute('x2', (cx + 146 * Math.cos(rad)).toFixed(1));
      ln.setAttribute('y2', (cy + 146 * Math.sin(rad)).toFixed(1));
      ln.setAttribute('stroke', 'rgba(0,212,255,0.35)');
      ln.setAttribute('stroke-width', '1.5');
      markG.appendChild(ln);
      var tx = document.createElementNS(ns, 'text');
      tx.setAttribute('x', (cx + 124 * Math.cos(rad)).toFixed(1));
      tx.setAttribute('y', (cy + 124 * Math.sin(rad)).toFixed(1));
      tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('dominant-baseline', 'middle');
      tx.setAttribute('font-size', '9');
      tx.setAttribute('fill', 'rgba(0,212,255,0.45)');
      tx.setAttribute('font-family', 'Share Tech Mono,monospace');
      tx.textContent = deg;
      markG.appendChild(tx);
    }
  })();

  // ── 9. Crew manifest ──────────────────────────────────────────────────────
  window.lbWorldFilter = window.lbWorldFilter || 'all';

  function lbRenderCrew() {
    var agents = (typeof window.AGENT_REPORTS !== 'undefined') ? window.AGENT_REPORTS : [];
    if (window.lbWorldFilter && window.lbWorldFilter !== 'all') {
      agents = agents.filter(function(a) {
        var w = a.world || 'mobilix';
        return window.lbWorldFilter === 'mobilix' ? (w === 'mobilix' || w === 'both') : (w === 'cptiivii' || w === 'both');
      });
    }
    if (!agents.length) return;

    var totalAgents  = agents.length;
    var activeAgents = agents.filter(function (a) { return a.status === 'active'; });
    var activeCount  = activeAgents.length;

    // Gauges
    function setEl(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }
    var gO = document.getElementById('lb-gauge-online');
    if (gO) gO.style.background = 'conic-gradient(var(--green) 0deg 360deg, rgba(0,255,136,0.08) 360deg 360deg)';
    setEl('lb-online-val', totalAgents);
    var aDeg = totalAgents ? Math.round(activeCount / totalAgents * 360) : 0;
    var gA = document.getElementById('lb-gauge-active');
    if (gA) gA.style.background = 'conic-gradient(var(--amber) 0deg ' + aDeg + 'deg, rgba(240,165,0,0.08) ' + aDeg + 'deg 360deg)';
    setEl('lb-active-val', activeCount);
    setEl('lb-crew-count', totalAgents + ' UNITS');

    // Radar blips
    var blipG = document.getElementById('lb-rsb-blips');
    var catRadii = [55, 90, 120, 70, 105, 42, 80];
    var catDefs  = [
      { key: 'Tekniska',                  color: '#3b82f6' },
      { key: 'Strategi & Affär',    color: '#a855f7' },
      { key: 'Marknadsintelligens',       color: '#22c55e' },
      { key: 'Transport & Infrastruktur', color: '#f97316' },
      { key: 'Content & Kommunikation',   color: '#06b6d4' },
      { key: 'Analys & Juridik',          color: '#ef4444' },
      { key: 'CRM & Dokument',            color: '#eab308' }
    ];
    var CATS = [
      { key: 'Tekniska',                  label: 'TECHNICAL',  color: '#3b82f6' },
      { key: 'Strategi & Affär',    label: 'STRATEGY',   color: '#a855f7' },
      { key: 'Marknadsintelligens',       label: 'INTEL',      color: '#22c55e' },
      { key: 'Transport & Infrastruktur', label: 'TRANSPORT',  color: '#f97316' },
      { key: 'Content & Kommunikation',   label: 'CONTENT',    color: '#06b6d4' },
      { key: 'Analys & Juridik',          label: 'ANALYTICS',  color: '#ef4444' },
      { key: 'CRM & Dokument',            label: 'CRM',        color: '#eab308' }
    ];

    if (blipG) {
      var sectorDeg = 360 / catDefs.length;
      var blipHtml  = '';
      catDefs.forEach(function (cat, ci) {
        var catAgents = agents.filter(function (a) { return a.category === cat.key; });
        if (!catAgents.length) return;
        var sStart = ci * sectorDeg;
        catAgents.forEach(function (agent, ai) {
          var spread = catAgents.length > 1
            ? sStart + 8 + (ai / (catAgents.length - 1)) * (sectorDeg - 16)
            : sStart + sectorDeg / 2;
          var ang    = spread * Math.PI / 180;
          var r      = catRadii[ci % catRadii.length] + (ai % 3) * 16;
          var bx     = (150 + r * Math.cos(ang)).toFixed(1);
          var by     = (150 + r * Math.sin(ang)).toFixed(1);
          var isAct  = agent.status === 'active';
          var dur    = (1.4 + ci * 0.15 + ai * 0.07) + 's';
          var col    = cat.color;
          if (isAct) {
            blipHtml += '<circle cx="' + bx + '" cy="' + by + '" r="4.5" fill="' + col + '"><animate attributeName="opacity" values="0.7;1;0.7" dur="' + dur + '" repeatCount="indefinite"/></circle>';
            blipHtml += '<circle cx="' + bx + '" cy="' + by + '" r="4.5" fill="none" stroke="' + col + '" stroke-width="1.5" opacity="0.9"><animate attributeName="r" values="4.5;9;4.5" dur="' + dur + '" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="' + dur + '" repeatCount="indefinite"/></circle>';
            blipHtml += '<circle cx="' + bx + '" cy="' + by + '" r="4.5" fill="none" stroke="' + col + '" stroke-width="0.8" opacity="0.5"><animate attributeName="r" values="4.5;14;4.5" dur="' + (parseFloat(dur) * 1.6).toFixed(2) + 's" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0;0.5" dur="' + (parseFloat(dur) * 1.6).toFixed(2) + 's" repeatCount="indefinite"/></circle>';
          } else {
            blipHtml += '<circle cx="' + bx + '" cy="' + by + '" r="2.5" fill="' + col + '" opacity="0.35"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="' + dur + '" repeatCount="indefinite"/></circle>';
          }
        });
      });
      blipG.innerHTML = blipHtml;
    }

    // Crew manifest HTML
    function snapProgress(raw) {
      if (raw >= 100) return 100; if (raw >= 50) return 50; if (raw >= 25) return 25; return 0;
    }
    var crewHtml = '<div class="crew-claire">'
      + '<div class="crew-claire-name">⚓ CLAIRE</div>'
      + '<div class="crew-claire-rank">FIRST MATE &amp; QUARTERMASTER</div>'
      + '</div>';
    CATS.forEach(function (cat) {
      var catAgents = agents.filter(function (a) { return a.category === cat.key; });
      if (!catAgents.length) return;
      var actives   = catAgents.filter(function (a) { return a.status === 'active'; });
      var hasActive = actives.length > 0;
      var snapped   = snapProgress(hasActive ? actives.reduce(function (m, a) { return Math.max(m, a.progress || 0); }, 0) : 0);

      crewHtml += '<div class="rsb-agent-cat" style="--cc:' + cat.color + '">' + cat.label + '</div>';
      catAgents.forEach(function (agent) {
        var isAct = agent.status === 'active';
        var cls   = isAct ? 'active' : 'idle';
        var w     = agent.world || 'mobilix';
        var mOn   = (w === 'mobilix' || w === 'both');
        var cOn   = (w === 'cptiivii' || w === 'both');
        crewHtml += '<div class="rsb-agent-row">'
          + '<div class="rsb-agent-dot ' + cls + '" style="--cc:' + cat.color + '"></div>'
          + '<span class="rsb-agent-name ' + cls + '">' + agent.id + '</span>'
          + '<span class="rsb-agent-status ' + cls + '">' + (isAct ? 'ACTIVE' : 'idle') + '</span>'
          + '<div class="rsb-agent-world">'
          + '<span class="rsb-world-badge ' + (mOn ? 'badge-m-on' : 'badge-off') + '">M</span>'
          + '<span class="rsb-world-badge ' + (cOn ? 'badge-c-on' : 'badge-off') + '">C</span>'
          + '</div></div>';
        if (agent.current_task) {
          var tTxt = agent.current_task.replace(/^(Pausad\s*[—-]\s*)/i, '').slice(0, 52).replace(/</g, '&lt;');
          crewHtml += '<div class="rsb-agent-task' + (isAct ? '' : ' rsb-agent-task-last') + '">' + (isAct ? '' : 'LAST: ') + tTxt + '…</div>';
        }
      });
      if (hasActive) {
        crewHtml += '<div class="crew-progress" style="padding-left:10px;"><span class="crew-progress-lbl">PROGRESS</span><div class="crew-progress-track">';
        [25, 50, 75, 100].forEach(function (t) {
          crewHtml += '<div class="crew-progress-seg' + (snapped >= t ? ' filled' : '') + '" style="--cc:' + cat.color + '"></div>';
        });
        crewHtml += '</div><span class="crew-progress-val" style="color:' + cat.color + '">' + snapped + '%</span></div>';
      }
    });

    var grid = document.getElementById('lb-crew-grid');
    if (grid) grid.innerHTML = crewHtml;
  }
  window.lbRenderCrew = lbRenderCrew;

  // ── 10. Refresh crew ─────────────────────────────────────────────────────────
  window.lbRefreshCrew = function() {
    var btn = document.getElementById('lb-refresh-btn');
    var ico = document.getElementById('lb-refresh-ico');
    if (btn) btn.disabled = true;
    if (ico) ico.className = 'lb-refresh-spin';
    var bg = document.getElementById('lb-rsb-blips'); if (bg) bg.innerHTML = '';
    ['lb-online-val','lb-active-val'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent='—';});
    var cc = document.getElementById('lb-crew-count'); if (cc) cc.textContent = '— UNITS';
    var cg = document.getElementById('lb-crew-grid'); if (cg) cg.innerHTML = '<div style="color:var(--muted);font-size:15px;text-align:center;padding:16px;">Uppdaterar…</div>';
    var s = document.createElement('script');
    s.src = '/agent_reports.js?t=' + Date.now();
    s.onload = function() { lbRenderCrew(); if (btn) btn.disabled = false; if (ico) ico.className = ''; };
    s.onerror = function() { if (btn) btn.disabled = false; if (ico) ico.className = ''; };
    document.head.appendChild(s);
  };

  window.lbSetWorldFilter = function(w) {
    window.lbWorldFilter = w;
    ['all','mobilix','cptiivii'].forEach(function(k) {
      var b = document.getElementById('lb-cwf-' + k);
      if (!b) return;
      b.className = 'cwf-btn' + (k === w ? ' cwf-active-' + (k === 'all' ? 'all' : k === 'mobilix' ? 'm' : 'c') : '');
    });
    lbRenderCrew();
  };

  lbRenderCrew();

  // ── Auto-wrap tables for horizontal scrollability ─────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var content = document.querySelector('.page-content');
    if (!content) return;
    content.querySelectorAll('table').forEach(function (t) {
      var p = t.parentElement;
      if (!p) return;
      // Skip if already wrapped
      if (p.classList.contains('table-scroll-wrap') ||
          p.style.overflowX === 'auto' ||
          p.style.overflowX === 'scroll') return;
      var wrap = document.createElement('div');
      wrap.classList.add('table-scroll-wrap');
      wrap.style.overflowX = 'auto';
      wrap.style.maxWidth = '100%';
      wrap.style.webkitOverflowScrolling = 'touch';
      wrap.style.marginBottom = '18px';
      t.style.marginBottom = '0';
      p.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  });

  // ── Print utility ─────────────────────────────────────────────────────────
  var LB_PRINT_CSS = [
    '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
    ':root {',
    '  --text:#1a1a2e; --text-hi:#0d0d1f; --muted:#4a5070;',
    '  --cyan:#0d5fa8; --amber:#7a5000; --green:#1a6a3a; --red:#8a1818;',
    '  --border:#cdd0e0; --border2:#e2e4f0;',
    '  --panel:#f6f7fb; --panel2:#edeef8; --bg:#ffffff;',
    '  --cyan-glow:rgba(13,95,168,0.15);',
    '}',
    'body { font-family:"Exo 2","Segoe UI",Arial,sans-serif; font-size:14px;',
    '  color:#1a1a2e; background:#fff; padding:28px 36px; }',
    '.lb-print-header { border-bottom:2px solid #1a2f6a; padding-bottom:10px; margin-bottom:24px; }',
    '.lb-print-header h1 { font-family:"Orbitron",monospace; font-size:19px; font-weight:700;',
    '  letter-spacing:0.1em; text-transform:uppercase; color:#1a2f6a; margin-bottom:3px; }',
    '.lb-print-header p { font-size:12px; color:#7080a0; }',
    '* { text-shadow:none !important; box-shadow:none !important; }',
    /* Remove nav tabs */
    '.an-tabs, .kb-tabs, .lb-print-action-bar { display:none !important; }',
    /* Show all panels */
    '.an-panel, .kb-panel { display:block !important; }',
    /* Dark backgrounds → light */
    '[class*="kpi"], [class*="-info"], [class*="action-card"], [class*="ana-card"],',
    '[class*="yr-chip"], [class*="yr-event-body"], [class*="tl-body"],',
    '[class*="-panel"]:not(.an-panel):not(.kb-panel), [class*="-card"], [class*="-wrap"] {',
    '  background:#f6f7fb !important; border-color:#cdd0e0 !important; }',
    '.page-content { background:#fff; padding:0; }',
    /* Color class overrides */
    '[class*="section-title"], .sec-hd, [class*="hero-title"], [class*="yr-title"],',
    '[class*="kpi-label"], [class*="bar-year"], [class*="info-title"] {',
    '  color:#1a2f6a !important; }',
    '[class*="kpi-val"], [class*="bar-val"] { color:#0d5fa8 !important; }',
    '[class*="kpi-val"].amber, [class*="bar-val"].amber,',
    '[style*="var(--amber)"] { color:#7a5000 !important; }',
    '[class*="kpi-val"].green, [class*="bar-val"].green,',
    '[style*="var(--green)"] { color:#1a6a3a !important; }',
    '[class*="kpi-val"].red, [class*="bar-val"].red,',
    '[style*="var(--red)"] { color:#8a1818 !important; }',
    '.num.hi { color:#1a6a3a !important; }',
    '.num.lo { color:#8a1818 !important; }',
    '.num.mid { color:#7a5000 !important; }',
    /* Tables */
    'table { width:100%; border-collapse:collapse; font-size:13px; margin-bottom:16px; }',
    'th { background:#1a2f6a !important; color:#fff !important;',
    '  padding:8px 11px; text-align:left; font-family:"Rajdhani","Exo 2",sans-serif;',
    '  font-size:12px; text-transform:uppercase; letter-spacing:0.08em; font-weight:700; }',
    'td { padding:7px 11px; border-bottom:1px solid #e2e4f0;',
    '  color:#1a1a2e !important; background:transparent !important; }',
    'tr:hover td { background:#f0f2fb !important; }',
    /* Bars */
    '[class*="bar-track"], [class*="bar-wrap"] { background:#e8eaf5 !important; }',
    '[class*="bar-fill"] { background:linear-gradient(90deg,rgba(13,95,168,0.6),rgba(13,95,168,0.3)) !important; }',
    '[class*="bar-fill"].amber { background:linear-gradient(90deg,rgba(122,80,0,0.5),rgba(122,80,0,0.25)) !important; }',
    '[class*="bar-fill"].red   { background:linear-gradient(90deg,rgba(138,24,24,0.5),rgba(138,24,24,0.25)) !important; }',
    '[class*="bar-num"] { color:#fff !important; }',
    /* Sections */
    '[class*="section"] { margin-bottom:20px; }',
    '[class*="section-title"] { border-bottom-color:#d0d4e4 !important; margin-bottom:12px; }',
    /* Info boxes */
    '[class*="-info"] { border-radius:6px; padding:12px 15px; }',
    '[class*="-info"].red { background:#fff5f5 !important; border-color:#e0b0b0 !important; }',
    '[class*="-info"].amber { background:#fffbf0 !important; border-color:#ddc890 !important; }',
    '[class*="-info"] p, [class*="-info"] li { color:#2a2a3e !important; }',
    '[class*="-info"] strong { color:#1a1a2e !important; }',
    /* Links */
    'a { color:#0d5fa8; }',
    '@page { margin:15mm; size:A4; }',
    '@media print { .lb-print-action-bar { display:none !important; } }'
  ].join('\n');

  window.lbPrint = function (customTitle) {
    var pc = document.querySelector('.page-content') || document.querySelector('.main') || document.querySelector('.page-wrap');
    if (!pc) { window.print(); return; }
    var title = customTitle || document.title.split('—')[0].trim();
    var clone = pc.cloneNode(true);

    /* Remove tab nav buttons from clone */
    ['an-tabs','kb-tabs','lb-print-btn','lb-print-action-bar'].forEach(function(cls) {
      clone.querySelectorAll('.' + cls).forEach(function(el){ el.remove(); });
    });
    /* Show all panels */
    clone.querySelectorAll('.an-panel, .kb-panel').forEach(function(el){
      el.style.display = 'block';
    });
    /* Remove print buttons already embedded in content */
    clone.querySelectorAll('button[onclick*="print"], button[onclick*="Print"]').forEach(function(el){ el.remove(); });

    var now = new Date().toLocaleDateString('sv-SE');
    var w = window.open('', '_blank', 'width=900,height=750');
    if (!w) { alert('Tillåt popup-fönster för den här sidan för att kunna skriva ut.'); return; }
    w.document.write(
      '<!DOCTYPE html><html lang="sv"><head>' +
      '<meta charset="UTF-8">' +
      '<title>' + title + '</title>' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">' +
      '<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@600;700&family=Exo+2:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">' +
      '<style>' + LB_PRINT_CSS + '</style>' +
      '</head><body>' +
      '<div class="lb-print-action-bar" style="position:fixed;top:14px;right:18px;display:flex;gap:8px;z-index:999;">' +
      '<button onclick="window.print()" style="padding:7px 18px;background:#1a2f6a;color:#fff;border:none;border-radius:5px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;">Skriv ut / PDF</button>' +
      '<button onclick="window.close()" style="padding:7px 12px;background:#eee;color:#333;border:none;border-radius:5px;font-size:13px;cursor:pointer;">Stäng</button>' +
      '</div>' +
      '<div class="lb-print-header">' +
      '<h1>' + title + '</h1>' +
      '<p>Blekingetrafiken · CPTiivii LogBook · Utskrivet ' + now + '</p>' +
      '</div>' +
      clone.innerHTML +
      '</body></html>'
    );
    w.document.close();
  };

  /* Inject floating print button on all pages with .page-content, .main, or .page-wrap */
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('.page-content') && !document.querySelector('.main') && !document.querySelector('.page-wrap')) return;
    var btn = document.createElement('button');
    btn.className = 'lb-print-btn';
    btn.title = 'Skriv ut / Spara som PDF';
    btn.onclick = function () { window.lbPrint(); };
    btn.innerHTML =
      '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" width="15" height="15" style="vertical-align:middle;margin-right:5px;">' +
      '<rect x="3" y="7" width="12" height="8" rx="1.2"/>' +
      '<path d="M5 7V3.5a1 1 0 011-1h6a1 1 0 011 1V7"/>' +
      '<rect x="5.5" y="11" width="7" height="1.2" rx="0.5" fill="currentColor" stroke="none"/>' +
      '<rect x="5.5" y="13.2" width="4" height="1.2" rx="0.5" fill="currentColor" stroke="none"/>' +
      '</svg>Skriv ut';
    document.body.appendChild(btn);
  });

  // Standalone mode: ?standalone hides all chrome (used by external landing page links)
  if (new URLSearchParams(location.search).has('standalone')) {
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.bridge, .right-sidebar, .horizon').forEach(function(el) {
        el.style.setProperty('display', 'none', 'important');
      });
      var pc = document.querySelector('.page-content');
      if (pc) { pc.style.marginLeft = '0'; pc.style.marginRight = '0'; pc.style.maxWidth = '100%'; pc.style.paddingBottom = '40px'; }
    });
  }

  window.lbRunnerRefresh = function(endpoint, btnId, icoId) {
    var btn = document.getElementById(btnId);
    var ico = document.getElementById(icoId);
    if (btn) btn.disabled = true;
    if (ico) ico.className = 'lb-refresh-spin';
    fetch('http://127.0.0.1:8010/' + endpoint)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.ok) { location.reload(); }
        else { if (btn) btn.disabled = false; if (ico) ico.className = ''; }
      })
      .catch(function() { if (btn) btn.disabled = false; if (ico) ico.className = ''; });
  };
})();
