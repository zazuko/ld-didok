#!/bin/sh
#docker run -p 3030:3030 --name fuseki-didok -e ADMIN_PASSWORD=cinderella -d stain/jena-fuseki
#sleep 20
source scripts/env.sh
curl -u admin:cinderella --data "dbType=tdb&dbName=didok"  http://$FUSEKI_HOST:3030/$/datasets
curl -i -X DELETE -u admin:cinderella -G http://$FUSEKI_HOST:3030/didok/data --data-urlencode graph=http://example.org/inference
curl -X PUT -u admin:cinderella  -T target/didok.nt -G -H "Content-Type: application/n-triples" http://$FUSEKI_HOST:3030/didok/data --data-urlencode graph=http://example.com/didok

