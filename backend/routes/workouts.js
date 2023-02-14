const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ msg: 'GET all workouts' });
});

router.get('/:id', (req, res) => {
  res.json({ msg: `GET a workout with id ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ msg: 'POST a new workout' });
});

router.delete('/:id', (req, res) => {
  res.json({ msg: `DELETE a workout with id ${req.params.id}` });
});

router.patch('/:id', (req, res) => {
  res.json({ msg: `UPDATE a workout with id ${req.params.id}` });
});

module.exports = router;