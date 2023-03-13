const express = require('express');
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
} = require('../controllers/workoutController');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const router = express.Router();

router.use(ensureAuth);

router.get('/', ensureAuth, getWorkouts);
router.get('/:id', ensureAuth, getWorkout);
router.post('/', ensureAuth, createWorkout);
router.delete('/:id', ensureAuth, deleteWorkout);
router.patch('/:id', ensureAuth, updateWorkout);

module.exports = router;