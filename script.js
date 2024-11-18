document.addEventListener('DOMContentLoaded', () => {
  const moodButtons = document.querySelectorAll('.mood-button');
  const dominantMoodDisplay = document.getElementById('dominantMoodDisplay');
  const quoteDisplay = document.getElementById('quoteDisplay');
  const daySummaryInput = document.getElementById('daySummaryInput');
  const saveMoodBtn = document.getElementById('saveMoodBtn');
  const moodHistoryDisplay = document.getElementById('moodHistoryDisplay');
  const deleteHistoryBtn = document.getElementById('deleteHistoryBtn');  // New Delete History Button
  const ctx = document.getElementById('moodChart').getContext('2d');  // Get the canvas context

  const moodKeywords = ['happy', 'sad', 'angry', 'calm', 'excited']; // Define the moods to track
  let moodHistory = []; // Store mood history

  // Define a set of inspirational quotes based on mood
  const quotes = {
      happy: [
          "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
          "The only way to do great work is to love what you do. - Steve Jobs"
      ],
      sad: [
          "It's okay to not be okay, but it's not okay to stay that way. - Unknown",
          "Tears are words the heart can't express. - Unknown"
      ],
      angry: [
          "Anger is one letter short of danger. - Eleanor Roosevelt",
          "Holding onto anger is like drinking poison and expecting the other person to die. - Buddha"
      ],
      calm: [
          "Peace comes from within. Do not seek it without. - Buddha",
          "Calmness is the cradle of power. - Josiah Gilbert Holland"
      ],
      excited: [
          "Excitement is the little spark that sets the world on fire. - Unknown",
          "The most exciting thing is not knowing what will happen next. - Unknown"
      ]
  };

  // Count the moods in the day summary
  function countMoods(summary) {
      const moodCounts = {
          happy: 0,
          sad: 0,
          angry: 0,
          calm: 0,
          excited: 0
      };

      const summaryLower = summary.toLowerCase(); // Convert text to lowercase for case-insensitive search

      // Count occurrences of each mood keyword in the summary
      moodKeywords.forEach(mood => {
          const regex = new RegExp(`\\b${mood}\\b`, 'g');
          const matches = summaryLower.match(regex);
          if (matches) {
              moodCounts[mood] = matches.length;
          }
      });

      return moodCounts;
  }

  // Analyze and display the mood count
  function analyzeAndDisplayMoodCount() {
      const summary = daySummaryInput.value.trim();
      if (summary === '') {
          dominantMoodDisplay.textContent = 'Please enter a day summary.';
          return;
      }

      const moodCounts = countMoods(summary);

      // Find the mood with the highest count
      let dominantMood = '';
      let maxCount = 0;
      moodKeywords.forEach(mood => {
          if (moodCounts[mood] > maxCount) {
              maxCount = moodCounts[mood];
              dominantMood = mood;
          }
      });

      if (dominantMood) {
          dominantMoodDisplay.textContent = `Your dominant mood is: ${dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1)} (${maxCount} occurrences)`;
          displayQuote(dominantMood);  // Display a quote based on the dominant mood
      } else {
          dominantMoodDisplay.textContent = 'No dominant mood found.';
      }

      // Update the graph with the mood counts
      updateMoodGraph(moodCounts);

      // Save the current mood summary in history
      moodHistory.push({
          summary: summary,
          moodCounts: moodCounts
      });

      // If history is visible, update the display
      if (moodHistoryDisplay.style.display !== 'none') {
          displayMoodHistory();
      }
  }

  // Function to update the graph with new mood counts
  function updateMoodGraph(moodCounts) {
      new Chart(ctx, {
          type: 'bar',  // You can change this to 'pie' or 'line' for different types of graphs
          data: {
              labels: Object.keys(moodCounts), // 'happy', 'sad', etc.
              datasets: [{
                  label: 'Mood Counts',
                  data: Object.values(moodCounts), // [count of happy, count of sad, ...]
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',  // Color for happy
                      'rgba(54, 162, 235, 0.2)',  // Color for sad
                      'rgba(255, 206, 86, 0.2)',  // Color for angry
                      'rgba(75, 192, 192, 0.2)',  // Color for calm
                      'rgba(153, 102, 255, 0.2)'  // Color for excited
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
  }

  // Function to display an inspirational quote based on the dominant mood
  function displayQuote(mood) {
      const moodQuotes = quotes[mood];
      const randomQuote = moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
      quoteDisplay.innerHTML = `<p>"${randomQuote}"</p>`;
  }

  // Save mood and day summary (with history)
  async function saveMood() {
      const summary = daySummaryInput.value.trim();
      if (summary === '') {
          alert('Please enter a day summary!');
          return;
      }

      // Analyze and display the mood counts and save history
      analyzeAndDisplayMoodCount();

      // Send the mood data to the backend
      const dominantMood = dominantMoodDisplay.textContent.split(' ')[3].toLowerCase();  // Extract dominant mood from the display
      try {
          const response = await fetch('http://localhost:5000/api/moods', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  mood: dominantMood,
                  summary: summary,
              }),
          });
          if (response.ok) {
              alert('Mood saved successfully!');
          } else {
              alert('Failed to save mood. Try again later.');
          }
      } catch (error) {
          alert('Error: ' + error.message);
      }
  }

  // Display mood history
  function displayMoodHistory() {
      moodHistoryDisplay.innerHTML = '';
      moodHistory.forEach((entry, index) => {
          const historyItem = document.createElement('div');
          historyItem.innerHTML = `<strong>Entry ${index + 1}</strong><br>Summary: ${entry.summary}<br>Mood Counts: ${JSON.stringify(entry.moodCounts)}<hr>`;
          moodHistoryDisplay.appendChild(historyItem);
      });
  }

  // Delete mood history
  function deleteMoodHistory() {
      moodHistory = [];
      moodHistoryDisplay.innerHTML = 'No history available.';
  }

  // Event listener for saving mood
  saveMoodBtn.addEventListener('click', saveMood);

  // Event listener for deleting mood history
  deleteHistoryBtn.addEventListener('click', deleteMoodHistory);

  // Add event listeners for mood buttons (example)
  moodButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          analyzeAndDisplayMoodCount();
      });
  });
});
