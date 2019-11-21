var canvas, ctx;// Variables for referencing the canvas and 2dcanvas context
var mouseX, mouseY;// Variables to keep track of the mouse position and left-button status 
let sketckpadPoint;
let sketchpadPoints = [];//initial array of points from canvas
let isCanvasActive = 1;// prevent insert points after "run" button is pressed;
let button = document.getElementById('run');
var nodeOrderedList = document.createElement("ol");
var nodeLi = document.createElement("li");
nodeOrderedList.appendChild(nodeLi);
var textNode;
let inferiorFrontier = [];
let determinant;

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot

function drawDot(ctx, x, y, size) {
    // Let's use a color by setting RGB 255 alpha (completely opaque)
    r = 255; g = 0; b = 0; a = 255;
    // Select a fill style
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillText("(" + x + "," + (300 - y) + ")", x + 5, y + 5);
}

//Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isCanvasActive = 1;
    //clear the array
    sketchpadPoints = [];
    inferiorFrontier = [];
    window.location.reload();
}


// Keep track of the mouse button being pressed and draw a dot at current location

function sketchpad_mouseDown(e) {
    if (isCanvasActive === 1) {
        getMousePos(e);
        drawDot(ctx, mouseX, mouseY, 2);
        sketckpadPoint = new point(mouseX, 300 - mouseY);//300 is the heigth of canvas, invert Y-axis
        sketchpadPoints.push(sketckpadPoint);

        //TO DO:

        //with the new sorted called LI (lower border) array:
        //draw line between first and second, second and third;
        //with LI
        //do
        //check if the line turns right(using math determinant)? if so, pop from LIS array the second, else push the third
        //until the end.
        //LI is the final inferior frontier

        //similar with LS(superior frontier) starting from the end;
    }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}


// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    // Get the specific canvas element from the HTML document
    canvas = document.getElementById('sketchpad');

    // If the browser supports the canvas tag, get the 2d drawing context for this canvas
    if (canvas.getContext)
        ctx = canvas.getContext('2d');

    // Check that we have a valid context to draw on/with before adding event handlers
    if (ctx) {
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
    }
}

// constructor for points
function point(x, y) {
    this.x = x;
    this.y = y;
}

// press run button

button.addEventListener("click", function () {

    isCanvasActive = 0;//after "run" button is pressed, stop inserting point
    //sort the array
    sketchpadPoints.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1);
    // insert text - first step of the algorithm
    textNode1 = document.createTextNode("Inferior Frontier is:{");
    nodeLi.appendChild(textNode1);
    document.getElementById("algorithm").appendChild(nodeOrderedList);

    // set new array for the frontier with the first three extreme -left points 
    inferiorFrontier.push(sketchpadPoints[0]);
    inferiorFrontier.push(sketchpadPoints[1]);
    for (let i = 2; i < sketchpadPoints.length; i++) {
        // start the algorithm 
        inferiorFrontier.push(sketchpadPoints[i]);
        checkTurn();
    }

    function checkTurn() {
        calculateDeterminant();
        
        while (calculateDeterminant() < 0){         
            inferiorFrontier.splice(inferiorFrontier.length - 2, 1);
            if (inferiorFrontier.length < 3) break;      
        } 

    }
    function calculateDeterminant() {
        determinant = (((inferiorFrontier[inferiorFrontier.length - 2].x * inferiorFrontier[inferiorFrontier.length - 1].y) - (inferiorFrontier[inferiorFrontier.length - 2].y * inferiorFrontier[inferiorFrontier.length - 1].x)) -
            ((inferiorFrontier[inferiorFrontier.length - 3].x * inferiorFrontier[inferiorFrontier.length - 1].y) - (inferiorFrontier[inferiorFrontier.length - 3].y * inferiorFrontier[inferiorFrontier.length - 1].x)) +
            ((inferiorFrontier[inferiorFrontier.length - 3].x * inferiorFrontier[inferiorFrontier.length - 2].y) - (inferiorFrontier[inferiorFrontier.length - 3].y * inferiorFrontier[inferiorFrontier.length - 2].x)));
        return determinant;
    }

    for (let i = 0; i < inferiorFrontier.length; i++) {
        nodeOrderedList.appendChild(nodeLi);
        textNode1 = document.createTextNode("(" + inferiorFrontier[i].x + "," + inferiorFrontier[i].y + ")" +";");
        nodeLi.appendChild(textNode1);
        //alert();
    }
    textNode1 = document.createTextNode("}");
    nodeLi.appendChild(textNode1);
    document.getElementById("algorithm").appendChild(nodeOrderedList);
    inferiorFrontier = [];
})
/*
  ctx.beginPath();
  ctx.moveTo(inferiorFrontier[inferiorFrontier.length - 3].x, 300 - inferiorFrontier[inferiorFrontier.length - 3].y);
  ctx.lineTo(inferiorFrontier[inferiorFrontier.length - 2].x, 300 - inferiorFrontier[inferiorFrontier.length - 2].y);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(inferiorFrontier[inferiorFrontier.length - 2].x, 300 - inferiorFrontier[inferiorFrontier.length - 2].y);
  ctx.lineTo(inferiorFrontier[inferiorFrontier.length - 1].x, 300 - inferiorFrontier[inferiorFrontier.length - 1].y);
  ctx.strokeStyle = "red";
  ctx.stroke();
  */
