import express from 'express';
import cors from 'cors';
import connectDB from './config';
import { startPolling } from './services/pollingService';
import assetRoutes from './routes/assets';

const app = express();

connectDB();

startPolling();

app.use(cors());

app.use(express.json());

app.use('/api/assets', assetRoutes);

app.get('/', (req, res) => {
  res.send('Stock and Crypto Tracker API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
