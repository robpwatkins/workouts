const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET_DEV, { expiresIn: '3d' });
};

const loginUser = async (req, res) => {
  const token = req.user.generateJWT();
  const me = req.user.toJSON();
  res.cookie('x-auth-cookie', token);
  res.json({ token, me });
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    const token = createToken(user._id);

    res.cookie('x-auth-cookie', token);
    res.redirect(process.env.CLIENT_URL_DEV);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };