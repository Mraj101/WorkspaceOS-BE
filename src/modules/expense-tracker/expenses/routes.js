const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

router.post('/crt', ctrl.createExpense);

module.exports = router;
