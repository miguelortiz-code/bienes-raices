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

/***/ "./src/js/mapsHome.js":
/*!****************************!*\
  !*** ./src/js/mapsHome.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n  const lat = 4.651002988522;\r\n  const lng = -74.081282901615;\r\n  const maps = L.map(\"maps-home\").setView([lat, lng], 12);\r\n let markers = new L.FeatureGroup().addTo(maps); \r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(maps);\r\n\r\n  const obtainProperties = async () =>{\r\n    try {\r\n      const url = '/api/properties';\r\n      const reply = await fetch(url)\r\n      const properties = await reply.json();\r\n      showProperties(properties);\r\n    } catch (error) {\r\n      console.log(error);\r\n    }\r\n  };\r\n\r\n  const showProperties = properties =>{\r\n    properties.forEach(property =>{\r\n      // Agregar Pines\r\n      const marker = new L.marker([property?.latitude, property?.longitude],{\r\n        autoPan: true\r\n      })\r\n      .addTo(maps)\r\n      .bindPopup(`\r\n        <p class=\"text-blue-600\">${property.category.category}</p>\r\n        <h1 class=\"text-center text-xl font-extrabold uppercase my-2\">${property.title}</h1>\r\n        <img src=\"/uploads/${property?.imagen}\" alt=\"Imagen de la propiedad: ${property?.title}\" />\r\n        <p class=\"text-center font-bold text-gray-600\">${property.price.price}</p>\r\n        <a href=\"/property/${property.code}\" target=\"_blank\" class=\"link block bg-blue-600 text-center rounded-lg p-2 uppercase\">ver propiedad</a>\r\n      `);\r\n\r\n      markers.addLayer(marker)\r\n    });\r\n  }\r\n  obtainProperties()\r\n\r\n}())\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapsHome.js?");

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
/******/ 	__webpack_modules__["./src/js/mapsHome.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;