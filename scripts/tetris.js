// tetris.js
globals = {
    debug: true,
}
// colors 
const figureColorOptions = [
    "#ff9400",
    "#ff0800",
    "#00d9ce",
    "#5a47ff",
    "#fc03ca",
    "#00cc0e",
]

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

// quads arras
let quads = []

// globals
let activeFigure;
let started = false;
let createdCounter = 0;
let canCreate = true;
let endGameAfterLevel = 99999;

const rotateFigure = () =>{
    const activeFigureColor = activeFigure.color;
    ereaseFigure(activeFigure);
    // if index is 4 reset it to 0
    if (activeFigure.actualSchemaPositionIndex == 4 ){activeFigure.actualSchemaPositionIndex = 0 }
    const figure = new Figure(activeFigure.position, activeFigure.schema, activeFigure.actualSchemaPositionIndex + 1, activeFigureColor);

    activeFigure = figure;
    refreshScene();
}

const spawnTesting = () =>{
    testingFigures = []
    const fig1 = new Figure({xPos: 1, yPos: 18}, figuresOptions[1], 3)
    const fig2 = new Figure({xPos: 4, yPos: 18}, figuresOptions[1], 3)
    const fig3 = new Figure({xPos: 8, yPos: 18}, figuresOptions[1], 3)
    figures.push(fig1);
    figures.push(fig2);
    figures.push(fig3);
    testingFigures.push(fig1);
    testingFigures.push(fig2);
    testingFigures.push(fig3);
}


const createNewFigure = (schemaPositionIndex=1) => {
    // stops game after n spawned figures - just for debugging
    if (createdCounter == endGameAfterLevel){
        gameOver();
    }
    if (canCreate){
        const spawnPosition = {xPos:5, yPos: 1}
        // const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        const randomColorIndex = Math.floor(Math.random() * figureColorOptions.length);
        const randomColor = figureColorOptions[randomColorIndex];
        let item = figuresOptions[Math.floor(Math.random()*figuresOptions.length)];
        const figure = new Figure(spawnPosition, item, 1, color=randomColor);
        console.log(figure)
        figures.push(figure);
        activeFigure = figure;
        createdCounter += 1;
    } 
}
const spawnBottomBorderQuads = () => {
// bottom border (you can't go below that)
    for (let i = 1; i < 11; i++){
        const q = new Quad({xPos: i, yPos: 20})
    }   
}

const Start = () =>{
    // testing
    if(globals["debug"]){
        spawnTesting();
    }

    // bottom border
    spawnBottomBorderQuads();

    const item = figuresOptions[Math.floor(Math.random()*figuresOptions.length)];
    
    // first figure
    const figure = new Figure(
        {xPos:5, yPos: 13},
        item,
        1
    );

    activeFigure = figure;
    draw();
}

const refreshScene = () =>{
    clearCanvas();
    drawFigures();
}

const deleteRow = (row) =>{
    const toDelete = quads.filter(el => (el.position.yPos == row))
    for (let i = 0; i< toDelete.length; i++){
        deleteQuad(toDelete[i]);
    }
    // move all quads one unit down
    moveQuadsDown(row);

    refreshScene();
}

const moveQuadsDown = (row) => {
    // move all quads above the row
    const quadsToMove = quads.filter(el => el.position.yPos <= row)
    for (let i = 0; i < quadsToMove.length; i++){
        quad = quads.find(el => el.position == quadsToMove[i].position);
        console.log(quad)
        quad.position = {...quad.position, yPos: quad.position.yPos + 1};
    }
}

const deleteQuad = (quad) => {
    // delete from globals
    deleteElementFromArray(quad, quads);
    refreshScene();
}

const checkIfScore = () => {
    // for every row check if it contains 10 elements
    for (let i = 0; i < 20; i++){
        const quadsInRow = quads.filter(el => (el.position.yPos == i))
        if (quadsInRow.length == 10) deleteRow(i);
    }
}

const moveActiveFigureDown = () =>{
    let canMoveThisFigure = true;
    let quadsToMoveDown = quads.filter(el => el.figure == activeFigure);
  
    for (let i = 0; i < quadsToMoveDown.length; i++){
        const quad = quadsToMoveDown[i];
        const positionToCheck = {...quad.position, yPos: quad.position.yPos + 1}

        if (!checkIfEmpty(positionToCheck)){
            // can't move down
            canMoveThisFigure = false;
        }
    } 
    if (canMoveThisFigure){
        // move figure down
        activeFigure.position = {...activeFigure.position, yPos: activeFigure.position.yPos + 1}
        // move quads down
        
        for (let i = 0; i < quadsToMoveDown.length; i++){
            const quad = quadsToMoveDown[i]
            quad.position = {xPos: quad.position.xPos, yPos: quad.position.yPos + 1}
        }
    }else{
        createNewFigure();
    }
}

