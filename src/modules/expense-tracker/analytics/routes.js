const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

router.get('/summary',   ctrl.getSummary);
router.get('/analytics', ctrl.getAnalytics);

module.exports = router;
