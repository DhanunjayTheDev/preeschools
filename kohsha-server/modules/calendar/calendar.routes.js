const express = require('express');
const router = express.Router();
const controller = require('./calendar.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

const adminOnly = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN)];

router.get('/holidays', authenticate, controller.getHolidays);
router.get('/', authenticate, controller.getAll);
router.post('/', ...adminOnly, controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', ...adminOnly, controller.update);
router.delete('/:id', ...adminOnly, controller.remove);

module.exports = router;
