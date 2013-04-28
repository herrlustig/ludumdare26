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
        this.setVelocity(3, 15);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
		// set audio not playing
		this.audioPlaying = false;
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
			// TODO: replace, just a test
			if ( !this.audioPlaying ) {
				me.audio.play("test_pulse_cycle", false, function() { this.audioPlaying = false });
			}
			//
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
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
            }
 
        }
		if (me.input.isKeyPressed('whistle1')) {
				me.audio.play("test_whistle1", false, function() { this.audioPlaying = false });
        }
		if (me.input.isKeyPressed('whistle2')) {
			if(whistle2_ready()){
				me.audio.play("test_whistle2", false, function() { this.audioPlaying = false });
				whistle2_cooldown = new Date().getTime();
				// clearOverlay();
			}
        }
		if (me.input.isKeyPressed('whistle3')) {
			if(whistle3_ready()){
				me.audio.play("transfer_middle", false, function() { });				
				whistle3_cooldown = new Date().getTime();
				whistle3_ring_there = false;
				console.debug("Whistle 3 ready, go!");
			}
		}
        
 
        // check & update player movement
        this.updateMovement();
 
     // check for collision
    var res = me.game.collide(this);
 
    if (res) {
        // if we collide with an enemy
        if (res.obj.type == me.game.INVISIBLE_OBJECT) {
            // check if we jumped on it
            if ((res.y > 0) && ! this.jumping) {
                // bounce (force jump)
                this.falling = false;
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
 
            } else {
                
                //this.flicker(45);
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
 
        console.log("player entity collision!");
    }
 
});

var WhistledEntity = me.InvisibleEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
		console.log("whistled initalized!");
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
			
			console.debug("############### invisible object touched")
        }
    }
		
        return false;
    },
	
	// call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        console.log("whistled entity collision!");
    }
});
