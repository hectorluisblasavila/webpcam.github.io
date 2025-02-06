



let useFrontCamera = true;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const preview = document.getElementById('preview');
const formatSelector = document.getElementById('formatSelector');


async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById('video').srcObject = stream;
    } catch (error) {
        console.error("Error al acceder a la cámara:", error);
    }
}






startCamera();

function toggleCamera() {
    useFrontCamera = !useFrontCamera;
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    startCamera();
}

function tomarFoto() {
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    
    // Definir el tamaño del canvas basado en la relación 9:16
    const canvasWidth = Math.min(video.videoWidth, 1080); // Máximo 1080px de ancho
    const canvasHeight = (canvasWidth * 16) / 9;

    // Ajustar el tamaño del canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    ctx.save();
    
    let sx, sy, sWidth, sHeight;
    
    // Ajustar el recorte dependiendo del aspecto del video
    if (videoAspectRatio > (9 / 16)) {
        sHeight = video.videoHeight;
        sWidth = (video.videoHeight * 9) / 16;
        sx = (video.videoWidth - sWidth) / 2;
        sy = 0;
    } else {
        sWidth = video.videoWidth;
        sHeight = (video.videoWidth * 16) / 9;
        sx = 0;
        sy = (video.videoHeight - sHeight) / 2;
    }

    // Si es la cámara frontal, reflejar la imagen
    if (useFrontCamera) {
        ctx.translate(canvasWidth, 0);
        ctx.scale(-1, 1);
    }

    // Dibujar la imagen en el canvas respetando la relación 9:16
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);
    
    ctx.restore();

    

   

  // Agregar la marca de agua (logo)
  const logo = new Image();
  logo.src = "image/logo.png"; // Reemplaza con la ruta de tu logo

  logo.onload = function () {
      const logoSize = 200; // Tamaño del logo
      const aspectRatio = logo.width / logo.height; // Relación de aspecto del logo
        const logoHeight = logoSize / aspectRatio; // Altura proporcional
      const logoX = 20; // Posición X (esquina inferior derecha)
      const logoY = canvas.height - logoHeight - 20; // Posición Y

      ctx.globalAlpha = 1.0; // Ajustar opacidad de la marca de agua (50%)
      ctx.drawImage(logo, logoX, logoY, logoSize, logoHeight); // Dibujar el logo en el canvas
      ctx.globalAlpha = 1.0; // Restaurar opacidad normal

      const formato = formatSelector.value;
      const dataURL = canvas.toDataURL(`image/${formato}`, 1);
      preview.src = dataURL;
      preview.style.display = 'block';
      descargarFoto(dataURL, formato);

}}

function descargarFoto(dataURL, formato) {
    const enlace = document.createElement('a');

    const fecha = new Date();
    const nombreArchivo = `foto_${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}_` +
                          `${fecha.getHours().toString().padStart(2, '0')}-${fecha.getMinutes().toString().padStart(2, '0')}-${fecha.getSeconds().toString().padStart(2, '0')}` +
                          `.${formato}`;
    enlace.href = dataURL;
    enlace.download = nombreArchivo;  // Usar el nombre único
    enlace.click();
}


function toggleGuias() {
    let guias = document.querySelector(".guias");
    let boton = document.querySelector(".btn-guias");
    
    if (guias.style.display === "none" || guias.style.display === "") {
        guias.style.display = "block";
        boton.style.background = "rgba(0, 255, 0, 0.8)"; // Verde con 50% de opacidad
    } else {
        guias.style.display = "none";
        boton.style.background = "rgba(255, 0, 0, 0.8)"; // Rojo con 50% de opacidad
    }
}