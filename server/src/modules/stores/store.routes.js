const express = require('express');
const controller = require('./store.controller');
const { authenticateUser } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const { validate, uuidParam } = require('../../middlewares/validation.middleware');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authenticateUser, authorizeRoles(ROLES.NORMAL_USER));

// Searching is done on the list endpoint: GET /api/stores?name=...&address=...
router.get('/', controller.listStores);
router.get('/:id', validate([uuidParam()]), controller.getStore);

module.exports = router;
