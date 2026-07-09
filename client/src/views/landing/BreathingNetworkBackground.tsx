import { useEffect, useRef } from "react";

// An alive constellation that frames the hero as a ring: dense at the edges, open in
// the centre so the words breathe. Colour follows position — warm (magenta → amber)
// down the left, cool (lavender → blue) down the right — with a few brighter hub nodes.
// A gentle spring holds each node near its home so the composition drifts without
// dissolving. Honours prefers-reduced-motion by drawing a single still frame.
export function BreathingNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = {
      x: number; y: number; // current
      hx: number; hy: number; // home
      vx: number; vy: number;
      r: number;
      cr: number; cg: number; cb: number; // base colour
      alpha: number;
      hub: boolean;
    };
    let nodes: Node[] = [];

    // Blend two rgb triples.
    function mix(a: number[], b: number[], t: number): number[] {
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ];
    }

    // Warm palette (left): magenta at top → amber at bottom. Cool (right): lavender → blue.
    const MAGENTA = [225, 130, 215];
    const AMBER = [240, 158, 96];
    const LAVENDER = [176, 158, 240];
    const BLUE = [110, 150, 235];

    function seed() {
      // Denser than a plain field, but capped for calm + perf.
      const target = Math.min(150, Math.round((width * height) / 13000));
      const cx = width / 2;
      const cy = height * 0.5;
      const rx = width * 0.46;
      const ry = height * 0.46;

      nodes = Array.from({ length: target }, () => {
        const theta = Math.random() * Math.PI * 2;
        // Radial bias pushes most nodes toward the ring edge, leaving the centre open.
        const rad = 0.5 + Math.pow(Math.random(), 0.55) * 0.72; // ~0.5 .. 1.22
        const jx = (Math.random() - 0.5) * width * 0.06;
        const jy = (Math.random() - 0.5) * height * 0.06;
        const x = cx + Math.cos(theta) * rx * rad + jx;
        const y = cy + Math.sin(theta) * ry * rad + jy;

        // Colour by position: horizontal fraction warm(left)→cool(right),
        // vertical fraction top→bottom within each side.
        const t = Math.min(1, Math.max(0, x / width));
        const v = Math.min(1, Math.max(0, y / height));
        const warm = mix(MAGENTA, AMBER, v);
        const cool = mix(LAVENDER, BLUE, v);
        const [cr, cg, cb] = mix(warm, cool, t);

        const hub = Math.random() < 0.08;
        return {
          x, y, hx: x, hy: y,
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          r: hub ? Math.random() * 1.3 + 1.6 : Math.random() * 1.2 + 0.4,
          cr, cg, cb,
          alpha: hub ? 0.85 : Math.random() * 0.4 + 0.35,
          hub,
        };
      });
    }

    function resize() {
      const parent = canvas!.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    const LINK = 130; // px within which two nodes draw a faint link

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.16;
            const r = (a.cr + b.cr) / 2;
            const g = (a.cg + b.cg) / 2;
            const bl = (a.cb + b.cb) / 2;
            ctx!.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${bl | 0}, ${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      for (const n of nodes) {
        if (n.hub) {
          ctx!.shadowBlur = 12;
          ctx!.shadowColor = `rgba(${n.cr | 0}, ${n.cg | 0}, ${n.cb | 0}, 0.9)`;
        }
        ctx!.fillStyle = `rgba(${n.cr | 0}, ${n.cg | 0}, ${n.cb | 0}, ${n.alpha})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
        if (n.hub) ctx!.shadowBlur = 0;
      }
    }

    function step() {
      for (const n of nodes) {
        // Gentle spring toward home keeps the ring composed while it breathes.
        n.vx += (n.hx - n.x) * 0.0008;
        n.vy += (n.hy - n.y) * 0.0008;
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx;
        n.y += n.vy;
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    let raf = 0;
    resize();
    if (reduce) {
      draw(); // one still, calm frame — no motion
    } else {
      raf = requestAnimationFrame(step);
    }

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="lp-hero-canvas" aria-hidden="true" />;
}
