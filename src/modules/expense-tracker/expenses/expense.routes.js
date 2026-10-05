const { Router } = require('express');
const ctrl = require('./expense.controller');
const validate = require('./exepnse.validator');

const router = Router();

// Much cleaner! And it reads like plain English.
router.post('/crt', validate.createExpense, ctrl.createExpense);

module.exports = router;
