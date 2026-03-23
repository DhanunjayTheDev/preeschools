const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

const adminOnly = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN)];

router.get('/teachers', ...adminOnly, controller.getTeachers);
router.put('/teachers/:id/assign-classes', ...adminOnly, controller.assignClasses);
router.get('/', ...adminOnly, controller.getAll);
router.get('/:id', ...adminOnly, controller.getById);
router.put('/:id', ...adminOnly, controller.update);
router.patch('/:id/toggle-active', ...adminOnly, controller.toggleActive);
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN), controller.remove);

module.exports = router;
