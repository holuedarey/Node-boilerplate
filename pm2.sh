#!/bin/bash

pm2 describe $pmID > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
    NODE_ENV=production pm2 start build/app.js --name $pmID
else
    NODE_ENV=production pm2 restart $pmID --update-env
fi;
