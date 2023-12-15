let canvas;
let context;
let sound = document.querySelector("#boing");

canvas = document.getElementById('2d-animation-canvas');
context = canvas.getContext('2d');

// variables x agafar inputs del dom per velocitats:
let speedX;
let speedY;
// Variable per canviar el color de la boleta en tocar
// parets laterals o parets verticals:
let colorBoleta = "#149911";

function draw(x, y) {
  context.fillStyle = colorBoleta;
  context.beginPath();
  context.arc(x,y,10,0,Math.PI * 2,true);
  context.fill();
}

function clearCanvas() {
  canvas.width = canvas.width;
}
// Paràmetres dibjuix bola
var ballX = 60;
var ballY = 60;

// Eixos de direcció
var directionX = 2;
var directionY = 2;

draw(ballX, ballY);

let activaIntervalo;

function jugar(){

  activaIntervalo = setInterval(function(){

    speedX = document.querySelector('#speedX').value;
    speedY = document.querySelector('#speedY').value;

    if(speedX === '0' && speedY === '0'){

      stop();

    }else{

    // 300 i 200 x mesures del canvas, si es va a sortir
    // canvia la bola de direcció:
        if (ballX > 300 || ballX < 0){

          directionX *= -1;
          sound.play();
          colorBoleta = "#149911";
      }

      if (ballY < 0 || ballY > 200){

          directionY *= -1;
          sound.play(); 
          colorBoleta = "#ED9B40";    
      }

      
      // Multipliquem direcció que pren la boleta x la velocitat del input:
      ballX += directionX * speedX;
      ballY += directionY * speedY;
      
      clearCanvas();
      draw(ballX, ballY);
        }
      }, 35);
}

// Per parar la bola, es torna a activar moviment en canviar valor d'input:
function stop(){
  // clearInterval(activaIntervalo);
  document.querySelector('#speedX').value = '0';
  document.querySelector('#speedY').value = '0';
}

// Activación del juego introduciendo parámetro x input y pulsando boton en html:
function run(){

    jugar();  
}
