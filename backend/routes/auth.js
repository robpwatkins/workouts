const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (!user) return res.status(401).json({ message: info.message });
    req.login(user, (err) => {
      if (err) return next(err);
    });
    req.session.save(() => res.json(user));
  })(req, res, next);
});

router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    req.login(user, (err) => {
      if (err) return next(err);
    });
    req.session.save(() => res.json(user));
  } catch (err) {
    console.log('err: ', err);
    res.status(400).json({ message: err.message });
  }
});

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/', failureMessage: true }),
  (req, res) => res.redirect(clientUrl),
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/', failureMessage: true }),
  (req, res) => res.redirect(clientUrl),
);

module.exports = router;