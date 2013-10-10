module.exports = (function () {
  "use strict"
  var valid = require('../');

  valid.some([
    'http://www.baidu.com',
    'http://www.google.com',
    'http://www.nothissite.com',
    'http://www.cnblogs.com',
    'http://www.sohu.com',
    'http://www.sina.com',
    'http://www.yeeyan.org',
    'http://github.com'
  ]).on('check', function (err, valid) {
    err && console.log(err);
    console.log(valid);
  });
})();