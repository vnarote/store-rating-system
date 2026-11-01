const express = require('express');
const ApiResponse = require('../utils/ApiResponse');
const MESSAGES = require('../constants/messages');

const router = express.Router();

router.get('/health', (_req, res) =>
  ApiResponse.success(res, { message: MESSAGES.HEALTH_OK, data: { uptime: process.uptime() } }),
);

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/admin', require('../modules/admin/admin.routes'));
router.use('/stores', require('../modules/stores/store.routes'));
router.use('/ratings', require('../modules/ratings/rating.routes'));
router.use('/owner', require('../modules/owner/owner.routes'));

module.exports = router;
