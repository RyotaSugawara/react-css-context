/**
 * isServer
 * @return {boolean}
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}
