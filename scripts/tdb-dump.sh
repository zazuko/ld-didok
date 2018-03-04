#!/bin/sh
tdbdump --loc target/tdb | sed '\#example.org#d' | rapper -i nquads -o ntriples  - http://example.org/base/ > target/everything.nt