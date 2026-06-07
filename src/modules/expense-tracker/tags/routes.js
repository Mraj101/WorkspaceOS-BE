const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

router.get   ('/',     ctrl.listTags);
router.post  ('/',     ctrl.createTag);
router.delete('/:id',  ctrl.deleteTag);

module.exports = router;
