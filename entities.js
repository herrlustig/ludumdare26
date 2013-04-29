/*-------------------
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
		this.collidable = true;
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(6, 15);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
		// set audio not playing
		this.audioPlaying = false;
		this.bounceRight = false;
		this.bounceLeft = false;
    },
 
    onBeatAction: function () {
		if (this.onBeat){
			// console.debug("######## Moved On Beat!");
			me.game.viewport.fadeOut("#00FF00", 0.2, 50);
			onBeat_cooldown += 100; // TODO: the nearer on the real beat, the more ms he can see the hidden elements
			// console.debug("onBeat cooldown is now:", onBeat_cooldown); 
		} else {
			onBeat_cooldown -= 200; //400; // TODO: the nearer on the real beat, the more ms he can see the hidden elements
		}
	},
    update: function() {
 
		this.onBeat = checkIfOnBeat();
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
			// TODO: replace, just a test
			if ( !this.audioPlaying ) {
				// me.audio.play("test_pulse_cycle", false, function() { this.audioPlaying = false }); // TODO, add again
			}
			// me.game.viewport.shake(2, 30, me.game.viewport.AXIS.HORIZONTAL); // melonjs' shake is buggy
			this.onBeatAction();
			
			//
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
			// me.game.viewport.shake(2, 30, me.game.viewport.AXIS.HORIZONTAL); // melonjs' shake is buggy
			this.onBeatAction();
			
        } else {
            this.vel.x = 0;
        }
        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
				this.onBeatAction();
            }
			// me.game.viewport.shake(2, 30, me.game.viewport.AXIS.VERTICAL); // melonjs' shake is buggy
        }
		
		if (this.bounceRight && !this.falling) {
            this.vel.x = 3*this.maxVel.x * me.timer.tick;
		} else {
			this.bounceRight = false;
		}
		if (this.bounceLeft && !this.falling) {
            this.vel.x = -3*this.maxVel.x * me.timer.tick;
		} else {
			this.bounceLeft = false;
		}
		
		if (onBeat_cooldown < 0) { onBeat_cooldown = 0 };
		// console.debug("onBeat cooldown is now:", onBeat_cooldown); 
		if (me.input.isKeyPressed('whistle1')) {
				me.audio.play("test_whistle1", false, function() { this.audioPlaying = false }, 0.3);
        }
		if (me.input.isKeyPressed('whistle2')) {
			if(whistle2_ready()){
				me.audio.play("test_whistle2", false, function() { this.audioPlaying = false }, 0.3);
				whistle2_cooldown = new Date().getTime();
				// clearOverlay();
			}
        }
		if (me.input.isKeyPressed('whistle3')) {
			if(whistle3_ready()){
				me.audio.play("transfer_middle", false, function() { }, 0.2);				
				whistle3_cooldown = new Date().getTime();
				whistle3_ring_there = false;
				// console.debug("Whistle 3 ready, go!");
			}
		}
        
 
        // check & update player movement
        this.updateMovement();
 
     // check for collision
    var res = me.game.collide(this);
 
    if (res) {
		// console.debug("Collision!, object type:", res.obj.type);
		if (res.obj.type == "endGame") {
		    me.input.bindKey(me.input.KEY.ENTER, "enter",  true);
			me.state.change(me.state.ENDGAME);
		}
        if (res.obj.type == "whistled_r") {
			// console.debug("Whistled r type collision");
            // bounce (force jump)
			this.bounceRight = true;
            this.falling = false;
            this.vel.y = -this.maxVel.y * me.timer.tick;

            this.jumping = true;
		} else if (res.obj.type == "whistled_l") {
			// console.debug("Whistled r type collision");
            // bounce (force jump)
			this.bounceLeft = true;
            this.falling = false;
            this.vel.y = -this.maxVel.y * me.timer.tick;
			// this.vel.x = 200 * me.timer.tick;
			// this.pos.x += 1000;
			// this.vel.x += 200*this.accel.x * me.timer.tick;
            this.jumping = true;
		} else if (res.obj.type == me.game.INVISIBLE_OBJECT) {
            // check if we jumped on it
			//			console.debug("Normal invisvle collision");
            if ((res.y > 0) && ! this.jumping) {
                // bounce (force jump)
                this.falling = false;
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            } 
		}
	}
    // update animation if necessary
    if (this.vel.x!=0 || this.vel.y!=0) {
        // update object animation
        this.parent();
        return true;
    }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    },
	 onCollision: function(res, obj) {
 
        // console.log("player entity collision!");
    }
 
});

var WhistledEntity = me.InvisibleEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
		// console.debug("whistled init settings:", settings);
		if (settings.endGame == "endIt") {
			this.type = "endGame";
		} else if (settings.direction == "r") {
			// console.debug("whistled RIGHT");
			this.type = "whistled_r";
		} else if (settings.direction == "l") {
			// console.debug("whistled RIGHT");
			this.type = "whistled_l";
		}
		// console.log("whistled initalized!");
	},
 

    update: function() {
 
		if (me.input.isKeyPressed('whistle1')) {
			// TODO: show target on second screen
        }
		
		// check for collision
    var res = me.game.collide(this);
 
    if (res) {
        // if we collide with an enemy
        if (res.obj.type == me.game.PLAYER_OBJECT) {
            // check if we jumped on it
			
			//console.debug("############### invisible object touched")
        }
    }
		
        return false;
    },
	
	// call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // console.log("whistled entity collision!");
    }
});

var StartScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true); 
        this.title = null;
   },
 
    onResetEvent: function() {
        if (this.title == null) {
            this.title = me.loader.getImage("title_screen");
        }
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
    },
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
 
});

var EndScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true); 
        this.title = null;
   },
 
    onResetEvent: function() {
        if (this.title == null) {
            this.title = me.loader.getImage("thx_screen");
        }
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
    },
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
 
});

