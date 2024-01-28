const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    req.login(user, (err) => {
      if (err) return next(err);
    });
    user.last_login = Date.now();
    user.save();
    req.session.save(() => res.json(user));
  } catch (err) {
    console.log('err: ', err);
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (!user) return res.status(401).json({ message: info.message });
    req.login(user, (err) => {
      if (err) return next(err);
    });
    user.last_login = Date.now();
    user.save();
    req.session.save(() => res.json(user));
  })(req, res, next);
});

const clientUrl = process.env.NODE_ENV === 'development' ? process.env.CLIENT_URL_DEV : process.env.CLIENT_URL_PROD;

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${clientUrl}/login`, failureMessage: true }),
  (req, res) => {
    const redirectUrl = req.user.last_login ? clientUrl : `${clientUrl}/username`;
    req.user.last_login = Date.now();
    req.user.save();
    res.redirect(redirectUrl);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${clientUrl}/login`, failureMessage: true }),
  (req, res) => {
    const redirectUrl = req.user.last_login ? clientUrl : `${clientUrl}/username`;
    req.user.last_login = Date.now();
    req.user.save();
    res.redirect(redirectUrl);
  }
);

module.exports = router;