import React, { useEffect, useRef, useState, useCallback } from 'react';
import './RetroGame.css';

/*
  PENGUIN DASH — a cute side-view dodger. A little penguin waddles left↔right
  along the snow while snowballs drop from the sky; steer it, dodge, grab fish.
  Uses a real sprite from /penguin.png when present, with a hand-drawn fallback.
  Move: ← → / A D, or press-and-hold the left/right side (touch). Random every run.
*/

const W = 360;
const H = 210;
const GROUND = 176;
const PW = 34;   // penguin draw width
const PH = 42;   // penguin draw height
const HIGH_KEY = 'penguindash_high';

function PenguinGame() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const gameRef = useRef(null);
  const hudRef = useRef(null);
  const imgRef = useRef(null);
  const inputRef = useRef({ left: false, right: false, target: null });
  const phaseRef = useRef('attract');
  const [phase, setPhase] = useState('attract');
  const [high, setHigh] = useState(0);
  const [last, setLast] = useState(0);

  useEffect(() => {
    const h = parseInt(localStorage.getItem(HIGH_KEY) || '0', 10);
    if (!Number.isNaN(h)) setHigh(h);
    const img = new Image();
    img.onload = () => { imgRef.current = img; };
    img.src = '/penguin.png';
  }, []);

  const makeGame = useCallback((attract) => ({
    x: W / 2, dir: 1, walk: 0, t: 0,
    balls: [], fishes: [], flakes: [],
    speed: 1.1, spawn: 0, spawnGap: 62, sinceFish: 0,
    score: 0, fish: 0, attract: !!attract, dead: false,
  }), []);

  const seed = useCallback((g) => {
    for (let i = 0; i < 26; i++) g.flakes.push({ x: Math.random() * W, y: Math.random() * H, s: Math.random() < 0.3 ? 2 : 1, vy: 0.2 + Math.random() * 0.4 });
  }, []);

  useEffect(() => {
    const g = makeGame(true); seed(g); gameRef.current = g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPlay = useCallback(() => {
    const g = makeGame(false); seed(g); gameRef.current = g;
    phaseRef.current = 'play'; setPhase('play');
  }, [makeGame, seed]);

  const press = useCallback(() => { if (phaseRef.current !== 'play') startPlay(); }, [startPlay]);

  useEffect(() => {
    const down = (e) => {
      const k = e.key;
      if (['ArrowLeft', 'a', 'A'].includes(k)) { inputRef.current.left = true; e.preventDefault(); }
      else if (['ArrowRight', 'd', 'D'].includes(k)) { inputRef.current.right = true; e.preventDefault(); }
      else if ([' ', 'Enter'].includes(k)) { e.preventDefault(); press(); }
    };
    const up = (e) => {
      const k = e.key;
      if (['ArrowLeft', 'a', 'A'].includes(k)) inputRef.current.left = false;
      if (['ArrowRight', 'd', 'D'].includes(k)) inputRef.current.right = false;
    };
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [press]);

  const pointerAt = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    inputRef.current.target = ((e.clientX - r.left) / r.width) * W;
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let lastT = performance.now();

    const drawPenguin = (cx, footY, faceLeft, waddle) => {
      const img = imgRef.current;
      const topY = footY - PH;
      if (img) {
        ctx.save();
        if (faceLeft) { ctx.translate(cx, 0); ctx.scale(-1, 1); ctx.drawImage(img, -PW / 2, topY, PW, PH); }
        else ctx.drawImage(img, cx - PW / 2, topY, PW, PH);
        ctx.restore();
        return;
      }
      // fallback cute penguin (fillRect/ellipse)
      const b = waddle ? 1 : 0;
      ctx.fillStyle = 'rgba(20,30,60,0.18)';
      ctx.beginPath(); ctx.ellipse(cx, footY, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      // feet
      ctx.fillStyle = '#ff9f2e';
      ctx.fillRect(cx - 9 + b, footY - 4, 6, 4);
      ctx.fillRect(cx + 3 - b, footY - 4, 6, 4);
      // body black
      ctx.fillStyle = '#1c2230';
      ctx.beginPath(); ctx.ellipse(cx, topY + 22, 14, 20, 0, 0, Math.PI * 2); ctx.fill();
      // belly white
      ctx.fillStyle = '#f6fbff';
      ctx.beginPath(); ctx.ellipse(cx, topY + 25, 9, 15, 0, 0, Math.PI * 2); ctx.fill();
      // head
      ctx.fillStyle = '#1c2230';
      ctx.beginPath(); ctx.ellipse(cx, topY + 8, 11, 10, 0, 0, Math.PI * 2); ctx.fill();
      // eyes
      const ex = faceLeft ? -1 : 1;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx + ex * 3 - 3, topY + 6, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + ex * 3 + 2, topY + 6, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1c2230';
      ctx.beginPath(); ctx.arc(cx + ex * 4, topY + 6, 1.2, 0, Math.PI * 2); ctx.fill();
      // beak
      ctx.fillStyle = '#ff9f2e';
      ctx.beginPath(); ctx.moveTo(cx + ex * 8, topY + 9); ctx.lineTo(cx + ex * 12, topY + 11); ctx.lineTo(cx + ex * 8, topY + 13); ctx.closePath(); ctx.fill();
      // wing
      ctx.fillStyle = '#141a26';
      ctx.beginPath(); ctx.ellipse(cx - ex * 12, topY + 22, 4, 11, ex * 0.3, 0, Math.PI * 2); ctx.fill();
    };

    const die = (g) => {
      if (g.dead || g.attract) return;
      g.dead = true; phaseRef.current = 'dead';
      const sc = Math.floor(g.score) + g.fish * 20;
      setLast(sc);
      setHigh((h) => { const nh = Math.max(h, sc); try { localStorage.setItem(HIGH_KEY, String(nh)); } catch (e) {} return nh; });
      setPhase('dead');
    };

    const render = (now) => {
      const g = gameRef.current;
      const dt = Math.min(50, now - lastT); lastT = now;
      const stp = dt / (1000 / 60);

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#bfe3ff'); sky.addColorStop(0.7, '#e8f4ff'); sky.addColorStop(1, '#ffffff');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      if (g) {
        g.t += stp;
        // distant hills
        ctx.fillStyle = '#dbe8f7';
        ctx.beginPath(); ctx.moveTo(0, GROUND);
        ctx.quadraticCurveTo(90, GROUND - 40, 180, GROUND - 8);
        ctx.quadraticCurveTo(270, GROUND - 44, W, GROUND - 6);
        ctx.lineTo(W, GROUND); ctx.closePath(); ctx.fill();
        // snow ground
        ctx.fillStyle = '#f3f8ff'; ctx.fillRect(0, GROUND, W, H - GROUND);
        ctx.fillStyle = '#dcecfb'; ctx.fillRect(0, GROUND, W, 3);

        // snowflakes
        g.flakes.forEach((f) => {
          f.y += f.vy * stp; f.x += Math.sin(g.t * 0.03 + f.y) * 0.2;
          if (f.y > H) { f.y = -2; f.x = Math.random() * W; }
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillRect(f.x, f.y, f.s, f.s);
        });

        const playing = phaseRef.current === 'play' || g.attract;

        if (playing) {
          g.score += stp * 0.35;
          g.speed = Math.min(2.6, 1.1 + g.score * 0.004);

          // movement
          let target = null;
          if (g.attract) {
            const threat = g.balls.filter((b) => b.y > 60 && b.y < GROUND).sort((a, b) => (a.y - b.y))[0];
            if (threat) target = threat.x > g.x ? g.x - 60 : g.x + 60;
            const fh = g.fishes[0]; if (!threat && fh) target = fh.x;
          } else {
            if (inputRef.current.left) target = g.x - 60;
            else if (inputRef.current.right) target = g.x + 60;
            else if (inputRef.current.target != null) target = inputRef.current.target;
          }
          if (target != null) {
            const d = target - g.x;
            if (Math.abs(d) > 1.5) { g.dir = d < 0 ? -1 : 1; g.x += Math.sign(d) * Math.min(Math.abs(d), 2.6 * stp); g.walk += stp; }
          }
          g.x = Math.max(PW / 2, Math.min(W - PW / 2, g.x));

          // spawn snowballs
          g.spawn += g.speed * stp;
          if (g.spawn >= g.spawnGap) {
            g.spawn = 0; g.spawnGap = 40 + Math.random() * 42;
            g.balls.push({ x: 16 + Math.random() * (W - 32), y: -8, r: 7 + Math.random() * 5, vy: 1.5 + Math.random() * 1.4 + g.speed * 0.4 });
          }
          g.sinceFish += stp;
          if (g.sinceFish > 90) { g.sinceFish = 0; if (Math.random() < 0.7) g.fishes.push({ x: 16 + Math.random() * (W - 32), y: -8, vy: 1.4 + Math.random() }); }
        }

        // snowballs
        const pL = g.x - PW / 2 + 4, pR = g.x + PW / 2 - 4, pT = GROUND - PH + 6, pB = GROUND - 2;
        for (let i = g.balls.length - 1; i >= 0; i--) {
          const b = g.balls[i];
          if (playing) b.y += b.vy * stp;
          // draw
          ctx.fillStyle = '#eef5ff'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#bcd2ef'; ctx.beginPath(); ctx.arc(b.x + b.r * 0.3, b.y + b.r * 0.3, b.r * 0.5, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(60,90,140,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
          if (b.y - b.r > H) { g.balls.splice(i, 1); continue; }
          // collision
          if (playing && b.y + b.r > pT && b.y - b.r < pB && b.x > pL - b.r && b.x < pR + b.r) {
            const cx = Math.max(pL, Math.min(b.x, pR)); const cy = Math.max(pT, Math.min(b.y, pB));
            if ((cx - b.x) ** 2 + (cy - b.y) ** 2 < b.r * b.r) die(g);
          }
        }
        // fish
        for (let i = g.fishes.length - 1; i >= 0; i--) {
          const f = g.fishes[i];
          if (playing) f.y += f.vy * stp;
          ctx.fillStyle = '#ff8a3d'; ctx.fillRect(f.x - 5, f.y - 3, 10, 6);
          ctx.fillStyle = '#ffd23e'; ctx.fillRect(f.x - 5, f.y - 3, 4, 6);
          if (f.y > H) { g.fishes.splice(i, 1); continue; }
          if (playing && f.y > pT && f.x > pL && f.x < pR) { g.fish += 1; g.fishes.splice(i, 1); }
        }

        // penguin
        drawPenguin(g.x, GROUND, g.dir < 0, Math.floor(g.walk / 6) % 2 === 0);

        if (hudRef.current) {
          const sc = Math.floor(g.score) + g.fish * 20;
          hudRef.current.innerHTML =
            `<span>P1 <b>${String(sc).padStart(6, '0')}</b></span>` +
            `<span>HI <b>${String(Math.max(high, sc)).padStart(6, '0')}</b></span>` +
            `<span class="rg-fish">◗ ${String(g.fish).padStart(2, '0')}</span>`;
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
      <div
        className="rg-frame"
        onPointerDown={(e) => { e.preventDefault(); if (phaseRef.current !== 'play') { press(); } else { pointerAt(e); } }}
        onPointerMove={(e) => { if (phaseRef.current === 'play' && e.buttons) pointerAt(e); }}
        onPointerUp={() => { inputRef.current.target = null; }}
        onPointerLeave={() => { inputRef.current.target = null; }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="rg-canvas" />
        <div className="rg-scan" />
        <div className="rg-hud" ref={hudRef}><span>P1 <b>000000</b></span></div>

        {phase === 'attract' && (
          <div className="rg-hint">
            <span className="rg-blink">▶ CLICK TO PLAY</span>
            <span className="rg-hintsub">← → or hold a side · dodge the snowballs</span>
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
        <span>A cute penguin dodger — vanilla JS &amp; Canvas, with real game sprites.</span>
      </div>
    </div>
  );
}

export default PenguinGame;
