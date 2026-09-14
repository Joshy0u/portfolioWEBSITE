let audioCtx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  audioCtx ??= new AC();
  return audioCtx;
}

export function resumeAudio(): void {
  const ctx = context();
  if (ctx?.state === "suspended") void ctx.resume();
}

function blip(frequency: number, duration: number, type: OscillatorType, gain: number) {
  const ctx = context();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  amp.gain.value = gain;
  osc.connect(amp);
  amp.connect(ctx.destination);
  const now = ctx.currentTime;
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

export function playTick(muted: boolean) {
  if (muted) return;
  resumeAudio();
  blip(210 + Math.random() * 40, 0.05, "square", 0.035);
}

export function playClick(muted: boolean) {
  if (muted) return;
  resumeAudio();
  blip(140, 0.07, "triangle", 0.045);
  blip(320, 0.04, "square", 0.02);
}

export function playToggle(muted: boolean, on: boolean) {
  if (muted) return;
  resumeAudio();
  blip(on ? 420 : 180, 0.08, "sine", 0.04);
}

export function playThrow(muted: boolean) {
  if (muted) return;
  resumeAudio();
  blip(90 + Math.random() * 50, 0.09, "sawtooth", 0.02);
}
