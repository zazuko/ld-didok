#!/bin/sh
s3cmd -c config/s3cmd put target/everything.nt.gz s3://zazuko-staging/didok.nt.gz
s3cmd -c config/s3cmd setacl --acl-public s3://zazuko-staging/didok.nt.gz
#s3cmd -c config/s3cmd del s3://zazuko-staging/didok.nt.gz