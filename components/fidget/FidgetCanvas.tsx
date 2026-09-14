"use client";

import dynamic from "next/dynamic";
import type { CubeFace } from "@/lib/resume";

const FidgetCubeScene = dynamic(() => import("./FidgetCubeScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#121212] font-mono text-xs tracking-[0.3em] text-[#8a8a8a]">
      SPINNING UP
    </div>
  ),
});

type Props = {
  damping: number;
  reducedMotion: boolean;
  muted: boolean;
  onSelectFace: (face: CubeFace) => void;
};

export default function FidgetCanvas(props: Props) {
  return (
    <div className="absolute inset-0">
      <FidgetCubeScene {...props} />
    </div>
  );
}
