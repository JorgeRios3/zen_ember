#!/bin/bash
python gzip.py
PROJECT=zeniclar
SOURCE=`pwd`
ssh smartics@10.0.1.124 "rm -Rf /home/smartics/dev/deploy/deployments/$PROJECT"
ssh smartics@10.0.1.124 "mkdir /home/smartics/dev/deploy/deployments/$PROJECT"
scp -r dist smartics@10.0.1.124:/home/smartics/dev/deploy/deployments/$PROJECT

