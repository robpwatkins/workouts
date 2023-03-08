const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

require('./config/passport')(passport);
app.use(passport.initialize());

// require('./services/jwtStrategy');
// require('./services/facebookStrategy');
// require('./services/googleStrategy');
// require('./services/localStrategy');

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
app.use('/auth', authRoutes);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log(`Connected to DB and listening on port ${port}!!`))
  })
  .catch((error) => console.log('error: ', error));

const port = process.env.PORT || 4000;
