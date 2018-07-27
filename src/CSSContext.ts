import * as React from 'react';

export enum CSSFetchState {
  Loading,
  Success,
  Error,
}

export type CSSMap = Map<string, CSSFetchState>;

export interface CSSContext {
  cssMap: CSSMap;
  multiUpdate(hrefs: string[]): void;
  update(href: string): void;
}

export const {
  Provider,
  Consumer,
} = React.createContext<CSSContext>({
  cssMap: new Map<string, CSSFetchState>(),
  multiUpdate: () => { /* noop */ },
  update: () => { /* noop */ },
});
