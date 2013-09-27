module.exports = (function () {
  'use strict';
  var http = require('http')
    , https = require('https')
    , EventEmitter = require('events').EventEmitter
    , URL = require('url')
    , urlReg = /^(https?):\/\//;

  function Vaild(url, callback) {
    this.url = url;
    this.emitter = new EventEmitter();
    this.get(url);
    this.fetch = false;
    callback && this.emitter.on('check', callback);
  }
  Vaild.prototype = {
    constructor: Vaild,
    get: function (url) {
      var match = url.match(urlReg)
        , that = this;
      if (match) {
        var httpLib = (match[1].toLowerCase() === 'http') ? http : https
          , opts = URL.parse(url)
          , req;
        opts.agent = false;
        req = httpLib.get(opts, function (res) {
          var statusCode = res.statusCode;
          that.fetch || req.abort();
          if (statusCode === 200) {
            that.emitter.emit('check', null, true);
          } else if (300 < statusCode && statusCode < 304) {
            that.fetch && req.abort();
            var emitter = that.emitter
            one(res.headers.location, function (err, vaild) {
              emitter.emit('check', err, vaild);
            });
          } else {
            that.fetch && req.abort();
            that.emitter.emit('check', null, false);
          }
          res.on('error', function (err) {
            req.abort();
            that.emitter.emit('data', err);
          });
          res.on('data', function (data) {
            that.emitter.emit('data', null, data);
          });
          res.on('end', function () {
            that.emitter.emit('end');
            that.url = undefined;
            that.emitter = null;
          });
        }).on('error', function (err) {
          that.fetch && req.abort();
          return that.emitter.emit('check', err, false);
        });
      } else {
        return that.emitter.emit('check', null, false);
      }
    },
    on: function (event, callback) {
      (event === 'data') && (this.fetch = true); 
      this.emitter.on(event, callback);
      return this;
    }
  }

  /**
   * one
   * @param {String} url
   * @param {Function} callback
   * @return {Vaild}
   */
  function one(url, callback) {
    return (new Vaild(url, callback)); 
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