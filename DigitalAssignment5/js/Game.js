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
    this.door = null;
    this.player = null;
    this.cursors = null;
    this.barriers = null;
    // this.wall = null;
    this.loot = null;
    // this.gem = null;
    this.score = 0;
    this.scoreText = null;
    this.notOverText = null;
    this.goalScore = 2;
    this.style = null;
    this.tileSprite = null;
    this.enemies = null;
};

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        this.game.world.setBounds(0, 0, 1000, 1010);
        // Source: https://phaser.io/examples/v2/tile-sprites/tiling-sprite
        this.tileSprite = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
        this.door = this.game.add.sprite( this.game.world.width, this.game.world.height, 'door');
        // this.door.position.setTo(this.game.world.width - this.door.width, this.game.world.height - this.door.height);// = this.game.add.sprite( this.game.world.width, this.game.world.height, 'door');
        this.door.scale.setTo(0.3,0.3);
        this.door.anchor.setTo(1, 1);
        this.game.physics.enable( this.door, Phaser.Physics.ARCADE );

        // Create a sprite at the center of the screen using the 'logo' image. 
        this.player = this.game.add.sprite( 400, 300, 'burglar' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        this.player.scale.setTo(0.6, 0.6);
        // this.player.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        this.game.physics.enable( this.player, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        this.player.body.collideWorldBounds = true;
        // Source: https://phaser.io/examples/v2/camera/smooth-follow
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        
        // var t = game.add.text(200, 500, "this text is fixed to the camera", { font: "32px Arial", fill: "#ffffff", align: "center" });
        // t.fixedToCamera = true;
        // t.cameraOffset.setTo(200, 500);
        
        // When you click on the sprite, you go back to the MainMenu.
        // this.player.inputEnabled = true;
        // this.player.events.onInputDown.add( function() { this.quitGame(); }, this );

        this.enemies = this.game.add.group();
        // this.enemies.enableBody = true;

        this.cop = this.enemies.create( this.game.width - 100, 500, 'cop');
        this.cop.scale.setTo(0.5, 0.5);
        // this.cop.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.cop, Phaser.Physics.ARCADE);
        this.setVelocity(this.cop);
        this.cop.body.collideWorldBounds = true;
        
        // These coordinates will be used to place the characters, walls, and items throughout the map;
        // takes the max dimensions of player and enemy to ensure that they will both fit properly when everything is placed on the map
        var coordX = Math.max(this.player.width,this.cop.width);
        var coordY = Math.max(this.player.height,this.cop.height);

        this.player.position.setTo(3 * coordX, 4 * coordY);

        // var copX = this.cop.x;//this.game.width - 100;
        // var copY = this.cop.y;//500;
        // Source: https://phaser.io/examples/v2/arcade-physics/on-collide-event
        this.cop.body.onCollide = new Phaser.Signal();
        this.cop.body.onCollide.add(this.stopCop, this);
        this.cop.body.onWorldBounds = new Phaser.Signal();
        this.cop.body.onWorldBounds.add(this.stopCop, this);

        this.cop2 = this.enemies.create( coordX, 0, 'cop');
        this.cop2.scale.setTo(0.5, 0.5);
        // Anchors it to the cop himself, not the light beam
        // this.cop2.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.cop2, Phaser.Physics.ARCADE);
        // this.game.physics.enable(this.cop, Phaser.Physics.ARCADE);
        this.setVelocity(this.cop2);
        this.cop2.body.collideWorldBounds = true;
        
        this.cop2.body.onCollide = new Phaser.Signal();
        this.cop2.body.onCollide.add(this.stopCop, this);
        this.cop2.body.onWorldBounds = new Phaser.Signal();
        this.cop2.body.onWorldBounds.add(this.stopCop, this);

        this.cop3 = this.enemies.create( 900, 800, 'cop');
        this.cop3.scale.setTo(0.5, 0.5);
        // Anchors it to the cop himself, not the light beam
        // this.cop3.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.cop3, Phaser.Physics.ARCADE);
        // this.game.physics.enable(this.cop, Phaser.Physics.ARCADE);
        this.setVelocity(this.cop3);
        this.cop3.body.collideWorldBounds = true;
        
        this.cop3.body.onCollide = new Phaser.Signal();
        this.cop3.body.onCollide.add(this.stopCop, this);
        this.cop3.body.onWorldBounds = new Phaser.Signal();
        this.cop3.body.onWorldBounds.add(this.stopCop, this);

        // // var copVelX = this.cop.body.velocity.x; 
        // this.lights = this.game.add.group();
        // this.flashlight = this.lights.create( copX, copY, 'flashlight');
        // // this.game.physics.enable(this.flashlight, Phaser.Physics.ARCADE);
        // // Anchors the flashlight to above the top of the sprite, which is where the cop should be
        // this.flashlight.anchor.setTo(0.5, -0.2);
        // // this.flashlight.pivot.setTo(this.cop.x, this.cop.y);
        // this.game.physics.enable(this.flashlight, Phaser.Physics.ARCADE); 
        // this.flashlight.body.velocity.x = velocity;

        this.barriers = this.game.add.group();
        this.barriers.enableBody = true;

        this.wall = this.barriers.create( 2 * coordX, 3 * coordY, 'wall');
        // this.wall.scale.setTo(0.75, 0.75); 
        // this.wall.anchor.setTo(0.5, 0.5);
        // this.game.physics.enable( this.wall, Phaser.Physics.ARCADE );
        this.wall.body.immovable = true;

        this.wall2 = this.barriers.create( 1 * coordX, 2 * coordY, 'wall');
        // this.wall2.scale.setTo(0.75, 2); 
        // this.wall2.anchor.setTo(0.5, 0.5);
        // this.game.physics.enable( this.wall2, Phaser.Physics.ARCADE );
        this.wall2.body.immovable = true;

        this.wall3 = this.barriers.create( 3 * coordX, 0, 'wall');
        // this.wall3.scale.setTo(0.75, 0.75); 
        // this.wall3.anchor.setTo(0.5, 0.5);
        // this.game.physics.enable( this.wall, Phaser.Physics.ARCADE );
        this.wall3.body.immovable = true;

        this.wall4 = this.barriers.create( 1 * coordX, 1 * coordY, 'wall');
        // this.wall4.scale.setTo(0.75, 0.75);
        this.wall4.body.immovable = true;

        this.wall5 = this.barriers.create( 4 * coordX, 2 * coordY, 'wall');
        this.wall5.body.immovable = true;

        this.wall5 = this.barriers.create( 4 * coordX, 2 * coordY, 'wall');
        this.wall5.body.immovable = true;

        this.wall6 = this.barriers.create( 2 * coordX, 5 * coordY, 'wall');
        this.wall6.body.immovable = true;

        this.wall7 = this.barriers.create( 3 * coordX, 5 * coordY, 'wall');
        this.wall7.body.immovable = true;

        this.wall8 = this.barriers.create( 9 * coordX, 9 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall9 = this.barriers.create( 6 * coordX, 4 * coordY, 'wall');
        this.wall9.body.immovable = true;

        this.wall8 = this.barriers.create( 5 * coordX, 1 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 5 * coordX, 7 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 2 * coordX, 6 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 2 * coordX, 8 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 1 * coordX, 8 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 3 * coordX, 8 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 0 * coordX, 6 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 9 * coordX, 9 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 1 * coordX, 3 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 6 * coordX, 5 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 4 * coordX, 10 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 4 * coordX, 12 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 3 * coordX, 10 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 5 * coordX, 10 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 1 * coordX, 9 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 0 * coordX, 11 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 2 * coordX, 14 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 2 * coordX, 14 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 6 * coordX, 7 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 7 * coordX, 2 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 7 * coordX, 8 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 7 * coordX, 9 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 6 * coordX, 13 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 10 * coordX, 10 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 10 * coordX, 6 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 10 * coordX, 5 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 10 * coordX, 4 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 9 * coordX, 5 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 10 * coordX, 5 * coordY, 'wall');
        this.wall8.body.immovable = true;

        this.wall8 = this.barriers.create( 11 * coordX, 5 * coordY, 'wall');
        this.wall8.body.immovable = true;


        this.loot = this.game.add.group();

        this.gem = this.loot.create( 200, 500, 'gem');
        this.gem.scale.setTo(0.5, 0.5);
        this.gem.anchor.setTo(0.5, 0.5);
        this.game.physics.enable( this.gem, Phaser.Physics.ARCADE );

        this.gem2 = this.loot.create( 400, 100, 'gem');
        this.gem2.scale.setTo(0.5, 0.5);
        this.gem2.anchor.setTo(0.5, 0.5);
        this.game.physics.enable( this.gem2, Phaser.Physics.ARCADE );

        this.style = { font: "25px Futura", fill: "#00FF00", align: "center" };
        // this.score = 10;
        this.scoreText = this.game.add.text( this.game.world.centerX, 15, "SCORE: " + this.score, this.style );
        this.scoreText.anchor.setTo( 0.5, 0.0 );
        // Source: https://phaser.io/examples/v2/camera/fixed-to-camera
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset.setTo(100,25);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        // this.player.rotation = this.game.physics.arcade.accelerateToPointer( this.player, this.game.input.activePointer, 500, 500, 500 );

        this.hitWall = this.game.physics.arcade.collide(this.player, this.barriers);
        this.hitWall2 = this.game.physics.arcade.collide(this.enemies, this.barriers);
        // if (this.game.physics.arcade.overlap(this.player, this.gem) == true) {collectGem(this.player, this.gem);}
        this.game.physics.arcade.overlap(this.player, this.loot, this.collectLoot, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
        // this.game.physics.arcade.overlap(this.player, this.lights, this.playerDie, null, this);
        // this.game.physics.arcade.collide(this.enemies, this.game.worldBounds, this.moveCop, null, this);
        // this.hitFlashlight = this.game.physics.arcade.collide(this.player, this.cop);

        this.player.body.velocity.set(0);

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -200;
            // player.play('left');
        }
        if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 200;
            // player.play('right');
        }
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -200;
            // player.play('up');
        }
        if (this.cursors.down.isDown) {
            this.player.body.velocity.y = 200;
            // player.play('down');
        }
        // else
        // {
        //     player.animations.stop();
        // }
        if (this.score < this.goalScore) {
            this.game.physics.arcade.overlap(this.player, this.door, this.notFinished, null, this);
        }
        if (this.score >= this.goalScore) {
            this.game.physics.arcade.overlap(this.player, this.door, this.quitGame, null, this);
        }
        // if (this.score >= 2 && (this.player.x == (this.door.x - this.door.width)) && (this.player.y == (this.door.y - this.door.height)) /*this.score >= 300 && (this.player.x == this.exit.x) && (this.player.y == this.exit.y)*/) {this.quitGame(); /*this.endGame();*/}
    },

    setVelocity: function (cop) {
        var velocity = 150;
        if (this.game.rnd.integerInRange(0, 1) == 1) {
            velocity *= -1;
        }
        // ...and direction
        if (this.game.rnd.integerInRange(0, 1) == 1) {
            cop.body.velocity.x = velocity;
        }
        else {
            cop.body.velocity.y = velocity;
        }
    },

    stopCop: function (cop) {

        // // cop.body.position.setTo(cop.body.x, cop.body.y);
        // this.flashlight.body.velocity.setTo(0);
        this.stopMovement(cop);
        cop.body.velocity.setTo(0);
        // Source: https://phaser.io/examples/v2/time/basic-timed-event
        // this.game.time.events.add(Phaser.Timer.SECOND * 3, this.stopMovement, this);
        // Generates a random number from 0 to 3 indicating what direction to move in: 0 being up, 1 right, 2 down, 3 left
    },

    moveCop: function (cop) {

        var direction = this.game.rnd.integerInRange(0, 3);//Math.random() * 3;
        if (direction == 0) {
            cop.body.velocity.y = -150;
            // this.flashlight.rotation = 0;
            // this.flashlight.rotation += 180;
            // this.flashlight.body.velocity.y = -100;
        }
        else if (direction == 1) {
            cop.body.velocity.x = 150;
            // this.flashlight.rotation = 0;
            // this.flashlight.rotation += -90;
            // this.flashlight.body.velocity.x = 100;
        }
        else if (direction == 2) {
            cop.body.velocity.y = 150;
            // this.flashlight.rotation = 0;
            // this.flashlight.body.velocity.y = 100;
        }
        else if (direction == 3) {
            cop.body.velocity.x = -150;
            // this.flashlight.rotation = 0;
            // this.flashlight.rotation += 90;
            // this.flashlight.body.velocity.x = -100;
        }
        // cop.body.velocity.x *= -1;// * cop.body.velocity.x;
        // flashlight.body.velocity.x = 100;
    },

    stopMovement: function (cop) {
        cop.body.velocity.setTo(0);
        this.game.time.events.add(Phaser.Timer.SECOND, this.moveCop, this, cop);
    },

    collectLoot: function (player, gem) {

        // Removes the gem from the screen
        gem.kill();

        // Add and update the score
        this.score += 1;
        this.scoreText.text = 'SCORE: ' + this.score; //this.game.add.text( this.game.world.centerX, 15, "Score: " + this.score, this.style );

        // if (numStars == 0) {
        //     game.add.text(300, 250, 'GAME OVER', { fontSize: '300px', fill: '#FF0000' });
        // }
    },

    playerDie: function () {
        // start the game over state
        this.game.physics.arcade.isPaused = true;
        if (this.notOverText != null) {
            this.notOverText.kill();
        }
        var style = { font: "25px Calibri", fill: "#FF0000", align: "center" };
        // this.score = 10;
        var text = this.game.add.text( this.game.world.centerX, this.game.world.centerY, "FREEZE! You're under arrest! We finally caught you.\nYou're gonna be locked up for a looong time.", style );
        // this.scoreText.cameraOffset.setTo(100,25);
        text.anchor.setTo( 0.5, 0.0 );
        text.fixedToCamera = true;
        text.cameraOffset.setTo(400,150);
        // this.state.start('MainMenu');
    },

    notFinished: function () {
        var style = { font: "15px Futura", fill: "#DDDDDD", align: "center" };
        this.notOverText = this.game.add.text( this.game.world.centerX, this.game.world.centerY, "I can't go yet...\n🤑🎶There's still some loot just waiting to be stolen!🎶😇", style );
        this.notOverText.anchor.setTo( 0.5, 0.0 );
        this.notOverText.fixedToCamera = true;
        this.notOverText.cameraOffset.setTo(400,150);
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.eraseText, this, this.notOverText);
    },

    eraseText: function (text) {
        text.kill();
    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
