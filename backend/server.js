import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', taskRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'Unbroken' }));
app.listen(PORT, () => {
  console.log(`Unbroken server running on http://localhost:${PORT}`);
});
