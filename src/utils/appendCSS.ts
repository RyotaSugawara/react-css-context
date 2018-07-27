/**
 * append css’s link element to head.
 * @param {string} href
 * @param {() => void} onLoad
 * @param {() => void} onError
 */
export function appendCSS(href: string, onLoad: () => void, onError: () => void): void {
  const linkElement = document.createElement('link');
  linkElement.href = href;
  linkElement.rel = 'stylesheet';
  linkElement.dataset.reactCssContext = 'true';
  linkElement.onload = () => {
    onLoad();
  };
  linkElement.onerror = () => {
    onError();
  };
  document.head.appendChild(linkElement);
}
