// Simple way to attach js code to the canvas is by using a function
var whistle3_ring_there = false;
var whistle3_cooldown = 0.0;
var whistle3_ringdiameter = 0.0;
function whistle3_ready() {
  whistle3_last_time_ago = new Date().getTime() - whistle3_cooldown;
  return whistle3_last_time_ago > 3000;
}

var whistle2_cooldown = 0.0;
function whistle2_ready() {
  whistle2_last_time_ago = new Date().getTime() - whistle2_cooldown;
  return whistle2_last_time_ago > 1000;
}


var sketchProc = new Processing.Sketch(function(processing) {

processing.setup = function () {

	processing.size(640,480); // TODO: same size as melon js canvas
	// processing.noFill();
	processing.strokeWeight(4);
	processing.background(0, 0, 0, 0);
	processing.frameRate(60);
	// console.debug("############# processing setup");
	processing.smooth();

};

processing.draw = function () 
{ 


  if ( whistle2_ready() && whistle3_ready()) {
  var pointillize = 10; // was between 10 and 18, random

  var draw_x_times = 5; 
  // *
  processing.fill(0,0,0,2);
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
	processing.fill(processing.color(pix[0], pix[1], pix[2], pix[3],126));
	processing.rect(x, y, pointillize+Math.floor(Math.random()*10), pointillize+Math.floor(Math.random()*60));
	draw_x_times = draw_x_times -1;
  };
  
  
  } // end 'pointillism'
  // if whistling draw a red dot where the player is
  if (me.input.isKeyPressed('whistle1')) {
    // console.debug("whistle one, processing");
	var pl = me.game.getEntityByName("mainPlayer")[0];
	var posOnScreenX = pl.pos.x + pl.width/2 - me.game.viewport.pos.x;
	var posOnScreenY = pl.pos.y + pl.height/2 - me.game.viewport.pos.y;
	processing.fill(processing.color(255,0,0,255));
	processing.rect(posOnScreenX, posOnScreenY, 20, 20);
  }
  
  // if whistling draw a red dot where the player is
	if (  ! whistle2_ready() ) {
		ws = me.game.getEntityByName("whistled");
		// console.debug("whistle two, processing", ws.length, ws);
		for (var i = 0; i < ws.length; i++) {
			posOnScreenX = ws[i].pos.x  - me.game.viewport.pos.x;
			posOnScreenY = ws[i].pos.y  - me.game.viewport.pos.y;
		
			// console.debug(posOnScreenX, posOnScreenY);
			processing.fill(processing.color(0, 255, 0, 255));
			processing.rect(posOnScreenX, posOnScreenY, ws[i].width, ws[i].height);
		}
		
	} else { /* console.debug( "whistle two is ready" ) */ }
  
	if (  ! whistle3_ready() ) {
		if ( whistle3_ring_there ) {
			whistle3_ringdiameter = whistle3_ringdiameter + 30;
		} else {
			whistle3_ring_there = true;
			whistle3_ringdiameter = 0;
		}
		// now draw the guiding ring
		// console.debug("######## Target whistle", whistle3_last_time);
		l = me.game.getEntityByName("targetPointer")[0];
		posOnScreenX = l.pos.x + l.width/2 - me.game.viewport.pos.x;
		posOnScreenY = l.pos.y + l.height/2 - me.game.viewport.pos.y;
		processing.noFill();
		// processing.fill();
		// processing.stroke(155, 153);
		// processing.stroke(155, 53);
		// processing.strokeWeight(2);
		processing.ellipse(posOnScreenX,posOnScreenY, whistle3_ringdiameter, whistle3_ringdiameter);
	} else {
		whistle3_ring_there = false;
		whistle3_ringdiameter = 0;
	}
	
	var pl = me.game.getEntityByName("mainPlayer")[0];
	var posOnScreenX = pl.pos.x + pl.width/2 - me.game.viewport.pos.x;
	var posOnScreenY = pl.pos.y + pl.height/2 - me.game.viewport.pos.y;
	processing.fill(processing.color(255,0,0,255));
	processing.rect(posOnScreenX, posOnScreenY, 20, 20);
  
}
})

function clearOverlay(){
	$("#overlay_canvas")[0].getContext('2d').clearRect(0,0,640,480);
}