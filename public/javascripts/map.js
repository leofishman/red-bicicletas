var map = L.map('main_map').setView([-34.6012424, -58.3861497], 13);

L.tileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);