(function () {
  const lat = 4.651002988522;
  const lng = -74.081282901615;
  const mapa = L.map("mapa").setView([lat, lng], 12);
  let marker;

  // Utilizar Provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();


  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // Pin de ubicación
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  // Obtener lat y lng de la ubicación del pin
  marker.on("moveend", function (e) {
    marker = e.target;
    const position = marker.getLatLng();
    mapa.panTo(new L.LatLng(position.lat, position.lng));

     // Obtener la información de las calles al soltar el pin
    geocodeService.reverse().latlng(position, 16).run(function(error, result){
        // console.log(result);

        marker.bindPopup(result.address.LongLabel)

        // LLenar los campos
        document.querySelector('.street').textContent = result?.address?.Address ?? '';
        document.getElementById('street').value = result?.address?.Address ?? '';
        document.getElementById('lat').value = result?.latlng.lat ?? '';
        document.getElementById('lng').value = result?.latlng.lng ?? '';
    });
});




  // función para buscar direcciones
  const search = document.getElementById("search");
  async function searchAddress() {
    const address = document.getElementById("search").value;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      const coords = [parseFloat(lat), parseFloat(lon)];

      mapa.setView(coords, 16);
      if (marker) marker.remove();
      marker = L.marker(coords).addTo(mapa).bindPopup(address).openPopup();
    } else {
      alert("Dirección no encontrada");
    }
  }

  // funcion para que el input ejecute la funcion del buscador
  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchAddress();
    }
  });
})();
