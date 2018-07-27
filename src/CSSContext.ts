import * as React from 'react';

/**
 * CSS Fetching Status
 * @enum
 */
export enum CSSFetchState {
  Loading,
  Success,
  Error,
}

/**
 * CSS Map Type
 */
export type CSSMap = Map<string, CSSFetchState>;

/**
 * CSS Context interface
 */
export interface CSSContext {
  cssMap: CSSMap;
  multiUpdate(hrefs: string[]): void;
  update(href: string): void;
}

/**
 * CSS Context
 */
export const {
  Provider,
  Consumer,
} = React.createContext<CSSContext>({
  cssMap: new Map<string, CSSFetchState>(),
  multiUpdate: () => { /* noop */ },
  update: () => { /* noop */ },
});
