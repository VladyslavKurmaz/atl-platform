#!/bin/bash -e
envsubst < .env.template > .env
envsubst < sonar-project.properties.template > sonar-project.properties
npm i
