import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from './routes';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { pool } from './config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((error) => console.error('Database connection error:', error));

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Evently API',
            version: '1.0.0',
            description: 'API for Event Management',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [], 
            },
        ],
        tags: [
            {
                name: 'Events',
                description: 'Operations related to event management',
            },
            {
                name: 'Participants',
                description: 'Operations related to participant management',
            },
            {
                name: 'Relations',
                description: 'Operations for managing event-participant relationships',
            },
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints',
            },
        ],
    },
    apis: ['./src/controllers.ts', './src/routes.ts'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

setupRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api/docs`);
});
