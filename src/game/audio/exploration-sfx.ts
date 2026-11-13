/**
 * Exploration sound effects — procedural Web Audio synthesis 
 * for in-game actions: footsteps, distinct pickups, portals, interactions, and crafting.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const C =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (C) audioCtx = new C();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Soft footstep tick — alternates pitch slightly */
export function playFootstep(volume = 0.12, variant = 0): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const baseFreq = variant % 2 === 0 ? 160 : 190;
  osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.045);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.045);
}

/** Metal scrap pickup — metallic clink with harmonic ring */
export function playMetalPickup(volume = 0.3): void {
  const ctx = getCtx();
  if (!ctx) return;
  [1200, 2400].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(volume * (idx === 0 ? 0.4 : 0.2), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  });
}

/** Energy cell pickup — electric zap / plasma pulse */
export function playEnergyPickup(volume = 0.3): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

/** Science sample pickup — crystal resonance shimmer */
export function playSamplePickup(volume = 0.35): void {
  const ctx = getCtx();
  if (!ctx) return;
  const notes = [659.25, 830.61, 1046.5]; // E5 - G#5 - C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const t = ctx.currentTime + i * 0.03;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.4, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  });
}

/** Blueprint fragment pickup — digital telemetry blip */
export function playBlueprintPickup(volume = 0.3): void {
  const ctx = getCtx();
  if (!ctx) return;
  [900, 1350].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    const t = ctx.currentTime + idx * 0.04;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(volume * 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  });
}

/** Rare mineral pickup — deep resonant chime with high overtone */
export function playMineralPickup(volume = 0.4): void {
  const ctx = getCtx();
  if (!ctx) return;
  [523.25, 1046.5, 2093.0].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const t = ctx.currentTime + idx * 0.02;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(volume * (0.4 / (idx + 1)), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

/** Generic / fallback pickup */
export function playPickup(volume = 0.35, type?: string): void {
  if (type === 'metal-scrap') return playMetalPickup(volume);
  if (type === 'energy-cell') return playEnergyPickup(volume);
  if (type === 'science-sample') return playSamplePickup(volume);
  if (type === 'blueprint-fragment') return playBlueprintPickup(volume);
  if (type === 'rare-mineral') return playMineralPickup(volume);

  const ctx = getCtx();
  if (!ctx) return;
  const notes = [880, 1108.73, 1318.51];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const t = ctx.currentTime + i * 0.04;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.5, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

/** Portal transition — swoosh with frequency sweep and filtered noise */
export function playPortal(volume = 0.28): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.35);
  gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
}

/** Crafting forge sound — mechanical ratchet + metallic forge bell */
export function playCraftingSuccess(volume = 0.4): void {
  const ctx = getCtx();
  if (!ctx) return;

  // Mechanical ratchet clicks
  for (let i = 0; i < 4; i++) {
    const click = ctx.createOscillator();
    const cGain = ctx.createGain();
    click.type = 'square';
    const t = ctx.currentTime + i * 0.06;
    click.frequency.setValueAtTime(600 + i * 150, t);
    cGain.gain.setValueAtTime(volume * 0.25, t);
    cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    click.connect(cGain);
    cGain.connect(ctx.destination);
    click.start(t);
    click.stop(t + 0.03);
  }

  // Harmonic forge chord (D4 + A4 + F#5)
  const chord = [293.66, 440.0, 739.99];
  chord.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const t = ctx.currentTime + 0.28;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume * 0.4, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}

/** Interaction prompt appear — subtle blip */
export function playInteractPrompt(volume = 0.1): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.03);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}
