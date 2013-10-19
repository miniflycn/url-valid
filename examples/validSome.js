module.exports = (function () {
  "use strict"
  var some = require('./some');

  some([
    'http://www.baidu.com',
    'http://www.google.com'
  ], function (err, data) {
    if (err) throw err;
    console.log(data);
  });
})();