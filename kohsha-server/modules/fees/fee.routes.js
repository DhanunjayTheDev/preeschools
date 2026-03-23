const express = require('express');
const router = express.Router();
const controller = require('./fee.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

const superAdminOnly = [authenticate, authorize(ROLES.SUPER_ADMIN)];
const adminOnly = [authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN)];

// Fee Plans - Only SUPER_ADMIN can create/update/delete, ADMIN can view
router.get('/plans', authenticate, controller.getFeePlans);
router.post('/plans', ...superAdminOnly, controller.createFeePlan);
router.get('/plans/:id', authenticate, controller.getFeePlanById);
router.put('/plans/:id', ...superAdminOnly, controller.updateFeePlan);
router.delete('/plans/:id', ...superAdminOnly, controller.deleteFeePlan);

// Fee Assignments - ADMIN and SUPER_ADMIN can assign
router.post('/assign', ...adminOnly, controller.assignFeePlan);
router.get('/assignments', ...adminOnly, controller.getFeeAssignments);
router.get('/student/:studentId', authenticate, controller.getStudentFees);
router.get('/my-fees', authenticate, authorize(ROLES.PARENT), controller.getMyFees);

// Payments - ADMIN and SUPER_ADMIN only
router.get('/stats', ...adminOnly, controller.getFeeStats);
router.post('/payments', ...adminOnly, controller.recordPayment);
router.get('/payments', ...adminOnly, controller.getAllPayments);
router.get('/payments/student/:studentId', authenticate, controller.getPaymentHistory);
router.get('/payments/:paymentId/receipt', authenticate, controller.downloadReceipt);

// Payment Links (Razorpay + WhatsApp/SMS)
router.post('/payment-link/:feeAssignmentId/generate', authenticate, controller.generatePaymentLink);
router.post('/payment-link/:feeAssignmentId/send', authenticate, controller.sendPaymentLink);
router.get('/payment/callback', controller.paymentCallback);

module.exports = router;
