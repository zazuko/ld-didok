#!/bin/sh
# some INSERTs
tdbupdate --loc=target/tdb --update=construct/providers.rq
tdbupdate --loc=target/tdb --update=construct/latlong2wgs84.rq
tdbupdate --loc=target/tdb --update=construct/stationtype.rq
tdbupdate --loc=target/tdb --update=construct/sameAs.rq
tdbupdate --loc=target/tdb --update=construct/wikidata.rq

# and after that cleanup
tdbupdate --loc=target/tdb --update=construct/delete-betriebspunkttyp.rq
tdbupdate --loc=target/tdb --update=construct/delete-latlong.rq
tdbupdate --loc=target/tdb --update=construct/delete-tuabkuerzung.rq
tdbupdate --loc=target/tdb --update=construct/delete-tunummer.rq
tdbupdate --loc=target/tdb --update=construct/delete-blanknodes.rq
tdbupdate --loc=target/tdb --update=construct/delete-verkehrsmittel.rq
