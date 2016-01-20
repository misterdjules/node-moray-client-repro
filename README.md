## How to reproduce the problem?

__This issue has been fixed__.

See https://github.com/mcavage/node-fast/commit/3e4ad857af28a277f1218544a26f714b5102f341
for the change that fixes it, published in npm as node-fast@0.5.1, which
node-moray automatically pulls as its dependency.

The rest of this file is left intact as to document what the issue was before
it was fixed.

Requirements: node v0.10.40.

```
$ npm install
$ node repro.js
```

Expected result: the program should exit gracefully.
Actual result: Most of the time, the program hangs.

However, setting the `MAX_CONNECTIONS` environment variable to some values
will make this program exit as expected most of the time:

```
$ MAX_CONNECTIONS=1 node repro.js
$
```
