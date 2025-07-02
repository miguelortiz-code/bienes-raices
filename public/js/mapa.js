/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  const lat = document.getElementById('lat').value || 4.651002988522;\r\n  const lng =document.getElementById('lng').value  || -74.081282901615;\r\n  const mapa = L.map(\"mapa\").setView([lat, lng], 12);\r\n  let marker;\r\n\r\n  // Utilizar Provider y Geocoder\r\n  const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n\r\n  // Pin de ubicación\r\n  marker = new L.marker([lat, lng], {\r\n    draggable: true,\r\n    autoPan: true,\r\n  }).addTo(mapa);\r\n\r\n  // Obtener lat y lng de la ubicación del pin\r\n  marker.on(\"moveend\", function (e) {\r\n    marker = e.target;\r\n    const position = marker.getLatLng();\r\n    mapa.panTo(new L.LatLng(position.lat, position.lng));\r\n\r\n     // Obtener la información de las calles al soltar el pin\r\n    geocodeService.reverse().latlng(position, 16).run(function(error, result){\r\n        // console.log(result);\r\n\r\n        marker.bindPopup(result.address.LongLabel)\r\n\r\n        // LLenar los campos\r\n        document.querySelector('.street').textContent = result?.address?.Address ?? '';\r\n        document.getElementById('street').value = result?.address?.Address ?? '';\r\n        document.getElementById('lat').value = result?.latlng.lat ?? '';\r\n        document.getElementById('lng').value = result?.latlng.lng ?? '';\r\n    });\r\n});\r\n\r\n\r\n\r\n\r\n  // función para buscar direcciones\r\n  const search = document.getElementById(\"search\");\r\n  async function searchAddress() {\r\n    const address = document.getElementById(\"search\").value;\r\n    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(\r\n      address\r\n    )}`;\r\n    const response = await fetch(url);\r\n    const data = await response.json();\r\n\r\n    if (data.length > 0) {\r\n      const { lat, lon } = data[0];\r\n      const coords = [parseFloat(lat), parseFloat(lon)];\r\n\r\n      mapa.setView(coords, 16);\r\n      if (marker) marker.remove();\r\n      marker = L.marker(coords).addTo(mapa).bindPopup(address).openPopup();\r\n    } else {\r\n      alert(\"Dirección no encontrada\");\r\n    }\r\n  }\r\n\r\n  // funcion para que el input ejecute la funcion del buscador\r\n  search.addEventListener(\"keydown\", (e) => {\r\n    if (e.key === \"Enter\") {\r\n      e.preventDefault();\r\n      searchAddress();\r\n    }\r\n  });\r\n})();\r\n\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;