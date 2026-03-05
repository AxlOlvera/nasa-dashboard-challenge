import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   CosmicBackground
   Three stacked visual zones:
   1. TOP    — canvas starfield with twinkling + shooting stars
   2. MIDDLE — CSS lava-lamp aurora blobs (shifting nebula colors)
   3. BOTTOM — drifting asteroid silhouettes
───────────────────────────────────────────────────────────── */

/* ── Zone 1: Canvas Starfield ── */
const StarCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let W, H;

    // ── Stars ──
    const STAR_COUNT = 280;
    const stars = [];

    const rand = (min, max) => Math.random() * (max - min) + min;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x:        rand(0, W),
          y:        rand(0, H),
          r:        rand(0.3, 1.8),
          alpha:    rand(0.2, 1.0),
          dAlpha:   rand(0.003, 0.012) * (Math.random() > 0.5 ? 1 : -1),
          // subtle color tint: white, blue-white, or warm
          hue:      Math.random() > 0.85 ? rand(200, 240) : rand(0, 30),
          sat:      Math.random() > 0.85 ? rand(40, 70)   : 0,
        });
      }
    };

    // ── Shooting stars ──
    const shooters = [];
    const spawnShooter = () => {
      shooters.push({
        x:     rand(0, W * 0.8),
        y:     rand(0, H * 0.3),
        vx:    rand(6, 14),
        vy:    rand(2, 5),
        len:   rand(80, 160),
        alpha: 1,
        life:  0,
        maxLife: rand(40, 70),
      });
    };

    let shooterTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Twinkling stars
      for (const s of stars) {
        s.alpha += s.dAlpha;
        if (s.alpha <= 0.1 || s.alpha >= 1.0) s.dAlpha *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const color = s.sat > 0
          ? `hsla(${s.hue}, ${s.sat}%, 90%, ${s.alpha})`
          : `rgba(255,255,255,${s.alpha})`;
        ctx.fillStyle = color;
        ctx.fill();
      }

      // Shooting stars
      shooterTimer++;
      if (shooterTimer > 220 && shooters.length < 3) {
        spawnShooter();
        shooterTimer = 0;
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life++;
        sh.alpha = 1 - sh.life / sh.maxLife;

        if (sh.alpha <= 0) { shooters.splice(i, 1); continue; }

        const grad = ctx.createLinearGradient(
          sh.x - sh.vx * (sh.len / sh.vx),
          sh.y - sh.vy * (sh.len / sh.vx),
          sh.x, sh.y
        );
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(180,240,255,${sh.alpha})`);

        ctx.beginPath();
        ctx.moveTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.lineTo(sh.x, sh.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    draw();

    const ro = new ResizeObserver(() => { resize(); initStars(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cosmic-zone cosmic-zone--stars"
      aria-hidden="true"
    />
  );
};

/* ── Zone 2: Aurora / Lava-lamp Blobs ── */
const AuroraZone = () => (
  <div className="cosmic-zone cosmic-zone--aurora" aria-hidden="true">
    {/* 6 animated orbs with offset delays and different colors */}
    <div className="aurora-orb aurora-orb--1" />
    <div className="aurora-orb aurora-orb--2" />
    <div className="aurora-orb aurora-orb--3" />
    <div className="aurora-orb aurora-orb--4" />
    <div className="aurora-orb aurora-orb--5" />
    <div className="aurora-orb aurora-orb--6" />
  </div>
);

/* ── Zone 3: Asteroid Belt ── */
// Pre-seeded shapes so they're deterministic (no hydration mismatch)
const ASTEROIDS = [
  { w:28, h:20, top:'8%',  left:'3%',  dur:38, delay:0,   op:0.55 },
  { w:14, h:10, top:'30%', left:'8%',  dur:52, delay:5,   op:0.35 },
  { w:42, h:30, top:'55%', left:'2%',  dur:45, delay:12,  op:0.50 },
  { w:18, h:14, top:'75%', left:'12%', dur:60, delay:3,   op:0.40 },
  { w:34, h:24, top:'90%', left:'6%',  dur:50, delay:18,  op:0.45 },
  { w:22, h:16, top:'15%', left:'88%', dur:44, delay:7,   op:0.38 },
  { w:36, h:26, top:'42%', left:'92%', dur:56, delay:20,  op:0.52 },
  { w:16, h:12, top:'68%', left:'85%', dur:48, delay:11,  op:0.33 },
  { w:48, h:34, top:'82%', left:'90%', dur:62, delay:25,  op:0.48 },
  { w:12, h: 8, top:'5%',  left:'50%', dur:70, delay:30,  op:0.28 },
  { w:20, h:14, top:'95%', left:'45%', dur:41, delay:15,  op:0.42 },
];

// Rough polygon path for an asteroid silhouette
const asteroidPath = (w, h) => {
  const cx = w / 2, cy = h / 2;
  const pts = [
    [cx * 0.3, cy * 0.1],
    [cx * 1.1, 0],
    [w,        cy * 0.4],
    [w * 0.9,  h],
    [cx * 0.6, h * 0.95],
    [0,        cy * 1.3],
    [cx * 0.1, cy * 0.5],
  ];
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';
};

const AsteroidBelt = () => (
  <div className="cosmic-zone cosmic-zone--asteroids" aria-hidden="true">
    {ASTEROIDS.map((a, i) => (
      <svg
        key={i}
        className="asteroid-rock"
        width={a.w}
        height={a.h}
        viewBox={`0 0 ${a.w} ${a.h}`}
        style={{
          top:              a.top,
          left:             a.left,
          opacity:          a.op,
          animationDuration:`${a.dur}s`,
          animationDelay:   `${-a.delay}s`,
        }}
      >
        <path d={asteroidPath(a.w, a.h)} />
      </svg>
    ))}
  </div>
);

/* ── Main export ── */
export const CosmicBackground = () => (
  <div className="cosmic-bg" aria-hidden="true">
    <StarCanvas />
    <AuroraZone />
    <AsteroidBelt />
  </div>
);