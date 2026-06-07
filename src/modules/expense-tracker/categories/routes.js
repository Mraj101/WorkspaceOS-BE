const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

router.get   ('/',     ctrl.listCategories);
router.post  ('/',     ctrl.createCategory);
router.delete('/:id',  ctrl.deleteCategory);

module.exports = router;
