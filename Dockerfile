# Using node image version 18
FROM node:18

# Specify working directory (will be created)
WORKDIR /usr/src/app

# Copying package.json & package-lock.json
COPY package*.json ./
# Install project dependencies
RUN npm install
RUN npm install -g sequelize-cli
RUN npm install -g nodemon

# Bundle the app
COPY . .

RUN chmod 755 docker/entrypoint.sh

ENV PORT 6000
EXPOSE 6000
# Run start script(command)
# CMD ["npm", "start"]
CMD ["sh", "-c","--","echo 'started';while true; do sleep 1000; done"]