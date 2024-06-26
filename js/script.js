var Z_MAX_X = 2;
var Z_MIN_X = -2;
var Z_MAX_Y = 2;
var Z_MIN_Y = -2;
var W_MAX_X = 2;
var W_MIN_X = -2;
var W_MAX_Y = 2;
var W_MIN_Y = -2;
var STROKEWIDTH = 5;
var AXISWIDTH = 1;
var BRANCH_CUT_THRESHHOLD = 10;

var STROKECOLOR = "#c74440";

var labelsShow = true;

document.getElementById("mapping").value = "z";

// Left Plane Canvas
var zCanvasDiv = document.getElementById('zPlaneDiv');
var zCanvas = document.createElement('canvas');
if(window.innerWidth > 1000){		
	var canvasMaxHeight1 = window.innerHeight*0.75;
	var canvasMaxHeight2 = window.innerHeight-195;	
	var canvasMaxHeight = Math.min(canvasMaxHeight1,canvasMaxHeight2);
} else {
	var canvasMaxHeight = window.innerHeight-100;
}

const scale = window.devicePixelRatio; 
var styleFrameSize = Math.round(Math.min(canvasMaxHeight,zCanvasDiv.clientWidth));
var frameSize = Math.floor(styleFrameSize * scale);

zCanvas.setAttribute('width',frameSize);
zCanvas.setAttribute('height',frameSize);
zCanvas.setAttribute('style', 'width: ' + styleFrameSize + 'px; height: ' + styleFrameSize + 'px;');
zCanvas.setAttribute('id', 'zCanvas');

zCanvasDiv.appendChild(zCanvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	zCanvas = G_vmlCanvasManager.initElement(zCanvas);
}

var zContext = zCanvas.getContext("2d");	

// w plane canvas
var wCanvasDiv = document.getElementById('wPlaneDiv');

wCanvas = document.createElement('canvas');
var wCanvasWidth = frameSize;
var wCanvasHeight = frameSize;
wCanvas.setAttribute('width',wCanvasWidth);
wCanvas.setAttribute('height',wCanvasHeight);
wCanvas.setAttribute('style', 'width: ' + styleFrameSize + 'px; height: ' + styleFrameSize + 'px;');
wCanvas.setAttribute('id', 'wCanvas');

wCanvasDiv.appendChild(wCanvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	wCanvas = G_vmlCanvasManager.initElement(wCanvas);
}
var wContext = wCanvas.getContext("2d");

//offscreen canvas
const osAxis = new OffscreenCanvas(frameSize, frameSize);
const osAxisContext = osAxis.getContext("2d");
const osAxisLabels = new OffscreenCanvas(frameSize, frameSize);
const osAxisLabelsContext = osAxisLabels.getContext("2d");

// To do: Implement offscreen canvas for zCanvas and wCanvas that takes account of undos
// const osZCanvas = new OffscreenCanvas(frameSize, frameSize);
// const osZCanvasContext = osZCanvas.getContext("2d");
// const osWCanvas = new OffscreenCanvas(frameSize, frameSize);
// const osWCanvasContext = osWCanvasContext.getContext("2d");

// Left Plane Data
var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickDrag = new Array();

var undoTracker = new Array();

var currentX = 0;
var currentY = 0;

// Genearl Cursor Variables
var firstCursorDown = false;
// true if and only if there's been one mousemove followed by a mousedown post reset
// Updates at the end of mousedown / mousemove
var movementAfterCursonDown = false;

// Pen Tool
var paint;
var penMidst = false;
var lineMidst = false;
var penTool = document.getElementById("penTool");

// Line Tool
// Toggle truth variable for mousedown
// Updates at the end of mousedown / mousemove
var lineStarted = false;
var lineTool = document.getElementById("lineTool");
var lineStartingPointX = 0; 
var lineStartingPointY = 0;
var lineStartingClick = 0;

// Circle Tool
// Toggle truth variable for mousedown
// Updates at the end of mousedown / mousemove
var circleStarted = false;
var circleTool = document.getElementById("circleTool");
var circleStartingPointX = 0;
var circleStartingPointY = 0;
var circleStartingClick = 0;

// Marker for Line and Circle Tool
var markerSprite = new Image();
markerSprite.src = "marker.webp";
var markerWidth = 12 * scale;
var markerHeight = 20 * scale;
var markerX = -markerWidth;
var markerY = -markerHeight;

