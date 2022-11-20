// tetris.js

// figures
const figuresOptions = [
    [ // t shape
        {type: "t-shape"},
        [
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ],
        [
            [0,1,0],
            [0,1,1],
            [0,1,0],
        ],
        [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ],
        [
            [0,1,0],
            [1,1,0],
            [0,1,0],
        ],
    ],
    [
        {type: "l-shape"},
        [
            [0,0,0],
            [1,1,1],
            [1,0,0],
        ],
        [
            [1,1,0],
            [0,1,0],
            [0,1,0],
        ],
        [
            [0,0,0],
            [0,0,1],
            [1,1,1],
        ],
        [
            [0,1,0],
            [0,1,0],
            [0,1,1],
        ]
    ],
    [
        {type: "reverse-l-shape"},
        [
            [0,0,0],
            [1,1,1],
            [0,0,1],
        ],
        [
            [0,1,0],
            [0,1,0],
            [1,1,0],
        ],
        [
            [0,0,0],
            [1,0,0],
            [1,1,1],
        ],
        [
            [0,1,1],
            [0,1,0],
            [0,1,0],
        ]
    ],
    [ // reverse z-shape
        {type: "reverse-z-shape"},
        [
            [0,0,0],
            [0,1,1],
            [1,1,0],
        ],
        [
            [1,0,0],
            [1,1,0],
            [0,1,0],
        ],
        [
            [0,0,0],
            [0,1,1],
            [1,1,0],
        ],
        [
            [1,0,0],
            [1,1,0],
            [0,1,0],
        ],
    ],
    [   // z-shape
        {type: "z-shape"},
        [
            [0,0,0],
            [1,1,0],
            [0,1,1],
        ],
        [
            [0,0,1],
            [0,1,1],
            [0,1,0],
        ],
        [
            [0,0,0],
            [1,1,0],
            [0,1,1],
        ],
        [
            [0,0,1],
            [0,1,1],
            [0,1,0],
        ],
    ],
   
]

const rotateFigure = () =>{

    // TODO: remove all quad from occupied quad position
    for (let i = 0; i < activeFigure.quads.length; i++){
        quad = activeFigure.quads[i];
        const index = occupiedQuadsPositions.indexOf(quad.position)
        if (index > -1){occupiedQuadsPositions.splice(index, 1)}
    }
        
        
        ereaseFigure(activeFigure);
        if (activeFigure.actualSchemaPositionIndex == 4 ){activeFigure.actualSchemaPositionIndex = 0 }
        const figure = new Figure(activeFigure.position, activeFigure.schema, activeFigure.actualSchemaPositionIndex + 1);
    activeFigure = figure;
    figures.push(figure);
    // drawFigure(figure);
    // // drawFigure(figure);
    // // drawFigures();
    // console.log("rotateFigure invoked")
    // // const newSchema = figuresOptions.find(el => el[1] == activeFigure.actualSchemaPositionIndex)
    // // let newActiveFigure = new Figure(activeFigure.position, newSchema[activeFigure.actualSchemaPositionIndex+1])
    // // activeFigure.createQuads()

}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 400;
const canvasHeight = 600;
const newFrameDelay = 1000; // in miliseconds

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



const createNewFigure = (schemaPositionIndex=1) => {
    // stops game after n spawned figures - just for debugging
    if (createdCounter == endGameAfterLevel){
        gameOver();
    }
    if (canCreate){
        const spawnPosition = {xPos:5, yPos: 10}
            
        let item = figuresOptions[Math.floor(Math.random()*figuresOptions.length)];
        const figure = new Figure(spawnPosition, item);
        figures.push(figure);
        activeFigure = figure;
        createdCounter += 1;
    } 
}

const Start = () =>{
    // const item = figuresOptions[Math.floor(Math.random()*figuresOptions.length)];

    const item = figuresOptions[0]
    // item is t-shape

    const figure = new Figure(
        {xPos:5, yPos: 10},
        item,
        1
    );

    figures.push(figure);
    activeFigure = figure;
    draw();
}

const updateActiveFigurePosition = () =>{

    let canMoveThisFigure = true;
    for (let i = 0; i < activeFigure.quads.length; i++){
        const quad = activeFigure.quads[i];
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
            quad2.position = {xPos: quad2.position.xPos, yPos: quad2.position.yPos + 1}
        }
    }else{
        for (let i = 0; i < activeFigure.quads.length; i++){
            let quad2 = activeFigure.quads[i]
            occupiedQuadsPositions.push(quad2.position);
        }
        createNewFigure(1);
    }
}

const drawFigures = () =>{
    for(let i = 0; i < figures.length; i++){
        drawFigure(figures[i])
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

// const countQuadsInFigure = (schema) => {

//     let count = 0;
//     for (let i = 0; i < schema.length; i++){
//         countInRow = schema[i].filter(x => x==1).length
//         count += countInRow;
//     }
//     return countInRow;
// }


const draw = () =>{
    if(canCreate){
        clearCanvas();
        //updatePositions();
        updateActiveFigurePosition();
        drawFigures();
        setTimeout(draw, newFrameDelay);
    } 
}

const clearCanvas = () =>{
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
     
    // create tetris grid
    drawGrid();
}

const drawGrid = () => {
    for (let i = 0; i < xResolution; i++ ){
        for (let j = 0; j < yResolution; j++){
            ctx.fillStyle = gridColor;
            ctx.fillRect(i * gridScale, j * gridScale, gridScale - gridWidth, gridScale - gridWidth);
        }
    }
}

const drawFigure = (figure) => {
    ctx.fillStyle = figureColor;
    for (let i = 0; i < figure.quads.length; i++){
        console.log('drawing quad for fucking figure')
        drawQuad(figure.quads[i].position);
    }
}

const ereaseFigure = (figure) => {
    for (let i = 0; i < figure.quads.length; i++){
        quad = figure.quads[i];
        quad = null;
    }
    delete figure;
    figure.quads = [];
    figure = null;
    clearCanvas();
    drawFigures();
}

const drawQuad = (position) =>{
    ctx.fillRect(position.xPos * gridScale, position.yPos * gridScale, gridScale - gridWidth, gridScale - gridWidth)
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
    constructor(position, schema, schemaPositionIndex=1){
        this.position = position;
        this.schema = schema;
        
        // this.quadCount = countQuadsInFigure(schema);
        this.quads = []
        this.actualSchemaPositionIndex = schemaPositionIndex;
        this.createQuads();
    }

    createQuads(){
        const centerPoint = this.position;
        let quadPos;
        if (this.schema[this.actualSchemaPositionIndex][0][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][0][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][0][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][1][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][1][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][1][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][2][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][2][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][2][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos);
            this.quads.push(quad);
        }
        }
    }


class Quad{
    constructor(position){
        this.position = position;
        drawQuad(this.position);
    }
}

window.onload = Start();


document.addEventListener('keydown', (event) =>{
    var name = event.key;
    var code = event.code;
    moveFigure(code);
    if (code == "KeyS") rotateFigure();
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
    // redraw all figures
    drawFigures();
}

