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


ENV PORT 6000
EXPOSE 6000
# Run start script(command)
CMD ["npm", "start"]