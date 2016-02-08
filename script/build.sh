#!/bin/sh
sed '1,24d' input/bav0116_report.txt | iconv -f iso8859-1 -t utf8 | perl -pi.back -e 'split(s/ {2,}/;/g)' > target/didok.csv