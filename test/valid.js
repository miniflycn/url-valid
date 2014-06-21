var assert = require('assert')
  , connect = require('connect')
  , valid = require('../lib/valid');

var testSever = connect()
                .use('/available', function (req, res, next) {
                  res.writeHead(200, {
                    'Content-Type': 'text/html; charset=UTF-8'
                  });
                  res.statusCode = 200;
                  res.end('hello world!');
                })
                .use('/move1', function (req, res, next) {
                  res.writeHead(302, {
                    'Location': 'http://localhost:7777/available'
                  });
                  res.statusCode = 302;
                  res.end();
                })
                .use('/move2', function (req, res, next) {
                  res.writeHead(301, {
                    'Location': '/available'
                  });
                  res.statusCode = 301;
                  res.end();
                })
                .use('/move3', function (req, res, next) {
                  res.writeHead(301, {
                    'Location': '../available'
                  });
                  res.statusCode = 301;
                  res.end();
                })
                .listen(7777);

describe('valid', function () {
  it('should able to check one url', function (done) {
    valid('HTTP://localhost:7777/available', function (err, valid) {
      assert.deepEqual(err, null);
      valid.should.be.true;
      done();
    });
  });

  it('should able to use .on method for one url', function (done) {
    valid('http://localhost:7777/available').on('check', function (err, valid) {
      assert.deepEqual(err, null);
      valid.should.be.true;
      done();
    });
  });

  it('should able to detect a 404 url', function (done) {
    valid('http://localhost:7777/unavailable', function (err, valid) {
      valid.should.be.false;
      done();
    });
  });

  it('should able to validate a url', function (done) {
    valid('test.test', function (err, valid) {
      valid.should.be.false;
      done();
    });
  });


  it('should able to fire when response finish', function (done) {
    valid('http://localhost:7777/available').on('end', function () {
      done();
    });
  });

  it('should able to fire when response send data', function (done) {
    valid('http://localhost:7777/available').on('data', function (err, data) {
      data.toString().should.equal('hello world!');
      done();
    });
  });

  it('should able to support a redirect url', function (done) {
    valid('http://localhost:7777/move1', function (err, valid) {
      valid.should.be.true;
      done();
    });
  });

  it('should able to support a absolute path', function (done) {
    valid('http://localhost:7777/move2', function (err, valid) {
      valid.should.be.true;
      done();
    });
  });

  it('should able to support a relative path', function (done) {
    valid('http://localhost:7777/move3', function (err, valid) {
      valid.should.be.true;
      done();
    });
  });

  it('should able to use .on method if it is a redirect url', function (done) {
    valid('http://localhost:7777/move1', function (err, valid) {
      valid.should.be.true;
    }).on('data', function (err, data) {
      data.toString().should.equal('hello world!');
      done();
    });
  });

  it('should able to destroy a Valid instance', function (done) {
    var v = valid('http://localhost:7777/available')
            .on('check', function (err, valid) {
              valid.should.be.true;
            }).on('end', function () {
              v.destroy();
              v.listeners().length.should.equal(0);
              done();
            });
  });

  it('should emit end event when finish validity detection', function (done) {
    var step = 0
      , v = valid('http://localhost:7777/move1').on('check', function (err, valid) {
          step.should.equal(0);
          step = 1;
          valid.should.be.true;
        }).on('data', function (err, data) {
          step.should.equal(1);
          step = 2;
          data.toString().should.equal('hello world!');
        }).on('end', function () {
          step.should.equal(2);
          done();
        });
  });

  it('should able to get the listeners', function () {
    var v = valid('http://localhost:7777/available')
            .on('data', function () {})
            .on('check', function () {})
            .on('data', function () {})
            .on('end', function () {});
    v.listeners().length.should.equal(4);
    v.listeners('end').length.should.equal(1);
    v.listeners('data').length.should.equal(2);
  });

  it('should able to remove all event listeners', function () {
    var v = valid('http://localhost:7777/available')
            .on('data', function () {})
            .on('check', function () {})
            .on('end', function () {});
    v.listeners().length.should.equal(3);
    v.removeAllListeners().listeners().length.should.equal(0);
  });

  it('should able to remove specified event listeners', function () {
    var v = valid('http://localhost:7777/available')
            .on('data', function () {})
            .on('check', function () {})
            .on('end', function () {});
    v.listeners().length.should.equal(3);
    v.removeAllListeners('data').listeners().length.should.equal(2);
  });
});