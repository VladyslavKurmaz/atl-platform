#!/bin/bash -e
if [ -f .env ]; then export $(cat .env | grep -v ^# | xargs); fi
npm run jasmine