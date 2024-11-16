const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  dominantMood: String,
  moodHistory: Array,
  quote: String,
  daySummary: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;
