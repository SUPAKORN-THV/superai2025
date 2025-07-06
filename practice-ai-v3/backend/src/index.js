import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';

// routes
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import adminRoutes from './routes/admin.js';
import ocrRoutes from './routes/ocr.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ocr', ocrRoutes);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));