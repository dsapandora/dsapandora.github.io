import React, { useEffect, useRef, useState, useCallback } from 'react';
import './RetroGame.css';

/*
  ICE DASH — a pseudo-3D "into the screen" arcade runner (Antarctic-Adventure style).
  A little white seal runs toward the horizon, jumping ice holes and grabbing fish.
  It lives on the page as design: it auto-plays in "attract mode", and the moment you
  click / press a key, you take control. Pure canvas, procedural, no assets.
*/

const W = 360;
const H = 210;
const HORIZON = 76;
const NEARY = H - 6;         // ground line at the very bottom
const ROAD_NEAR = 150;       // half road width at the player
const SEAL_PX = 4;           // seal sprite pixel size

// 12x12 back-view seal. K=outline W=white G=grey-back F=flipper . =empty
const SEAL = [
  '....KKKK....',
  '..KKWWWWKK..',
  '.KWWWWWWWWK.',
  '.KWGGGGGGWK.',
  'KWWWWWWWWWWK',
  'KWWWWWWWWWWK',
  'KWWWWWWWWWWK',
  'KWWWWWWWWWWK',
  '.KWWWWWWWWK.',
  '.KWWWWWWWWK.',
  '..KWWWWWWK..',
  '..FF....FF..',
];
const FEET = { a: [11, [2, 3, 8, 9]], b: [11, [3, 4, 7, 8]], air: [11, [3, 8]] };
const PAL = { K: '#20222e', W: '#f7fbff', G: '#cdd9ec', F: '#e6eefb' };
const SEAL_W = 12 * SEAL_PX;
const SEAL_H = 12 * SEAL_PX;

const HIGH_KEY = 'icedash_high2';

// perspective scale from depth p (0 = at player / near, 1 = horizon / far)
function scaleOf(p) {
  const zc = 0.2 + Math.max(0, p) * 6;
  return (1 / zc) / 5; // normalized so p=0 -> 1
}
function yOf(p) { return HORIZON + (NEARY - HORIZON) * scaleOf(p); }