// Global variables for additional drawing tools 
var drawnGrid = false;
var drawnAltGrid = false;
var drawnPolar = false;

function updateCurrent(x, y) {
	currentX = x;
	currentY = y;
}

function updateMarker(x, y) {
	markerX = x - markerWidth/2;
	markerY = y - markerHeight;
}

function hideMarker(){
	markerX = -markerWidth;
	markerY = -markerHeight;
}

function popClick(start) {
	var length = clickX.length;
	for (var i = 0; i < length - start; i++) {
		clickX.pop();
		clickY.pop();
		clickColor.pop();
		clickDrag.pop();
	}
}

var animationStarted = false;
var animationRunning = false;
var animationStartedTime;
var initialTime;
var endTime;
var elapseTime;
var totalTimeInterval;
var t_map;

function previewUpdate(){
	if(lineStarted){
		// If the line has started, regardless of whether there's been an mouseup, still display the preview line.
		popClick(lineStartingClick);
		addLine(lineStartingPointX, lineStartingPointY, currentX, currentY);
	}
	if(circleStarted) {
		// If the line has started, regardless of whether there's been an mouseup, still display the preview line.
		popClick(circleStartingClick);
		var radius = distance(circleStartingPointX, circleStartingPointY, currentX, currentY);
		addCircle(circleStartingPointX, circleStartingPointY, radius);
	}
}

function Update(){
	var timeNow = new Date();
	previewUpdate();
	if(animationRunning){
		// Progress from 0.00 to 1.00, describes the stage of animation we should be in now
		var timeDiff = parseFloat(timeNow.getTime() - animationStartedTime.getTime());
		var progress = parseFloat(timeDiff/elapseTime/1000);
		// The time used for the map
		var time = initialTime + progress * totalTimeInterval;
		var map = parseTime(t_map, time);
		try {
			mapUpdate(map);
		} catch(err) {
			alert("Invalid Function \nMake sure to use * for multiplication between the variables t, x and y \nMake sure the other settings are valid numbers");
			stopAnimationCall();
		}
		if(time > endTime){
			stopAnimationCall();
		}
	}
	// Now try to redraw
	redraw();
}

var framesThisSecond = 198;

function animationUpdateLoop(){
	Update();
	window.setTimeout(animationUpdateLoop, 0);
	framesThisSecond++;
}

function fpsUpdate(){
	document.getElementById("fps").innerHTML = "fps: " + framesThisSecond;
	framesThisSecond = 0;
	window.setTimeout(fpsUpdate, 1000);
}

function stopAnimationCall(){
	animationStarted = false;
	animationRunning = false;
}

function animationReset(){
	stopAnimationCall();
	var map = parseTime(t_map, initialTime);
	mapUpdate(map);
}

function resetTools(){
	firstCursorDown = false; 	
	movementAfterCursonDown = false;
	penMidst = false;
	lineMidst = false;
	lineStarted = false;
	circleStarted = false;
	lineStartingPointX = 0; 
	lineStartingPointY = 0;
	circleStartingPointX = 0;
	circleStartingPointY = 0;
	markerX = -markerWidth;
	markerY = -markerHeight;
}

// Mouse Event Handlers
function mousedown(cursorX, cursorY) {
	if(clickX.length != undoTracker[undoTracker.length-1]){
		undoTracker.push(clickX.length);
	}
	firstCursorDown = true;
	if(penTool.checked) {
		if(document.getElementById("autoLinkMin").value < 0.5) {
			document.getElementById("autoLinkMin").value = "1";
			alert("Autolink max distance too small (< 0.5) \nIt has been reseted to 1.");
		}
		paint = true;
		addClick(cursorX, cursorY);
		penMidst = true;
	}
	// lineTool and circleTool
	if(lineTool.checked) {
		if(lineStarted) {
			if(movementAfterCursonDown){
				// Draw line now and reset
				addLine(lineStartingPointX, lineStartingPointY, cursorX, cursorY);
				resetTools();
			} else {
				// Line started (so there's been a down) but there's no movement 
				// So we need to reset and start anew
				resetTools();
				// Even firstCursorDown got set to false, we still need to set it to true
				firstCursorDown = true;
				// Start a new line 
				lineStarted = true;
				lineStartingPointX = cursorX;
				lineStartingPointY = cursorY;
				lineStartingClick = clickX.length;
			}
		} else {
			// Start a new line 
			lineStarted = true;
			lineStartingPointX = cursorX;
			lineStartingPointY = cursorY;
			lineStartingClick = clickX.length;
		}
	}
	if(circleTool.checked) {	
		if(circleStarted) {
			if(movementAfterCursonDown){
				// Draw circle now and reset
				var radius = distance(circleStartingPointX, circleStartingPointY, cursorX, cursorY);
				addCircle(circleStartingPointX, circleStartingPointY, radius);
				resetTools();
			} else {
				// Circle started (so there's been a down) but there's no movement 
				// So we need to reset and start anew
				resetTools();
				// Even firstCursorDown got set to false, we still need to set it to true
				firstCursorDown = true;
				// Start a new circle 
				circleStarted = true;
				circleStartingPointX = cursorX;
				circleStartingPointY = cursorY;
				updateMarker(circleStartingPointX, circleStartingPointY);
				circleStartingClick = clickX.length;
			}
		} else {
			// Start a new circle 
			circleStarted = true;
			circleStartingPointX = cursorX;
			circleStartingPointY = cursorY;
			updateMarker(cursorX, cursorY);
			circleStartingClick = clickX.length;
		}
	}
	movementAfterCursonDown = false;
}

