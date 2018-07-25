#!/bin/sh
s3cmd -c config/s3cmd put target/everything.nt.gz s3://zazuko-staging/didok.nt.gz
s3cmd -c config/s3cmd setacl --acl-public s3://zazuko-staging/didok.nt.gz

# Stardog

curl -u $STORE_USER:$STORE_PASSWORD -X POST -w "%{http_code}" -s -o /dev/null --data timeout=1000000  --data-urlencode update="CLEAR GRAPH <https://linked.opendata.swiss/graph/FOT/didok>" https://lindas-data.ch:8443/lindas/update
curl -u $STORE_USER:$STORE_PASSWORD -X POST -w "%{http_code}" -s -o /dev/null --data timeout=1000000  --data-urlencode update="LOAD <https://sos-ch-dk-2.exo.io/zazuko-staging/didok.nt.gz> INTO GRAPH <https://linked.opendata.swiss/graph/FOT/didok>" https://lindas-data.ch:8443/lindas/update
curl -u $STORE_USER:$STORE_PASSWORD -H "Accept: application/sparql-results+json" -X POST -s --data timeout=1000000  --data-urlencode query="SELECT (COUNT(?s) AS ?count) WHERE {  GRAPH <https://linked.opendata.swiss/graph/FOT/didok> {?s ?p ?o}}" https://lindas-data.ch:8443/lindas/query | node node_modules/json/lib/json.js "['results']['bindings'][0]['count']['value']"
# Cleanup
s3cmd -c config/s3cmd del s3://zazuko-staging/didok.nt.gz