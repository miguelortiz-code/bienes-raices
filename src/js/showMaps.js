(function() {
    const lat = document.getElementById('latitude').textContent
    const lng = document.getElementById('longitude').textContent
    const street = document.getElementById('street').textContent
    const mapa = L.map('mapa').setView([lat, lng], 17)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // Agregar Pin
  L.marker([lat, lng]).addTo(mapa).bindPopup(street)
}())