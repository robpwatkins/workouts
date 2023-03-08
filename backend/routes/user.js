const express = require('express');
const requireJwtAuth = require('../middleware/requireJwtAuth');

const { loginUser, signupUser } = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/me', requireJwtAuth, (req, res) => {
  const me = req.user.toJSON();
  res.json({ me });
});

module.exports = router;