Command variables
-----------------

#### GIT_MODIFIED_FILE_COUNT

`git status --porcelain | wc -l`
This outputs the number of modified files.

 * `git status --porcelain` returns a machine-readable version of `git status`
 * `wc` prints the byte, word, and line counts
 * `wc -l` just prints line count (which in this case is the number of modified files)

#### GIT_IS_REPO_UP_TO_DATE

`git fetch; git status | grep '^Your branch is up-to-date' | wc -l`
This checks if local repo is up to date with remote.

 * `git fetch` downloads changes from the remote branch, updating the local repository data, but leaving your local branch unchanged 
 * `grep '...'` looks for the text 'Your branch is up-to-date' in the piped output from `git status`
 * `wc -l` prints the line count of the grep output (which in this case will be 1 if the branch is up to date, and 0 if not)

#### GIT_DOES_REPO_VERSION_EXIST

`git tag -l ${NPM_VERSION} | wc -l`
This checks if there is already a version matching the one in our package.json. 

Helpers
-------

Just 3 echo helpers that adds some colors and formatting to params before echoing.

Rules
-----

#### lint

 * lints the source

#### test

 * runs source tests

#### coverage

 * generates a testing coverage report

#### publish

 * runs test rule
 * checks if local repo is clean (no outstanding commits)
 * checks that local repo is up to date with remote
 * checks that package.json version is new
 * creates a new Github release
 * publishes new version to NPM (can be toggled off in Makefile by setting NPM=0) 

#### todo

 * lists all TODOs in source
