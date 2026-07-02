export function isPresent<T>(t: T | undefined | null | void): t is T {
  return typeof t !== 'undefined' && t !== null;
}
