#!/bin/bash -e
export $(cat ./.env | grep -v ^# | xargs)
npm i