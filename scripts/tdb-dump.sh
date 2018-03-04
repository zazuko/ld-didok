#!/bin/sh
tdbdump --loc target/tdb | serdi -i nquads -o ntriples - | sed '\#example.org#d' > target/everything.nt