const Team = require('../models/Team');

const getTeams = async (req, res) => {
  const teams = await Team.find();
  res.status(200).json(teams);
};

const createTeam = async (req, res) => {
  const { name, abbreviation, primary, secondary } = req.body;

  try {
    const team = await Team.create({ name, abbreviation, primary, secondary });
    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getTeams, createTeam };