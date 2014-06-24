module.exports = (function () {
  "use strict"
  var valid = require('../');

  valid('http://www.google.com').on('check', function (err, valid) {
  	if (err) throw err;
  	console.log(valid);
  });
})();