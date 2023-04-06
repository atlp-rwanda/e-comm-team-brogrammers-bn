/* eslint-disable import/no-extraneous-dependencies */
import swaggerJSDoc from 'swagger-jsdoc';
import env from 'dotenv';

env.config();

const swaggerServer = process.env.SWAGGER_SERVER;

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Brogrammers E-COMMERCE PROJECT',
      version: '1.0.0',
      description: 'ATLP Rwanda, Brogrammers team, E-commerce project',
    },
    servers: [{ url: swaggerServer }],
    components: {
      securitySchemes: {
        google_auth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: process.env.GOOGLE_SERVER,
            },
          },
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/docs/*.js', './src/docs/*.yml'],
};

const swagger = swaggerJSDoc(options);

export default swagger;
