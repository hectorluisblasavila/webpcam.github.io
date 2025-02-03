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

    const formato = formatSelector.value;
    const dataURL = canvas.toDataURL(`image/${formato}`, 0.9);
    preview.src = dataURL;
    preview.style.display = 'block';
    descargarFoto(dataURL, formato);
}

function descargarFoto(dataURL, formato) {
    const enlace = document.createElement('a');
    enlace.href = dataURL;
    enlace.download = `foto.${formato}`;
    enlace.click();
}