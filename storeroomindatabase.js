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

function storeRoomData() {
    const roomDatabase = {
        'LT Block': {
            'Ground Floor': ['LT101', 'LT102', 'LT103'],
            'First Floor': ['LT201', 'LT202', 'LT203']
        },
        'LP Block': {
            'Ground Floor': ['LP101', 'LP102', 'LP103'],
            'First Floor': ['LP201', 'LP202', 'LP203']
        },
        'E Block': {
            'Ground Floor': ['E101', 'E102', 'E103'],
            'First Floor': ['E201', 'E202', 'E203']
        },
        'F Block': {
            'Ground Floor': ['F101', 'F102', 'F103'],
            'First Floor': ['F201', 'F202', 'F203'],
            'Second Floor': ['F301', 'F302', 'F303'],
        },
        // Add other buildings and floors similarly
    };

    database.ref('roomDatabase').set(roomDatabase)
        .then(() => {
            console.log('Room data stored successfully!');
        })
        .catch((error) => {
            console.error('Error storing room data:', error);
        });
}

// Call the function to store data
storeRoomData();