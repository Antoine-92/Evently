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
    },
    apis: ['./src/controllers.ts', './src/routes.ts'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

setupRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
