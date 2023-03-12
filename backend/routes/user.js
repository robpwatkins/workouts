const express = require('express');
const requireLocalAuth = require('../middleware/requireLocalAuth');
const { loginUser, signupUser } = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/me', (req, res) => {
  const me = req.user.toJSON();
  res.json({ me });
});

module.exports = router;