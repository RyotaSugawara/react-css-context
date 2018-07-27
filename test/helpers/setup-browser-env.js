if (process.env.BROWSER_ENV) {
  require('browser-env')();
  global.requestAnimationFrame = function(fn) {
    setTimeout(() => {
      fn();
    });
  };
}
