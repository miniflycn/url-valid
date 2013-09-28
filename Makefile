install:
	@npm install

test:
	@mocha

test-cov:
	@mocha --require blanket -R html-cov > coverage.html
	@echo Please open coverage.html to see the result!

test-coveralls:
	@mocha --require blanket --reporter mocha-lcov-reporter | COVERALLS_REPO_TOKEN="wNgiAfX3qwme7HyaLSn8ep3m3h0My44pS" ./node_modules/coveralls/bin/coveralls.js

.PHONY: test test-cov test-coveralls