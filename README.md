# Linked Data DIDOK README [![Build Status](https://travis-ci.org/lindas-uc/ld-didok.svg?branch=master)](https://travis-ci.org/lindas-uc/ld-didok)

This DIDOK Linked Data export is based on the CSV file found in `input`.

It gets build by [RML-Mapper](https://github.com/zazukoians/RML-Mapper/).

## Source

The data is taken from the [SBB Open Data Portal](https://data.sbb.ch/), more specifically from the [DIDOK](https://data.sbb.ch/explore/dataset/didok-liste/information/) list. You can get the CSV directly from [this link](https://data.sbb.ch/explore/dataset/didok-liste/download/?format=csv&timezone=Europe/Berlin&use_labels_for_header=true).

## RDF Export

This is a first PoC version of an LD-Export. It will hopefully be gradually expanded in the next months. So far only few triples are attached to the station and the namespace is not fixed yet.

The Linked Data version provides a pretty simple mapping of the DIDOK tables. We do not include the name of the community but instead link to the URI of the appropriate municipality in the "Historisiertes Gemeindeverzeichnis", maintained by "Bundesamt für Statistik".

## Accessing the data online

Each URI used can be directly dereferenced by HTTP, for example this entry for [SBB Cargo](http://lod.opentransportdata.swiss/didok/8500011). You can request different RDF serializations for each resource, like Turtle, JSON-LD, RDF/XML etc.

If you want to query the data you can use the LINDAS SPARQL endpoint at [lindas-data.ch/sparql](http://lindas-data.ch/sparql). You can find the data in the graph `http://lindas-data.ch/resource/ld-didok`. See this [YASGUI query](http://lod.opentransportdata.swiss/sparql/#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0ASELECT+*+WHERE+%7B+GRAPH+%3Chttps%3A%2F%2Flinked.opendata.swiss%2Fgraph%2FFOT%2Fdidok%3E+%7B%0A++%3Fsub+%3Fpred+%3Fobj+.%0A++%7D%0A%7D%0ALIMIT+10&contentTypeConstruct=text%2Fturtle&contentTypeSelect=application%2Fsparql-results%2Bjson&endpoint=http%3A%2F%2Flindas-data.ch%2Fsparql&requestMethod=POST&tabTitle=Query&headers=%7B%7D&outputFormat=table) as an example.

# Author

The export was created by Adrian Gschwend, adrian.gschwend@zazuko.com or http://twitter.com/linkedktk

# License

The RML configuration is provided under The MIT License (MIT). I did not check the exact license of the DIDOK dataset.

The MIT License (MIT)

Copyright (c) 2017 Zazuko GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

