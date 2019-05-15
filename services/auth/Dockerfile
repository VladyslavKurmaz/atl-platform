FROM node:11.9.0-alpine

#
HEALTHCHECK --interval=5s --timeout=3s CMD node src/healthcheck.js || exit 1
#HEALTHCHECK --interval=12s --timeout=12s --start-period=30s  CMD node /healthcheck.js

# Create app directory
WORKDIR /usr/src/app

# Copy sources
COPY ./package*.json ./
COPY ./src ./src
COPY ./.env ./
COPY ./docker-entry.sh ./

# Install app dependencies
#RUN apk --update --no-cache add git gettext curl
RUN npm install --only=production

CMD [ "./docker-entry.sh" ]
