const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

router.get   ('/',     ctrl.listPaymentMethods);
router.post  ('/',     ctrl.createPaymentMethod);
router.delete('/:id',  ctrl.deletePaymentMethod);

module.exports = router;
