module.exports = plugin;

const fs = require('fs');

const outFilePath = 'contentIndex.json';

const defaultOptions = {
  fields: '*'
}

/*
  {
    fields: '*'
    fields: ['title', 'description']
    indexPath: 'contentIndex.json'
  }
*/

function writeIndexes(files, options) {
  let fd = fs.openSync(options.indexPath, 'w');
  // console.log('write start json')
  fs.write(fd, '{\r\n');

  let isFirst = true;
  let propProcessor;
  if (options.fields === '*') {
    propProcessor = function (obj) {
      let props = Object.assign({}, obj);
      delete props['contents'];
      delete props['stats'];
      delete props['mode'];
      return props;
    }
  } else if (Array.isArray(options.fields)) {
    // remove fields contents, stats, mode from options.fields
    if (options.fields.indexOf('contents') != -1) options.fields.splice(options.fields.indexOf('contents'), 1);
    if (options.fields.indexOf('stats') != -1) options.fields.splice(options.fields.indexOf('stats'), 1);
    if (options.fields.indexOf('mode') != -1) options.fields.splice(options.fields.indexOf('mode'), 1);
    propProcessor = function (obj) {      
      let props = {};
      options.fields.forEach(function (field) {
        props[field] = obj[field];
      });
      return props;
    }
  }
  for (filePath in files) {
    if (!files.hasOwnProperty(filePath)) continue;
    if (!isFirst) {
      //console.log('write sep end prop');
      fs.write(fd, ',\r\n');
    }

    isFirst = false;

    let content = files[filePath];
    // console.log('write key', filePath)
    fs.write(fd, `"${filePath.replace('.html', '.md')}": `);

    let indexContent = propProcessor(content);    
    // console.log('write value')
    fs.write(fd, JSON.stringify(indexContent));
  }
  // console.log('write end json')
  fs.write(fd, '\r\n}\r\n');
  fs.close(fd);
}

function plugin(options) {
  options = options || [];
  if (typeof options === 'object' && !Array.isArray(options)) {
    options = [options];
  }
  return function (files, metalsmith, done) {
    options.forEach(function (opts) {
      writeIndexes(files, opts);
    });

    done();
  };
};
