



let useFrontCamera = true;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const preview = document.getElementById('preview');
const formatSelector = document.getElementById('formatSelector');

function startCamera() {
    const constraints = {
        video: { facingMode: useFrontCamera ? 'user' : 'environment' }
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            if (useFrontCamera) {
                // Aplica el modo espejo solo para la cámara frontal
                video.style.transform = 'scaleX(-1)';
            } else {
                // Elimina el modo espejo para la cámara posterior
                video.style.transform = 'scaleX(1)';
            }
            video.classList.toggle('mirrored', useFrontCamera);
        })
        .catch(err => console.error('Error accediendo a la cámara:', err));
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
    const canvasSize = 500;
    ctx.save();
    
    // Ajustar la imagen para evitar distorsión
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    let sx, sy, sWidth, sHeight;
    if (videoAspectRatio > 1) {
        sHeight = video.videoHeight;
        sWidth = video.videoHeight * 1;
        sx = (video.videoWidth - sWidth) / 2;
        sy = 0;
    } else {
        sWidth = video.videoWidth;
        sHeight = video.videoWidth * 1;
        sx = 0;
        sy = (video.videoHeight - sHeight) / 2;
    }
    
    if (useFrontCamera) {
        ctx.translate(canvasSize, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvasSize, canvasSize);
    ctx.restore();

    

   

  // Agregar la marca de agua (logo)
  const logo = new Image();
  logo.src = "image/logo.png"; // Reemplaza con la ruta de tu logo

  logo.onload = function () {
      const logoSize = 100; // Tamaño del logo
      const aspectRatio = logo.width / logo.height; // Relación de aspecto del logo
        const logoHeight = logoSize / aspectRatio; // Altura proporcional
      const logoX = 10; // Posición X (esquina inferior derecha)
      const logoY = canvas.height - logoHeight - 10; // Posición Y

      ctx.globalAlpha = 0.5; // Ajustar opacidad de la marca de agua (50%)
      ctx.drawImage(logo, logoX, logoY, logoSize, logoHeight); // Dibujar el logo en el canvas
      ctx.globalAlpha = 1.0; // Restaurar opacidad normal

      const formato = formatSelector.value;
      const dataURL = canvas.toDataURL(`image/${formato}`, 0.9);
      preview.src = dataURL;
      preview.style.display = 'block';
      descargarFoto(dataURL, formato);

}}

function descargarFoto(dataURL, formato) {
    const enlace = document.createElement('a');
    enlace.href = dataURL;
    enlace.download = `foto.${formato}`;
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