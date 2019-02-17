FROM node:11.9.0-alpine

#
HEALTHCHECK --interval=5s --timeout=3s CMD curl --fail http://localhost:$(printenv COMPONENT_PARAM_PORT)/healthcheck || exit 1

# Create app directory
WORKDIR /usr/src/app

# Copy sources
COPY ./package*.json ./
COPY ./src ./src
COPY ./.env.template ./
COPY ./docker-entry.sh ./

# Install app dependencies
RUN apk --update --no-cache add git gettext curl
RUN npm install --only=production

CMD [ "./docker-entry.sh" ]
