## How to reproduce the problem?

Requirements: node v0.10.40.

```
$ npm install
$ node repro.js
```

Expected result: the program should exit gracefully.
Actual result: the program hangs.

However, setting the `CONNECT_TIMEOUT` environment variable to some values
will make this program exit as expected:

```
$ CONNECT_TIMEOUT=200 node repro.js
$
```
