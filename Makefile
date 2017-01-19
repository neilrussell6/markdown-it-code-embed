PATH        	:= ./node_modules/.bin:${PATH}

NPM_PACKAGE 	:= $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION 	:= $(shell node -e 'process.stdout.write(require("./package.json").version)')

TMP_PATH    	:= /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME 	?= origin
REMOTE_REPO 	?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD   	:= $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GITHUB_PROJECT 	:= https://github.com//neilrussell6/${NPM_PACKAGE}

help:
	@echo
	@echo "  \033[34mlint\033[0m – lints the source"
	@echo "  \033[34mtest\033[0m – runs source tests"
	@echo "  \033[34mtest-w\033[0m – watches source and runs tests on change"
	@echo "  \033[34mcoverage\033[0m – runs source tests and generates coverage report"
	@echo "  \033[34mpublish\033[0m – pushes the plugin to Github and publishes to NPM"
	@echo "  \033[34mtodo\033[0m – lists all the TODOs in source"
	@echo

lint:
	eslint . --ignore-pattern "src/**/*.spec.js"

test: lint
	mocha -R spec "src/**/*.spec.js"

test-w: lint
	mocha -R spec "src/**/*.spec.js" -w

coverage:
	rm -rf coverage
		istanbul cover --root ./src ./node_modules/.bin/_mocha -R spec "src/**/*.spec.js"

publish:
	@if test 0 -ne `git status --porcelain | wc -l` ; then \
		echo "Unclean working tree. Commit or stash changes first." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git fetch ; git status | grep '^# Your branch' | wc -l` ; then \
		echo "Local/Remote history differs. Please push/pull changes." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git tag -l ${NPM_VERSION} | wc -l` ; then \
		echo "Tag ${NPM_VERSION} exists. Update package.json" >&2 ; \
		exit 128 ; \
		fi
	git tag ${NPM_VERSION} && git push origin ${NPM_VERSION}
	npm publish ${GITHUB_PROJECT}/tarball/${NPM_VERSION}

todo:
	grep 'TODO' -n -r ./src --colour=always

.PHONY: lint test test-w coverage publish todo
.SILENT: lint test