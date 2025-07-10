(function(){
  const lat = 4.651002988522;
  const lng = -74.081282901615;
  const maps = L.map("maps-home").setView([lat, lng], 12);
 let markers = new L.FeatureGroup().addTo(maps); 
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(maps);

  const obtainProperties = async () =>{
    try {
      const url = '/api/properties';
      const reply = await fetch(url)
      const properties = await reply.json();
      showProperties(properties);
    } catch (error) {
      console.log(error);
    }
  };

  const showProperties = properties =>{
    properties.forEach(property =>{
      // Agregar Pines
      const marker = new L.marker([property?.latitude, property?.longitude],{
        autoPan: true
      })
      .addTo(maps)
      .bindPopup(`
        <p class="text-blue-600">${property.category.category}</p>
        <h1 class="text-center text-xl font-extrabold uppercase my-2">${property.title}</h1>
        <img src="/uploads/${property?.imagen}" alt="Imagen de la propiedad: ${property?.title}" />
        <p class="text-center font-bold text-gray-600">${property.price.price}</p>
        <a href="/property/${property.code}" target="_blank" class="link block bg-blue-600 text-center rounded-lg p-2 uppercase">ver propiedad</a>
      `);

      markers.addLayer(marker)
    });
  }
  obtainProperties()

}())