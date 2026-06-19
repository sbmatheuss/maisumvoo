"use client";

import { useEffect, useRef } from "react";
import styles from "./GlobeLoader.module.css";

interface GlobeLoaderProps {
  show: boolean;
  message?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line
    d3: any;
    // eslint-disable-next-line
    topojson: any;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

export default function GlobeLoader({
  show,
  message = "Carregando...",
}: GlobeLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!show || !canvasRef.current) return;

    let cancelled = false;

    Promise.all([
      loadScript("https://unpkg.com/d3@7.9.0/dist/d3.min.js"),
      loadScript(
        "https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js"
      ),
    ]).then(() => {
      if (cancelled || !canvasRef.current) return;

      const d3 = window.d3;
      const topojson = window.topojson;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const SIZE = 200;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = SIZE * DPR;
      canvas.height = SIZE * DPR;
      ctx.scale(DPR, DPR);

      const GOLD = "#C8A96E";

      const projection = d3
        .geoOrthographic()
        .scale(SIZE / 2 - 6)
        .translate([SIZE / 2, SIZE / 2])
        .clipAngle(90);

      const path = d3.geoPath(projection, ctx);
      const graticule = d3.geoGraticule10();

      // eslint-disable-next-line
      let land: any = null;
      // eslint-disable-next-line
      let borders: any = null;

      function draw() {
        ctx!.clearRect(0, 0, SIZE, SIZE);

        // sphere fill — subtle gold tint
        ctx!.beginPath();
        path({ type: "Sphere" });
        ctx!.fillStyle = "rgba(200,169,110,0.05)";
        ctx!.fill();

        // graticule
        ctx!.beginPath();
        path(graticule);
        ctx!.lineWidth = 0.5;
        ctx!.strokeStyle = "rgba(200,169,110,0.2)";
        ctx!.stroke();

        // land
        if (land) {
          ctx!.beginPath();
          path(land);
          ctx!.fillStyle = GOLD;
          ctx!.fill();
        }

        // country borders (knock out with bg color)
        if (borders) {
          ctx!.beginPath();
          path(borders);
          ctx!.lineWidth = 0.6;
          ctx!.strokeStyle = "rgba(8,8,8,0.7)";
          ctx!.stroke();
        }

        // sphere outline
        ctx!.beginPath();
        path({ type: "Sphere" });
        ctx!.lineWidth = 1;
        ctx!.strokeStyle = "rgba(200,169,110,0.45)";
        ctx!.stroke();
      }

      let rotation = 0;
      let last = performance.now();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function tick(now: number) {
        if (cancelled) return;
        const dt = now - last;
        last = now;
        rotation += dt * 0.024;
        projection.rotate([rotation, -12, 0]);
        draw();
        if (!reduce) rafRef.current = requestAnimationFrame(tick);
      }

      // draw placeholder immediately
      projection.rotate([0, -12, 0]);
      draw();

      fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
        .then((r) => r.json())
        .then((topo) => {
          if (cancelled) return;
          land = topojson.feature(topo, topo.objects.countries);
          borders = topojson.mesh(
            topo,
            topo.objects.countries,
            // eslint-disable-next-line
            (a: any, b: any) => a !== b
          );
          if (reduce) {
            projection.rotate([rotation, -12, 0]);
            draw();
          } else {
            last = performance.now();
            rafRef.current = requestAnimationFrame(tick);
          }
        })
        .catch(() => {
          // keep spinning even without atlas data
          if (!cancelled && !reduce) {
            last = performance.now();
            rafRef.current = requestAnimationFrame(tick);
          }
        });
    });

    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.overlay} role="status" aria-label="Carregando">
      <div className={styles.loader}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.whirl} />
        <div className={styles.mote} />
        <div className={`${styles.mote} ${styles.m2}`} />
        <div className={`${styles.mote} ${styles.m3}`} />
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
