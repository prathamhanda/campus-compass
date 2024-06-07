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

document.getElementById('roomForm').addEventListener('submit', function(event){
    event.preventDefault();
    const roomNumber = document.getElementById('roomNumber').value.trim().toUpperCase();
    
    database.ref('roomDatabase').once('value').then((snapshot) => {
        const roomDatabase = snapshot.val();
        let building = 'Unknown Building';
        
        for (const [buildingName, floors] of Object.entries(roomDatabase)){
            for (const [floor, rooms] of Object.entries(floors)) {
                if (rooms.includes(roomNumber)){
                    building = `${buildingName}, ${floor}`;
                    break;
                }
            }
            if (building !== 'Unknown Building') break;
        }

        document.getElementById('modalText').innerText = `Your room is in ${building}`;
        document.getElementById('modal').style.display = 'block';
        document.querySelector('.container').style.filter = 'blur(5px)';
    });
});

document.querySelector('.close').addEventListener('click', function(){
    document.getElementById('modal').style.display = 'none';
    document.querySelector('.container').style.filter = 'none';
});

document.getElementById('campusCompassButton').addEventListener('click', function() {
    window.location.href = 'navigate.html';
});