require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const pagesRouter = require('./routes/pages');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Security Middleware ----------

// Helmet for secure HTTP headers (relaxed CSP for inline scripts/styles)
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:"],
                frameSrc: ["'self'", "https://www.google.com"],
                connectSrc: ["'self'"],
            },
        },
    })
);

// CORS — allow same-origin requests
app.use(cors({ origin: true }));

// ---------- Body Parsing ----------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Template Engine ----------

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Static Files ----------

app.use(express.static(path.join(__dirname, 'public')));

// ---------- Routes ----------

app.use('/', pagesRouter);
app.use('/api', contactRouter);

// ---------- 404 Handler ----------

app.use((req, res) => {
    res.status(404).render('404', { currentPage: '' });
});

// ---------- Error Handler ----------

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ---------- Start Server ----------

app.listen(PORT, () => {
    console.log(`✅ Varge Clinic server running at http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
