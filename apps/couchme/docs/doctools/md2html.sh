#!/bin/bash

cat startHTML.xhtml > "../../_design/$target/_attachments/$1.html"
cat "../$target/$1.md" "../$target/refs.md" > temporary.md
markdown temporary.md >> "../../_design/$target/_attachments/$1.html"
cat endHTML.xhtml >> "../../_design/$target/_attachments/$1.html"
rm temporary.md


