/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

 
var canvases_width = 640;
var canvases_height = 480;
var onBeat_cooldown = 0;

// beat / music sets
var beats = ["test_beat1", "test_beat2", "bass_1","bass_2","bass_3"];


// game resources
var g_resources = [
// testlevel tilesets
{
    name: "line_corner",
    type: "image",
    src: "data/line_corner.png"
},
{
    name: "line_horizontal",
    type: "image",
    src: "data/line_horizontal.png"
},
{
    name: "line_vertical",
    type: "image",
    src: "data/line_vertical.png"
},
{
    name: "area01_level_tiles",
    type: "image",
    src: "data/area01_level_tiles.png"
},
{
    name: "metatiles64x64", //TODO: needed ? remove
    type: "image",
    src: "data/metatiles64x64.png"
},
// testlevel
/*
{
    name: "test_lvl",
    type: "tmx",
    src: "data/test_lvl.tmx"
},
{
    name: "test_lvl2",
    type: "tmx",
    src: "data/test_lvl2.tmx"
},
*/
{
    name: "lvl1",
    type: "tmx",
    src: "data/lvl1.tmx"
},
{
    name: "lvl2",
    type: "tmx",
    src: "data/lvl2.tmx"
},
{
    name: "lvl3",
    type: "tmx",
    src: "data/lvl3.tmx"
},
{
    name: "lvl4",
    type: "tmx",
    src: "data/lvl4.tmx"
},
{
    name: "lvl5",
    type: "tmx",
    src: "data/lvl5.tmx"
},
{
    name: "lvl6",
    type: "tmx",
    src: "data/lvl6.tmx"
},
// test main player spritesheet
{
    name: "test_main_player",
    type: "image",
    src: "data/test_main_player.png"
},
// test pulse
{
    name: "test_pulse_cycle_bg",
    type: "audio",
    src: "data/",
	channel: 1 // TODO: check out what it makes exacly
},
{
    name: "test_pulse_cycle",
    type: "audio",
    src: "data/",
	channel: 2 // TODO: check out what it makes exacly
},
{
    name: "test_whistle1",
    type: "audio",
    src: "data/",
	channel: 3 
},
{
    name: "test_whistle2",
    type: "audio",
    src: "data/",
	channel: 4
},
{
    name: "transfer_middle",
    type: "audio",
    src: "data/",
	channel: 5
},
{
    name: "long_moan",
    type: "audio",
    src: "data/",
	channel: 3
},
{	name: "title_screen",        
	type: "image",	
	src: "data/title_screen.png"
},
{	name: "thx_screen",        
	type: "image",	
	src: "data/thx_screen.png"
}
];


// push sound material into the resources
for(var i = 0; i < beats.length; i++) { g_resources.push( {name: beats[i], type: "audio", src: "data/", channel: 3}); }; 


// helper function to choose randomly from array
function chooseSample( sampleArray ) {

	return sampleArray[Math.floor(Math.random()*sampleArray.length)];

}


function playBeatCallbackFunc(teststring){ // TODO: rename, used by playBeat
	teststring = teststring || "-"; 
	// console.debug("play beat callback func:", current_beat, current_beat_time/1000);
	current_beat = chooseSample(beats);
	playBeat();
}

var current_beat = chooseSample(beats);
var current_beat_time = new Date().getTime();
var beat_queue = [];

function calcMeanBeatDur( last_x) {
	last_x = last_x || 4;
	if (last_x < beat_queue.length -1) {
		durs = [];
		for (var i = 0; i < last_x - 1; i++) {
			a = beat_queue[beat_queue.length-1-i];
			b = beat_queue[beat_queue.length-2-i];
			durs.push(a - b);
		}
		sum_dur = 0;
		for (var i = 0; i < durs.length; i++) {
			sum_dur += durs[i];
		}
		return sum_dur / durs.length;
		// finally
	} else {
		return false;
	}
}

var onBeat_tolerance = 120; // in milliseconds;
function checkIfOnBeat() {
	time_now = new Date().getTime() + 100;
	// near enough to last beat ?
	after_beat_time = time_now - current_beat_time;
	if ( after_beat_time < onBeat_tolerance ) {
		//console.debug("after beat", after_beat_time);
		return true;
	}
	// ok, well near enough to next beat ?
	beatDur = calcMeanBeatDur();
	// return false;
	if (beatDur == false ) { 
		return false; 
	} // we dont know, not enough to calc mean beat;
	// *
	before_beat_time = current_beat_time + beatDur - time_now;
	if (before_beat_time < onBeat_tolerance) {
		// console.debug("before beat", before_beat_time);
		return true;
	} else { 
		return false;
	}
	// */
}
	
	
function playBeat() {

	// me.audio.play("test_pulse_cycle", false, playBeat());
	current_beat_time = new Date().getTime();
	beat_queue.push(current_beat_time);         // queue is now [2]
	if ( beat_queue.length > 10 ) {
		beat_queue.shift(); // queue is now [5]
	}
	me.audio.play(current_beat, false, playBeatCallbackFunc);
}
var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', canvases_width, canvases_height, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		me.state.set(me.state.PLAY, new PlayScreen());
		me.state.set(me.state.MENU, new StartScreen());
		me.state.set(me.state.GAMEEND, new EndScreen());

        
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("whistled", WhistledEntity);
		me.entityPool.add("targetPointer", WhistledEntity); // Target Pointer

		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,     "jump", true);
		me.input.bindKey(me.input.KEY.T,     "whistle1");
		me.input.bindKey(me.input.KEY.V,     "whistle2");
		me.input.bindKey(me.input.KEY.SPACE,     "whistle3");

		me.state.change(me.state.MENU);
		// me.state.change(me.state.PLAY);

		// play the audio track
		playBeat();
		
	}
}

var p = null;
/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
	  // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("lvl1");
		// processing
		// set background transparency
		sketchProc.options.isTransparent = true;
		p = new Processing($("#overlay_canvas")[0], sketchProc);
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
		p.exit()
   }

});


window.onReady(function() 
{
	jsApp.onload();
});
