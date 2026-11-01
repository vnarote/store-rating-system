const express = require('express');
const controller = require('./admin.controller');
const { createUserRules } = require('./admin.validation');
const { createStoreRules } = require('../stores/store.validation');
const { authenticateUser } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const { validate, uuidParam } = require('../../middlewares/validation.middleware');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authenticateUser, authorizeRoles(ROLES.SYSTEM_ADMIN));

router.get('/dashboard', controller.getDashboard);

router.post('/users', validate(createUserRules), controller.createUser);
router.get('/users', controller.listUsers);
router.get('/users/:id', validate([uuidParam()]), controller.getUser);

router.post('/stores', validate(createStoreRules), controller.createStore);
router.get('/stores', controller.listStores);
router.get('/stores/:id', validate([uuidParam()]), controller.getStore);

module.exports = router;
