const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema, changePasswordSchema } = require('./auth.validation');
const { ROLES } = require('../../config/constants');

router.post('/register', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
