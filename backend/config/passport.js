const { Strategy: GoogleStrategy} = require('passport-google-oauth20');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

module.exports = function(passport) {
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
        user = await User.create(newUser);
        done(null, user);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }));

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
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      if (!email || !password) return done(null, false, { message: 'All fields must be filled' });
  
      const user = await User.findOne({ email });
    
      if (!user) return done(null, false, { message: 'Email does not exist'});
    
      const match = bcrypt.compare(password, user.password);
    
      if (!match) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      console.error('error: ', err);
      return done(err);
    }
  }));
}

