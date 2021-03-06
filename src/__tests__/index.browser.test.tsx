import test from 'ava';
import * as React from 'react';
import { render } from 'react-dom';
import '../../test/helpers/setup-browser-env.js';
import {
  createCSSCollector,
  CSSCollector,
  CSSFetchState,
  CSSMap,
  CSSProvider,
  getCSSMap,
  toTagString,
} from '../index';
import { appendCSS } from '../utils/appendCSS';
import { isServer } from '../utils/isServer';

const App: React.SFC = ({ children }) => {
  return (
    <div>{children}</div>
  );
};

const CSS_FILE_1 = 'https://necolas.github.io/normalize.css/8.0.0/normalize.css';
const CSS_FILE_2 = 'https://necolas.github.io/normalize.css/7.0.0/normalize.css';
const CSS_FILE_3 = 'https://necolas.github.io/normalize.css/6.0.0/normalize.css';

test('isServer', (t) => {
  t.false(isServer());
});

test('appendCSS', (t) => {
  t.plan(2);
  appendCSS(CSS_FILE_1, () => {
    t.pass();
  }, () => {
    t.pass();
  });
  const linkElement = document.head.querySelector<HTMLLinkElement>('link[data-react-css-context]');
  // force fire onload events
  const load = new Event('load');
  const error = new Event('error');
  linkElement.dispatchEvent(load);
  linkElement.dispatchEvent(error);
});

test('Client Side Rendering', (t) => {
  // set default head tag.
  const defaultCSSMap: CSSMap = new Map();
  defaultCSSMap.set(CSS_FILE_1, CSSFetchState.Success);
  document.head.innerHTML = toTagString(defaultCSSMap);

  const cssMap = getCSSMap();
  t.is(cssMap.get(CSS_FILE_1), CSSFetchState.Success);
  t.is(cssMap.get(CSS_FILE_2), undefined);
  t.is(cssMap.get(CSS_FILE_3), undefined);

  const CSSCollector1 = createCSSCollector(
    () => <span>loading</span>,
  );

  const CSSCollector2 = createCSSCollector(
    null,
    () => <span>error</span>,
  );

  document.body.innerHTML = '<div id="main"></div>';
  render(
    <CSSProvider cssMap={cssMap}>
      <App>
        <div id="test_1">
          <CSSCollector hrefs={[CSS_FILE_1]}>
            ok
          </CSSCollector>
        </div>
        <div id="test_2">
          <CSSCollector1 hrefs={[CSS_FILE_2]}>
            ok
          </CSSCollector1>
        </div>
        <div id="test_3">
          <CSSCollector2 hrefs={[CSS_FILE_3]}>
            ok
          </CSSCollector2>
        </div>
      </App>
    </CSSProvider>,
    document.getElementById('main'),
  );

  t.is(document.getElementById('test_1').innerHTML, 'ok');
  t.is(document.getElementById('test_2').innerHTML, '<span>loading</span>');
  t.is(document.getElementById('test_3').innerHTML, '');

  // Simulate onload at test_2
  const link1 = document.querySelector<HTMLLinkElement>(`link[href="${CSS_FILE_2}"]`);
  link1.dispatchEvent(new Event('load'));
  t.is(document.getElementById('test_2').innerHTML, 'ok');

  // Simulate onerror at test_3
  const link2 = document.querySelector<HTMLLinkElement>(`link[href="${CSS_FILE_3}"]`);
  link2.dispatchEvent(new Event('error'));
  t.is(document.getElementById('test_3').innerHTML, '<span>error</span>');

  /* tslint:disable:max-line-length */
  const snapshot = '<link href="https://necolas.github.io/normalize.css/8.0.0/normalize.css" rel="stylesheet" data-react-css-context="true"><link href="https://necolas.github.io/normalize.css/7.0.0/normalize.css" rel="stylesheet" data-react-css-context="true"><link href="https://necolas.github.io/normalize.css/6.0.0/normalize.css" rel="stylesheet" data-react-css-context="true">';
  /* tslint:enable:max-line-length */

  t.is(document.head.innerHTML, snapshot);
});
