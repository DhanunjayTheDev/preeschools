const express = require('express');
const router = express.Router();
const controller = require('./student.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');
const { createUploader } = require('../../middleware/upload');

const upload = createUploader('students');
const adminOnly = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN)];
const staff = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER)];

router.get('/stats', ...adminOnly, controller.getStats);
router.get('/my-children', authenticate, authorize(ROLES.PARENT), controller.getMyChildren);
router.get('/class/:className', ...staff, controller.getByClass);
router.get('/', ...staff, controller.getAll);
router.post('/', ...adminOnly, upload.single('photo'), controller.create);
router.get('/:id', ...staff, controller.getById);
router.put('/:id', ...adminOnly, upload.single('photo'), controller.update);
router.delete('/:id', ...adminOnly, controller.remove);

module.exports = router;
