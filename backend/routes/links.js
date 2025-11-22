import express from 'express';
import validator from 'validator';
import pool from '../db/database.js';
import { generateCode, isValidCode } from '../utils/codeGenerator.js';

const router = express.Router();

/**
 * POST /api/links
 * Create a new shortened URL
 * Body: { originalUrl: string, customCode?: string }
 * Returns: { code, originalUrl, shortUrl }
 * Status: 201 on success, 409 if code already exists, 400 for invalid input
 */
router.post('/api/links', async (req, res) => {
    try {
        const { originalUrl, customCode } = req.body;

        // Validate original URL
        if (!originalUrl || !validator.isURL(originalUrl)) {
            return res.status(400).json({ error: 'Invalid URL provided' });
        }

        // Determine code: use custom or generate random
        let code = customCode;

        if (customCode) {
            // Validate custom code format
            if (!isValidCode(customCode)) {
                return res.status(400).json({
                    error: 'Custom code must be 6-8 alphanumeric characters'
                });
            }
        } else {
            // Generate a random code and ensure uniqueness
            code = generateCode();

            // Retry up to 5 times if collision occurs
            let attempts = 0;
            while (attempts < 5) {
                const existing = await pool.query(
                    'SELECT code FROM links WHERE code = $1',
                    [code]
                );
                if (existing.rows.length === 0) break;
                code = generateCode();
                attempts++;
            }
        }

        // Insert into database
        const result = await pool.query(
            'INSERT INTO links (code, original_url) VALUES ($1, $2) RETURNING *',
            [code, originalUrl]
        );

        const link = result.rows[0];

        res.status(201).json({
            code: link.code,
            originalUrl: link.original_url,
            shortUrl: `${req.protocol}://${req.get('host')}/${link.code}`,
            createdAt: link.created_at
        });
    } catch (error) {
        // Handle duplicate code error
        if (error.code === '23505') { // Postgres unique violation
            return res.status(409).json({
                error: 'Code already exists. Please try a different custom code.'
            });
        }

        console.error('Error creating link:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/links
 * Get all shortened URLs with stats
 * Returns: Array of link objects
 */
router.get('/api/links', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, code, original_url, click_count, last_clicked_at, created_at 
       FROM links 
       ORDER BY created_at DESC`
        );

        const links = result.rows.map(row => ({
            id: row.id,
            code: row.code,
            originalUrl: row.original_url,
            clickCount: row.click_count,
            lastClickedAt: row.last_clicked_at,
            createdAt: row.created_at
        }));

        res.json(links);
    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/links/:code
 * Get stats for a specific shortened URL
 * Returns: Link object with stats
 * Status: 404 if not found
 */
router.get('/api/links/:code', async (req, res) => {
    try {
        const { code } = req.params;

        const result = await pool.query(
            `SELECT id, code, original_url, click_count, last_clicked_at, created_at 
       FROM links 
       WHERE code = $1`,
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }

        const link = result.rows[0];

        res.json({
            id: link.id,
            code: link.code,
            originalUrl: link.original_url,
            clickCount: link.click_count,
            lastClickedAt: link.last_clicked_at,
            createdAt: link.created_at
        });
    } catch (error) {
        console.error('Error fetching link:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * DELETE /api/links/:code
 * Delete a shortened URL
 * Returns: Success message
 * Status: 404 if not found
 */
router.delete('/api/links/:code', async (req, res) => {
    try {
        const { code } = req.params;

        const result = await pool.query(
            'DELETE FROM links WHERE code = $1 RETURNING *',
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
