module.exports = (function () {
  'use strict';
  var http = require('http')
    , https = require('https')
    , EventEmitter = require('events').EventEmitter
    , isArray = require('util').isArray
    , URL = require('url')
    , urlReg = /^(https?):\/\//;

  if (!setImmediate) {
    var setImmediate = function (foo) {
      return setTimeout(foo, 0);
    };
  }
  /**
   * Vaild
   * @class
   */
  function Vaild(url, callback) {
    var that = this;
    this.url = url;
    this.emitter = new EventEmitter();
    setImmediate(function () {
      that.get(url);
    });
    this.fetch = false;
    callback && this.emitter.on('check', callback);
  }
  Vaild.prototype = {
    constructor: Vaild,
    /**
     * get
     * @param {String} url
     */
    get: function (url) {
      var match = url.match(urlReg)
        , that = this;
      if (match) {
        var httpLib = (match[1].toLowerCase() === 'http') ? http : https
          , opts = URL.parse(url)
          , req;
        opts.agent = false;
        opts.method = that.fetch ? 'GET' : 'HEAD';
        req = httpLib.request(opts, function (res) {
          var statusCode = res.statusCode;
          if (statusCode === 200) {
            that.emitter.emit('check', null, true);
          } else if (300 < statusCode && statusCode < 304) {
            that.fetch && req.abort();
            var emitter = that.emitter
              , vaild = one(res.headers.location, function (err, vaild) {
                emitter.emit('check', err, vaild);
              });
            that.fetch && vaild.on('data', function (err, data) {
              emitter.emit('data', err, data);
            });
          } else {
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
        });
        req.on('error', function (err) {
          that.fetch && req.abort();
          return that.emitter.emit('check', err, false);
        });
        req.end();
      } else {
        return that.emitter.emit('check', null, false);
      }
    },
    /**
     * on
     * @param {Stirng} event
     * @param {Function} callback
     */
    on: function (event, callback) {
      (event === 'data') && (this.fetch = true); 
      this.emitter.on(event, callback);
      return this;
    }
  }

  /**
   * MultiVaild
   * @class
   */
  function MultiVaild(urls, callback) {
    var that = this;
    this.vailds = [];
    this.emitter = new EventEmitter();
    this.fetch = false;
    callback && this.emitter.on('check', callback);
    setImmediate(function () {
      that.get(urls);
    });
  }
  MultiVaild.prototype = {
    constructor: MultiVaild,
    /**
     * on
     * @param {String} event
     * @param {Function} callback
     */
    on: function (event, callback) {
      if (event === 'data' || event === 'end') {
        throw new Error('Do not support this event.');
      }
      this.emitter.on(event, callback);
      return this;
    },
    /**
     * get
     * @param {Array} urls
     */
    get: function (urls) {
      var that = this;
      urls.forEach(function (url) {
        var vaild = one(url, function (err, vaild) {
          that.emitter.emit('check', err, {
            url: url,
            vaild: vaild
          });
        });
      });
    }
  };

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
   * @return {MultiVaild}
   */
  function some(urls, callback) {
    return (new MultiVaild(urls, callback)); 
  }

  function vaild(url, callback) {
    if (isArray(url)) {
      return some(url, callback);
    } else {
      return one(url, callback);
    }
  }
  vaild.one = one;
  vaild.some = some;

  return vaild;
})();