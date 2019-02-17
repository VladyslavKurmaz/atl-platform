#!/bin/sh
envsubst < .env.template > .env
exec npm start
