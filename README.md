[![Build Status](https://travis-ci.org/miniflycn/url-valid.png?branch=master)](https://travis-ci.org/miniflycn/url-valid)
[![Coverage Status](https://coveralls.io/repos/miniflycn/url-valid/badge.png?branch=master)](https://coveralls.io/r/miniflycn/url-valid?branch=master)
# url-valid
[![NPM](https://nodei.co/npm/url-valid.png)](https://npmjs.org/package/url-valid)

Homepage: https://github.com/miniflycn/url-valid

## Project Goals
Url validity detection library.

## Setup
Setup

    $ npm install url-valid


## Useage

```js
var valid = require('url-valid');

valid('http://www.google.com', function (err, valid) {
  if (err) throw err;
  console.log(valid);
});
```

## API
```js
/**
 * valid(url)
 * valid(url, callback)
 * @param {String} url
 * @param {Function} callback
 * @return {Valid}
 */
valid('http://ke.qq.com', function (err, valid) {
  if (err) throw err;
  console.log(valid);
});
/**
 * Valid
 * @class
 *  - on(event, callback)
 *    @param {String} event, event can be 'check', 'data', 'end'
 *    @param {Function} callback
 */
valid('http://ke.qq.com').on('check', function (err, valid) {
  if (err) throw err;
  console.log(valid);
});
/**
 *  - destroy
 */
var v = valid('http://ke.qq.com');
// do something
v.destroy();
/**
 *  - listeners
 *    @param {String} event
 *    @returns {Array} listenerList
 */
valid.on('check', function (err, valid) {
  if (err) throw err;
  console.log(valid);
}).listeners('check');
```

## Examples
* https://github.com/miniflycn/url-valid/tree/master/examples

## License
(The MIT License)

Copyright (c) 2013 Daniel Yang <miniflycn@justany.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.