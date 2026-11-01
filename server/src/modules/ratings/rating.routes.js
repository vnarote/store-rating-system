const express = require('express');
const controller = require('./rating.controller');
const { createRatingRules, updateRatingRules } = require('./rating.validation');
const { authenticateUser } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const { validate, uuidParam } = require('../../middlewares/validation.middleware');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authenticateUser, authorizeRoles(ROLES.NORMAL_USER));

router.get('/my-ratings', controller.listMyRatings);
router.post('/', validate(createRatingRules), controller.submitRating);
router.patch('/:id', validate([uuidParam(), ...updateRatingRules]), controller.updateRating);

module.exports = router;
