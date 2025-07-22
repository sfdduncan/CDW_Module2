 // Import the functions you need from the SDKs you need

// Firebase Poll App - Tutorial JavaScript
// This script demonstrates how to integrate Firebase Realtime Database with a simple web app
// It shows real-time data synchronization across multiple users

// Wait for the DOM (Document Object Model) to be fully loaded before running any code
// This ensures all HTML elements exist before we try to access them
document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // STEP 1: FIREBASE CONFIGURATION
  // ========================================
  // Firebase configuration object - this connects your app to your Firebase project
  // You get these values from your Firebase Console (https://console.firebase.google.com)
  // 
  // To set up Firebase:
  // 1. Go to Firebase Console and create a new project
  // 2. Add a web app to your project
  // 3. Copy the config object that Firebase provides
  // 4. Replace the values below with your actual Firebase config
  
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD1zeh5FfFjlgcocBXks_9F2_hBtv_qirY",
    authDomain: "poll-project-test.firebaseapp.com",
    projectId: "poll-project-test",
    storageBucket: "poll-project-test.firebasestorage.app",
    messagingSenderId: "442949328082",
    appId: "1:442949328082:web:1769cdfb7d8412fac4210b",
    measurementId: "G-6R9QP7NY6X"
  };


  // Initialize Firebase - this connects your app to Firebase services
  // firebase.initializeApp() sets up the connection using your configuration
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the Firebase Realtime Database
  // This is like getting a "handle" to your database that you can use to read/write data
  const database = firebase.database();

  // ========================================
  // STEP 2: GET REFERENCES TO HTML ELEMENTS
  // ========================================
  // We need to get references to the HTML elements we want to update
  // This is like getting "handles" to the parts of the webpage we want to change

  const noneButton = document.getElementById('vote-none')
  const sometimesButton = document.getElementById('vote-sometimes')
  const neutralButton = document.getElementById('vote-neutral')
  const mosttimesButton = document.getElementById('vote-mosttimes')
  const allButton = document.getElementById('vote-all')

  const noneCount = document.getElementById('count-none')
  const sometimesCount = document.getElementById('count-sometimes')
  const neutralCount = document.getElementById('count-neutral')
  const mosttimesCount = document.getElementById('count-mosttimes')
  const allCount = document.getElementById('count-all')
  const myTotalVotes = document.getElementById('total-votes');
  const myConnectionStatus = document.getElementById('connection-status');

 /* const yesButton = document.getElementById('vote-yes');
  const noButton = document.getElementById('vote-no');
  const yesCount = document.getElementById('yes-count');
  const noCount = document.getElementById('no-count');
  const totalVotes = document.getElementById('total-votes');
  const connectionStatus = document.getElementById('connection-status');*/ 

  // ========================================
  // STEP 3: SET UP REAL-TIME DATABASE LISTENERS
  // ========================================
  // Firebase Realtime Database can automatically update your app when data changes
  // We use .on('value') to listen for any changes to our poll data
  
  // Listen for changes to the 'yes' votes in the database
  // This function runs every time the 'yes' vote count changes in Firebase
const voteOptions = ['none', 'sometimes', 'neutral', 'mosttimes', 'all'];
const voteCounts = {
  none: noneCount,
  sometimes: sometimesCount,
  neutral: neutralCount,
  mosttimes: mosttimesCount,
  all: allCount
};

voteOptions.forEach(option => {
  database.ref(`poll/${option}`).on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    voteCounts[option].textContent = count;
    updateTotalVotes();
    console.log(`${option} votes updated:`, count);
  });
});


  // ========================================
  // STEP 4: SET UP BUTTON EVENT LISTENERS
  // ========================================
  // When users click the vote buttons, we need to update the database
  // Firebase will then automatically update all other connected users
  
  // Handle "Yes" vote button clicks
const voteButtons = {
  none: noneButton,
  sometimes: sometimesButton,
  neutral: neutralButton,
  mosttimes: mosttimesButton,
  all: allButton
};

voteOptions.forEach(option => {
  voteButtons[option].addEventListener('click', function () {
    console.log(`${option} button clicked`);
    database.ref(`poll/${option}`).once('value')
      .then(snapshot => {
        const currentCount = snapshot.val() || 0;
        return database.ref(`poll/${option}`).set(currentCount + 1);
      })
      .then(() => {
        console.log(`${option} vote recorded successfully`);
        showVoteConfirmation(option);
      })
      .catch(error => {
        console.error(`Error recording ${option} vote:`, error);
        showError('Failed to record vote. Please try again.');
      });
  });
});

  // ========================================
  // STEP 5: HELPER FUNCTIONS
  // ========================================
  // These functions help us manage the user interface and provide feedback
  
  /**
   * updateTotalVotes Function
   * Purpose: Calculate and display the total number of votes
   * This function runs whenever either vote count changes
   */
function updateTotalVotes() {
  let total = 0;
  voteOptions.forEach(option => {
    total += parseInt(voteCounts[option].textContent) || 0;
  });
  myTotalVotes.textContent = total;
}


  /**
   * showVoteConfirmation Function
   * Purpose: Show a brief confirmation message when a vote is recorded
   * @param {string} vote - The vote that was recorded ('Yes' or 'No')
   */
  function showVoteConfirmation(vote) {
    // Create a temporary confirmation message
    const confirmation = document.createElement('div');
    confirmation.className = 'vote-confirmation';
    confirmation.textContent = `Thank you for voting "${vote}"!`;
    confirmation.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add the confirmation to the page
    document.body.appendChild(confirmation);
    
    // Remove the confirmation after 3 seconds
    setTimeout(function() {
      confirmation.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(function() {
        if (confirmation.parentNode) {
          confirmation.parentNode.removeChild(confirmation);
        }
      }, 300);
    }, 3000);
  }

  /**
   * showError Function
   * Purpose: Show an error message if something goes wrong
   * @param {string} message - The error message to display
   */
  function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
    `;
    
    document.body.appendChild(error);
    
    setTimeout(function() {
      if (error.parentNode) {
        error.parentNode.removeChild(error);
      }
    }, 5000);
  }

  // ========================================
  // STEP 6: CONNECTION STATUS MONITORING
  // ========================================
  // Firebase provides connection status information
  // This helps us know if we're connected to the database
  
  // Listen for connection state changes
  database.ref('.info/connected').on('value', function(snapshot) {
    const connected = snapshot.val();
    
    if (connected) {
      // We're connected to Firebase
      connectionStatus.innerHTML = '<p style="color: #4CAF50;">✅ Connected to Firebase</p>';
      console.log('Connected to Firebase');
    } else {
      // We're not connected to Firebase
      connectionStatus.innerHTML = '<p style="color: #f44336;">❌ Disconnected from Firebase</p>';
      console.log('Disconnected from Firebase');
    }
  });

  // ========================================
  // STEP 7: INITIALIZATION
  // ========================================
  // Set up any initial state when the page loads
  
  // Initialize vote counts to 0 if they don't exist in the database
  // This ensures we start with a clean slate
database.ref('poll').once('value')
  .then(function(snapshot) {
    if (!snapshot.exists()) {
      const initialVotes = {};
      voteOptions.forEach(option => initialVotes[option] = 0);
      return database.ref('poll').set(initialVotes);
    }
  })
  .then(function() {
    console.log('Poll initialized successfully');
  })
  .catch(function(error) {
    console.error('Error initializing poll:', error);
  });

});
