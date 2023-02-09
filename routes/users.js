const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const user = require('../controllers/user');

router.route('/register')
    .get(user.registerForm)
    .post(user.create);

router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), user.login);

router.get('/logout', user.logout);

module.exports = router;