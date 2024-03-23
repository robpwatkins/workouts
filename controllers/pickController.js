const Pick = require('../models/pickModel');
const mongoose = require('mongoose');

const { isValid } = mongoose.Types.ObjectId;

const getPicks = async (req, res) => {
  const search = !req.params.all ? { user_id: req.user._id } : {};
  const picks = await Pick.find(search);
  res.status(200).json(picks);
};

const getPick = async (req, res) => {
  const { id } = req.params;
  if (!isValid(id)) return res.status(404).json({ error: 'No such pick' });
  const pick = await Pick.findById(id);
  if (!pick) return res.status(404).json({ error: 'No such pick' });
  res.status(200).json(pick);
}

const createPick = async (req, res) => {
  const { series_id, pick } = req.body;

  try {
    const { _id: user_id } = req.user;
    const newPick = await Pick.create({ series_id, pick, user_id });
    res.status(200).json(newPick);
  } catch (error) {
    console.log('error!: ', error);
    res.status(400).json({ error: error.message });
  }
};

const updatePick = async (req, res) => {
  const { id } = req.params;
  if (!isValid(id)) return res.status(404).json({ error: 'No such pick' });
  const pick = await Pick.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
  if (!pick) return res.status(404).json({ error: 'No such pick' });
  res.status(200).json(pick);
};

const deletePick = async (req, res) => {
  const { id } = req.params;

  if (!isValid(id)) return res.status(404).json({ error: 'No such pick' });

  const pick = await Pick.findOneAndDelete({ _id: id });

  if (!pick) return res.status(404).json({ error: 'No such pick' });

  res.status(200).json(pick);
};

const deleteAllPicks = async (req, res) => {
  const picks = await Pick.find({});

  console.log('picks: ', picks);
};

module.exports = {
  getPicks,
  getPick,
  createPick,
  updatePick,
  deletePick,
  deleteAllPicks
};