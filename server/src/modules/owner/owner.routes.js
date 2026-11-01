const express = require('express');
const controller = require('./owner.controller');
const { listRatingsRules } = require('./owner.validation');
const { authenticateUser } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const { validate } = require('../../middlewares/validation.middleware');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authenticateUser, authorizeRoles(ROLES.STORE_OWNER));

router.get('/dashboard', controller.getDashboard);
router.get('/store', controller.getStores);
router.get('/ratings', validate(listRatingsRules), controller.listRatings);

module.exports = router;
