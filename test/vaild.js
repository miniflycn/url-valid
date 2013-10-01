var assert = require('assert')
  , connect = require('connect')
  , vaild = require('../lib/vaild');

var testSever = connect()
                .use('/available', function (req, res, next) {
                  res.writeHead(200, {
                    'Content-Type': 'text/html; charset=UTF-8'
                  });
                  res.statusCode = 200;
                  res.end('hello world!');
                })
                .use('/move', function (req, res, next) {
                  res.writeHead(302, {
                    'Location': 'http://localhost:7777/available'
                  });
                  res.statusCode = 302;
                  res.end();
                })
                .listen(7777);

describe('vaild', function () {
  it('should able to check one url', function (done) {
    vaild('http://localhost:7777/available', function (err, vaild) {
      assert.deepEqual(err, null);
      vaild.should.be.true;
      done();
    });
  });

  it('should able to use .on method for one url', function (done) {
    vaild.one('http://localhost:7777/available').on('check', function (err, vaild) {
      assert.deepEqual(err, null);
      vaild.should.be.true;
      done();
    });
  });

  it('should able to detect a 404 url', function (done) {
    vaild.one('http://localhost:7777/unavailable', function (err, vaild) {
      vaild.should.be.false;
      done();
    });
  });

  it('should able to vaildate a url', function (done) {
    vaild.one('test.test', function (err, vaild) {
      vaild.should.be.false;
      done();
    });
  });


  it('should able to check some url', function (done) {
    var num = 0;
    vaild([
      'http://localhost:7777/available/0',
      'http://localhost:7777/available/1',
      'http://localhost:7777/available/2',
      'http://localhost:7777/available/3'
    ], function (err, data) {
      data.vaild.should.be.true;
      if (++num > 3) {
        done();
      }
    });
  });

  it('should able to use .on method for some url', function (done) {
    var num = 0;
    vaild.some([
      'http://localhost:7777/available/0',
      'http://localhost:7777/available/1',
      'http://localhost:7777/available/2',
      'http://localhost:7777/available/3'
    ]).on('check', function (err, data) {
      data.vaild.should.be.true;
      if (++num > 3) {
        done();
      }
    });
  });

  it('should able to fire when response finish', function (done) {
    vaild.one('http://localhost:7777/available').on('end', function () {
      done();
    });
  });

  it('should able to fire when response send data', function (done) {
    vaild.one('http://localhost:7777/available').on('data', function (err, data) {
      data.toString().should.equal('hello world!');
      done();
    });
  });

  it('should not able to support "data" & "end" event when use .some method', function () {
    (function () {
      vaild.some([
        'http://localhost:7777/available/0',
        'http://localhost:7777/available/1',
        'http://localhost:7777/available/2',
        'http://localhost:7777/available/3'
      ]).on('data', function () {});
    }).should.throw()
  });

  it('should able to support a redirect url', function (done) {
    vaild.one('http://localhost:7777/move', function (err, vaild) {
      vaild.should.be.true;
      done();
    });
  });

  it('should able to use .on method if it is a redirect url', function (done) {
    vaild.one('http://localhost:7777/move', function (err, vaild) {
      vaild.should.be.true;
    }).on('data', function (err, data) {
      data.toString().should.equal('hello world!');
      done();
    });
  });

  it('should able to destroy a Vaild instance', function (done) {
    var v = vaild('http://localhost:7777/available')
            .on('check', function (err, vaild) {
              vaild.should.be.true;
            }).on('end', function () {
              v.destroy();
              assert.deepEqual(v.url, undefined);
              assert.deepEqual(v.emitter, null);
              assert.deepEqual(v.fetch, undefined);
              done();
            });
  });

  it('should able to destroy a MutilVaild instance', function (done) {
    var m = vaild([
      'http://localhost:7777/available/0',
      'http://localhost:7777/available/1',
      'http://localhost:7777/available/2',
      'http://localhost:7777/available/3'
    ]).on('end', function () {
      m.destroy();
      assert.deepEqual(m.emitter, null);
      assert.deepEqual(m.fetch, undefined);
      done();
    });
  });

  it('should emit end event when finish validity detection', function (done) {
    var step = 0
      , v = vaild('http://localhost:7777/move').on('check', function (err, vaild) {
          step.should.equal(0);
          step = 1;
          vaild.should.be.true;
        }).on('data', function (err, data) {
          step.should.equal(1);
          step = 2;
          data.toString().should.equal('hello world!');
        }).on('end', function () {
          step.should.equal(2);
          done();
        });
  });
});