import express from 'express';

const router = express.Router();

/**
 * GET /healthz
 * Healthcheck endpoint
 * Returns: {"ok": true, "version": "1.0"}
 */
router.get('/healthz', (req, res) => {
    console.log("healthcheck is active");
    res.json({
        ok: true,
        version: '1.0'
    });
});

export default router;
