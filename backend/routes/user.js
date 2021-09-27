const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const limiter = require('../middlewares/rate-limit');
const validator = require('../middlewares/validate-user');

router.post('/signup', validator, userCtrl.signup);
router.post('/login', validator, limiter.maxConnections, userCtrl.login);

module.exports = router;