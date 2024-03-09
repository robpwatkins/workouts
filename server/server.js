const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const pickRoutes = require('./routes/picks');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const User = require('./models/userModel');
const { getAllSeries } = require('./plugins/googleDrive');

require('dotenv').config();

require('./config/passport')(passport);

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 120 * 1000 },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/picks', pickRoutes);
app.use('/api/user', userRoutes);
app.use('/auth', authRoutes);

app.get('/user', (req, res) => {
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

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log('error: ', error);
  }
})

app.patch('/user/update/:userId?', async (req, res) => {
  try {
    const _id = !!(req.user.admin && req.params.userId) ? req.params.userId : req.user._id;
    const user = await User.findById({ _id });

    const { username, total_wins, total_losses } = req.body;

    if (username) {
      user.username = username;
      user.username_customized = true;
    } else if (total_wins && total_losses) {
      user.total_wins = total_wins;
      user.total_losses = total_losses;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.log('error: ', error);
  }
});

app.delete('/user/delete/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const response = await user.delete();
  res.json(response);
})

app.get('/username-check', async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  res.json(!!user);
})

app.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      console.log('err: ', err);
      return next(err);
    }
    console.log('logged out');
    return res.json('success');
  });
});

app.get('/all-series', async (req, res) => {
  const allSeries = await getAllSeries('1YJw6UclwKyGjdwns9vgU3VrivderKfpM3FPKIRR6uVE', 'Series');
  res.json(allSeries);
})

app.get('/ping', (req, res) => res.send('pong!'));

// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", (_, res) => {
//   res.sendFile(
//     path.join(__dirname, "./client/build/index.html"),
//     (err) => res.status(500).send(err)
//   );
// });

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log(`Connected to DB and listening on port ${port}!!`))
  })
  .catch((error) => console.log('error: ', error));
