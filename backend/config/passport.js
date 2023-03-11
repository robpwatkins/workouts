const { Strategy: GoogleStrategy} = require('passport-google-oauth20');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

module.exports = function(passport) {
  const secretOrKey = process.env.NODE_ENV === 'production'
    ? process.env.JWT_SECRET_PROD
    : process.env.JWT_SECRET_DEV;
  
  passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
      secretOrKey,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
  
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        done(err, false);
      }
    },
  ));

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    // passReqToCallback: true,
  },
  async (email, password, done) => {
    try {
      if (!email || !password) return done(null, false, { message: 'All fields must be filled' });
  
      const user = await User.findOne({ email });
    
      if (!user) return done(null, false, { message: 'Email does not exist'});

      if (user.provider !== 'email') {
        const message = `Please log in with your original method (${user.provider})`;
        return done(null, false, { message });
      }
    
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
    const newUser = {
      googleId: profile.id,
      email: profile.emails[0].value,
      provider: 'google'
    }

    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) done(null, user);
      else {
        user = await User.fineOne({ email: profile.emails[0].value });

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
    const newUser = {
      facebookId: profile.id,
      email: profile.emails[0].value,
      provider: 'facebook'
    };

    try {
      let user = await User.findOne({ facebookId: profile.id });

      if (user) done(null, user);
      else {
        user = await User.create(newUser);
        done(null, user);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }));
}

