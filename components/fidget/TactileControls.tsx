"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useRef } from "react";
import { playClick, playToggle } from "@/lib/fidget-audio";

type Props = {
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  damping: number;
  onDampingChange: (value: number) => void;
  clicks: number;
  onClicker: () => void;
};

export default function TactileControls({
  muted,
  onMutedChange,
  damping,
  onDampingChange,
  clicks,
  onClicker,
}: Props) {
  const knob = useRef<HTMLDivElement>(null);
  const angle = 40 + damping * 280;

  return (
    <div className="hard-panel flex flex-col gap-4 p-3 sm:p-4">
      <p className="font-mono text-[10px] tracking-[0.28em] text-[#8a8a8a] uppercase">
        Tactile
      </p>

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-widest text-[#8a8a8a] uppercase">
          Audio
        </span>
        <button
          type="button"
          aria-pressed={!muted}
          onClick={() => {
            playToggle(false, muted);
            onMutedChange(!muted);
          }}
          className="relative h-7 w-12 border border-[#e5e5e5]/30 bg-[#121212]"
        >
          <span
            className="absolute top-0.5 h-6 w-6 bg-[#e5e5e5] transition-transform duration-150"
            style={{ transform: muted ? "translateX(2px)" : "translateX(22px)" }}
          />
          <span className="sr-only">Mute</span>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#121212]">
            {muted ? (
              <VolumeX className="h-3 w-3 opacity-0" />
            ) : (
              <Volume2 className="h-3 w-3 opacity-0" />
            )}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div
          ref={knob}
          className="relative h-16 w-16 shrink-0 cursor-ew-resize rounded-full border border-[#e5e5e5]/40 bg-[#121212] shadow-inner"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const startX = e.clientX;
            const start = damping;
            const move = (ev: PointerEvent) => {
              const next = Math.min(1, Math.max(0, start + (ev.clientX - startX) / 160));
              onDampingChange(next);
            };
            const up = () => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
            playClick(muted);
          }}
        >
          <span
            className="absolute top-1 left-1/2 h-3 w-0.5 origin-bottom bg-[#e5e5e5]"
            style={{ transform: `translateX(-50%) rotate(${angle - 140}deg) translateY(4px)` }}
          />
          <span className="absolute inset-[18%] rounded-full border border-[#2a2a2a]" />
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-widest text-[#8a8a8a] uppercase">
            Damp
          </p>
          <p className="font-mono text-sm text-[#e5e5e5]">{Math.round(damping * 100)}</p>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92, y: 2 }}
        onClick={onClicker}
        className="h-16 border border-[#e5e5e5] bg-[#e5e5e5] font-mono text-xs tracking-[0.22em] text-[#121212] uppercase shadow-[4px_4px_0_#000] hover:bg-white"
      >
        Clicker · {clicks}
      </motion.button>
    </div>
  );
}
