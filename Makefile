PATH        := ./node_modules/.bin:${PATH}

help:
	@echo
	@echo "  \033[34mlint\033[0m – lints the source"
	@echo "  \033[34mtest\033[0m – runs source tests"
	@echo "  \033[34mtest-w\033[0m – watches source and runs tests on change"
	@echo "  \033[34mcoverage\033[0m – runs source tests and generates coverage report"
	@echo "  \033[34mtodo\033[0m – lists all the TODOs in source"
	@echo

lint:
	eslint . --ignore-pattern "src/**/*.spec.js"

test: lint
	mocha -R spec "src/**/*.spec.js" -w

test-w: lint
	mocha -R spec "src/**/*.spec.js" -w

coverage:
	rm -rf coverage
		istanbul cover --root ./src ./node_modules/.bin/_mocha -R spec "src/**/*.spec.js"

todo:
	grep 'TODO' -n -r ./src --colour=always

.PHONY: lint test test-w coverage todo
.SILENT: lint test