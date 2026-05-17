const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules for the contact form
const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
        .escape(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[+]?[\d\s()-]{7,20}$/).withMessage('Invalid phone number format'),
    body('age')
        .trim()
        .notEmpty().withMessage('Age is required')
        .isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('gender')
        .trim()
        .notEmpty().withMessage('Gender is required')
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender selection'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('date')
        .optional({ checkFalsy: true })
        .isDate().withMessage('Invalid date format'),
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5, max: 300 }).withMessage('Address must be 5-300 characters')
        .escape(),
    body('message')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 }).withMessage('Message must be under 1000 characters')
        .escape(),
];

// POST /api/contact — Secure form handler
router.post('/contact', rateLimiter, contactValidation, async (req, res) => {
    try {
        // 1. Honeypot check — if filled, it's a bot
        if (req.body.honeypot && req.body.honeypot.trim() !== '') {
            // Silently accept to not reveal the trap to bots
            return res.json({ success: true, message: 'Thank you! Your appointment request has been sent successfully.' });
        }

        // 2. Validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Please check your input.',
                errors: errors.array().map(e => e.msg),
            });
        }

        // 3. Build FormData to send to Google Apps Script
        const scriptURL = process.env.GOOGLE_SCRIPT_URL;

        if (!scriptURL) {
            console.error('GOOGLE_SCRIPT_URL is not configured in .env');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. Please try again later.',
            });
        }

        // Use URLSearchParams to mimic form submission (Google Apps Script expects this)
        const formBody = new URLSearchParams();
        formBody.append('name', req.body.name);
        formBody.append('phone', req.body.phone);
        formBody.append('age', req.body.age);
        formBody.append('gender', req.body.gender);
        formBody.append('email', req.body.email);
        formBody.append('date', req.body.date || '');
        formBody.append('address', req.body.address);
        formBody.append('message', req.body.message || '');

        // 4. Forward to Google Apps Script
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString(),
        });

        if (!response.ok) {
            throw new Error(`Google Script responded with status ${response.status}`);
        }

        // 5. Success response
        return res.json({
            success: true,
            message: 'Thank you! Your appointment request has been sent successfully.',
        });

    } catch (error) {
        console.error('Contact form error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again or call us directly.',
        });
    }
});

module.exports = router;