function mousemove(cursorX, cursorY) {
	if(penTool.checked) {
		if(paint)
		{
			addClick(cursorX, cursorY, true);
		}
	}
	if(firstCursorDown){
		movementAfterCursonDown = true;
	}	
}

function mouseup(cursorX, cursorY) {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		if(movementAfterCursonDown){
			// Draw line now and reset
			previewUpdate();
			addLine(lineStartingPointX, lineStartingPointY, cursorX, cursorY);
			resetTools();
		}
	}
	if(circleTool.checked) {
		if(movementAfterCursonDown){
			// Draw circle now and reset
			previewUpdate();
			var radius = distance(circleStartingPointX, circleStartingPointY, cursorX, cursorY);
			addCircle(circleStartingPointX, circleStartingPointY, radius);
			resetTools();
		}
	}
}

function mouseleave(cursorX, cursorY) {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		// Reset everything
		resetTools();
	}	
	if(circleTool.checked) {
		// Reset everything
		resetTools();
	}
}

// Touch Event Handlers
function touchstart(cursorX, cursorY) {
	if(clickX.length != undoTracker[undoTracker.length-1]){
		undoTracker.push(clickX.length);
	}
	firstCursorDown = true;
	if(penTool.checked) {
		if(document.getElementById("autoLinkMin").value < 0.5) {
			document.getElementById("autoLinkMin").value = "1";
			alert("Autolink max distance too small (< 0.5) \nIt has been reseted to 1.");
		}
		paint = true;
		addClick(cursorX, cursorY);
		penMidst = true;
	}
	// lineTool and circleTool
	if(lineTool.checked) {
		// Start a new line 
		lineStarted = true;
		lineStartingPointX = cursorX;
		lineStartingPointY = cursorY;
		lineStartingClick = clickX.length;
	}
	if(circleTool.checked) {	
		circleStarted = true;
		circleStartingPointX = cursorX;
		circleStartingPointY = cursorY;
		updateMarker(cursorX, cursorY);
		circleStartingClick = clickX.length;
	}
	movementAfterCursonDown = false;
}

function touchmove(cursorX, cursorY) {
	if(penTool.checked) {
		if(paint)
		{
			addClick(cursorX, cursorY, true);
		}
	}
	if(firstCursorDown){
		movementAfterCursonDown = true;
	}
}

function touchend() {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		if(movementAfterCursonDown){
			// Draw line
			previewUpdate();
			addLine(lineStartingPointX, lineStartingPointY, currentX, currentY);
		}
		resetTools();
	}
	if(circleTool.checked) {
		if(movementAfterCursonDown){
			// Draw circle
			previewUpdate();
			var radius = distance(circleStartingPointX, circleStartingPointY, currentX, currentY);
			addCircle(circleStartingPointX, circleStartingPointY, radius);
		}
		resetTools();
	}
}

// Mouse Event Listeners
$('#zCanvas').mousemove(function(e) {
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);
	console.log("mousemove");
	mousemove(mouseX, mouseY);
});

$('#zCanvas').mousedown(function(e){
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);
	
	console.log("mousedown");
	mousedown(mouseX, mouseY);
});

$('#zCanvas').mouseup(function(e) {
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);

	console.log("mouseup");
	mouseup(mouseX, mouseY);
});

