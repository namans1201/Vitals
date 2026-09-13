/** Rest-timer audio/haptic cues - pure Web Audio oscillator tones, no audio
 * files to ship. Every call is a no-op on the server or if the browser
 * blocks autoplay before a user gesture has unlocked the AudioContext. */

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.25) {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playCountdownBeep() {
  playTone(660, 0.1, "square", 0.15);
}

export function playRestOver() {
  playTone(440, 0.1, "sine", 0.2);
  setTimeout(() => playTone(660, 0.1, "sine", 0.2), 120);
  setTimeout(() => playTone(880, 0.2, "sine", 0.25), 240);
}

export function playPersonalRecord() {
  [0, 100, 200, 300, 400].forEach((delay, i) => {
    setTimeout(() => playTone(523 + i * 65, 0.15, "sine", 0.2), delay);
  });
}

export function vibrate(pattern: number | number[] = 50) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
