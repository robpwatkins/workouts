const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    required: false
  },
  provider: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  }
})

userSchema.statics.signup = async function(email, password) {
  if (!email || !password) throw Error('All fields must be filled');
  if (!validator.isEmail(email)) throw Error('Email is not valid');
  if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

  const exists = await this.findOne({ email });

  if (exists) throw Error('Email already in use');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
}

userSchema.statics.login = async function(email, password) {
  if (!email || !password) throw Error('All fields must be filled');

  const user = await this.findOne({ email });

  if (!user) throw Error('Incorrect email');

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw Error('Incorrect password');

  return user;
}

const secretOrKey = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET_PROD
  : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      id: this._id,
      provider: this.provider,
      email: this.email,
    },
    secretOrKey,
    { expiresIn: 60 }
  );
  return token;
};


module.exports = mongoose.model('User', userSchema);