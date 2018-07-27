import * as React from 'react';
import { CSSMap } from './CSSContext';

/**
 * CSS-Map to HTMLLinkElement string.
 * @param {CSSMap} cssMap
 * @return {string}
 */
export function toTagString(cssMap: CSSMap): string {
  let tagString: string = '';
  for (const [href] of cssMap) {
    if (href) {
      tagString += `<link href="${href}" rel="stylesheet" data-react-css-context="true"/>`;
    }
  }
  return tagString;
}

/**
 * CSS-Map to ReactElement.
 * @param {CSSMap} cssMap
 * @return {any}
 */
export function toTagComponent(cssMap: CSSMap): React.ReactElement<any> {
  const hrefs: string[] = [];
  for (const [href] of cssMap) {
    if (href) {
      hrefs.push(href);
    }
  }
  return (
    <>
      {hrefs.map((href) => (
        <link
          key={href}
          href={href}
          rel="stylesheet"
          data-react-css-context={true}
        />
      ))}
    </>
  );
}
