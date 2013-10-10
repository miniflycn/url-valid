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
    , isArray = require('util').isArray
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
              , valid = one(res.headers.location, function (err, valid) {
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
    }
  }

  /**
   * MultiValid
   * @class
   */
  function MultiValid(urls, callback) {
    var that = this;
    this.emitter = new EventEmitter();
    this.valids = [];
    this.fetch = false;
    this.finishLen = 0;
    callback && this.emitter.on('check', callback);
    setImmediate(function () {
      that.get(urls);
    });
  }
  MultiValid.prototype = {
    constructor: MultiValid,
    /**
     * on
     * @param {String} event
     * @param {Function} callback
     */
    on: function (event, callback) {
      if (event === 'data') {
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
      if (this.valids) {
        var that = this;
        urls.forEach(function (url) {
          var valid = one(url, function (err, valid) {
            that.emitter.emit('check', err, {
              url: url,
              valid: valid
            });
          });
          valid.on('end', function () {
            if (++that.finishLen === that.valids.length) {
              that.emitter.emit('end');
            }
          });
          that.valids.push(valid);
        });
      }
      return this;
    },

    /**
     * destroy
     */
    destroy: function () {
      this.valids.forEach(function (valid) {
        valid.destroy();
      });
      this.valids = null;
      this.emitter.removeAllListeners();
      this.emitter = null;
      this.fetch = undefined;
    }
  };

  /**
   * one
   * @param {String} url
   * @param {Function} callback
   * @return {Valid}
   */
  function one(url, callback) {
    return (new Valid(url, callback)); 
  }

  /**
   * some
   * @param {Array} urls
   * @param {Function} callback
   * @return {MultiValid}
   */
  function some(urls, callback) {
    return (new MultiValid(urls, callback)); 
  }

  function valid(url, callback) {
    if (isArray(url)) {
      return some(url, callback);
    } else {
      return one(url, callback);
    }
  }
  valid.one = one;
  valid.some = some;

  return valid;
})();