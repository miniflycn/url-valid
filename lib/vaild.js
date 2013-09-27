module.exports = (function () {
  'use strict';
  var http = require('http')
    , https = require('https')
    , URL = require('url')
    , urlReg = /^https?:\/\//;

  /**
   * one
   * @param {String} url
   * @param {Function} callback
   */
  function one(url, callback) {
    if (urlReg.test(url)) {
      var opts = URL.parse(url)
        , req;
      opts.agent = false;
      req = http.get(opts, function (res) {
        var statusCode = res.statusCode;
        req.abort();
        if (statusCode === 200) {
          return callback(null, true);
        } else if (300 < statusCode && statusCode < 304) {
          return one(res.headers.location, callback);
        } else {
          return callback(null, false);
        }
      }).on('error', function (err) {
        callback(err, false);
      });
    } else {
      return callback(null, false);
    }
  }

  /**
   * some
   * @param {Array} urls
   * @param {Function} callback
   */
  function some(urls, callback) {
    return urls.forEach(function (url) {
      one(url, function (err, vaild) {
        callback(err, {
          url: url,
          vaild: vaild
        });
      });
    });
  }

  return {
    one: one,
    some: some
  };
})();