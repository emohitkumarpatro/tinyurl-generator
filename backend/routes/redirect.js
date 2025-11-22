import express from 'express';
import pool from '../db/database.js';

const router = express.Router();

/**
 * GET /:code
 * Redirect to original URL and increment click count
 * Returns: HTTP 302 redirect (or 404 if not found)
 */
router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;

        // Skip internal routes (avoid conflicts with frontend & API paths)
        if (['api', 'healthz', 'code'].includes(code)) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Atomically increment click count and update last_clicked_at
        const query = `
            UPDATE links
            SET click_count = click_count + 1,
                last_clicked_at = CURRENT_TIMESTAMP
            WHERE code = $1
            RETURNING original_url
        `;

        const result = await pool.query(query, [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }

        const originalUrl = result.rows[0].original_url;

        // Redirect with HTTP 302
        return res.redirect(302, originalUrl);

    } catch (error) {
        console.error('Error redirecting:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
