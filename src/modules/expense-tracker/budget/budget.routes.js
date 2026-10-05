const { Router } = require('express');
const ctrl = require('./budget.controller');
const validate = require('./budget.validator');

const router = Router();

router.post('/crt', validate.createBudget, ctrl.createBudget);
router.post("/del/:id",validate.deleteBudget, ctrl.deleteBudget);

module.exports = router;
