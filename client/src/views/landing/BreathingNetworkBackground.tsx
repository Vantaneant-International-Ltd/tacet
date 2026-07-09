import { useEffect, useRef } from "react";

// The hero constellation (spec: docs/10-design/hifi/fidelity-specs.md §1). A dense
// encircling ring — warm (amber/pink) down the left arc, cool (violet/blue/cyan) down
// the right, lavender throughout — hundreds of nodes with varied size + glow and a fixed
// triangulated edge list. Perpetual calm motion: per-node angular/radial wobble + slow
// twinkle + gentle breathe. prefers-reduced-motion draws one still frame (W4).
export function BreathingNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0, height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = {
      a: number; rf: number; size: number; hub: boolean;
      cr: number; cg: number; cb: number; alpha: number;
      wobA: number; wobR: number; phA: number; phR: number; twPh: number; twSp: number;
    };
    let nodes: Node[] = [];
    let edges: Array<[number, number]> = [];
    const px: number[] = [];
    const py: number[] = [];

    const mix = (a: number[], b: number[], t: number) => [
      a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t,
    ];
    const PINK = [235, 130, 215], AMBER = [246, 168, 96];
    const VIOLET = [150, 120, 242], BLUE = [98, 168, 236];
    const LAV = [176, 158, 240];
    const rnd = (min: number, max: number) => min + Math.random() * (max - min);

    function seed() {
      const area = width * height;
      const cap = width < 700 ? 120 : 340;
      const target = Math.max(90, Math.min(cap, Math.round(area / 6000)));

      nodes = Array.from({ length: target }, () => {
        const a = Math.random() * Math.PI * 2;
        // Radial factor biased outward → dense ring, open centre.
        const rf = 0.52 + Math.pow(Math.random(), 0.5) * 0.74;
        const tx = Math.cos(a) * 0.5 + 0.5; // 0 left → 1 right
        const ty = Math.sin(a) * 0.5 + 0.5; // 0 top → 1 bottom
        const warm = mix(PINK, AMBER, ty);
        const cool = mix(VIOLET, BLUE, ty);
        let c = mix(warm, cool, tx);
        c = mix(c, LAV, 0.22);
        if (Math.random() < 0.18) c = LAV.slice(); // lavender accents
        const hub = Math.random() < 0.08;
        return {
          a, rf,
          size: hub ? rnd(1.7, 3) : rnd(0.4, 1.5),
          hub,
          cr: c[0], cg: c[1], cb: c[2],
          alpha: hub ? rnd(0.75, 0.95) : rnd(0.3, 0.7),
          wobA: rnd(0.006, 0.03), wobR: rnd(0.006, 0.028),
          phA: Math.random() * 6.28, phR: Math.random() * 6.28,
          twPh: Math.random() * 6.28, twSp: rnd(0.25, 0.7),
        };
      });

      // Precompute a fixed edge list: each node → its ~3 nearest neighbours (once).
      const rx = width * 0.46, ry = height * 0.46, cx = width / 2, cy = height / 2;
      const bx = nodes.map((n) => cx + Math.cos(n.a) * rx * n.rf);
      const by = nodes.map((n) => cy + Math.sin(n.a) * ry * n.rf);
      const seen = new Set<string>();
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const d: Array<[number, number]> = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = bx[i] - bx[j], dy = by[i] - by[j];
          d.push([dx * dx + dy * dy, j]);
        }
        d.sort((a, b) => a[0] - b[0]);
        const k = 2 + (Math.random() < 0.5 ? 1 : 0);
        for (let m = 0; m < k; m++) {
          const j = d[m][1];
          const key = i < j ? `${i}_${j}` : `${j}_${i}`;
          if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
        }
      }
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

    let t = 0;
    function frame(still: boolean) {
      const rx = width * 0.46, ry = height * 0.46, cx = width / 2, cy = height / 2;
      const breathe = 1 + Math.sin(t * 0.18) * 0.012;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const a = still ? n.a : n.a + Math.sin(t * 0.3 + n.phA) * n.wobA;
        const rf = (still ? n.rf : n.rf + Math.sin(t * 0.25 + n.phR) * n.wobR) * breathe;
        px[i] = cx + Math.cos(a) * rx * rf;
        py[i] = cy + Math.sin(a) * ry * rf;
      }
      ctx!.clearRect(0, 0, width, height);
      // Edges
      ctx!.lineWidth = 1;
      for (const [i, j] of edges) {
        const r = (nodes[i].cr + nodes[j].cr) / 2;
        const g = (nodes[i].cg + nodes[j].cg) / 2;
        const b = (nodes[i].cb + nodes[j].cb) / 2;
        ctx!.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},0.13)`;
        ctx!.beginPath();
        ctx!.moveTo(px[i], py[i]);
        ctx!.lineTo(px[j], py[j]);
        ctx!.stroke();
      }
      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const tw = still ? 1 : 0.55 + 0.45 * Math.sin(t * n.twSp + n.twPh);
        if (n.hub) { ctx!.shadowBlur = 10; ctx!.shadowColor = `rgba(${n.cr | 0},${n.cg | 0},${n.cb | 0},0.9)`; }
        ctx!.fillStyle = `rgba(${n.cr | 0},${n.cg | 0},${n.cb | 0},${(n.alpha * tw).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(px[i], py[i], n.size, 0, Math.PI * 2);
        ctx!.fill();
        if (n.hub) ctx!.shadowBlur = 0;
      }
    }

    let raf = 0;
    function step() {
      t += 0.016;
      frame(false);
      raf = requestAnimationFrame(step);
    }

    resize();
    if (reduce) frame(true);
    else raf = requestAnimationFrame(step);

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    }
    window.addEventListener("resize", onResize);

    let pointerRaf = 0;
    function onPointer(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(pointerRaf);
      pointerRaf = requestAnimationFrame(() => {
        canvas!.style.transform = `translate(${nx * -8}px, ${ny * -8}px) scale(1.05)`;
      });
    }
    if (!reduce && finePointer) {
      canvas.style.transform = "scale(1.05)";
      canvas.style.willChange = "transform";
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pointerRaf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="lp-hero-canvas" aria-hidden="true" />;
}
