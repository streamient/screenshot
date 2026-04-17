// HTTP API for generating screenshots on demand
const express = require('express');
const path = require('path');
const { captureScreenshot } = require('./capture');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Screenshot endpoint accepts URL and optional configuration
app.post('/', async (req, res) => {
    var {
        url,
        width = 1440,
        height = 900,
        fullPage = false,
        format = 'jpg',
        quality = 60,
        delay = 100
    } = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'URL is required or not valid' });
    }

    try {
        quality = parseInt(quality);
        const buffer = await captureScreenshot({
            url, width, height, fullPage, format, quality, delay
        });

        // Set appropriate content type based on requested format
        const contentType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        res.set('Content-Type', contentType);
        res.send(buffer);
    } catch (err) {
        console.error(`Screenshot failed for ${url}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Screenshot service running on port ${PORT}`);
});
