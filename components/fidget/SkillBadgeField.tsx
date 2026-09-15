"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { playThrow, playTick } from "@/lib/fidget-audio";
import { resume } from "@/lib/resume";

type Body = {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  dragging: boolean;
};

// Keep badges out of the header (name + description) so they never sit under
// the z-20 header where their clicks would be swallowed.
function topInset(height: number) {
  return Math.min(240, Math.max(150, Math.round(height * 0.3)));
}

const MAX_SPEED = 900; // px/s — clamps flings so bodies can't teleport across the screen

function clampSpeed(b: Body) {
  const speed = Math.hypot(b.vx, b.vy);
  if (speed > MAX_SPEED) {
    const k = MAX_SPEED / speed;
    b.vx *= k;
    b.vy *= k;
  }
}

function seedBodies(width: number, height: number): Body[] {
  const top = topInset(height);
  const perRow = width < 640 ? 2 : 3;
  return resume.featuredBadges
    .map((label, i) => {
      const w = 108 + label.length * 2;
      const h = 36;
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      return {
        id: label,
        label,
        x: 24 + col * 150 + (i % 2) * 18,
        y: top + 16 + row * 56,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 30,
        w,
        h,
        dragging: false,
      };
    })
    .map((b) => ({
      ...b,
      x: Math.min(Math.max(8, b.x), Math.max(8, width - b.w - 8)),
      y: Math.min(Math.max(top, b.y), Math.max(top, height - b.h - 8)),
    }));
}

type Props = {
  muted: boolean;
  reducedMotion: boolean;
};

export default function SkillBadgeField({ muted, reducedMotion }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const nodes = useRef<Map<string, HTMLButtonElement>>(new Map());
  const drag = useRef<{ id: string; lx: number; ly: number; t: number } | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    bodies.current = seedBodies(rect.width, rect.height);
    bodies.current.forEach((b) => {
      const n = nodes.current.get(b.id);
      if (n) n.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    });

    const step = () => {
      const box = el.getBoundingClientRect();
      const top = topInset(box.height);
      const list = bodies.current;
      const dt = 1 / 60;
      const rest = 0.82;

      if (!reducedMotion) {
        for (const b of list) {
          if (b.dragging) continue;
          clampSpeed(b);
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.vx *= 0.992;
          b.vy *= 0.992;
          if (b.x < 8) {
            b.x = 8;
            b.vx = Math.abs(b.vx) * rest;
          } else if (b.x + b.w > box.width - 8) {
            b.x = box.width - 8 - b.w;
            b.vx = -Math.abs(b.vx) * rest;
          }
          if (b.y < top) {
            b.y = top;
            b.vy = Math.abs(b.vy) * rest;
          } else if (b.y + b.h > box.height - 8) {
            b.y = box.height - 8 - b.h;
            b.vy = -Math.abs(b.vy) * rest;
          }
        }

        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];
            if (a.dragging || b.dragging) continue;
            const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
            const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
            if (ox > 0 && oy > 0) {
              if (ox < oy) {
                const s = a.x < b.x ? -1 : 1;
                a.x += (ox / 2) * s;
                b.x -= (ox / 2) * s;
                const va = a.vx;
                a.vx = b.vx * rest;
                b.vx = va * rest;
              } else {
                const s = a.y < b.y ? -1 : 1;
                a.y += (oy / 2) * s;
                b.y -= (oy / 2) * s;
                const va = a.vy;
                a.vy = b.vy * rest;
                b.vy = va * rest;
              }
            }
          }
        }
      }

      for (const b of list) {
        const n = nodes.current.get(b.id);
        if (n) n.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [reducedMotion]);

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {resume.featuredBadges.map((label) => (
        <motion.button
          key={label}
          ref={(node) => {
            if (node) nodes.current.set(label, node);
            else nodes.current.delete(label);
          }}
          type="button"
          className="pointer-events-auto absolute top-0 left-0 cursor-grab touch-none border border-[#e5e5e5]/40 bg-[#1e1e1e] px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-[#e5e5e5] uppercase shadow-[3px_3px_0_#000] hover:bg-[#2a2a2a] active:cursor-grabbing"
          whileTap={{ scale: 0.94 }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const body = bodies.current.find((b) => b.id === label);
            if (!body) return;
            body.dragging = true;
            body.vx = 0;
            body.vy = 0;
            drag.current = { id: label, lx: e.clientX, ly: e.clientY, t: performance.now() };
            playTick(muted);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || d.id !== label) return;
            const body = bodies.current.find((b) => b.id === label);
            if (!body) return;
            const now = performance.now();
            // Floor dt higher (30ms) so a single fast sample can't explode the
            // velocity, then smooth it and clamp so releases never teleport.
            const dt = Math.max(30, now - d.t) / 1000;
            const dx = e.clientX - d.lx;
            const dy = e.clientY - d.ly;
            body.x += dx;
            body.y += dy;
            const sampleVx = dx / dt;
            const sampleVy = dy / dt;
            body.vx = body.vx * 0.4 + sampleVx * 0.6;
            body.vy = body.vy * 0.4 + sampleVy * 0.6;
            clampSpeed(body);
            d.lx = e.clientX;
            d.ly = e.clientY;
            d.t = now;
          }}
          onPointerUp={() => {
            const d = drag.current;
            const body = bodies.current.find((b) => b.id === label);
            if (body) {
              body.dragging = false;
              // If the pointer was held still before release, don't fling.
              if (!d || performance.now() - d.t > 80) {
                body.vx = 0;
                body.vy = 0;
              } else {
                clampSpeed(body);
                if (Math.hypot(body.vx, body.vy) > 180) playThrow(muted);
              }
            }
            drag.current = null;
          }}
        >
          {label}
        </motion.button>
      ))}
    </div>
  );
}
