module.exports = (function () {
  "use strict"
  var vaild = require('../');

  vaild.one('http://www.google.com', function (err, vaild) {
  	if (err) throw err;
  	console.log(vaild);
  }).on('data', function (err, data) {
  	if (err) throw err;
  	console.log(data.toString());
  });
})();