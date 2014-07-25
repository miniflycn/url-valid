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
    , util = require('util')
    , URL = require('url')
    , urlReg = /^(https?):\/\//i;
  
  /**
   * Valid
   * @param {String} url
   * @param {Function} callback
   */
  function Valid(url, callback) {
    if (!(this instanceof Valid)) return new Valid(url, callback);
    EventEmitter.call(this);
    this.fetch = false;
    callback && this.on('check', callback);
    var get = this.get.bind(this);
    process.nextTick(function () {
      get(url);
    });
  }
  util.inherits(Valid, EventEmitter);
  Valid.prototype.get = function (url) {
    var match = url.match(urlReg)
      , that = this;

    this.fetch = !!this.listeners('data').length;

    if (match) {
      var httpLib = (match[1].toLowerCase() === 'http') ? http : https
        , opts = URL.parse(url)
        , req;
      opts.agent = false;
      opts.method = 'GET';
      req = httpLib.request(opts, function (res) {
        var statusCode = res.statusCode;
        if (statusCode === 200) {
          that.emit('check', null, true);

          that.fetch ? 
            (res.on('data', function (data) {
              that.emit('data', null, data);
            }) && res.on('end', function () {
              that.emit('end');
            })) :
            (req.abort() || that.emit('end'));
        } else if (300 < statusCode && statusCode < 304) {
          req.abort();
          var valid = Valid(URL.resolve(url, res.headers.location), function (err, valid) {
              that.emit('check', err, valid);
            });
          that.fetch && valid.on('data', function (err, data) {
            that.emit('data', err, data);
          });
          valid.on('error', function (err) {
            that.emit('error', err);
          });
          valid.on('end', function () {
            that.emit('end');
          });
        } else {
          that.emit('check', null, false);
        }
        res.on('error', function (err) {
          req.abort();
          that.emit('data', err);
        });
      });
      req.on('error', function (err) {
        req.abort();
        return that.emit('check', null, false);
      });
      req.end();
    } else {
      return that.emit('check', null, false);
    }
  };

  Valid.prototype.destroy = function () {
    this.removeAllListeners();
    this.url = undefined;
  };

  Valid.prototype.listeners = function (event) {
    var listeners = Valid.super_.prototype.listeners.bind(this);
    if (event) {
      return listeners(event);
    } else {
      var res = []
        , that = this
        , _push = Array.prototype.push;
      Object.keys(this._events).forEach(function (key) {
        _push.apply(res, that.listeners(key));
      });
      return res;
    }
  };

  return Valid;
})();