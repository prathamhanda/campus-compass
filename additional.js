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

function addRow() {
    const dynamicRows = document.getElementById('dynamic-rows');
    const newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.innerHTML = `
        <input type="text" placeholder="Subject Name">
        <input type="text" placeholder="Room Number">
    `;
    dynamicRows.appendChild(newRow);
}

function submitData() {
    const year = document.getElementById('year').value;
    const subgroup = document.getElementById('subgroup').value;
    const dynamicRows = document.getElementById('dynamic-rows').getElementsByClassName('row');
    let subjects = [];
    for (let row of dynamicRows) {
        const subjectName = row.children[0].value;
        const roomNumber = row.children[1].value;
        subjects.push({ subjectName, roomNumber });
    }

    // Get the current user
    const user = auth.currentUser;
    if (user) {
        // Write additional info to the user's node in Firebase Realtime Database
        const userRef = database.ref('users/' + user.uid);
        userRef.update({
            year: year,
            subgroup: subgroup,
            subjects: subjects,
            additional_info_provided: true // Update the flag
        }).then(() => {
            alert('Data submitted successfully!');
            // Redirect to the dashboard or home page
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Error submitting data:', error);
        });
    } else {
        alert('No user is currently logged in.');
    }
}