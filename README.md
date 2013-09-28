[![Build Status](https://travis-ci.org/miniflycn/url-vaild.png?branch=master)](https://travis-ci.org/miniflycn/url-vaild)
[![Coverage Status](https://coveralls.io/repos/miniflycn/url-vaild/badge.png?branch=master)](https://coveralls.io/r/miniflycn/url-vaild?branch=master)
# url-vaild
[![NPM](https://nodei.co/npm/url-vaild.png)](https://npmjs.org/package/url-vaild)

Homepage: https://github.com/miniflycn/url-vaild

## Project Goals
Url validity detection library.

## Setup
Setup

    $ npm install url-vaild


## Useage

```js
var vaild = require('url-vaild');

vaild.one('http://www.google.com', function (err, vaild) {
  if (err) throw err;
  console.log(vaild);
});
```

## API
```js
/**
 * one(url)
 * one(url, callback)
 * @param {String} url
 * @param {Function} callback
 * @return {Vaild}
 */
vaild.one('http://www.baidu.com', function (err, vaild) {
  if (err) throw err;
  console.log(vaild);
});
/**
 * Vaild
 * @class
 *  - on(event, callback)
 *    @param {String} event, event can be 'check', 'data', 'end'
 *    @param {Function} callback
 */
vaild.one('http://www.baidu.com').on('check', function (err, vaild) {
  if (err) throw err;
  console.log(vaild);
});

/**
 * some
 * @param {Array} urls
 * @param {Function} callback
 * @return {MultiVaild}
 */
vaild.some([
  'http://www.baidu.com',
  'http://www.google.com',
], function (err, data) {
  err && console.log(err);
  console.log(data);
});
/**
 * MultiVaild
 * @class
 *  - on(event, callback)
 *    @param {String} event, event can be 'check'
 *    @param {Function} callback
 */
vaild.some([
  'http://www.baidu.com',
  'http://www.google.com',
]).on('check', function (err, data) {
  err && console.log(err);
  console.log(data);
});

/**
 * vaild(url, callback) === one(url, callback)
 */
vaild('http://www.baidu.com', function (err, vaild) {
  if (err) throw err;
  console.log(vaild);
});
/**
 * vaild(urls, callback) === some(urls, callback)
 */
vaild([
  'http://www.baidu.com',
  'http://www.google.com',
], function (err, data) {
  err && console.log(err);
  console.log(data);
});
```
## Examples
* https://github.com/miniflycn/url-vaild/tree/master/examples

## License
All code inside is licensed under MIT license.