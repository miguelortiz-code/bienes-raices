(function(){
  const lat = 4.651002988522;
  const lng = -74.081282901615;
  const maps = L.map("maps-home").setView([lat, lng], 12);
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(maps);

  const obtainProperties = async () =>{
    try {
      const url = '/api/properties';
      const reply = await fetch(url)
      const properties = await reply.json();
      console.log(properties);
    } catch (error) {
      console.log(error);
    }
  };
  obtainProperties()

}())