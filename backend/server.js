import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health.js';
import linksRouter from './routes/links.js';
import redirectRouter from './routes/redirect.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173' || 'https://tinyurl-generator.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use(healthRouter);      // /healthz
app.use(linksRouter);        // /api/links/*
app.use(redirectRouter);     // /:code (must be last)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TinyLink backend running on http://localhost:${PORT}`);
    console.log(`📊 Healthcheck: http://localhost:${PORT}/healthz`);
});
