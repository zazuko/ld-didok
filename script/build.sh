#!/bin/sh
if [ ! -f "lib/RML-Mapper.jar" ]
then
  mkdir lib
  wget -O "lib/RML-Mapper.jar" $(curl -s https://api.github.com/repos/zazukoians/RML-Mapper/releases | grep browser_download_url | head -n 1 | cut -d '"' -f 4)
fi

mkdir target
java -jar "lib/RML-Mapper.jar" -m config/didok.ttl -o target/didok.nt -f ntriple 2>&1 | grep -v DEBUG
#perl -pi.back -e 's/didok\/(\d{4})>/didok\/0$1>/' target/didok.nt
#perl -pi.back -e 's/didok\/(\d{5})>/didok\/85$1>/' target/didok.nt
#perl -pi.back -e 's/id> "(\d{4})"/id> "0$1"/' target/didok.nt
#perl -pi.back -e 's/id> "(\d{5})"/id> "85$1"/' target/didok.nt

# sed '1,24d' input/bav0116_report.txt | iconv -f iso8859-1 -t utf8 | perl -pi.back -e 'split(s/ {2,}/;/g)' > target/didok.csv
# cat target/utf8.txt | cut -c 19-30,32-38,40-70,72-122,124-131,133-144,146-156,158-169,171-176,178-187,189-198,200-205,207-225,227-245,247-258
