import * as React from 'react';
import {
  CSSContext,
  CSSFetchState,
  CSSMap,
  Provider,
} from './CSSContext';
import { appendCSS } from './utils/appendCSS';
import { isServer } from './utils/isServer';

interface CSSProviderProps {
  cssMap: CSSMap;
}

export class CSSProvider extends React.Component<CSSProviderProps, CSSContext> {

  /**
   * @constructor
   * @param {Readonly<CSSProviderProps>} props
   */
  constructor(props: Readonly<CSSProviderProps>) {
    super(props);
    this.state = {
      cssMap: props.cssMap,
      multiUpdate: this.multiUpdate,
      update: this.update,
    };
  }

  /**
   * update CSS-Map in CSSContext.
   * @param {string} href
   */
  public update = (href: string) => {
    if (isServer()) {
      // if SSR
      // CSSCollector always pass the CSSLoadingState in SSR phase.
      // Then override the CSS-Map which is defined before server side rendering.
      this.props.cssMap.set(href, CSSFetchState.Success);
    } else {
      // if CSR
      // CSSCollector state is default Loading. (when css is not append yet.)
      // Append the link element with css.
      // When css file’s have been loaded, CSSCollector state will change to Success.
      // or if error, CSSCollector state will be Error.
      if (this.state.cssMap.get(href) !== CSSFetchState.Success) {
        appendCSS(href, () => {
          this.updateCSSMap(href, CSSFetchState.Success);
        }, () => {
          this.updateCSSMap(href, CSSFetchState.Error);
        });
      }
    }
  }

  /**
   * multiple update CSS-Map in CSSContext.
   * @param {string[]} hrefs
   */
  public multiUpdate = (hrefs: string[]) => {
    hrefs.forEach((href) => {
      this.update(href);
    });
  }

  /**
   * set new CSS-Map state.
   * @param {string} href
   * @param {CSSFetchState} state
   */
  public updateCSSMap(href: string, state: CSSFetchState): void {
    // create new CSS-Map to avoid override refs.
    const cssMap = new Map(this.state.cssMap.entries());
    cssMap.set(href, state);
    this.setState({
      cssMap,
    });
  }

  public render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    );
  }
}
