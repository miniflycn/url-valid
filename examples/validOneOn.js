module.exports = (function () {
  "use strict"
  var vaild = require('../');

  valid.one('http://www.google.com').on('check', function (err, valid) {
  	if (err) throw err;
  	console.log(valid);
  });
})();