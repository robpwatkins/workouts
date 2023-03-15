const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const User = require('./models/userModel');

require('./config/passport')(passport);

const app = express();

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log(`Connected to DB and listening on port ${port}!!`))
  })
  .catch((error) => console.log('error: ', error));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 5 * 1000 },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
app.use('/auth', authRoutes);

app.get('/getuser', (req, res) => {
  try {
    if (req.session.messages && req.session.messages.length) {
      const [error] = req.session.messages;
      req.session.messages = [];
      return res.json({ error });
    }
    res.json({ user: req.user });
  } catch (error) {
    console.log('error: ', error);
  }
});

app.get('/username-check', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  res.json(!!user);
})

app.post('/logout', function(req, res, next) {
  req.logout(err => {
    if (err) {
      console.log('err: ', err);
      return next(err);
    }
    console.log('logged out');
    return res.json('success');
  });
});
