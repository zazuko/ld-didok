#!/bin/sh
source scripts/env.sh

FUSEKI_UPDATE=http://$FUSEKI_HOST:3030/didok/update
function sparqlu { curl -H "Accept: text/turtle" --data-urlencode update@$1 $2 ; }

#echo $FUSEKI_UPDATE

# some INSERTs
sparqlu construct/providers.rq $FUSEKI_UPDATE
sparqlu construct/latlong2wgs84.rq $FUSEKI_UPDATE
sparqlu construct/stationtype.rq $FUSEKI_UPDATE
sparqlu construct/sameAs.rq $FUSEKI_UPDATE

# and after that cleanup

sparqlu construct/delete-betriebspunkttyp.rq $FUSEKI_UPDATE
sparqlu construct/delete-latlong.rq $FUSEKI_UPDATE
sparqlu construct/delete-tuabkuerzung.rq $FUSEKI_UPDATE
sparqlu construct/delete-tunummer.rq $FUSEKI_UPDATE
sparqlu construct/delete-blanknodes.rq $FUSEKI_UPDATE
sparqlu construct/delete-verkehrsmittel.rq $FUSEKI_UPDATE
