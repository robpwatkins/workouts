const { Strategy: GoogleStrategy} = require('passport-google-oauth20');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
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
      provider: 'google',
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      image: profile.photos[0].value
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
  }))

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
}

