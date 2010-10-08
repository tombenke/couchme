#!/bin/bash

export target=couchme
export downloads=../../_design/$target/_attachments/downloads

./md2html.sh authorization
./md2html.sh dataUpload
./md2html.sh downloads
./md2html.sh generate
./md2html.sh index
./md2html.sh intro
./md2html.sh install
./md2html.sh resources

cp -r images ../../_design/$target/_attachments/
cp -r ../$target/images ../../_design/$target/_attachments/

zip -r $downloads/contacts.zip ../../../contacts