$('#zCanvas').mouseleave(function(e) {
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);

	console.log("mouseleave");
	mouseleave(mouseX, mouseY);
});

// Touch Event Listeners
$('#zCanvas').on('touchmove', function(e) {	
	e.preventDefault();
	touchX = (e.originalEvent.touches[0].pageX - this.offsetLeft) * scale;
	touchY = (e.originalEvent.touches[0].pageY - this.offsetTop) * scale;;
	updateCurrent(touchX, touchY);

	console.log("touchmove");
	touchmove(touchX, touchY);
}
);

$('#zCanvas').on('touchstart', function(e) {
	e.preventDefault();
	touchX = (e.originalEvent.touches[0].pageX - this.offsetLeft) * scale;
	touchY = (e.originalEvent.touches[0].pageY - this.offsetTop) * scale;;
	updateCurrent(touchX, touchY);

	console.log("touchstart");
	touchstart(touchX, touchY);
}
);

$('#zCanvas').on('touchend', function(e) {
	e.preventDefault();
	// It seems that touch data cannot be retrieved when touch ends?

	console.log("touchend");
	touchend();
}
);

$('#zCanvas').on('touchcancel', function(e) {
	e.preventDefault();

	console.log("touchcancel");
	touchcancel();
}
);

// Helpful Functions
function distance(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow((y2-y1),2) + Math.pow((x2-x1),2));
}

// Adding vertices to the left plane
function addClick(x, y, dragging)
{
	if(clickX.length == 0){
		// Duplicate the first point
		clickX.push(x);
		clickY.push(y);
		clickColor.push(STROKECOLOR);
		clickDrag.push(dragging);
		addClick(x, y, true);
	} else {
	var clickXPrevious = clickX[clickX.length-1];
	var clickYPrevious = clickY[clickY.length-1];

	if(distance(clickXPrevious, clickYPrevious, x, y)>document.getElementById("autoLinkMin").value && (penMidst || lineMidst)) {
		xMid = (clickXPrevious + x)/2;
		yMid = (clickYPrevious + y)/2;
		addClick(xMid, yMid, true);
		addClick(x, y, true);
	} else {
		clickX.push(x);
		clickY.push(y);
		clickColor.push(STROKECOLOR);
		clickDrag.push(dragging);
	}
	}
}

function addLine(x1, y1, x2, y2) {
	console.log("adding line with addLine");
	console.log("from " + x1 + " " + y1 + " to " + x2 + " " + y2);

	addClick(x1, y1);
	lineMidst = true;
	addClick(x2, y2);
	lineMidst = false;
	
}

function addCircle(x, y, r){
	var circumference = 2 * Math.PI * r;
	var n = circumference / document.getElementById("autoLinkMin").value /1.15;
	addClick(x + r, y);
	penMidst = true;
	// 2 more points than n to visually complete the circle
	for(var i = 0; i < n+2; i++){
		var angle = i * 2 * Math.PI / n;
		var x0 = x + r * Math.cos(angle + 2 * Math.PI / n);
		var y0 = y + r * Math.sin(angle + 2 * Math.PI / n);
		addClick(x0, y0);
	}
	penMidst = false;

}

// Function Plotting
var f = function(z){
	return z;
};

function parse2DFunctions(func)
{
	var func_parsed = func.replaceAll(/x(?!p)/g,"(re(z))");
	var func_parsed_twice = func_parsed.replaceAll("y","(im(z))");
	return func_parsed_twice;
}

function parseTime(func, time){
	var floatTime =  parseFloat(time);
	var bracketedTime =  "(" + floatTime + ")";
	func_parsed = func.replaceAll(/t(?!an)(?<!cbrt)(?<!sqrt)(?<!fact)(?<!cot)(?<!fpart)(?<!ipart)(?<!int)/g, bracketedTime);
	return func_parsed;
}

function combineMap(u,v){
	map = "(" + u + ")+(" + v+ ")*i";
	return map;
}

function finalMapCheck(map){
	if(map.includes("conj")){
		alert("Conjugate is not supported at this moment \nConsider using abs(z)^2/z instead, subjected to your branch cut settings");
	}
}

function setPhiMap()
{
	var u = document.getElementById("real").value;
	var v = document.getElementById("imag").value;

	time = parseFloat(document.getElementById("time").value);
	map = combineMap(parseTime(parse2DFunctions(u),time),parseTime(parse2DFunctions(v),time));
	finalMapCheck(map);

	try{
	mapUpdate(map);
	} catch (err){
		alert("Invalid Function \nMake sure to use * for multiplication between the variables t, x and y \nMake sure the other settings are valid numbers");
	}
}

