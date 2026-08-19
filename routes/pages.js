const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index', { currentPage: 'home' });
});

// Services page
router.get('/services', (req, res) => {
    res.render('services', { currentPage: 'services' });
});

// Privacy policy page
router.get('/privacy', (req, res) => {
    res.render('privacy', { currentPage: 'privacy' });
});

module.exports = router;
