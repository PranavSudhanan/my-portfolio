"use client";

/**
 * One shared, smoothed tilt signal for every gyro-driven effect on the page.
 *
 * Raw `deviceorientation` readings are noisy, are expressed in whichever way
 * the phone is held, and swap axes when the screen rotates. This normalises all
 * of that into `x` / `y` in -1..1, where 0 is however you happen to be holding
 * the phone right now:
 *   • the screen's rotation is compensated, so tilt always matches what you see
 *   • the neutral pose drifts slowly toward your current hold (no creeping edge)
 *   • a small dead zone swallows hand shake, and readings are low-pass filtered
 *   • subscribers are called at most once per frame, from a single rAF loop
 *     that sleeps as soon as the phone is still
 */

type Listener = (x: number, y: number) => void;

const RANGE = 20; // degrees of tilt for a full-scale swing
const DEAD = 0.05; // ignore the first few % — hand shake, not intent
const DRIFT = 0.006; // how quickly "neutral" follows the way you hold it
const EASE = 0.16; // low-pass on the raw reading

type IOSOrientation = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};
const DOE = () =>
  typeof DeviceOrientationEvent !== "undefined" ? (DeviceOrientationEvent as IOSOrientation) : null;

const listeners = new Set<Listener>();
const liveListeners = new Set<(live: boolean) => void>();
let attached = false;
let live = false;
let raf = 0;
let tx = 0;
let ty = 0;
let x = 0;
let y = 0;
let baseX: number | null = null;
let baseY = 0;

const clamp1 = (v: number) => (v > 1 ? 1 : v < -1 ? -1 : v);
/** −1..1 with a dead zone in the middle, rescaled so the edges still reach 1 */
const shape = (v: number) => {
  const s = clamp1(v);
  const a = Math.abs(s);
  return a < DEAD ? 0 : Math.sign(s) * ((a - DEAD) / (1 - DEAD));
};

const screenAngle = () =>
  typeof screen !== "undefined" && screen.orientation
    ? screen.orientation.angle
    : ((window as { orientation?: number }).orientation ?? 0);

function onOrient(e: DeviceOrientationEvent) {
  if (e.beta == null || e.gamma == null) return;
  if (!live) {
    live = true;
    liveListeners.forEach((fn) => fn(true));
  }
  // map the phone's axes onto the axes of what's on screen
  let hx: number;
  let hy: number;
  switch (screenAngle()) {
    case 90:
      hx = e.beta;
      hy = -e.gamma;
      break;
    case 180:
      hx = -e.gamma;
      hy = -e.beta;
      break;
    case 270:
    case -90:
      hx = -e.beta;
      hy = e.gamma;
      break;
    default:
      hx = e.gamma;
      hy = e.beta;
  }
  if (baseX == null) {
    baseX = hx;
    baseY = hy;
  }
  baseX += (hx - baseX) * DRIFT;
  baseY += (hy - baseY) * DRIFT;

  const nx = shape((hx - baseX) / RANGE);
  const ny = shape((hy - baseY) / RANGE);
  if (Math.abs(nx - tx) < 0.002 && Math.abs(ny - ty) < 0.002) return;
  tx = nx;
  ty = ny;
  if (!raf) raf = requestAnimationFrame(frame);
}

function frame() {
  x += (tx - x) * EASE;
  y += (ty - y) * EASE;
  listeners.forEach((fn) => fn(x, y));
  raf = Math.abs(tx - x) < 0.001 && Math.abs(ty - y) < 0.001 ? 0 : requestAnimationFrame(frame);
}

function recenter() {
  baseX = null;
}

function attach() {
  if (attached || !DOE()) return;
  attached = true;
  window.addEventListener("deviceorientation", onOrient, { passive: true });
  window.addEventListener("orientationchange", recenter);
}
function detach() {
  if (!attached) return;
  attached = false;
  cancelAnimationFrame(raf);
  raf = 0;
  window.removeEventListener("deviceorientation", onOrient);
  window.removeEventListener("orientationchange", recenter);
}

export const gyro = {
  /** the device can report orientation at all */
  supported: () => !!DOE(),
  /** iOS: motion access has to be asked for from inside a tap */
  needsPermission: () => typeof DOE()?.requestPermission === "function",
  /** readings are actually arriving */
  isLive: () => live,
  /** ask iOS for motion access — must be called from a user gesture */
  async request() {
    try {
      const granted = (await DOE()?.requestPermission?.()) === "granted";
      if (granted) attach();
      return granted;
    } catch {
      return false;
    }
  },
  /** forget the current neutral pose (e.g. after changing section) */
  recenter,
  subscribe(fn: Listener) {
    listeners.add(fn);
    attach();
    fn(x, y);
    return () => {
      listeners.delete(fn);
      if (!listeners.size) detach();
    };
  },
  /** notified once the first reading lands (i.e. the sensor really works) */
  onLive(fn: (live: boolean) => void) {
    liveListeners.add(fn);
    return () => liveListeners.delete(fn);
  },
};
