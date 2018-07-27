/**
 * isServer
 * @return {boolean}
 */
export function isServer() {
  return typeof window === 'undefined';
}
