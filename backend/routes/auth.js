const express = require('express');
const passport = require('passport');

const router = express.Router();

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const token = req.user.generateJWT();
    res.cookie('x-auth-cookie', token);
    res.redirect(clientUrl);
  },
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  }),
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    // console.log(req.user);
    const token = req.user.generateJWT();
    res.cookie('x-auth-cookie', token);
    res.redirect(clientUrl);
  },
);

module.exports = router;