const express = require('express');
const router = express.Router();
const service = require('./notification.service');
const { authenticate } = require('../../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await service.getNotifications(req.user._id, req.query);
    res.json(result);
  } catch (error) { next(error); }
});

router.patch('/:id/read', authenticate, async (req, res, next) => {
  try {
    await service.markAsRead(req.params.id, req.user._id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) { next(error); }
});

router.patch('/read-all', authenticate, async (req, res, next) => {
  try {
    await service.markAllAsRead(req.user._id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) { next(error); }
});

module.exports = router;
