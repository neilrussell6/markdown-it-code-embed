#!/usr/bin/env bash

#------------------------------
# vars
#------------------------------

PATH        	:= ./node_modules/.bin:${PATH}

NPM_PACKAGE 	:= $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION 	:= $(shell node -e 'process.stdout.write(require("./package.json").version)')

TMP_PATH    	:= /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME 	?= origin
REMOTE_REPO 	?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD   	:= $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GITHUB_PROJECT 	:= https://github.com//neilrussell6/${NPM_PACKAGE}

REPORTER 		:= spec
NPM 			:= 1

# commands

GIT_MODIFIED_FILE_COUNT 		:= `git status --porcelain | wc -l`
GIT_IS_REPO_UP_TO_DATE 			:= `git fetch; git status | grep '^Your branch is up-to-date' | wc -l`
GIT_DOES_REPO_VERSION_EXIST 	:= `git tag -l ${NPM_VERSION} | wc -l`

#------------------------------
# helpers
#------------------------------

define echo_help
	if [ -n "$(3)" ]; then \
		echo " \033[34m$(1)\033[0m –$(2) \033[36m(args:\033[34m$(3)\033[36m)\033[0m"; \
	else \
		echo " \033[34m$(1)\033[0m –$(2)"; \
	fi
endef

define echo_warning
	echo " \033[33m$(1)\033[0m"
endef

define echo_success
	echo " \033[32m$(1)\033[0m"
endef

#------------------------------
# rules
#------------------------------

help:
	@echo
	@$(call echo_help, lint, lints the source)
	@$(call echo_help, test, runs source tests, REPORTER=spec WATCH=0)
	@$(call echo_help, coverage, generates a testing coverage report)
	@$(call echo_help, publish, creates a new Github release and publishes new version to NPM, NPM=0)
	@$(call echo_help, todo, lists all TODOs in source)
	@echo

lint:
	eslint . --ignore-pattern "src/**/*.spec.js"

test: lint
ifndef WATCH
	mocha -R ${REPORTER} "src/**/*.spec.js"
else
	mocha -R ${REPORTER} "src/**/*.spec.js" -w
endif

coverage:
	rm -rf coverage
		istanbul cover --root ./src ./node_modules/.bin/_mocha "src/**/*.spec.js"

publish:
	@$(MAKE) test REPORTER=dot --no-print-directory

	@if [ ${GIT_MODIFIED_FILE_COUNT} != 0 ]; then \
		$(call echo_warning, Unclean working tree. Commit or stash changes first.); \
	elif [ ${GIT_IS_REPO_UP_TO_DATE} = 0 ]; then \
		$(call echo_warning, Local/Remote histories differ. Please push/pull changes.); \
	elif [ ${GIT_DOES_REPO_VERSION_EXIST} != 0 ]; then \
		$(call echo_warning, v${NPM_VERSION} already exists. Update package.json); \
	else \
		git tag ${NPM_VERSION} && git push origin ${NPM_VERSION}; \
		$(call echo_success, New Github release for v${NPM_VERSION} successfully created); \
		if [ $(NPM) = 1 ]; then \
			npm publish ${GITHUB_PROJECT}/tarball/${NPM_VERSION}; \
			$(call echo_success, New NPM release for v${NPM_VERSION} successfully created); \
		fi; \
	fi
	@echo

todo:
	@echo
	@grep 'TODO' -n -r ./src --colour=always
	@echo

.PHONY: lint test coverage publish todo
.SILENT: lint test