function RetroGame() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const gameRef = useRef(null);
  const hudRef = useRef(null);
  const keysRef = useRef({ left: false, right: false });
  const bgRef = useRef(null);
  const sealRef = useRef(null);
  const phaseRef = useRef('attract');
  const [phase, setPhase] = useState('attract'); // attract | play | dead
  const [high, setHigh] = useState(0);
  const [last, setLast] = useState(0);

  useEffect(() => {
    const h = parseInt(localStorage.getItem(HIGH_KEY) || '0', 10);
    if (!Number.isNaN(h)) setHigh(h);
    const bg = new Image(); bg.src = '/fjord_bg.png'; bgRef.current = bg;
    const s = new Image(); s.src = '/seal.png'; sealRef.current = s;
  }, []);

  const makeGame = useCallback((attract) => ({
    x: 0, jumpY: 0, vy: 0, air: false,
    speed: 0.0044, dist: 0, fish: 0, run: 0, t: 0,
    holes: [], fishes: [], clouds: [], scroll: 0,
    sinceHole: 0, holeGap: 70, sinceFish: 0, attract: !!attract, dead: false,
  }), []);

  const seed = useCallback((g) => {
    for (let i = 0; i < 3; i++) g.clouds.push({ x: Math.random() * W, y: 6 + Math.random() * 12, w: 22 + Math.random() * 26 });
    const mkRange = (n, top, span) => {
      const pts = [];
      for (let i = 0; i <= n; i++) pts.push({ x: (i / n) * (W + 60) - 30, y: top + Math.random() * span });
      return pts;
    };
    g.mtnFar = mkRange(7, 34, 14);   // hazy back range
    g.mtnNear = mkRange(9, 26, 22);  // snowy fjord peaks
  }, []);

  // init an attract-mode demo behind the hint
  useEffect(() => {
    const g = makeGame(true);
    seed(g);
    gameRef.current = g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPlay = useCallback(() => {
    const g = makeGame(false);
    seed(g);
    gameRef.current = g;
    phaseRef.current = 'play';
    setPhase('play');
  }, [makeGame, seed]);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g && !g.air) { g.vy = 4.6; g.air = true; }
  }, []);

  const press = useCallback(() => {
    if (phaseRef.current === 'play') jump();
    else startPlay();
  }, [jump, startPlay]);

  useEffect(() => {
    const down = (e) => {
      const k = e.key;
      if (['ArrowLeft', 'a', 'A'].includes(k)) { keysRef.current.left = true; e.preventDefault(); }
      else if (['ArrowRight', 'd', 'D'].includes(k)) { keysRef.current.right = true; e.preventDefault(); }
      else if ([' ', 'ArrowUp', 'w', 'W', 'Enter'].includes(k)) { e.preventDefault(); press(); }
    };
    const up = (e) => {
      const k = e.key;
      if (['ArrowLeft', 'a', 'A'].includes(k)) keysRef.current.left = false;
      if (['ArrowRight', 'd', 'D'].includes(k)) keysRef.current.right = false;
    };
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [press]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    let lastT = performance.now();

    const SEAL_DRAW_W = 46;
    const drawSeal = (cx, baseY, feet, bob) => {
      const img = sealRef.current;
      if (img && img.complete && img.naturalWidth) {
        const w = SEAL_DRAW_W;
        const h = Math.round(w * (img.naturalHeight / img.naturalWidth));
        ctx.drawImage(img, Math.round(cx - w / 2), Math.round(baseY - h + bob), w, h);
        return;
      }
      // fallback pixel sprite
      const ox = Math.round(cx - SEAL_W / 2);
      const oy = Math.round(baseY - SEAL_H);
      for (let r = 0; r < SEAL.length; r++) {
        for (let c = 0; c < SEAL[r].length; c++) {
          let ch = SEAL[r][c];
          if (r === 11) ch = '.';
          if (ch === '.') continue;
          ctx.fillStyle = PAL[ch] || '#fff';
          ctx.fillRect(ox + c * SEAL_PX, oy + r * SEAL_PX, SEAL_PX, SEAL_PX);
        }
      }
      ctx.fillStyle = PAL.F;
      feet[1].forEach((c) => ctx.fillRect(ox + c * SEAL_PX, oy + feet[0] * SEAL_PX, SEAL_PX, SEAL_PX));
    };

    const die = (g) => {
      if (g.dead || g.attract) return;
      g.dead = true;
      phaseRef.current = 'dead';
      const sc = Math.floor(g.dist) + g.fish * 25;
      setLast(sc);
      setHigh((h) => { const nh = Math.max(h, sc); try { localStorage.setItem(HIGH_KEY, String(nh)); } catch (e) {} return nh; });
      setPhase('dead');
    };

    const render = (now) => {
      const g = gameRef.current;
      const dt = Math.min(50, now - lastT); lastT = now;
      const step = dt / (1000 / 60);

      // backdrop: pixel-art Norwegian fjord (crop the top ~sky+mountains); fallback gradient
      const bg = bgRef.current;
      if (bg && bg.complete && bg.naturalWidth) {
        const srcH = bg.naturalHeight * 0.6;
        ctx.drawImage(bg, 0, 0, bg.naturalWidth, srcH, 0, 0, W, HORIZON + 8);
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
        sky.addColorStop(0, '#8fd0ff'); sky.addColorStop(1, '#cfeaff');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HORIZON + 8);
      }

      if (g) {
        g.t += step;

        // ---- GROUND: one big white ice plain (no water on the sides) ----
        const halfTop = ROAD_NEAR * scaleOf(1);
        // whole ground is snow, full width
        ctx.fillStyle = '#eff5fd';
        ctx.fillRect(0, HORIZON + 8, W, H - (HORIZON + 8));
        // subtle packed-ice lane receding to the horizon
        ctx.fillStyle = '#e2edf9';
        ctx.beginPath();
        ctx.moveTo(W / 2 - ROAD_NEAR, NEARY);
        ctx.lineTo(W / 2 - halfTop, HORIZON + 9);
        ctx.lineTo(W / 2 + halfTop, HORIZON + 9);
        ctx.lineTo(W / 2 + ROAD_NEAR, NEARY);
        ctx.closePath(); ctx.fill();
        // faint lane edges
        ctx.strokeStyle = 'rgba(140,168,210,0.4)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 - ROAD_NEAR, NEARY); ctx.lineTo(W / 2 - halfTop, HORIZON + 9);
        ctx.moveTo(W / 2 + ROAD_NEAR, NEARY); ctx.lineTo(W / 2 + halfTop, HORIZON + 9);
        ctx.stroke();

        const playing = phaseRef.current === 'play' || g.attract;

        // scroll speed lines on the track
        g.scroll = (g.scroll + g.speed * step * 3) % 0.2;
        for (let k = 0; k < 8; k++) {
          const p = ((k * 0.125 + g.scroll) % 1);
          const y = yOf(p); const s = scaleOf(p);
          ctx.fillStyle = 'rgba(150,175,215,0.22)';
          ctx.fillRect(W / 2 - ROAD_NEAR * s, y, ROAD_NEAR * 2 * s, Math.max(1, 2 * s));
        }

        // physics / progress
        if (playing) {
          g.dist += g.speed * step * 120;
          g.speed = Math.min(0.0092, 0.0044 + g.dist * 0.0000026);
          // jump
          if (g.air) { g.jumpY += g.vy * step; g.vy -= 0.34 * step; if (g.jumpY <= 0) { g.jumpY = 0; g.air = false; g.vy = 0; } }
          g.run += g.speed * step * 60;

          // steering
          let mv = 0;
          if (g.attract) {
            const tf = g.fishes.find((f) => f.p < 0.5 && !f.got);
            const target = tf ? tf.x : 0;
            mv = Math.sign(target - g.x) * (Math.abs(target - g.x) > 4 ? 1 : 0);
          } else {
            if (keysRef.current.left) mv -= 1;
            if (keysRef.current.right) mv += 1;
          }
          g.x += mv * 2.4 * step;
          g.x = Math.max(-ROAD_NEAR + 14, Math.min(ROAD_NEAR - 14, g.x));

          // spawn
          g.sinceHole += g.speed * step * 120;
          if (g.sinceHole >= g.holeGap) {
            g.sinceHole = 0; g.holeGap = 34 + Math.random() * 30;
            g.holes.push({ p: 1, x: (Math.random() * 2 - 1) * (ROAD_NEAR - 26), checked: false });
          }
          g.sinceFish += g.speed * step * 120;
          if (g.sinceFish >= 60) {
            g.sinceFish = 0;
            if (Math.random() < 0.7) g.fishes.push({ p: 1, x: (Math.random() * 2 - 1) * (ROAD_NEAR - 30), got: false });
          }
        }

        // update depth + collect gather list, draw far->near
        const drawables = [];
        for (let i = g.holes.length - 1; i >= 0; i--) {
          const o = g.holes[i];
          if (playing) o.p -= g.speed * step;
          if (!o.checked && o.p <= 0.04) {
            o.checked = true;
            const overHole = Math.abs(g.x - o.x) < 32; // only die if actually on the hole
            if (overHole && g.jumpY < 10 && !g.attract) die(g);
          }
          if (o.p < 0) { g.holes.splice(i, 1); continue; }
          drawables.push({ type: 'hole', o, p: o.p });
        }
        for (let i = g.fishes.length - 1; i >= 0; i--) {
          const f = g.fishes[i];
          if (playing) f.p -= g.speed * step;
          if (!f.got && f.p <= 0.08 && Math.abs(f.x - g.x) < 18) { f.got = true; g.fish += 1; }
          if (f.got || f.p < 0) { g.fishes.splice(i, 1); continue; }
          drawables.push({ type: 'fish', o: f, p: f.p });
        }
        drawables.sort((a, b) => b.p - a.p);

        // AI auto-jump in attract / help: jump when a hole is close
        if (g.attract) {
          const near = g.holes.find((o) => o.p > 0.02 && o.p < 0.14);
          if (near && !g.air) { g.vy = 4.6; g.air = true; }
        }

        drawables.forEach((d) => {
          const s = scaleOf(d.p);
          const x = W / 2 + d.o.x * s;
          const y = yOf(d.p);
          if (d.type === 'hole') {
            const w = 40 * s, h = 16 * s;
            ctx.fillStyle = '#123a7a';
            ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#0a2450';
            ctx.beginPath(); ctx.ellipse(x, y - h * 0.15, w * 0.8, h * 0.7, 0, 0, Math.PI * 2); ctx.fill();
          } else {
            const fw = Math.max(2, 12 * s);
            ctx.fillStyle = '#ff8a3d';
            ctx.fillRect(x - fw / 2, y - fw / 3, fw, fw * 0.66);
            ctx.fillStyle = '#ffd23e';
            ctx.fillRect(x - fw / 2, y - fw / 3, fw * 0.5, fw * 0.66);
          }
        });

        // seal
        const sealX = W / 2 + g.x;
        const baseY = NEARY + 4 - g.jumpY;
        // shadow
        const shW = g.air ? 10 : 16;
        ctx.fillStyle = 'rgba(20,30,60,0.20)';
        ctx.beginPath(); ctx.ellipse(sealX, NEARY + 4, shW, 4, 0, 0, Math.PI * 2); ctx.fill();
        let feet = FEET.air;
        const bob = (!g.air && Math.floor(g.run / 4) % 2 === 1) ? 1 : 0;
        if (!g.air) feet = Math.floor(g.run / 4) % 2 === 0 ? FEET.a : FEET.b;
        drawSeal(sealX, baseY, feet, bob);

        // HUD
        if (hudRef.current) {
          const sc = Math.floor(g.dist) + g.fish * 25;
          const spd = Math.round(((g.speed - 0.0075) / (0.016 - 0.0075)) * 8);
          hudRef.current.innerHTML =
            `<span>P1 <b>${String(sc).padStart(6, '0')}</b></span>` +
            `<span>HI <b>${String(Math.max(high, sc)).padStart(6, '0')}</b></span>` +
            `<span class="rg-fish">◗ ${String(g.fish).padStart(2, '0')}</span>` +
            `<span class="rg-spd">SPD ${'▮'.repeat(Math.max(1, spd))}</span>`;
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [high]);

  return (
    <div className="rg-wrap">
      <div className="rg-frame" onPointerDown={(e) => { e.preventDefault(); press(); }}>
        <canvas ref={canvasRef} width={W} height={H} className="rg-canvas" />
        <div className="rg-scan" />
        <div className="rg-hud" ref={hudRef}><span>P1 <b>000000</b></span></div>

        {phase === 'attract' && (
          <div className="rg-hint">
            <span className="rg-blink">▶ CLICK TO PLAY</span>
            <span className="rg-hintsub">← → move · SPACE jump</span>
          </div>
        )}
        {phase === 'dead' && (
          <div className="rg-overlay">
            <div className="rg-title rg-red">GAME OVER</div>
            <div className="rg-score">SCORE {String(last).padStart(6, '0')} · HI {String(high).padStart(6, '0')}</div>
            <button className="rg-btn" onClick={(e) => { e.stopPropagation(); startPlay(); }}>↻ RETRY</button>
          </div>
        )}
      </div>
      <div className="rg-caption">
        <span>A slow, pseudo-3D fjord runner — coded from scratch in vanilla JS &amp; Canvas.</span>
      </div>
    </div>
  );
}

export default RetroGame;
