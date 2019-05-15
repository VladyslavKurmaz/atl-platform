#!/bin/bash -e
if [ -f "../../.env" ]; then export $(envsubst < "../../.env" | grep -v ^# | xargs); fi
if [ -f ".env" ]; then export $(envsubst < ".env" | grep -v ^# | xargs); fi
npm run jasmine && npm run coverage