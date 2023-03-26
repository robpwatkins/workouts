const Pick = require('../models/pickModel');
const mongoose = require('mongoose');

const { isValid } = mongoose.Types.ObjectId;

const getPicks = async (req, res) => {
  const user_id = req.user._id;
  const picks = await Pick.find({ user_id });
  res.status(200).json(picks);
};

// const getWorkout = async (req, res) => {
//   const { id } = req.params;
//   if (!isValid(id)) return res.status(404).json({ error: 'No such workout' });
//   const workout = await Workout.findById(id);
//   if (!workout) return res.status(404).json({ error: 'No such workout' });
//   res.status(200).json(workout);
// }

const createPick = async (req, res) => {
  const { series_id, pick } = req.body;

  try {
    const { _id: user_id } = req.user;
    const newPick = await Pick.create({ series_id, pick, user_id });
    res.status(200).json(newPick);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const deleteWorkout = async (req, res) => {
//   const { id } = req.params;
//   if (!isValid(id)) return res.status(404).json({ error: 'No such workout' });
//   const workout = await Workout.findOneAndDelete({ _id: id });
//   if (!workout) return res.status(404).json({ error: 'No such workout' });
//   res.status(200).json(workout);
// };

const updatePick = async (req, res) => {
  const { id } = req.params;
  if (!isValid(id)) return res.status(404).json({ error: 'No such pick' });
  const pick = await Pick.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
  if (!pick) return res.status(404).json({ error: 'No such pick' });
  res.status(200).json(pick);
};

module.exports = {
  getPicks,
  // getWorkout,
  createPick,
  // deleteWorkout,
  updatePick
};