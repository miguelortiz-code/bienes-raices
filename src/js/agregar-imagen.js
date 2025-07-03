import {Dropzone} from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.image = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png, .jpg, jpeg, .webp',
    maxFilesize: 5,
    maxFiles: 5,
    parallelUploads: 5,
    // autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El limite son 5 archivos',
    headers:{
        'CSRF-TOKEN' : token
    }
}