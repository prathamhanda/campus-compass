document.addEventListener('DOMContentLoaded', () => {
    // Coordinates for Thapar University, Punjab
    const thaparUniversityCoords = [30.3515, 76.3663];

    // Initialize the map centered on Thapar University
    const map = L.map('map').setView(thaparUniversityCoords, 16);

    // Add OSM tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load and display the OSM data for Thapar University
    fetch('C:\\Users\\Lenovo\\Desktop\\CampusCompass\\final.osm') // Update this path to where your final.osm file is located
        .then(response => response.text())
        .then(osmData => {
            const geojsonData = osmtogeojson(osmData);
            L.geoJSON(geojsonData).addTo(map);
        });

    // Predefined coordinates for buildings within the campus
    const buildings = {
        'Atheletic Track': [30.35433, 76.36133],
        'Auditorium': [30.35194, 76.37064],
        'B-Block': [30.35307, 76.37123],
        'Biogas Plant': [30.35664, 76.35944],
        'C-Block': [30.35355, 76.37129],
        'Car Parking': [30.35277, 76.37250],
        'COS Complex': [30.35424, 76.36229],
        'Cricket Ground': [30.35578, 76.36370],
        'Dean Office': [30.35518, 76.37065],
        'Directorate': [30.35267, 76.37173],
        'E-Block': [30.35345, 76.37226],
        'Faculty Residential Complex A': [30.35340, 76.36010],
        'Faculty Residential Complex B': [30.35368, 76.36005],
        'Faculty Residential Complex C': [30.35368, 76.36005],
        'Football Ground': [30.35364, 76.36340],
        'F-Block': [30.35389, 76.37219],
        'Gate 2': [30.35604, 76.37246],
        'Gate 3': [30.35298, 76.35901],
        'G-Block': [30.35350, 76.36942],
        'Guest House': [30.35191, 76.36950],
        'Gurudwara': [30.35220, 76.36257],
        'Health Center': [30.35601, 76.36906],
        'Hostel A': [30.35123, 76.36461],
        'Hostel B': [30.35128, 76.36369],
        'Hostel C': [30.35086, 76.36126],
        'Hostel D': [30.35085, 76.36023],
        'Hostel E': [30.35488, 76.36662],
        'Hostel G': [30.35451, 76.36670],
        'Hostel H': [30.35295, 76.36474],
        'Hostel I': [30.35497, 76.36733],
        'Hostel J': [30.35318, 76.36340],
        'Hostel K': [30.35692, 76.36368],
        'Hostel L': [30.35730, 76.36642],
        'Hostel M': [30.35243, 76.36102],
        'Hostel N': [30.35411, 76.368066],
        'Hostel O': [30.35119, 76.36242],
        'Hostel PG': [30.35174, 76.36617],
        'Hostel Q': [30.35177, 76.36782],
        'Jaggi': [30.35269, 76.37077],
        'Library': [30.35444, 76.37012],
        'LT Building': [30.35509, 76.36943],
        'Main Gate': [30.35196, 76.37292],
        'Mechanical Engineering Workshop': [30.35454, 76.37193],
        'Nirvana': [30.35356, 76.36626],
        'Oat': [30.35438, 76.36253],
        'Polytechnic Building': [30.35757, 76.36748],
        'SBOP Lawns': [30.35192, 76.37001],
        'State Bank of India': [30.35260, 76.37052],
        'Swimming Pool': [30.35447, 76.36601],
        'TAN Complex': [30.35357, 76.36851],
        'Temple': [30.35267, 76.36266],
        'Tennis Court': [30.35501, 76.36449],
        'TSLAS': [30.35703, 76.37197],
        'Volleyball Court': [30.35519, 76.36526]
    };

    // Initialize routing control without waypoints
    const routingControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        createMarker: function() { return null; } // Hide default markers
    }).addTo(map);

    // Populate the datalist with building names
    const buildingsList = document.getElementById('buildingsList');
    for (const building in buildings) {
        const option = document.createElement('option');
        option.value = building;
        buildingsList.appendChild(option);
    }

    // Handle routing based on user input
    document.getElementById('routeBtn').addEventListener('click', () => {
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        if (start && end && buildings[start] && buildings[end]) {
            const startCoords = buildings[start];
            const endCoords = buildings[end];
            routingControl.setWaypoints([
                L.latLng(startCoords[0], startCoords[1]),
                L.latLng(endCoords[0], endCoords[1])
            ]);
        } else {
            alert('Please enter valid starting and ending locations within the campus.');
        }
    });

    // Handle geolocation
    const locationBtn = document.createElement('button');
    locationBtn.textContent = "Use My Location";
    locationBtn.style.marginTop = "10px";
    locationBtn.style.padding = "10px 20px";
    locationBtn.style.backgroundColor = "#28a745";
    locationBtn.style.color = "white";
    locationBtn.style.border = "none";
    locationBtn.style.cursor = "pointer";
    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
                map.setView(latlng, 16);
                routingControl.setWaypoints([latlng, routingControl.getWaypoints()[1]]);
            }, () => {
                alert("Geolocation permission denied.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
    document.getElementById('controls').appendChild(locationBtn);
});
