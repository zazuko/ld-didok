#!/bin/sh
curl -G -H "Accept: application/n-triples" -o target/didok-clean-base.nt http://admin:cinderella@$FUSEKI_HOST:3030/didok/data --data-urlencode graph=http://example.com/didok
curl -G -H "Accept: application/n-triples" -o target/didok-clean-inference.nt http://admin:cinderella@$FUSEKI_HOST:3030/didok/data --data-urlencode graph=http://example.org/inference