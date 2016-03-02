# Linked Data DIDOK README [![Build Status](https://travis-ci.org/lindas-uc/ld-didok.svg?branch=master)](https://travis-ci.org/lindas-uc/ld-didok)

This DIDOK Linked Data export is based on the Excel file found in `input`.

It gets build by [RML-Mapper](https://github.com/zazukoians/RML-Mapper/).

## RDF Export

This is a first PoC version of an LD-Export. It will hopefully be gradually expanded in the next months. So far only few triples are attached to the station and the namespace is not fixed yet.

The Linked Data version provides a pretty simple mapping of the DIDOK tables. We do not include the name of the community but instead link to the URI of the appropriate municipality in the "Historisiertes Gemeindeverzeichnis", maintained by "Bundesamt für Statistik".

The x/y values are LV03 x/y coordinates. If you want to get WGS84  lat/long values instead you might want to use the [Swisstopo API](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/software/products/m2m/lv03towgs84.html). In a final Linked Data version this should surely be included by default.

# Author

The export was created by Adrian Gschwend, adrian.gschwend@zazuko.com or http://twitter.com/linkedktk

# License

The RML configuration is provided under The MIT License (MIT). I did not check the exact license of the DIDOK dataset.

The MIT License (MIT)

Copyright (c) 2015 Zazuko GmbH

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