const checkIfEmpty = (position) =>{
    for (let i = 0; i < quads.length; i++){
        if(quads[i].position.xPos == position.xPos && 
            quads[i].position.yPos == position.yPos &&
            (quads[i].figure != activeFigure || quads[i].figure == null)){
                return false
        }
    }
    return true
}


const drawFigures = () =>{
    for(let i = 0; i < figures.length; i++){
        drawFigure(figures[i])
    }
}


const draw = () =>{
    if(canCreate){
        clearCanvas();
        moveActiveFigureDown();
        checkIfScore();
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
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    // ctx.fillStyle = figureColor;
    ctx.fillStyle = figure.color;
    // ctx.fillStyle = randomColor;
    // find quads that belong to this figure
    const figureQuads = quads.filter(el => el.figure == figure)
    for (let i = 0; i < figureQuads.length; i++){
        drawQuad(figureQuads[i].position);
    }
}

const deleteElementFromArray = (element, arr) => {
    const index = arr.indexOf(element)
    if (index > -1){arr.splice(index, 1)}
}

const ereaseFigure = (figure) => {
    const figureQuads = quads.filter(el => el.figure == activeFigure)
    // delete all quads from scene
    for (let i = 0; i < figureQuads.length; i++){
        quad = figureQuads[i];
        deleteElementFromArray(quad, quads)
    }

    deleteElementFromArray(figure, figures);
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
    constructor(position, schema, schemaPositionIndex=1, color=figureColor){
        this.position = position;
        this.schema = schema;
        this.color = color;
        this.quads = []
        this.actualSchemaPositionIndex = schemaPositionIndex;
        this.createQuads();
        figures.push(this);
    }

    createQuads(){
        const centerPoint = this.position;
        let quadPos;
        if (this.schema[this.actualSchemaPositionIndex][0][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][0][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][0][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos-1}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][1][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][1][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][1][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][2][0] == 1){
            quadPos = {xPos: centerPoint.xPos - 1, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][2][1] == 1){
            quadPos = {xPos: centerPoint.xPos, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }

        if (this.schema[this.actualSchemaPositionIndex][2][2] == 1){
            quadPos = {xPos: centerPoint.xPos + 1, yPos: centerPoint.yPos + 1}
            const quad = new Quad(quadPos, this, this.color);
            // this.quads.push(quad);
        }
        
    }
}


class Quad{
    constructor(position, figure=null, color=figureColor){
        this.position = position;
        this.figure = figure;
        this.color = figureColor;
        drawQuad(this.position);
        quads.push(this);
    }
}

window.onload = Start();


document.addEventListener('keydown', (event) =>{
    var name = event.key;
    var code = event.code;
    moveFigure(code);
    if (code == "KeyW") rotateFigure();
    if (code == "KeyS") fastMove();
})

const fastMove = () =>{
    // activeFigure.position = {xPos: activeFigure.position.xPos, yPos: activeFigure.position.yPos+1}
    // for (let i = 0; i < activeFigure.quads.length; i++){
    //     quad = activeFigure.quads[i];
    //     quad.position = {xPos: quad.position.xPos, yPos: quad.position.yPos + 1}
    // }
    moveActiveFigureDown();
    clearCanvas();
    drawFigures();
}

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
        const xMovingDirection = -1
        const activeFigureQuads = quads.filter(el => el.figure == activeFigure);
        for(let i = 0; i < activeFigureQuads.length; i++){
            quad = activeFigureQuads[i];
            if(quad.position.xPos + xMovingDirection == -1) return;
            if (!checkIfEmpty({...quad.position ,xPos: quad.position.xPos + xMovingDirection})){
                return
            }
        }
        
        activeFigure.position.xPos += xMovingDirection;
        // all figure quads
        const figureQuads = quads.filter(el => el.figure == activeFigure);
        for(let i = 0; i < figureQuads.length; i++){
            let quad = figureQuads[i];
            quad.position = {xPos: quad.position.xPos + xMovingDirection, yPos: quad.position.yPos}
        }
    } 

    if (direction == "right"){
        const xMovingDirection = 1
        const activeFigureQuads = quads.filter(el => el.figure == activeFigure);
        for(let i = 0; i < activeFigureQuads.length; i++){
            quad = activeFigureQuads[i];
            if(quad.position.xPos + xMovingDirection == 10) return;
            if (!checkIfEmpty({...quad.position ,xPos: quad.position.xPos + xMovingDirection})){
                return
            }
        }
        activeFigure.position.xPos += xMovingDirection;
        // all figure quads
        const figureQuads = quads.filter(el => el.figure == activeFigure);
        for(let i = 0; i < figureQuads.length; i++){
            let quad = figureQuads[i];
            quad.position = {xPos: quad.position.xPos + xMovingDirection, yPos: quad.position.yPos}
        }
    } 

    refreshScene();
}

