module.exports = (function () {
  "use strict"
  var valid = require('../');

  valid('http://www.google.com', function (err, valid) {
  	if (err) throw err;
  	console.log(valid);
  });
})();