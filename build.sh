#!/bin/bash

file=${PWD##*/}.ocmod.zip
[ -f $file ] && rm $file
find . -name ".DS_Store" -delete
zip -r $file upload
#git archive --prefix ${PWD##*/}/ HEAD -o $file