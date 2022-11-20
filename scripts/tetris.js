// tetris.js



// figures
const figuresOptions = [
    [
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1],
    ],
    [
        [0,1,0],
        [0,1,1],
        [0,0,1],
    ],
    [
        [0,1,0],
        [1,1,0],
        [1,0,0],
    ],
    [
        [1,0,0],
        [1,0,0],
        [1,0,0],
    ],
]


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 400;
const canvasHeight = 600;
const newFrameDelay = 100; // in miliseconds

// grid consts
const xResolution = 10;
const yResolution = 20;
const xOffset = 7;
const yOffset = 10;
const gridScale = 30;
const gridWidth = 2;

// colors
const backgroundColor = 'gray';
const gridColor = "#bfd3f2";
const figureColor = "red";


let figureInitialPos = {x: 5, y: 1}
let figurePos;

// figures array
let figures = []

// globals
let occupiedPositions = [];
let occupiedQuadsPositions = [];
let activeFigure;
let started = false;
let createdCounter = 0;
let canCreate = true;
let endGameAfterLevel = 10;

// bottom border (you can't go below that)
for (let i = 1; i < 11; i++){
    occupiedQuadsPositions.push({xPos: i, yPos: 20});
}



const createNewFigure = () => {
    // stops game after n spawned figures - just for debugging
    if (createdCounter == endGameAfterLevel){
        gameOver();
    }
    if (canCreate){
        const spawnPosition = {xPos:5, yPos: 10}
            
        let item = figuresOptions[Math.floor(Math.random()*figuresOptions.length)];
        const figure = new Figure(
            spawnPosition, item);

        figures.push(figure);
        activeFigure = figure;
        createdCounter += 1;
    } 
}

const Start = () =>{
    const figure = new Figure(
        {xPos:5, yPos: 10},
        [
            [1,1,1],
            [0,1,0],
            [0,0,0]
        ]
    );

    figures.push(figure);
    activeFigure = figure;
    draw();
}
// occupiedPositions

const updateActiveFigurePosition = () =>{

    let canMoveThisFigure = true;

    for (let i = 0; i < activeFigure.quads.length; i++){
        const quad = activeFigure.quads[i];
        //if (!checkIfEmpty(quad.position)){
        if (!checkIfEmpty({xPos: quad.position.xPos, yPos: quad.position.yPos + 1})){
            // can't move down
            canMoveThisFigure = false;
        }
    } // end for



    if (canMoveThisFigure){
        // move figure down
        activeFigure.position = {xPos: activeFigure.position.xPos, yPos: activeFigure.position.yPos + 1}
        // move quads down
        for (let i = 0; i < activeFigure.quads.length; i++){
            let quad2 = activeFigure.quads[i]
            quad2.position = {xPos: quad2.position.xPos, yPos: quad2.position.yPos + 1 }
        }
    }else{
        for (let i = 0; i < activeFigure.quads.length; i++){
            let quad2 = activeFigure.quads[i]
            occupiedQuadsPositions.push(quad2.position);
        }
        createNewFigure();
    }
}

const checkIfEmpty = (position) =>{
    for (let i = 0; i < occupiedQuadsPositions.length; i++){
        if(occupiedQuadsPositions[i].xPos == position.xPos && occupiedQuadsPositions[i].yPos == position.yPos){
            return false
        }
    }
    return true
}

const updatePositions = () =>{
    // TODO: add next quad position to occupiedQuadPositions and remove current position from that array
    // for every figure on scene
    for (let i = 0; i < figures.length; i++){
        let canMoveThisFigure = true;

        // for every quad in figure
        for(let j = 0; j < figures[i].quads.length; j++){
            const quad = figures[i].quads[j]
            const checkOccupiedPosition = {xPos: quad.position.xPos, yPos: quad.position.yPos + 1}

            //if (occupiedQuadsPositions.some(el => (el.xPos == checkOccupiedPosition.xPos && el.yPos == checkOccupiedPosition.yPos))) 
            for (let op = 0; op < occupiedQuadsPositions.length; op++){
               if (occupiedQuadsPositions[op].xPos == figures[i].quads[j].position.xPos &&
                   occupiedQuadsPositions[op].yPos == figures[i].quads[j].position.yPos){
                    canMoveThisFigure = false;
                    if(figures[i] == activeFigure){
                        createNewFigure();
                    }
               }
            }
        } 
           
            //else{canMoveThisFigure = true;}
        //}

        // check every quad in figure
        if (canMoveThisFigure){
            figures[i].position = {xPos: figures[i].position.xPos, yPos: figures[i].position.yPos + 1}

            for (let q = 0; q < figures[i].quads.length; q++){
                const quad = figures[i].quads[q]

                const index = occupiedQuadsPositions.indexOf({xPos:quad.position.xPos, yPos:quad.position.yPos})
                if (index > -1){
                    occupiedQuadsPositions.splice(index, 1)
                }

                quad.position = {xPos: quad.position.xPos, yPos: quad.position.yPos + 1};
            }
        }
        else{
            for (let q = 0; q < figures[i].quads.length; q++){
                // if the squad coordinates are already in occupiedQuadsPositions array - do nothing
                if (occupiedQuadsPositions.some(el => (el.xPos == figures[i].quads[q].position.xPos && el.yPos == figures[i].quads[q].position.yPos))) {
                    continue;
                }
                occupiedQuadsPositions.push(figures[i].quads[q].position);
            }
        }
    }
}

