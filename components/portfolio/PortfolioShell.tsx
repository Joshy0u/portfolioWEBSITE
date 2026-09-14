"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, GitFork, Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FidgetCanvas from "@/components/fidget/FidgetCanvas";
import SkillBadgeField from "@/components/fidget/SkillBadgeField";
import TactileControls from "@/components/fidget/TactileControls";
import { playClick } from "@/lib/fidget-audio";
import {
  cubeFaces,
  domains,
  resume,
  type CubeFace,
  type DomainId,
} from "@/lib/resume";

function burst() {
  void confetti({
    particleCount: 48,
    spread: 62,
    origin: { y: 0.7 },
    colors: ["#e5e5e5", "#9a9a9a", "#1e1e1e"],
    disableForReducedMotion: true,
  });
}

function FaceCopy({ face }: { face: CubeFace }) {
  if (face === "about") {
    return (
      <>
        {resume.about.map((p) => (
          <p key={p} className="text-sm leading-6 text-[#cfcfcf]">
            {p}
          </p>
        ))}
      </>
    );
  }
  if (face === "skills") {
    return (
      <div className="grid gap-3">
        {resume.skillGroups.map((g) => (
          <div key={g.title}>
            <p className="font-mono text-[10px] tracking-[0.22em] text-[#8a8a8a] uppercase">
              {g.title}
            </p>
            <p className="text-sm text-[#e5e5e5]">{g.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    );
  }
  if (face === "projects") {
    return (
      <div className="grid gap-3">
        {resume.projects.map((p) => (
          <div key={p.title} className="border-l border-[#e5e5e5]/30 pl-3">
            <p className="text-sm font-medium">{p.title}</p>
            <p className="mt-1 text-xs leading-5 text-[#bdbdbd]">{p.blurb}</p>
            <p className="mt-1 font-mono text-[10px] tracking-wider text-[#8a8a8a]">
              {p.stack.join(" / ")}
            </p>
          </div>
        ))}
      </div>
    );
  }
  if (face === "experience") {
    return (
      <div className="grid gap-3">
        {resume.experience.map((e) => (
          <div key={e.org}>
            <p className="text-sm font-medium">
              {e.title}
              <span className="text-[#8a8a8a]"> · {e.org}</span>
            </p>
            <p className="mt-1 text-xs leading-5 text-[#bdbdbd]">{e.blurb}</p>
          </div>
        ))}
      </div>
    );
  }
  if (face === "fidget") {
    return (
      <p className="text-sm leading-6 text-[#cfcfcf]">
        Drag the cube. Toss it. Mash the clicker. Fling the skill tags. Damping
        knob bleeds spin energy. Mute if the ticks get loud. This panel is the
        fidget face — no resume, just tactile noise.
      </p>
    );
  }
  return (
    <div className="grid gap-2 text-sm">
      <a className="flex items-center gap-2 hover:underline" href={resume.contact.github}>
        <GitFork className="h-4 w-4" /> {resume.contact.github.replace("https://", "")}
      </a>
      <a className="flex items-center gap-2 hover:underline" href={resume.contact.linkedin}>
        <AtSign className="h-4 w-4" /> {resume.contact.linkedin.replace("https://", "")}
      </a>
      <a className="flex items-center gap-2 hover:underline" href={`mailto:${resume.contact.email}`}>
        <Mail className="h-4 w-4" /> {resume.contact.email}
      </a>
      <p className="mt-2 font-mono text-[10px] tracking-widest text-[#8a8a8a] uppercase">
        Placeholders — swap in real handles
      </p>
    </div>
  );
}

export default function PortfolioShell() {
  const [face, setFace] = useState<CubeFace>("about");
  const [activeDomain, setActiveDomain] = useState<DomainId | null>(null);
  const [muted, setMuted] = useState(false);
  const [damping, setDamping] = useState(0.45);
  const [clicks, setClicks] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const meta = useMemo(() => cubeFaces.find((f) => f.id === face)!, [face]);
  const domain = useMemo(
    () => domains.find((d) => d.id === activeDomain) ?? null,
    [activeDomain],
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#121212] text-[#e5e5e5]">
      <FidgetCanvas
        damping={damping}
        reducedMotion={reducedMotion}
        muted={muted}
        onSelectFace={(next) => {
          setFace(next);
          setActiveDomain(null);
          if (next === "fidget") burst();
        }}
      />
      <div className="grid-veil pointer-events-none absolute inset-0 z-[1] opacity-70" />
      <div className="scanline absolute inset-0 z-[2] opacity-30" />

      <SkillBadgeField muted={muted} reducedMotion={reducedMotion} />

      <header className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto max-w-xl">
          <p className="font-mono text-[10px] tracking-[0.35em] text-[#8a8a8a] uppercase">
            Personal unit
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-4xl">
            {resume.name}
          </h1>
          <p className="mt-1 max-w-md text-xs leading-5 text-[#bdbdbd] sm:text-sm">
            {resume.headline}
            <br />
            {resume.role}
          </p>
        </div>
        <p className="pointer-events-none hidden font-mono text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase sm:block">
          Drag · Toss · Click
        </p>
      </header>

      <aside className="absolute top-28 right-3 z-20 max-h-[42vh] w-[min(100%-1.5rem,20rem)] overflow-y-auto sm:top-6 sm:right-6 sm:max-h-[70vh]">
        <AnimatePresence mode="wait">
          {domain ? (
            <motion.section
              key={`domain-${domain.id}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="hard-panel p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-mono text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase">
                  {domain.kicker}
                </p>
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#8a8a8a]">
                  NODE {domain.index}
                </span>
              </div>
              <h2 className="mt-1 text-lg tracking-tight">{domain.label}</h2>
              <p className="mt-2 text-sm leading-6 text-[#cfcfcf]">
                {domain.summary}
              </p>
              <ul className="mt-3 grid gap-2">
                {domain.highlights.map((h) => (
                  <li
                    key={h}
                    className="border-l border-[#e5e5e5]/30 pl-3 text-xs leading-5 text-[#bdbdbd]"
                  >
                    {h}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[10px] tracking-wider text-[#8a8a8a]">
                {domain.tags.join(" · ")}
              </p>
            </motion.section>
          ) : (
            <motion.section
              key={face}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="hard-panel p-4"
            >
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase">
                {meta.kicker}
              </p>
              <h2 className="mt-1 text-lg tracking-tight">{meta.label}</h2>
              <div className="mt-3 grid gap-2">
                <FaceCopy face={face} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </aside>

      <div className="absolute right-3 bottom-3 left-3 z-20 flex flex-col gap-3 sm:right-6 sm:bottom-6 sm:left-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-3 overflow-x-auto pb-1 sm:min-w-0 sm:flex-1">
          {domains.map((d) => {
            const active = activeDomain === d.id;
            return (
              <motion.button
                key={d.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                aria-pressed={active}
                onClick={() => {
                  setActiveDomain(d.id);
                  playClick(muted);
                }}
                className={`hard-panel min-w-[15rem] flex-1 p-4 text-left transition-opacity ${
                  active ? "opacity-100" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#8a8a8a] uppercase">
                    Node {d.index}
                  </p>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active ? "bg-[#e5e5e5]" : "bg-[#5a5a5a]"
                    }`}
                    aria-hidden
                  />
                </div>
                <p className="mt-1.5 text-sm font-medium leading-5">{d.label}</p>
              </motion.button>
            );
          })}
        </div>
        <TactileControls
          muted={muted}
          onMutedChange={setMuted}
          damping={damping}
          onDampingChange={setDamping}
          clicks={clicks}
          onClicker={() => {
            playClick(muted);
            setClicks((n) => {
              const next = n + 1;
              if (next % 5 === 0) burst();
              return next;
            });
            setFace("fidget");
            setActiveDomain(null);
          }}
        />
      </div>
    </div>
  );
}
