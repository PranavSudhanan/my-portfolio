/** A tiny tap of vibration on touch devices that support it (Android; iOS
 *  ignores the API). Keeps mobile interactions feeling physical. */
export function haptic(ms = 8) {
  try {
    // browsers refuse (and log) vibration before the first user tap
    const activated = navigator.userActivation?.hasBeenActive ?? true;
    if (activated && window.matchMedia("(pointer: coarse)").matches) navigator.vibrate?.(ms);
  } catch {
    /* unsupported — silently skip */
  }
}
