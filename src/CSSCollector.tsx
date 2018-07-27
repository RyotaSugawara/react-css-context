import * as React from 'react';
import {
  Consumer,
  CSSContext,
  CSSFetchState,
} from './CSSContext';
import { isServer } from './utils/isServer';

interface CSSCollectorProps {
  hrefs: string[];
}

export function createCSSCollector(
  renderLoading?: () => React.ReactElement<any>,
  renderError?: () => React.ReactElement<any>,
  displayName: string = 'CSSCollector',
) {
  const ScopedCSSCollector: React.SFC<CSSCollectorProps> = (props) => {
    return (
      <Consumer>
        {(context: CSSContext) => (
          <CSSCollectorLifecycle
            context={context}
            renderError={renderError}
            renderLoading={renderLoading}
            {...props}
          />
        )}
      </Consumer>
    );
  };
  ScopedCSSCollector.displayName = displayName;
  return ScopedCSSCollector;
}

export const CSSCollector: React.SFC<CSSCollectorProps> = createCSSCollector();

interface CSSCollectorLifecycleProps extends CSSCollectorProps {
  context: CSSContext;
  renderError?(): React.ReactElement<any>;
  renderLoading?(): React.ReactElement<any>;
}

class CSSCollectorLifecycle extends React.Component<CSSCollectorLifecycleProps> {
  /**
   * get Fetch State from state array.
   * @param {CSSFetchState[]} states
   * @return {CSSFetchState}
   */
  public static getFetchState(states: CSSFetchState[]): CSSFetchState {
    let isLoading: boolean;
    for (const state of states) {
      // if some error state, return Error.
      if (state === CSSFetchState.Error) {
        return CSSFetchState.Error;
      }

      if (state === CSSFetchState.Loading || !state) {
        isLoading = true;
      }
    }

    if (isLoading) {
      return CSSFetchState.Loading;
    } else {
      return CSSFetchState.Success;
    }
  }

  constructor(props: Readonly<CSSCollectorLifecycleProps>) {
    super(props);
    const {
      context,
      hrefs,
    } = props;

    // When this instance created, access context api.
    context.multiUpdate(hrefs);
  }

  public render() {
    const {
      context,
      hrefs,
    } = this.props;

    const state: CSSFetchState = CSSCollectorLifecycle.getFetchState(hrefs.map((href) => {
      return context.cssMap.get(href);
    }));

    // if SSR, it should be render.
    if (state === CSSFetchState.Success || isServer()) {
      return <>{this.props.children}</>;
    }

    if (state === CSSFetchState.Loading || !state) {
      return this.props.renderLoading ? this.props.renderLoading() : null;
    }

    if (state === CSSFetchState.Error) {
      return this.props.renderError ? this.props.renderError() : null;
    }

    return null;
  }
}
