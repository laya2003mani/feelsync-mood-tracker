const express = require('express');
const router = express.Router();
const Mood = require('C:\Users\layam\OneDrive\Desktop\feelsync google\mood-tracker-backend\models\mood.js');

// Route to get all moods
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (err) {
    res.status(400).send('Error retrieving moods');
  }
});

// Route to save a mood
router.post('/', async (req, res) => {
  const { dominantMood, moodHistory, quote, daySummary } = req.body;

  const newMood = new Mood({
    dominantMood,
    moodHistory,
    quote,
    daySummary
  });

  try {
    await newMood.save();
    res.status(201).send('Mood saved');
  } catch (err) {
    res.status(400).send('Error saving mood');
  }
});

module.exports = router;
