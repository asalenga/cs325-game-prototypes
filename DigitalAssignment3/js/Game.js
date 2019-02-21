"use strict";

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */
    
    // For optional clarity, you can initialize
    // member variables here. Otherwise, you will do it in create().
    this.player = null;
    //this.lightning = null;
    this.score = 0;
    this.lightning = null;
};

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.physics.setBoundsToWorld();

        this.background = this.game.add.sprite( 0, 0, 'sky' );
        // Create a sprite at the center of the screen using the 'logo' image.
        this.player = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'angel' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        this.player.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        this.game.physics.enable( this.player, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        this.player.body.collideWorldBounds = true;
        
        this.lightning = this.game.add.group();
        this.lightning.enableBody = true;
        this.lightning.physicsBodyType = Phaser.Physics.ARCADE;
        // this.lightning.body.immovable = true;
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = this.game.add.text( 70, 15, "Score: 0", style );
        text.anchor.setTo( 0.5, 0.0 );
        // Randomly places lightning on the map
        for (var i=0; i<30; i++) {
            var danger = this.lightning.create(this.game.world.width + (500 * i), Math.random() * this.game.world.height, 'lightning');
            danger.body.velocity.x = -200;
            danger.checkWorldBounds = true;
            // if (danger.body.x < 0) {
            //     this.score++;
            //     text.text = 'Score: ' + this.score;
            // }
            // danger.events.onOutOfBounds.add(incrementScore, this);
        }

            this.player.inputEnabled = true;
            this.player.events.onInputDown.add( function() { this.quitGame(); }, this );

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        // var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // var text = this.game.add.text( this.game.world.centerX, 15, "Build something amazing.", style );
        // text.anchor.setTo( 0.5, 0.0 );
        
        // When you click on the sprite, you go back to the MainMenu.
    //this.player.inputEnabled = true;
    //this.player.events.onInputDown.add( function() { this.quitGame(); }, this );
        // birds = game.add.group();
        // for (var i = 0; i < 20; i++)
        // {
        //     //  This creates a new Phaser.Sprite instance within the group
        //     //  It will be randomly placed within the world and use the 'baddie' image to display
        //     birds.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'bird');
        // }
    },

    incrementScore: function() {
        (this.score)++;

    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        this.player.rotation = this.game.physics.arcade.accelerateToPointer( this.player, this.game.input.activePointer, 1000, 1000, 1000 );
        // if (done == false) {
        this.game.physics.arcade.overlap(this.player, this.lightning, this.quitGame, null, this);
        // }
    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('GameOver');

    }

};
