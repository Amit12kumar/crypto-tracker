import express from 'express';
import connectDB from './config';
import { startPolling } from './services/pollingService';

const app = express();

connectDB();

startPolling();

app.get('/', (req, res) => {
  res.send('Stock and Crypto Tracker API');
});

export default app;
