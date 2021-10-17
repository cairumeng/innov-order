FROM node:12.22-alpine

LABEL maintainer="cairuemgn@gmail.com"

# Create app directory
WORKDIR /var/www/innov

# Install app dependencies
# COPY package.json package-lock.json ./
COPY package*.json ./

# Install npm packages
RUN npm ci

EXPOSE 3000

# You can update this to run other NodeJS apps
CMD [ "npm", "start:dev" ]
