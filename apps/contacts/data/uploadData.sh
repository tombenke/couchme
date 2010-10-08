#!/bin/bash

declare -rx SERVER_URL=http://localhost:5984
#declare -rx SERVER_URL=http://couchdb1.ws.lsy.bud.dlh.de:5984
declare -rx DATABASE=contacts

for datafile in *.json
do
    curl -X POST \
         -d @$datafile \
         -H "Content-type: application/json" \
         "$SERVER_URL/$DATABASE"
done