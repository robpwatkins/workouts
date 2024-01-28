const User = require('../models/userModel');

const loginUser = async (req, res) => {
  // const token = req.user.generateJWT();

  // const user = req.user.toJSON();

  // res.cookie('x-auth-cookie', token);
  // res.json(user);
};

const signupUser = async (req, res) => {
  // const { email, password } = req.body;

  // try {
    // const user = await User.signup(email, password);

  //   const token = user.generateJWT();

  //   res.cookie('x-auth-cookie', token);
  //   res.json(user);
  // } catch (error) {
  //   res.status(400).json({ error: error.message });
  // }
};

module.exports = { loginUser, signupUser };