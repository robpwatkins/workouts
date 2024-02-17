const { Strategy: GoogleStrategy} = require('passport-google-oauth20');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const bcrypt = require('bcrypt');
const { getUniqueUsername } = require('../utils/username');
const User = require('../models/userModel');

require('dotenv').config();

module.exports = function(passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (user && user.provider !== 'email') {
        return done(null, false, { message: `Please log in with your original method (${user.provider})` });
      }
    
      if (!user) return done(null, false, { message: 'Email does not exist'});
    
      const match = await bcrypt.compare(password, user.password);
    
      if (!match) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      console.error('error: ', err);
      return done(err);
    }
  }));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    const [{ value: email }] = profile.emails;

    const newUser = {
      googleId: profile.id,
      email,
      username: email,
      username_customized: false,
      provider: 'google'
    }

    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) done(null, user);
      else {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user && user.provider !== 'google') {
          const message = `Please log in with your original method (${user.provider})`;
          return done(null, false, { message });
        }

        console.log('newUser: ', newUser);

        user = await User.create(newUser);
        
        done(null, user);
      }
    } catch (err) {
      console.error('error: ', err);
      return done(err.message);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: [
      'id',
      'email'
    ],
  },
  async (accessToken, refreshToken, profile, done) => {
    const [{ value: email }] = profile.emails;

    const newUser = {
      facebookId: profile.id,
      email,
      username: email,
      username_customized: false,
      provider: 'facebook'
    };

    try {
      let user = await User.findOne({ facebookId: profile.id });

      if (user) done(null, user);
      else {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user && user.provider !== 'facebook') {
          const message = `Please log in with your original method (${user.provider})`;
          return done(null, false, { message });
        }

        user = await User.create(newUser);
        done(null, user);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }));

  passport.serializeUser((user, cb) => cb(null, user.id));

  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await User.findById(id);
      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  });
}

