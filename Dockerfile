# Using node image version 18
FROM node:18

# Specify working directory (will be created)
WORKDIR /usr/src/app

# Copying package.json & package-lock.json
COPY package*.json ./
# Install project dependencies
RUN npm install

# Bundle the app
COPY . .

# Run start script(command)
CMD ["npm", "start"]