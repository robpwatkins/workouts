const express = require('express');
const routes = require('./routes/workouts');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/workouts', routes);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`listening on port ${port}!!`));