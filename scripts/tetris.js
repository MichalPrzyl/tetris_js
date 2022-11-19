// tetris.js

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 400;
const canvasHeight = 600;
const backgroundColor = "gray";
const newFrameDelay = 2; // in miliseconds

// grid consts
const xResolution = 10;
const yResolution = 20;
const gridColor = "blue";
const xOffset = 7;
const yOffset = 10;
const gridScale = 30;
const gridWidth = 2;
const Start = () =>{
    draw();
}

const update = () =>{

}

const draw = () =>{
    clearCanvas();
    update();
    setTimeout(draw, newFrameDelay);
}

const clearCanvas = () =>{
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
     
    // create tetris grid
    for (let i = 0; i < xResolution; i++ ){
        for (let j = 0; j < yResolution; j++){
            ctx.fillStyle = gridColor;
            ctx.strokeStyle = "black"; // this isn't working. fix that.
            //ctx.fillRect(i* (canvasWidth/xResolution), j * (canvasHeight/yResolution), gridScale, gridScale);
            ctx.fillRect(i*gridScale, j * gridScale, gridScale - gridWidth, gridScale -gridWidth);
        }
    }
}

window.onload = Start();
