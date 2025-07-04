import { Dropzone } from "dropzone";

const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

Dropzone.options.image = {
  dictDefaultMessage: "Sube tus imágenes aquí",
  acceptedFiles: ".png, .jpg, .jpeg, .webp",
  maxFilesize: 1,
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

    // 1️⃣ Evita doble clic
    btnPublish.addEventListener("click", () => {
      btnPublish.disabled = true;
      btnPublish.classList.add("opacity-50", "cursor-not-allowed");
      dz.processQueue();
    });

    // 2️⃣ Si ocurre error, re‑habilita el botón
    dz.on("error", (_file, msg) => {
      console.error("Error al subir imagen:", msg);
      alert("El formato de la imagen no es permitido o es demasiado pesado");
      btnPublish.disabled = false;
      btnPublish.classList.remove("opacity-50", "cursor-not-allowed");
    });

    /* 3️⃣ Flujo deseado:
          a) queuecomplete garantiza que el ✔️ ya está en pantalla.
          b) alert() → preloader → redirect
    */
    dz.on("queuecomplete", () => {
      // Verifica que no queden archivos pendientes ni con error
      if (dz.getActiveFiles().length === 0 && dz.getRejectedFiles().length === 0) {
        // Mostrar alerta (bloquea hasta que el usuario la cierra)
        alert("Propiedad publicada con éxito");

        // Mostrar preloader
        const preloader = document.getElementById("preloader");
        if (preloader) preloader.classList.remove("hidden");

        // Redirigir tras breve pausa
        setTimeout(() => {
          window.location.href = "/my-properties";
        }, 3000);
      }
    });
  },
};