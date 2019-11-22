var canvas, ctx;// Variables for referencing the canvas and 2dcanvas context
var mouseX, mouseY;// Variables to keep track of the mouse position and left-button status 
let sketckpadPoint;// points drawn on canvas
let sketchpadPoints = [];//initial array of points from canvas
let sketchpadPointsReverse = [];// reversed array for superior frontier
let isCanvasActive = 1;// prevent insert points after "run" button is pressed;
let inferior = document.getElementById('inferior');
let superior = document.getElementById('superior');
var node;//append in html an ul
var textNode;// insert text in ul
let frontier = [];// stack to insert and remove frontier elements
let determinant;// check how the turm is
let color; // color of the frontier

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot

function drawDot(ctx, x, y, size) {
    // Let's use a color by setting RGB 255 alpha (completely opaque)
    r = 100; g = 100; b = 0; a = 255;
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
    frontier = [];
    window.location.reload();
}


// Keep track of the mouse button being pressed and draw a dot at current location

function sketchpad_mouseDown(e) {
    if (isCanvasActive === 1) {
        getMousePos(e);
        drawDot(ctx, mouseX, mouseY,2.5);
        sketckpadPoint = new point(mouseX, 300 - mouseY);//300 is the heigth of canvas, invert Y-axis
        sketchpadPoints.push(sketckpadPoint);
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


// press button

inferior.addEventListener("click", function () {
    isCanvasActive = 0;//after "run" button is pressed, stop inserting point
    //sort the array
    sketchpadPoints.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1);
    color = "black";
    frontierType("Inferior Frontier", sketchpadPoints,color);
    
});

superior.addEventListener("click", function () {
    isCanvasActive = 0;//after "run" button is pressed, stop inserting point
    sketchpadPoints.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1);
    sketchpadPoints.reverse();
    color = "blue";
    frontierType("Superior Frontier", sketchpadPoints,color);
});

// draw and calculate the frontier
function frontierType(choice, sketchpadPoints, color) {
    node = document.createElement("li");
    showStackPoints(choice + " = {");
    // set new array for the frontier with the first two extreme -left points 
    frontier.push(sketchpadPoints[0]);
    frontier.push(sketchpadPoints[1]);

    //push first point ,second , draw red line
    drawLine("rgb(255, 230, 230)", 0, 1);

    for (let i = 2; i < sketchpadPoints.length; i++) {
        // start the algorithm 
        frontier.push(sketchpadPoints[i]);

        //push point red, draw red line
        drawLine("rgb(255, 230, 230)", frontier.length - 2, frontier.length - 1);
        checkTurn();
    }

    function checkTurn() {

        calculateDeterminant();

        while (calculateDeterminant() < 0) {

            drawLine("rgb(255, 230, 230)", frontier.length - 1, frontier.length - 2);
            drawLine("rgb(255, 230, 230)", frontier.length - 2, frontier.length - 3);

            frontier.splice(frontier.length - 2, 1);
            drawLine("rgb(255, 230, 230)", frontier.length - 1, frontier.length - 2);
            //remove behind from list, and remove lines (draw context colored line from second-first behind, and curent point)
            // draw red line second current point

            if (frontier.length < 3) break;
        }

    }
    function calculateDeterminant() {
        determinant = (((frontier[frontier.length - 2].x * frontier[frontier.length - 1].y) - (frontier[frontier.length - 2].y * frontier[frontier.length - 1].x)) -
            ((frontier[frontier.length - 3].x * frontier[frontier.length - 1].y) - (frontier[frontier.length - 3].y * frontier[frontier.length - 1].x)) +
            ((frontier[frontier.length - 3].x * frontier[frontier.length - 2].y) - (frontier[frontier.length - 3].y * frontier[frontier.length - 2].x)));
        return determinant;
    }

    // print points of the frontier
    for (let i = 0; i < frontier.length; i++) {
        if (i != (frontier.length - 1)) showStackPoints("(" + frontier[i].x + "," + frontier[i].y + ")" + ";");
        else showStackPoints("(" + frontier[i].x + "," + frontier[i].y + ")");
        
    }
    
    showStackPoints("}");
    // 
    function showStackPoints(value) {
        textNode = document.createTextNode(value);
        node.appendChild(textNode);
        document.getElementById("frontier").appendChild(node);        
    };

    //draw the frontier
    for (i = 0; i < frontier.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(frontier[i].x, 300 - frontier[i].y);
        ctx.lineTo(frontier[i + 1].x, 300 - frontier[i + 1].y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function drawLine(color, a, b) {
        ctx.beginPath();
        ctx.moveTo(frontier[a].x, 300 - frontier[a].y);
        ctx.lineTo(frontier[b].x, 300 - frontier[b].y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
  
    frontier=[];
}
    
  
    

