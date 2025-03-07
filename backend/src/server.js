import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Get the domain from FRONTEND_URL or use a default
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
console.log(`Frontend URL: ${frontendUrl}`);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    frontendUrl, 
    'https://d6ed0173-979f-401f-85f4-826a574c4619-00-2btepdzlwfgjs.pike.replit.dev'
  ],
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for Replit environment
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});