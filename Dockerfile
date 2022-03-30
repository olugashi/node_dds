FROM node:11
FROM python:2.7

# Create app directory
WORKDIR D:\\Project\\node_dds_c

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm install --global --production windows-build-tools 
RUN npm install rticonnextdds-connector
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source


EXPOSE 8080
CMD [ "node", "server.js" ]