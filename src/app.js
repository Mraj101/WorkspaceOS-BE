const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const requestId = require('./middleware/requestId');
const currentUser = require('./middleware/currentUser');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Request Tracing ───────────────────────────────────────────────────────────
app.use(requestId);

// ─── Security & Logging ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Identity ─────────────────────────────────────────────────────────────────
// Mounted below /health on purpose: once this enforces real auth, the health
// check must stay reachable without credentials.
app.use(currentUser);

// ─── Module Routes ────────────────────────────────────────────────────────────
// Register each module's router here as you add them.
// Pattern: app.use('/api/<resource>', require('./modules/<name>'));
app.use('/api/v1/expense_tracker', require('./modules/expense-tracker'));

// ─── Error Handling (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
