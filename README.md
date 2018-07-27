# react-css-context

Async Loading CSS file in our React Application.
Of course we can use in Isomorphic Application!

## Install

```
$ npm install react-css-context -S
```

## Usage

### At Component where you want to load css.

```tsx
import * as React from 'react';
import { CSSCollector } from 'react-css-context';

export class SomeComponent extends React.Component {
  return (
    <CSSCollector hrefs={["/path/to/css"]}>
      <div>display after css loaded.</div>
    </CSSCollector>
  );
}
```

### Server Side Rendering

```tsx
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { CSSProvider, toTagString, toTagComponent } from 'react-css-context';

const cssMap = new Map();
const renderOutput = ReactDOMServer.renderToString(
  <App>
    <CSSProvider cssMap={cssMap}>
      <SomeComponent />
    </CSSProvider>
  </App>
);

// use string
const htmlOutput = `
<html>
  <head>
    ${toTagString(cssMap)}
  </head>
  ...
</html>
`;

// use component
const htmlOutput = renderToString(
  <html>
    <head>
      {toTagComponent(cssMap)}
    </head>
    ...
  </html>
);
```

### 3. Client Side Rendering

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSProvider, getCSSMap } from 'react-css-context';

// get CSS-Map from browser head.
const cssMap = getCSSMap();

ReactDOM.render(
  <App>
    <CSSProvider cssMap={cssMap}>
      <SomeComponent />
    </CSSProvider>
  </App>,
  document.getElementById('main')
);
```
