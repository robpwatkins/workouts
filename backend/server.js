const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/workouts');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/workouts', routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log(`Connected to DB and listening on port ${port}!!`))
  })
  .catch((error) => console.log('error: ', error));

const port = process.env.PORT || 4000;
