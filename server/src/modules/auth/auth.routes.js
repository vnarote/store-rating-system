const express = require('express');
const controller = require('./auth.controller');
const { registerRules, loginRules, changePasswordRules } = require('./auth.validation');
const { validate } = require('../../middlewares/validation.middleware');
const { authenticateUser } = require('../../middlewares/auth.middleware');
const { authRateLimiter } = require('../../middlewares/rateLimit.middleware');

const router = express.Router();

router.post('/register', authRateLimiter, validate(registerRules), controller.register);
router.post('/login', authRateLimiter, validate(loginRules), controller.login);
router.get('/me', authenticateUser, controller.getMe);
router.patch('/change-password', authenticateUser, validate(changePasswordRules), controller.changePassword);

module.exports = router;
