const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

router.post  ('/bulk',      ctrl.bulkCreateExpenses);
router.delete('/bulk',      ctrl.bulkDeleteExpenses);

router.get   ('/',          ctrl.listExpenses);
router.get   ('/:id',       ctrl.getExpense);
router.post  ('/',          ctrl.createExpense);
router.put   ('/:id',       ctrl.updateExpense);
router.delete('/:id',       ctrl.deleteExpense);

router.post  ('/:id/tags',        ctrl.attachTag);
router.delete('/:id/tags/:tagId', ctrl.detachTag);

module.exports = router;
