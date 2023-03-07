const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

require('./config/passport')(passport);

const app = express();

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log(`Connected to DB and listening on port ${port}!!`))
  })
  .catch((error) => console.log('error: ', error));

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
app.use('/auth', require('./routes/auth'));

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('http://localhost:3000/');
//   });

app.get('/getuser', (req, res) => {
  res.json({ user: req.user });
})
  
