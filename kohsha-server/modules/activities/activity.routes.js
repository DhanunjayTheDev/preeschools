const express = require('express');
const router = express.Router();
const controller = require('./activity.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');
const { createUploader } = require('../../middleware/upload');

const upload = createUploader('activities');
const staff = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER)];

router.get('/my', authenticate, authorize(ROLES.TEACHER), controller.getMyActivities);
router.get('/parent', authenticate, authorize(ROLES.PARENT), controller.getForParent);
router.get('/', ...staff, controller.getAll);
router.post('/', ...staff, upload.array('attachments', 5), controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', ...staff, controller.update);
router.delete('/:id', ...staff, controller.remove);
router.post('/:id/submissions', authenticate, upload.array('attachments', 3), controller.addSubmission);

module.exports = router;
