import "./styles.css";

const smile = require("./smile.png");

document.getElementById("app").innerHTML = `
<h1>🤡Smile-a-ton🤡</h1>
`;

var constraints = { audio: false, video: { width: 450, height: 450 } };

window.onload = onGetUserMediaButtonClick();

var imageCapture;

function onGetUserMediaButtonClick() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(mediaStream => {
      let video = document.querySelector("video");
      video.srcObject = mediaStream;
      video.onloadedmetadata = e => {
        video.play();
      };
      const track = mediaStream.getVideoTracks()[0];
      imageCapture = new ImageCapture(track);
    })
    .catch(error => console.log(error));
}

function onTakePhotoButtonClick() {
  document.querySelector('.canvas-wrapper').style.display='block';
  imageCapture
    .takePhoto()
    .then(blob => createImageBitmap(blob))
    .then(imageBitmap => {
      let canvas = document.querySelector("#photoCanvas");
      drawnBitmaps = drawCanvas(imageBitmap, canvas);


      let photoCanvas = document.querySelector('#photoCanvas');
      let overlayCanvas = document.querySelector('#overlayCanvas');
      var resultCanvas = document.querySelector('#resultCanvas');
      var resultCtx = resultCanvas.getContext('2d');
      resultCanvas.width = 640;
      resultCanvas.height = 480;
      resultCtx.drawImage(photoCanvas.getContext('2d').canvas, 0, 0);
      resultCtx.drawImage(overlayCanvas.getContext('2d').canvas, 0, 0);

    })
    .catch(error => console.log(error));
}

/* Utils */

function drawCanvas(img, canvas) {
  canvas.width = 640; //getComputedStyle(canvas).width.split("px")[0];
  canvas.height = 480; //getComputedStyle(canvas).height.split("px")[0];

  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  
  let x = 640; //(canvas.width - img.width * ratio) / 2;
  let y = 480; //(canvas.height - img.height * ratio) / 2;
  
  let ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
   img.width * ratio,
   img.height * ratio
    // 0,
    // 0,
    // img.width, //* ratio,
    // img.height,// * ratio
  );
}

function drawImageOnCanvas(image, canvas, dx, dy, dw,dh) {
  let base_image = new Image(640,480);
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  base_image.onload = function() {
    ctx.drawImage(
      base_image,
      dx,dy,dw,dh
    );
  };
  base_image.src = image;
}

let canvasWidth = 640;
let canvasHeight = 480;

// Overlay Canvas
var overlayCanvas = document.querySelector('#overlayCanvas');
overlayCanvas.width=canvasWidth;
overlayCanvas.height=canvasHeight;
drawImageOnCanvas(smile, overlayCanvas, (overlayCanvas.width/2-103), (overlayCanvas.height/2)+70, 206, 115);


// Reset
function resetCanvases(){
  document.querySelector('.canvas-wrapper').style.display='none';
  let photoCanvas = document.querySelector('#photoCanvas');
  let overlayCanvas = document.querySelector('#overlayCanvas');
  let resultCanvas = document.querySelector('#resultCanvas');

  photoCanvas.getContext('2d').clearRect(0, 0, photoCanvas.width, photoCanvas.height);
  resultsCanvas.getContext('2d').clearRect(0, 0, resultsCanvas.width, resultCanvas.height);
}

// Event Listeners
document
  .querySelector("#takePhotoButton")
  .addEventListener("click", onTakePhotoButtonClick);

document
  .querySelector('#savePhotoButton')      
  .addEventListener('click', function (e) {
    let photoCanvas = document.querySelector('#photoCanvas');
    let overlayCanvas = document.querySelector('#overlayCanvas');
    var resultCanvas = document.querySelector('#resultCanvas');
    var resultCtx = resultCanvas.getContext('2d');
    resultCanvas.width = 640;
    resultCanvas.height = 480;
    resultCtx.drawImage(photoCanvas.getContext('2d').canvas, 0, 0);
    resultCtx.drawImage(overlayCanvas.getContext('2d').canvas, 0, 0);

    let download = document.querySelector('#btn-download');
    var dataURL = resultCanvas.toDataURL('image/png');
    download.href = dataURL;
  });


document
  .querySelector('#resetPhotoButton')
  .addEventListener('click', resetCanvases);