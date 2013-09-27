module.exports = (function () {
  "use strict"
  var vaild = require('../');

  vaild.some([
  	'http://www.baidu.com',
  	'http://www.google.com',
  	'http://www.nothissite.com'
  ], function (err, data) {
  	err && console.log(err);
  	console.log(data);
  });
})();