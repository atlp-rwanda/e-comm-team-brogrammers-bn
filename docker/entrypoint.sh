#!/bin/sh

echo "Running sequelize migrations..."
npm run migrate
# Add command to run when container starts: like `npm run test`
npm run start