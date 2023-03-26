const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pickSchema = new Schema({
  series_id: {
    type: String,
    required: true
  },
  pick: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Pick', pickSchema);