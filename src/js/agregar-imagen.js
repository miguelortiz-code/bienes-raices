import { Dropzone } from "dropzone";

const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

Dropzone.options.image = {
  dictDefaultMessage: "Sube tus imágenes aquí",
  acceptedFiles: ".png, .jpg, .jpeg, .webp",
  maxFilesize: 10, // MB
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: "Borrar Archivo",
  dictMaxFilesExceeded: "El límite es 1 archivo",
  headers: { "CSRF-TOKEN": token },
  paramName: "image",

  init() {
    const dz = this;
    const btnPublish = document.getElementById("publish");
    let uploadSuccess = false; // ⛳ Flag de éxito

    // 1️⃣ Evita doble clic
    btnPublish.addEventListener("click", () => {
      btnPublish.disabled = true;
      btnPublish.classList.add("opacity-50", "cursor-not-allowed");
      dz.processQueue();
    });

    // 2️⃣ Al subir con éxito, marcar flag y guardar redirect (opcional)
    dz.on("success", (_file, response) => {
      uploadSuccess = response.success; // Solo si backend confirma éxito
    });

    // 3️⃣ Si ocurre error, re‑habilita el botón y muestra mensaje
    dz.on("error", (_file, msg) => {
      console.error("Error al subir imagen:", msg);
      alert("El formato de la imagen no es permitido o es demasiado pesado");

      btnPublish.disabled = false;
      btnPublish.classList.remove("opacity-50", "cursor-not-allowed");

      uploadSuccess = false;
    });

    // 4️⃣ Cuando termina la cola, evaluar si todo fue bien
    dz.on("queuecomplete", () => {
      if (uploadSuccess) {
        alert("Propiedad publicada con éxito");

        const preloader = document.getElementById("preloader");
        if (preloader) preloader.classList.remove("hidden");

        setTimeout(() => {
          window.location.href = "/my-properties";
        }, 3000);
      }
    });
  },
};