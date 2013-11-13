/*!
 * valid
 * Copyright (c) 2013 Daniel Yang <miniflycn@justany.net>
 * MIT Licensed
 */

module.exports = (function () {
  'use strict';
  var http = require('http')
    , https = require('https')
    , EventEmitter = require('events').EventEmitter
    , URL = require('url')
    , urlReg = /^(https?):\/\//;

  if (!setImmediate) {
    var setImmediate = function (foo) {
      return setTimeout(foo, 0);
    };
  }
  
  /**
   * Valid
   * @class
   */
  function Valid(url, callback) {
    var that = this;
    this.url = url;
    this.emitter = new EventEmitter();
    setImmediate(function () {
      that.get(url);
    });
    this.fetch = false;
    callback && this.emitter.on('check', callback);
  }
  Valid.prototype = {
    constructor: Valid,
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
        opts.method = 'GET';
        req = httpLib.request(opts, function (res) {
          var statusCode = res.statusCode;
          if (statusCode === 200) {
            that.emitter.emit('check', null, true);

            that.fetch ? 
              (res.on('data', function (data) {
                that.emitter.emit('data', null, data);
              }) && res.on('end', function () {
                that.emitter.emit('end');
              })) :
              (req.abort() || that.emitter.emit('end'));
          } else if (300 < statusCode && statusCode < 304) {
            req.abort();
            var emitter = that.emitter
              , valid = one(URL.resolve(url, res.headers.location), function (err, valid) {
                emitter.emit('check', err, valid);
              });
            that.fetch && valid.on('data', function (err, data) {
              emitter.emit('data', err, data);
            });
            valid.on('error', function (err) {
              that.emitter.emit('error', err);
            });
            valid.on('end', function () {
              that.emitter.emit('end');
            });
          } else {
            that.emitter.emit('check', null, false);
          }
          res.on('error', function (err) {
            req.abort();
            that.emitter.emit('data', err);
          });
        });
        req.on('error', function (err) {
          req.abort();
          return that.emitter.emit('check', null, false);
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
    },

    /**
     * destroy
     */
    destroy: function () {
      this.emitter.removeAllListeners();
      this.url = undefined;
      this.emitter = null;
      this.fetch = undefined;
    },

    /**
     * removeAllListeners
     * @param
     */
    removeAllListeners: function (event) {
      event ? 
        this.emitter.removeAllListeners(event) :
        this.emitter.removeAllListeners();
      return this;
    },

    /**
     * listeners
     * @param
     */
    listeners: function (event) {
      if (event) {
        return this.emitter.listeners(event);
      } else {
        var res = []
          , that = this
          , _push = Array.prototype.push;
        Object.keys(this.emitter._events).forEach(function (key) {
          _push.apply(res, that.emitter.listeners(key));
        });
        return res;
      }
    }
  }

  /**
   * one
   * @param {String} url
   * @param {Function} callback
   * @return {Valid}
   */
  function one(url, callback) {
    return (new Valid(url, callback)); 
  }

  one.one = one;

  return one;
})();