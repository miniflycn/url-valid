module.exports = (function () {
  "use strict"
  var vaild = require('../');

  vaild.one('http://www.google.com', function (err, vaild) {
  	if (err) throw err;
  	console.log(vaild);
  });
})();