function setFMap() {

	var time = document.getElementById("time").value
	var map = document.getElementById("mapping").value;
	map = parseTime(map, time);
	finalMapCheck(map);

	try {
	mapUpdate(map);
	} catch (err){
		alert("Invalid Function \nMake sure to use * for multiplication between the variables t, x and y \nMake sure the other settings are valid numbers");
	}
}

function mapUpdate(map)
{
	console.log("Mapping " + map );
	var funk = Complex.parseFunction(map,['z']);
	f = function(z){
		return funk(z);
	};
}

// Animation code
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function playAnimation()
{
	if(animationStarted || animationRunning){
		stopAnimationCall();
		playAnimation();
	}
	animationStarted = true;
	animationStartedTime = new Date();

	// Process time settings
	initialTime = parseFloat(document.getElementById("initialTime").value);
	endTime = parseFloat(document.getElementById("endTime").value);
	totalTimeInterval = endTime - initialTime;

	fps = parseFloat(document.getElementById("fps").value);
	elapseTime = parseFloat(document.getElementById("elapseTime").value);

	// Deal with the choice of which function to animate
	if (document.getElementById("animate-function").value == "real") {
		var u = document.getElementById("real").value;
		var v = document.getElementById("imag").value;
		var u_parsed = parse2DFunctions(u);
		var v_parsed = parse2DFunctions(v);
		t_map = combineMap(u_parsed,v_parsed);}
	else{
		var f = document.getElementById("mapping").value;
		t_map = f;
	}

	finalMapCheck(t_map);

	animationRunning=true;
	animationStarted=false;
}

var zplane = zContext.getImageData(0,0,frameSize,frameSize);
var data = zplane.data;

function redraw()
{
	zContext.clearRect(0, 0, zContext.canvas.width, zContext.canvas.height);
	zContext.drawImage(osAxis, 0, 0);
	// labels
	if(Z_MAX_X == 2 & Z_MIN_X == -2 & Z_MAX_Y == 2 & Z_MIN_Y == -2 & labelsShow){
		zContext.drawImage(osAxisLabels, 0, 0);	
	}
	
	zContext.lineJoin = "round";
	zContext.lineWidth = STROKEWIDTH;

	// Everything starts at 1. Look at addClick function for more details
	// Have to do this weird thing to stop a visual glitch
	zContext.beginPath();
	zContext.closePath();
	zContext.stroke();

	zContext.strokeStyle = clickColor[0];
	for(var i=1; i < clickX.length; i++) 
	{
		if (!clickDrag[i]) {
			// Apparently clickDrag is false if the point is at an end point of an line, and true otherwise. Not sure why this is the case.
			// End line and start a new line
			zContext.stroke(); 
			// Color change is done this way to minimize number of times of changing strokeStyle which is computationally expensive
			if(clickColor[i] != clickColor[i-1]){
				zContext.strokeStyle = clickColor[i];
			}
			zContext.moveTo(clickX[i], clickY[i]);
			zContext.beginPath();
		} else {
			// Continue a line
			if(clickColor[i] != clickColor[i-1]){
				zContext.strokeStyle = clickColor[i];
			}
			zContext.lineTo(clickX[i], clickY[i]);
		}
	}

	// Finish the path if there's a line in progress
	zContext.stroke();

	// do the mapping
	wMap();
}

