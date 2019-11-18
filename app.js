

// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx;

// Variables to keep track of the mouse position and left-button status 
var mouseX, mouseY, mouseDown = 0;

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(ctx, x, y, size) {
    // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
    r = 255; g = 0; b = 0; a = 255;

    // Select a fill style
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";

    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown(e) {
    mouseDown = 1;
    getMousePos(e);
    drawDot(ctx, mouseX, mouseY, 2);
   
		//construieste array cu fiecare punct inserat

		//sorteaza array dupa x cu o functie de sortare
		//uneste punctele intre ele
		//verifica determinantul a celor trei puncte (doua precedente, al treilea urmatorul)
		//daca e viraj stanga sau pe linie push al treilea (intr-un alt sir LI)
		// traseaza si sterge linii cu un delay
		//altfel  precedent = urmatorul mergi la urmatorul
		//LI este frontiera inferioara
    }

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown = 0;
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
        window.addEventListener('mouseup', sketchpad_mouseUp, false);
    }
}
