module.exports = (function () {
  "use strict"
  var valid = require('../');

  valid('http://www.google.com', function (err, valid) {
  	if (err) throw err;
  	console.log(valid);
  }).on('data', function (err, data) {
  	if (err) throw err;
  	console.log(data.toString());
  });
})();