function wMap()
{
	wContext.clearRect(0,0,wCanvasWidth,wCanvasHeight);
	wContext.drawImage(osAxis, 0, 0);
	//labels
	if(W_MAX_X == 2 & W_MIN_X == -2 & W_MAX_Y == 2 & W_MIN_Y == -2 & labelsShow){
		wContext.drawImage(osAxisLabels, 0, 0);	
	}

	// Have to do this weird thing to stop a visual glitch
	wContext.beginPath();
	wContext.closePath();
	wContext.stroke();

	var prevx;
	var prevy;

	wContext.lineWidth = STROKEWIDTH;
	wContext.lineJoin = "round";
	wContext.strokeStyle = clickColor[0];
	
	for(var i = 0; i < clickDrag.length; i++)
	{
		var zreal = Z_MIN_X + (Z_MAX_X - Z_MIN_X)*(clickX[i]/frameSize);
		var zimg = Z_MIN_Y + (Z_MAX_Y - Z_MIN_Y)*(1-(clickY[i]/frameSize));
		var inp = Complex(zreal, zimg);
		var out = f(inp);
		var out_re = out.real();
		var out_im = out.imag();

		var out_x = Math.round(((out_re - W_MIN_X)/(W_MAX_X - W_MIN_X))*wCanvasWidth)
		var out_y = Math.round((1-((out_im - W_MIN_Y)/(W_MAX_Y - W_MIN_Y)))*wCanvasHeight)

		// Start drawing at the second point. Look at addClick function for more details
		if(i != 0)
		{
			if(!clickDrag[i]){
				// Refer to redraw function for more details
				// End line and start a new line
				wContext.stroke();
				if(clickColor[i] != clickColor[i-1]){
					wContext.strokeStyle = clickColor[i];
				}
				wContext.moveTo(out_x, out_y);
				wContext.beginPath();
			} else {
				// Continue a line
				if((distance(out_x,out_y,prevx,prevy)/distance(clickX[i-1],clickY[i-1],clickX[i],clickY[i]))<BRANCH_CUT_THRESHHOLD){
					// No branch cut
					wContext.lineTo(out_x,out_y);
				} else {
					// Branch cut exists
					wContext.moveTo(out_x, out_y);
				}					
			}
		}
		prevx = out_x;
		prevy = out_y;
	}

	// Finish the path if there's a line in progress
	wContext.stroke();
}


function initOffscreen(){
	osAxisContext.lineWidth = AXISWIDTH;
	osAxisContext.strokeStyle = "#000000";
	//axes
	osAxisContext.beginPath();
	osAxisContext.moveTo(0,frameSize/2);
	osAxisContext.lineTo(frameSize,frameSize/2);
	osAxisContext.closePath();
	osAxisContext.stroke();
	// other axis
	osAxisContext.beginPath();
	osAxisContext.moveTo(frameSize/2,0);
	osAxisContext.lineTo(frameSize/2,frameSize);
	osAxisContext.closePath();
	osAxisContext.stroke();

	osAxisLabelsContext.drawImage(osAxis, 0 ,0);

	osAxisLabelsContext.lineWidth = AXISWIDTH*2;

	osAxisLabelsContext.font = "30px Arial";
	osAxisLabelsContext.textAlign = "right";
	osAxisLabelsContext.fillText("0", frameSize/2 - 5, frameSize/2 + 35);
	
	osAxisLabelsContext.textAlign = "center";
	osAxisLabelsContext.fillText("1", frameSize*3/4, frameSize/2 + 35);
	osAxisLabelsContext.beginPath();
	osAxisLabelsContext.moveTo(frameSize*3/4,frameSize/2+5);
	osAxisLabelsContext.lineTo(frameSize*3/4,frameSize/2-5);
	osAxisLabelsContext.closePath();
	osAxisLabelsContext.stroke();

	osAxisLabelsContext.fillText("1", frameSize*1/4, frameSize/2 + 35);
	osAxisLabelsContext.fillText("-", frameSize*1/4-12, frameSize/2 + 35);
	osAxisLabelsContext.beginPath();
	osAxisLabelsContext.moveTo(frameSize*1/4,frameSize/2+5);
	osAxisLabelsContext.lineTo(frameSize*1/4,frameSize/2-5);
	osAxisLabelsContext.closePath();
	osAxisLabelsContext.stroke();

	osAxisLabelsContext.fillText("1", frameSize/2-20, frameSize*1/4+10);
	osAxisLabelsContext.beginPath();
	osAxisLabelsContext.moveTo(frameSize/2+5, frameSize*1/4);
	osAxisLabelsContext.lineTo(frameSize/2-5, frameSize*1/4);
	osAxisLabelsContext.closePath();
	osAxisLabelsContext.stroke();

	osAxisLabelsContext.fillText("1", frameSize/2-20, frameSize*3/4+10);
	osAxisLabelsContext.fillText("-", frameSize/2-32, frameSize*3/4+10);
	osAxisLabelsContext.beginPath();
	osAxisLabelsContext.moveTo(frameSize/2+5, frameSize*3/4);
	osAxisLabelsContext.lineTo(frameSize/2-5, frameSize*3/4);
	osAxisLabelsContext.closePath();
	osAxisLabelsContext.stroke();
}

// Initliase and start animation
initOffscreen();
redraw();
animationUpdateLoop();
fpsUpdate();