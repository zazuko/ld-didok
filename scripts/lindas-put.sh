#!/bin/sh
curl -n \
     -X PUT \
     -H Content-Type:application/n-triples \
     -T target/didok-clean-base.nt \
     -G https://lindasprd.netrics.ch:8443/lindas \
     --data-urlencode graph=https://linked.opendata.swiss/graph/FOT/didok
curl -n \
     -X POST \
     -H Content-Type:application/n-triples \
     -T target/didok-clean-inference.nt \
     -G https://lindasprd.netrics.ch:8443/lindas \
     --data-urlencode graph=https://linked.opendata.swiss/graph/FOT/didok
curl -n \
     -X POST \
     -H Content-Type:text/turtle \
     -T input/static.ttl \
     -G https://lindasprd.netrics.ch:8443/lindas \
     --data-urlencode graph=https://linked.opendata.swiss/graph/FOT/didok
