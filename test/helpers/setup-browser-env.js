require('browser-env')();
global.requestAnimationFrame = function(fn) {
  setTimeout(() => {
    fn();
  });
};
