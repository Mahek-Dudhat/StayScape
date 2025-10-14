// Initialize the map
const map = L.map('map').setView(list.geomatry.coordinates, 13);
//console.log("Co:", list.geomatry.coordinates);
// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
}).addTo(map);

// let myIcon = L.icon({
//     iconUrl: 'https://www.pngall.com/wp-content/uploads/13/Airbnb-Logo-Transparent.png',
//     iconSize: [38, 50],
//     iconAnchor: [22, 94],
//     popupAnchor: [-3, -76],
//     shadowSize: [68, 95],
//     shadowAnchor: [22, 94]
// });

var myIcon = L.divIcon({className: 'my-div-icon',html: '<div style="background-color:lightpink;height:25px;width:25px;border-radius:50%;display:flex;justify-content:center;align-items:center;"><i class="fa-brands fa-airbnb style="color:red;font-size:200px;"></i></div>',iconSize: [100,100],iconAnchor: [16,32],popupAnchor: [0,-32]});

// Add a marker
const marker = L.marker(list.geomatry.coordinates, { icon: myIcon }).addTo(map);

// Add popup to marker
marker.bindPopup(`<b>${list.title}..</b><br>${list.location},${list.country}`).openPopup();