// tetris.js
              
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

// figures
const figuresOptions = [
    [
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ]
]

let figureInitialPos = {x: 5, y: 1}
let figurePos;

// figures array
let figures = []

// globals
let occupiedPositions = [];
let occupiedQuadsPositions = [];
let activeFigure;
let started = false;

for (let i = 1; i < 11; i++){
    occupiedQuadsPositions.push({xPos: i, yPos: 20});
}


// bottom border (you can't go below that)
for (let i = 1; i < 11; i++){
    //occupiedPositions.push({xPos: i, yPos: 21});
}

const createNewFigure = () => {
    const figure = new Figure(
        {xPos:5, yPos: 10},
        [
            [1,1,1],
            [0,0,0],
            [0,0,0]
        ]
    );

    figures.push(figure);
    activeFigure = figure;
}

const Start = () =>{
    const figure = new Figure(
        {xPos:5, yPos: 10},
        [
            [1,1,1],
            [0,0,0],
            [0,0,0]
        ]
    );

    figures.push(figure);
    activeFigure = figure;
    draw();
}
// occupiedPositions
const updatePositions = () =>{
    // TODO: add next quad position to occupiedQuadPositions and remove current position from that array
    // for every figure on scene
    for (let i = 0; i < figures.length; i++){
        let canMoveThisFigure = true;

        // for every quad in figure
        for(let j = 0; j < figures[i].quads.length; j++){
            const quad = figures[i].quads[j]
            const checkOccupiedPosition = {xPos: quad.position.xPos, yPos: quad.position.yPos + 1}

            if (occupiedQuadsPositions.some(el => (el.xPos == checkOccupiedPosition.xPos && el.yPos == checkOccupiedPosition.yPos))) 
            {
                canMoveThisFigure = false;
                if(figures[i] == activeFigure){
                    createNewFigure();
                }
            }
            else{canMoveThisFigure = true;}
        }

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
    clearCanvas();
    updatePositions();
    for(let i = 0; i < figures.length; i++){
        // drawFigure(figuresOptions[0], figures[i].position)
        drawFigure(figures[i].schema, figures[i].position)
    }
    setTimeout(draw, newFrameDelay);
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
        occupiedQuadsPositions.push(position)
    }
}

window.onload = Start();
