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

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, fetch the subjects
        const userRef = database.ref('users/' + user.uid);
        userRef.once('value').then((snapshot) => {
            const userData = snapshot.val();
            const subjects = userData.subjects || [];

            // Populate the timetable with the fetched subjects
            populateTimetable(subjects);
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    } else {
        alert('No user is currently logged in.');
    }
});

function populateTimetable(subjects) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    days.forEach(day => {
        const dayContainer = document.getElementById(day);
        addSubject(day, subjects);
    });
}

function addSubject(dayId, subjects) {
    const dayContainer = document.getElementById(dayId);
    const selectedSubjects = getSelectedSubjects(dayId);
    const newSubjectRow = document.createElement('div');
    newSubjectRow.className = 'subject-row';
    newSubjectRow.innerHTML = `
        <select class="subject-input">
            <option value="" disabled selected>Select a subject</option>
            ${subjects.filter(subject => !selectedSubjects.includes(subject.subjectName)).map(subject => `<option value="${subject.subjectName}">${subject.subjectName}</option>`).join('')}
        </select>
        <button class="plus-btn" type="button">+</button>
    `;
    dayContainer.appendChild(newSubjectRow);

    // Add event listener to the new plus button
    newSubjectRow.querySelector('.plus-btn').addEventListener('click', () => addSubject(dayId, subjects));

    // Add event listener to the new select element
    newSubjectRow.querySelector('.subject-input').addEventListener('change', () => updateDropdowns(dayId, subjects));
}

function getSelectedSubjects(dayId) {
    const dayContainer = document.getElementById(dayId);
    const subjectRows = dayContainer.getElementsByClassName('subject-row');
    const selectedSubjects = [];

    for (let row of subjectRows) {
        const subject = row.querySelector('.subject-input').value;
        if (subject) {
            selectedSubjects.push(subject);
        }
    }

    return selectedSubjects;
}

function updateDropdowns(dayId, subjects) {
    const dayContainer = document.getElementById(dayId);
    const subjectRows = dayContainer.getElementsByClassName('subject-row');
    const selectedSubjects = getSelectedSubjects(dayId);

    for (let row of subjectRows) {
        const selectElement = row.querySelector('.subject-input');
        const currentValue = selectElement.value;

        selectElement.innerHTML = `
            <option value="" disabled ${currentValue === "" ? "selected" : ""}>Select a subject</option>
            ${subjects.filter(subject => !selectedSubjects.includes(subject.subjectName) || subject.subjectName === currentValue).map(subject => `<option value="${subject.subjectName}" ${subject.subjectName === currentValue ? "selected" : ""}>${subject.subjectName}</option>`).join('')}
        `;
    }
}

function submitTimetable() {
    const timetable = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    days.forEach(day => {
        const dayContainer = document.getElementById(day);
        const subjectRows = dayContainer.getElementsByClassName('subject-row');
        const subjects = [];

        for (let row of subjectRows) {
            const subject = row.querySelector('.subject-input').value;
            if (subject) {
                subjects.push(subject);
            }
        }

        timetable[day] = subjects;
    });

    // Get the current user
    const user = auth.currentUser;
    if (user) {
        // Write timetable to the user's node in Firebase Realtime Database
        const userRef = database.ref('users/' + user.uid);
        userRef.update({
            timetable: timetable
        }).then(() => {
            alert('Timetable submitted successfully!');
            // Redirect to the dashboard or home page
            window.location.href = 'options.html';
        }).catch((error) => {
            console.error('Error submitting timetable:', error);
        });
    } else {
        alert('No user is currently logged in.');
    }
}
