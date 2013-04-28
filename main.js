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
    name: "test_lvl2",
    type: "tmx",
    src: "data/test_lvl2.tmx"
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
	channel: 3 // TODO: check out what it makes exacly
},
{
    name: "test_whistle2",
    type: "audio",
    src: "data/",
	channel: 4 // TODO: check out what it makes exacly
},
{
    name: "transfer_middle",
    type: "audio",
    src: "data/",
	channel: 5 // TODO: check out what it makes exacly
},
{
    name: "long_moan",
    type: "audio",
    src: "data/",
	channel: 3 // TODO: check out what it makes exacly
}
];

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
		do_pointillize = false;
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
         // add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("whistled", WhistledEntity);
		me.entityPool.add("targetPointer", WhistledEntity); // Target Pointer

		
   // enable the keyboard
   me.input.bindKey(me.input.KEY.LEFT,  "left");
   me.input.bindKey(me.input.KEY.RIGHT, "right");
   me.input.bindKey(me.input.KEY.X,     "jump", true);
   me.input.bindKey(me.input.KEY.W,     "whistle1");
   me.input.bindKey(me.input.KEY.E,     "whistle2");
   me.input.bindKey(me.input.KEY.Q,     "whistle3");

      // start the game 
		me.state.change(me.state.PLAY);
		
		// processing
		// set background transparency
		sketchProc.options.isTransparent = true;
		var p = new Processing($("#overlay_canvas")[0], sketchProc)
	}
}

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
      // stuff to reset on state change
	  // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("lvl1");
		// play the audio track
		me.audio.play("test_pulse_cycle", true ); // loop
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
	
   }

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
