module.exports = plugin;

function plugin(options) {
  options = options || [];
  return function (files, metalsmith, done) {
    files.forEach(file => {
      console.log('file', file);
    });
    done();
  };
};
