import test from 'ava';
import * as React from 'react';
import {
  renderToStaticMarkup,
  renderToStaticNodeStream,
} from 'react-dom/server';
import {
  CSSCollector,
  CSSFetchState,
  CSSProvider,
  toTagComponent,
  toTagString,
} from './index';
import { isServer } from './utils/isServer';

const App: React.SFC = ({ children }) => {
  return (
    <div>{children}</div>
  );
};

const CSS_FILE_1 = 'https://necolas.github.io/normalize.css/8.0.0/normalize.css';
const CSS_FILE_2 = 'https://necolas.github.io/normalize.css/7.0.0/normalize.css';
const CSS_FILE_3 = 'https://necolas.github.io/normalize.css/6.0.0/normalize.css';

test('isServer', (t) => {
  t.true(isServer());
});

test('Server Side Rendering', async (t) => {
  const cssMap = new Map();

  const readableStream = renderToStaticNodeStream(
    <CSSProvider cssMap={cssMap}>
      <App>
        <CSSCollector hrefs={[CSS_FILE_1, CSS_FILE_2]}>
          ok
        </CSSCollector>
        <CSSCollector hrefs={[CSS_FILE_3]}>
          <p>good</p>
        </CSSCollector>
      </App>
    </CSSProvider>,
  );

  const result = readableStream.read().toString();

  t.is(result, '<div>ok<p>good</p></div>');
  t.is(cssMap.get(CSS_FILE_1), CSSFetchState.Success);
  t.is(cssMap.get(CSS_FILE_2), CSSFetchState.Success);
  t.is(cssMap.get(CSS_FILE_3), CSSFetchState.Success);

  const cssTagString = toTagString(cssMap);
  const cssTagComponent = toTagComponent(cssMap);

  const cssTagComponentString = renderToStaticMarkup(cssTagComponent);

  t.is(cssTagString, cssTagComponentString);
});

test('CSSProvider can only receive single element.', (t) => {

  try {
    const cssMap = new Map();
    renderToStaticMarkup(
      <CSSProvider cssMap={cssMap}>
        <App>
          <CSSCollector hrefs={[CSS_FILE_1, CSS_FILE_2]}>
            ok
          </CSSCollector>
          <CSSCollector hrefs={[CSS_FILE_3]}>
            <p>good</p>
          </CSSCollector>
        </App>
        <App />
      </CSSProvider>,
    );
    t.fail();
  } catch (e) {
    t.pass();
  }
});
