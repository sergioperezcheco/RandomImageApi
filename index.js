require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const db = require('./database');
const { isValidUrl, isImageUrl, getRandomInt, sanitizeInput } = require('./utils');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));

const DEFAULT_PORT = 3210;
const DOMAIN = process.env.DOMAIN || 'localhost';
const HTTPS = process.env.HTTPS !== 'FALSE';
let port = DEFAULT_PORT;

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        process.env.ACTUAL_PORT = port; // 将实际端口存储在环境变量中
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
};

startServer(port);

app.post('/generate', (req, res) => {
    const { urls } = req.body;

    const validUrls = urls.filter(url => isValidUrl(url) && isImageUrl(url)).map(url => sanitizeInput(url));

    if (validUrls.length === 0) {
        return res.status(400).json({ error: '请提供至少一个有效的图片 URL' });
    }

    const id = uuid.v4();
    const urlsString = JSON.stringify(validUrls);

    db.run(`INSERT INTO image_sets (id, urls) VALUES (?, ?)`, [id, urlsString], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        let apiUrl;
        if (DOMAIN === 'localhost') {
            apiUrl = `http://localhost:${process.env.ACTUAL_PORT}/images/${id}`;
        } else {
            const protocol = HTTPS ? 'https' : 'http';
            const portSuffix = (process.env.PORT && process.env.PORT !== '80' && process.env.PORT !== '443') ? `:${process.env.PORT}` : '';
            apiUrl = `${protocol}://${DOMAIN}${portSuffix}/images/${id}`;
        }

        res.json({ apiUrl });
    });
});

app.get('/images/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT urls FROM image_sets WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (!row) {
            return res.status(404).send('Not Found');
        }

        const urls = JSON.parse(row.urls);
        const randomIndex = getRandomInt(0, urls.length);
        const randomUrl = urls[randomIndex];
        res.redirect(randomUrl);
    });
});

app.use(express.static('public'));