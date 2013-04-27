// Simple way to attach js code to the canvas is by using a function
var sketchProc = new Processing.Sketch(function(processing) {

processing.setup = function () {

	processing.size(640,480); // TODO: same size as melon js canvas

	processing.noStroke();

	processing.background(0, 0, 0, 0);
	processing.frameRate(60);
	console.debug("############# processing setup");
	processing.smooth();

};

processing.draw = function () 
{ 


  var pointillize = 20; // was between 10 and 18, random

  var draw_x_times = 10; 
  // *
  processing.fill(0,0,0,0);
  processing.rect(0,0,processing.width, processing.height)
  // */
  
  while ( draw_x_times > 0 ) {
	var x = Math.floor(Math.random()*640);
	var y = Math.floor(Math.random()*480);
	var ctx_game = $("#jsapp").children('canvas')[0].getContext('2d');
	var imgd = ctx_game.getImageData(x, y, 1, 1);
	var pix = imgd.data;
	/*
	console.debug(pix);
	
	var red = pix[0];
	var green = pix[1];
	var blue = pix[2];
	var alpha = pix[3];
	*/
	processing.fill(processing.color(pix[0], pix[1], pix[2], pix[3]), 126);
	processing.ellipse(x, y, pointillize, pointillize);
	draw_x_times = draw_x_times -1;
  }
  // processing.updatePixels();
}
})

function clearOverlay(){
	$("#overlay_canvas")[0].getContext('2d').clearRect(0,0,640,480);
}