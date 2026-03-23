const express = require('express');
const router = express.Router();
const controller = require('./announcement.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createAnnouncementSchema, updateAnnouncementSchema } = require('./announcement.validation');
const { ROLES } = require('../../config/constants');

const adminOnly = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN)];

router.get('/my', authenticate, controller.getMy);
router.get('/', ...adminOnly, controller.getAll);
router.post('/', ...adminOnly, validate(createAnnouncementSchema), controller.create);
router.get('/:id', authenticate, controller.getById);
router.get('/:id/read-stats', ...adminOnly, controller.readStats);
router.put('/:id', ...adminOnly, validate(updateAnnouncementSchema), controller.update);
router.delete('/:id', ...adminOnly, controller.remove);

module.exports = router;
