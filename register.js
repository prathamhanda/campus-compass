// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyANAjogJpTWdO-FslV97Ll4KGFdk2MkyVA",
    authDomain: "ccsproject-d9fec.firebaseapp.com",
    databaseURL: "https://ccsproject-d9fec-default-rtdb.firebaseio.com",
    projectId: "ccsproject-d9fec",
    storageBucket: "ccsproject-d9fec.appspot.com",
    messagingSenderId: "786062867145",
    appId: "1:786062867145:web:4d6eadca5d6190a16a6b18",
    measurementId: "G-2C1ZX12RR0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Set up our register function
function register() {
    console.log("Register function called");

    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('full_name').value;

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Full Name:", full_name);

    // Collect phone numbers and relations
    const phoneNumbers = [];
    const phoneContainers = document.querySelectorAll('.primary_phone_container');
    let validPhoneNumbers = true;

    phoneContainers.forEach(container => {
        const relation = container.querySelector('.relation').value;
        const number = container.querySelector('.number').value;
        if (relation && number) {
            if (!validate_phone_number(number)) {
                alert('Phone number must be exactly 10 digits long!');
                validPhoneNumbers = false;
                return;
            }
            phoneNumbers.push(`${relation}:${number}`);
        }
    });

    console.log("Phone Numbers:", phoneNumbers);

    // Stop registration if any phone number is invalid
    if (!validPhoneNumbers) {
        return;
    }

    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is out of Line!');
        return; // Don't continue running the code
    }
    if (!validate_field(full_name)) {
        alert('Full Name is Out of Line!');
        return;
    }

    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then(function() {
            console.log("User created successfully");

            // Declare user variable
            const user = auth.currentUser;

            // Add this user to Firebase Database
            const database_ref = database.ref();

            // Create User data
            const user_data = {
                email: email,
                full_name: full_name,
                phone_numbers: phoneNumbers,
                last_login: Date.now(),
                additional_info_provided: false // Flag for additional info
            };

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).set(user_data)
                .then(() => {
                    console.log("User data saved to database");
                    alert('User Created!!');
                    // Redirect to additional info page
                    window.location.href = 'additional.html';
                })
                .catch(error => {
                    console.error("Error saving user data to database:", error);
                    alert(error.message);
                });
        })
        .catch(function(error) {
            // Firebase will use this to alert of its errors
            const error_code = error.code;
            const error_message = error.message;
            console.error("Error creating user:", error_message);
            alert(error_message);
        });
}

// Set up our login function
function login() {
    console.log("Login function called");

    // Get all our input fields
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    console.log("Login Email:", email);
    console.log("Login Password:", password);

    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is out of Line!');
        return; // Don't continue running the code
    }

    // Move on with Auth
    auth.signInWithEmailAndPassword(email, password)
        .then(function() {
            console.log("User logged in successfully");

            // Declare user variable
            const user = auth.currentUser;

            // Get user data from Firebase Database
            const database_ref = database.ref();
            database_ref.child('users/' + user.uid).once('value').then(function(snapshot) {
                const user_data = snapshot.val();
                console.log("User data retrieved:", user_data);

                // Check if additional info is provided
                if (!user_data.additional_info_provided) {
                    // Redirect to additional info page
                    window.location.href = 'additional.html';
                } else {
                    // Display full name and phone numbers
                    displayUserInfo(user.uid);
                    alert('User Logged In!!');
                }
            });
        })
        .catch(function(error) {
            // Firebase will use this to alert of its errors
            const error_code = error.code;
            const error_message = error.message;
            console.error("Error logging in user:", error_message);
            alert(error_message);
        });
}

// Function to display full name and phone numbers
function displayUserInfo(userId) {
    console.log("Displaying user info for user ID:", userId);
    const database_ref = database.ref();
    database_ref.child('users/' + userId).once('value').then(function(snapshot) {
        const user_data = snapshot.val();
        console.log("User data:", user_data);

        const userInfoContainer = document.getElementById('user_info_container');
        userInfoContainer.innerHTML = ''; // Clear previous user info

        // Display full name
        const fullNameElement = document.createElement('h3');
        fullNameElement.textContent = `Full Name: ${user_data.full_name}`;
        userInfoContainer.appendChild(fullNameElement);

        // Display email
        const emailElement = document.createElement('p');
        emailElement.textContent = `Email: ${user_data.email}`;
        userInfoContainer.appendChild(emailElement);

        // Display phone numbers
        const contactsContainer = document.createElement('div');
        contactsContainer.innerHTML = '<h3>Contacts:</h3>';
        user_data.phone_numbers.forEach(phoneNumber => {
            const phoneNumberElement = document.createElement('p');
            phoneNumberElement.textContent = phoneNumber;
            contactsContainer.appendChild(phoneNumberElement);
        });
        userInfoContainer.appendChild(contactsContainer);

        // Create and append the button
        const button = document.createElement('button');
        button.textContent = 'New Action';
        button.id = 'permanent_button';
        button.style.padding = '10px 20px';
        button.style.background = 'linear-gradient(80deg, #FFBE0B, #FB5607 50%, #FF006E 50%, #8338EC)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.onclick = function() {
            handleButtonClick();
        };
        userInfoContainer.appendChild(button);
    });
}

// Function to handle button click
function handleButtonClick() {
    const user = auth.currentUser;
    if (user) {
        // User is logged in, check if timetable exists
        const userRef = database.ref('users/' + user.uid);
        userRef.once('value').then((snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.timetable) {
                // Timetable exists, redirect to options.html
                window.location.href = 'options.html';
            } else {
                // No timetable, redirect to timetable.html
                window.location.href = 'timetable.html';
            }
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    } else {
        // User is not logged in, show alert
        alert('Please log in first!');
    }
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

function validate_phone_number(number) {
    return number.length === 10 && /^\d+$/.test(number);
}