const countQuadsInFigure = (schema) => {

    let count = 0;
    for (let i = 0; i < schema.length; i++){
        countInRow = schema[i].filter(x => x==1).length
        count += countInRow;
    }
    return countInRow;
}


const draw = () =>{
    if(canCreate){
        clearCanvas();
        //updatePositions();
        updateActiveFigurePosition();
        for(let i = 0; i < figures.length; i++){
            drawFigure(figures[i].schema, figures[i].position)
        }
        setTimeout(draw, newFrameDelay);
    } 
}

const clearCanvas = () =>{
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
     
    // create tetris grid
    for (let i = 0; i < xResolution; i++ ){
        for (let j = 0; j < yResolution; j++){
            ctx.fillStyle = gridColor;
            ctx.fillRect(i * gridScale, j * gridScale, gridScale - gridWidth, gridScale - gridWidth);
        }
    }
}

const drawFigure = (figure, figurePos) => {
    ctx.fillStyle = figureColor;
    centerPoint = figurePos;
    figureSquares = []
    
    if (figure[0][0] == 1){
        rectPos = {xPos: centerPoint.xPos -1, yPos: centerPoint.yPos-1}
        figureSquares.push(rectPos)
    }

    if (figure[0][1] == 1){
        rectPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos-1}
        figureSquares.push(rectPos)
    }

    if (figure[0][2] == 1){
        rectPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos-1}
        figureSquares.push(rectPos)
    }

    if (figure[1][0] == 1){
        rectPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos}
        figureSquares.push(rectPos)
    }

    if (figure[1][1] == 1){
        rectPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos}
        figureSquares.push(rectPos)
    }

    if (figure[1][2] == 1){
        rectPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos}
        figureSquares.push(rectPos)
    }

    if (figure[2][0] == 1){
        rectPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos + 1}
        figureSquares.push(rectPos)
    }

    if (figure[2][1] == 1){
        rectPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos + 1}
        figureSquares.push(rectPos)
    }

    if (figure[2][2] == 1){
        rectPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos + 1}
        figureSquares.push(rectPos)
    }

    // figureSquares
    for (let i = 0; i < figureSquares.length; i++){
        rectPos = figureSquares[i];
        ctx.fillRect(rectPos.xPos * gridScale, rectPos.yPos * gridScale, gridScale - gridWidth, gridScale - gridWidth)
    }
}

const gameOver = () =>{
    canCreate = false;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    fillStyle = "white"; 
    ctx.font = '48px serif';
    ctx.fillText('Hello world', 10, 50);
}

class Figure{
    constructor(position, schema){
        this.position = position;
        this.schema = schema;
        this.quadCount = countQuadsInFigure(schema);
        this.quads = []
        this.createQuads();
    }

    createQuads(){
        const centerPoint = this.position;
        let quadPos;
        if (this.schema[0][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[0][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[0][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[1][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[1][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[1][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[2][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[2][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[2][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }




        }
    }


class Quad{
    constructor(position){
        this.position = position;
    }
}

window.onload = Start();


document.addEventListener('keydown', (event) =>{
    var name = event.key;
    var code = event.code;
    moveFigure(code);
})

const moveFigure = (code) =>{
    if (code =="ArrowLeft"){
        moveHorizontally("left");
    }
    if (code =="ArrowRight"){
        moveHorizontally("right");
    }
}

const moveHorizontally = (direction) =>{
    if (direction == "left"){
        activeFigure.position.xPos -= 1;
        for(let i = 0; i < activeFigure.quads.length; i++){
            let quad = activeFigure.quads[i];
            quad.position = {xPos: quad.position.xPos - 1, yPos: quad.position.yPos}
        }
    } 
    if (direction == "right"){
        activeFigure.position.xPos += 1;
        for(let i = 0; i < activeFigure.quads.length; i++){
            let quad = activeFigure.quads[i];
            quad.position = {xPos: quad.position.xPos + 1, yPos: quad.position.yPos}
        }
    } 
    clearCanvas();
    for(let i = 0; i < figures.length; i++){
        drawFigure(figures[i].schema, figures[i].position)
    }
    
}
