// tetris.js
              
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 400;
const canvasHeight = 600;
const backgroundColor = "gray";
const newFrameDelay = 1000; // in miliseconds

// grid consts
const xResolution = 10;
const yResolution = 20;
const gridColor = "blue";
const xOffset = 7;
const yOffset = 10;
const gridScale = 30;
const gridWidth = 2;


// figures
const figureColor = "red";
const figures = [
    [
        [1,1,0],
        [0,1,1],
        [0,1,0],
    ]
]

const Start = () =>{
    draw();
}

const update = () =>{

}

const draw = () =>{
    clearCanvas();
    update();
    // figurePos ma miec x i y
    let figurePos = {x: 1, y: 1}
    drawFigure(figures[0], figurePos)
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
            ctx.fillRect(i*gridScale, j * gridScale, gridScale - gridWidth, gridScale - gridWidth);
        }
    }
}


//const figures = [
//    [
//        [0,1,0],
//        [0,1,0],
//        [0,1,0],
//    ]
//]








//let figurePos = {x: 1, y: 1}
const drawFigure = (figure, figurePos) => {
    ctx.fillStyle = figureColor;
    
    centerPoint = figurePos;

    if (figure[0][0] == 1){
        rectPos = {x: centerPoint.x-1, y: centerPoint.y-1}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[0][1] == 1){
        rectPos = {x: centerPoint.x, y: centerPoint.y-1}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[0][2] == 1){
        rectPos = {x: centerPoint.x + 1, y: centerPoint.y-1}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[1][0] == 1){
        rectPos = {x: centerPoint.x - 1, y: centerPoint.y}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[1][1] == 1){
        rectPos = {x: centerPoint.x, y: centerPoint.y}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[1][2] == 1){
        rectPos = {x: centerPoint.x + 1, y: centerPoint.y}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[2][0] == 1){
        rectPos = {x: centerPoint.x - 1, y: centerPoint.y + 1}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[2][1] == 1){
        rectPos = {x: centerPoint.x, y: centerPoint.y + 1}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

    if (figure[2][2] == 1){
        rectPos = {x: centerPoint.x + 1, y: centerPoint.y + 1}
        ctx.fillRect(rectPos.x * gridScale, rectPos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }



    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){



            x = 2;
            // if (figure[i][j] == 1){
                // ctx.fillRect((figurePos.x + i) * gridScale, (figurePos.y + 1) * gridScale, gridScale - gridWidth, gridScale - gridWidth)

            // }
        }
    }
    // ctx.fillRect(figurePos.x * gridScale, figurePos.y * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }

window.onload = Start();
