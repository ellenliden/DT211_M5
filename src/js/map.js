/**
 * initierar Leaflet-kartan och lägger till en tile layer
 * @returns {L.Map} Leaflet-karta
 */
function initMap() {
  const map = L.map("map").setView([62.39, 17.31], 5); // Startvy Sverige

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  return map;
}

/**
 * söker efter en plats med hjälp av Nominatim API
 * @param {string} location - Platsens namn
 * @returns {Promise<Object>} GeoJSON-objekt
 */
async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    location
  )}&format=json&limit=1`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.length === 0) {
    throw new Error("Platsen kunde inte hittas.");
  }

  return data[0];
}

//initiera kartan
const map = initMap();
let marker = null;

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const location = document.getElementById("locationInput").value;

  try {
    const result = await geocodeLocation(location);
    const lat = result.lat;
    const lon = result.lon;

    //flytta kartan och lägg till markör
    map.setView([lat, lon], 13);

    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker([lat, lon])
      .addTo(map)
      .bindPopup(result.display_name)
      .openPopup();
  } catch (err) {
    alert(err.message);
  }
});
