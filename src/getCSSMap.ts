import {
  CSSFetchState,
  CSSMap,
} from './CSSContext';

/**
 * Get CSS-Map from head tag.
 * Can only use in browser.
 */
export function getCSSMap(): CSSMap {
  const cssMap: CSSMap = new Map();
  const linkElements = document.querySelectorAll<HTMLLinkElement>('link[data-react-css-context]');
  const nodeList: HTMLLinkElement[] = Array.prototype.slice.call(linkElements, 0);
  nodeList.forEach((link) => {
    if (link && link.href) {
      cssMap.set(link.href, CSSFetchState.Success);
    }
  });
  return cssMap;
}
