import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookeiParser from 'cookie-parser';
import firebaseRouter from './routes/firebaseAuthRoutes';
import doctorsRouter from './routes/doctorRoutes';

// Load environment variables from a .env file into process.env
dotenv.config();

// Create an instance of the Express application
const app = express();

// Define the port for the application to listen on
const port = process.env.PORT || '5000';
const address = `localhost:${port}`;

const apiVersion = '/api/v1';

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookeiParser());

// Middleware to enable Cross-Origin Resource Sharing (CORS)
if (process.env.ENV == 'production') {
  console.log('production');
  app.use(
    cors({
      origin: ['https://your-production-url.com'], // Change this to your frontend url
      credentials: true,
      exposedHeaders: ['Content-Disposition'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );
} else {
  console.log('dev');
  app.use(
    cors({
      exposedHeaders: ['Content-Disposition']
    })
  );
}

// Route handler for the root path
app.get('/', function (req: Request, res: Response) {
  res.send('doctor_visit');
});

app.use(apiVersion + '/users', firebaseRouter);
app.use(apiVersion + '/doctors', doctorsRouter);

// Start the server and listen for incoming requests
export const server = app.listen(port, () => {
  console.log(`Starting app on: ${address}`);
});

// Export the app instance for testing or other use
export default app;
