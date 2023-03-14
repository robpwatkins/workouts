const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  abbreviation: {
    type: String,
    required: true
  },
  primary: {
    type: String,
    required: true
  },
  secondary: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Team', teamSchema);