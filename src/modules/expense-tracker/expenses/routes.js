const { Router } = require('express');
const ctrl = require('./controller');
const validate = require('./validator');

const router = Router();

// Much cleaner! And it reads like plain English.
router.post('/crt', validate.createExpense, ctrl.createExpense);

module.exports = router;
