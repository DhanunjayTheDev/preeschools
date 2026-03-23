const express = require('express');
const router = express.Router();
const controller = require('./teacherRegistration.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

const adminOnly = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN)];

router.get('/stats', ...adminOnly, controller.getStats);
router.get('/', ...adminOnly, controller.getAll);
router.post('/', ...adminOnly, controller.create);
router.get('/:id', ...adminOnly, controller.getById);
router.put('/:id', ...adminOnly, controller.update);
router.patch('/:id/status', ...adminOnly, controller.updateStatus);
router.post('/:id/notes', ...adminOnly, controller.addNote);
router.delete('/:id', ...adminOnly, controller.remove);

module.exports = router;
