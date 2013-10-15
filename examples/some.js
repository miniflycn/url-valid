module.exports = (function () {
  "use strict"
  var one = require('../')
    , EventEmitter = require('events').EventEmitter;

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

  return function (urls, callback) {
  	return (new MultiValid(urls, callback));
  };
})();