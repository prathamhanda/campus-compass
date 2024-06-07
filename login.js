// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCvREhB11XEKijIhrR-1KEd3CznIazuZNc",
  authDomain: "campuscompass-a690a.firebaseapp.com",
  projectId: "campuscompass-a690a",
  storageBucket: "campuscompass-a690a.appspot.com",
  messagingSenderId: "792133827344",
  appId: "1:792133827344:web:bf159c2f4b85355cc34395"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('full_name').value;
  const favourite_song = document.getElementById('favourite_song').value;
  const milk_before_cereal = document.getElementById('milk_before_cereal').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
      alert('Email or Password is Outta Line!!');
      return;
  }
  if (!validate_field(full_name) || !validate_field(favourite_song) || !validate_field(milk_before_cereal)) {
      alert('One or More Extra Fields is Outta Line!!');
      return;
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
      .then(function () {
          // Declare user variable
          var user = auth.currentUser;

          // Add this user to Firebase Database
          var database_ref = database.ref();

          // Create User data
          var user_data = {
              email: email,
              full_name: full_name,
              favourite_song: favourite_song,
              milk_before_cereal: milk_before_cereal,
              last_login: Date.now()
          };

          // Push to Firebase Database
          database_ref.child('users/' + user.uid).set(user_data);

          // Done
          alert('User Created!!');
      })
      .catch(function (error) {
          // Firebase will use this to alert of its errors
          var error_message = error.message;
          alert(error_message);
      });
}

// Set up our login function
function login() {
  // Get all our input fields
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return; // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User data
      var user_data = {
        last_login: Date.now()
      };

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data);

      // // Done
      // alert('User Logged In! Redirecting...');

      // Redirect to google.com
      window.location.href = 'roomfind.html';
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;

      alert(error_message);
    });
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  return password.length >= 6;
}

function validate_field(field) {
  return field != null && field.length > 0;
}
