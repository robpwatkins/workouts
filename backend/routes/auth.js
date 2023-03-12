const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');

const router = express.Router();

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => res.json(req.user));

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
    throw err;
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect(clientUrl),
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => res.redirect(clientUrl),
);

module.exports = router;