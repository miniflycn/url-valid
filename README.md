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
(The MIT License)

Copyright (c) 2013 Daniel Yang <miniflycn@justany.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.