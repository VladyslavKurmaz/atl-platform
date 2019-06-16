#!/bin/bash -e
if [ -f ".env" ]; then export $(envsubst < ".env" | grep -v ^# | xargs); fi
if [ -f "sonar-project.properties.template" ]; then envsubst > sonar-project.properties < sonar-project.properties.template; fi
if [ -f ".env.template" ]; then envsubst > .env < .env.template; fi