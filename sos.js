document.addEventListener("DOMContentLoaded", () => {
    // Initialize the map
    const map = L.map("map").setView([51.505, -0.09], 13); // default location: London

    // Add a tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        subdomains: ["a", "b", "c"],
    }).addTo(map);

    // Add a marker for the user's location
    let userMarker;

    // Get the user's location
    document.getElementById("use-location").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // User allowed location sharing
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Update the map view
                    map.setView([lat, lon], 15);

                    // Add a marker for the user's location
                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }
                    userMarker = L.marker([lat, lon]).addTo(map);
                },
                () => {
                    // User denied location sharing
                    alert("Unable to access your location. Please allow location sharing.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
});