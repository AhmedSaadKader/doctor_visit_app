import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Doctor Visit App API',
    version: '1.0.0',
    description: 'API documentation for the Doctor Visit App'
  },
  servers: [
    {
      url: 'https://doctorvisitapp-production.up.railway.app/api/v1',
      description: 'Development server'
    }
  ]
};

const options = {
  swaggerDefinition,
  // Paths to files containing API documentation
  apis: ['*/routes/*.ts', '*/controllers/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
