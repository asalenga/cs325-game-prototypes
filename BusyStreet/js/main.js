// "use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 1000, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'finn'.
        game.load.image('finn', 'assets/pixel_finn.jpg' );
        // Source: https://3.bp.blogspot.com/-2Df83Vxtmiw/V5tL6ruTb0I/AAAAAAAAAYw/6O7FrcwPht8_ukd42jtiJN-ieu7l2tUyQCLcB/s1600/background-1.png
        game.load.image('road', 'assets/roadBackground.png');
        // Source: https://www.clipartmax.com/png/middle/273-2730097_pixel-art-finn-y-jake.png
        game.load.image('hazard', 'assets/phaser.png');
        // Source: https://images.pexels.com/photos/1085677/pexels-photo-1085677.jpeg?cs=srgb&dl=beach-bird-s-eye-view-from-above-1085677.jpg&fm=jpg
        game.load.image('endzone', 'assets/beach.jpg');
    }
    
    var player;
    var numLives = 3;
    var cursors;
    var hazard;
    var hazPerRow = 5;
    var hazVelocity = 175;
    var done = false;
    
    function create() {
        game.add.sprite(0, 0, 'road');
        player = game.add.sprite( game.world.centerX, game.world.height - 50, 'finn' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        // player.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( player, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        player.body.collideWorldBounds = true;
        
        hazards = game.add.group();

        hazards.enableBody = true;
        // while (numLives > 0) {
            for (var i=0; i<7; i++) {

                var spawnRow = game.world.height - 125 - (i * 100);

                if ((i % 2) == 0) {
                    // all hazards move left; spawn from right.
                    for (var j=0; j<hazPerRow; j++) {
                        hazard = hazards.create(50 + (j * (game.world.width/hazPerRow)), spawnRow, 'hazard');
                        hazard.body.velocity.x = -1 * hazVelocity;
                        // Source: http://examples.phaser.io/_site/view_full.html?d=sprites&f=out%20of%20bounds.js&t=out%20of%20bounds
                        hazard.checkWorldBounds = true;
                        hazard.events.onOutOfBounds.add(hazardOutLeft, this);
                    }
                }
                else {
                    // all hazards move right, spawn from left.
                    for (var j=0; j<hazPerRow; j++) {
                        hazard = hazards.create(50 + (j * (game.world.width/hazPerRow)), spawnRow, 'hazard');
                        hazard.body.velocity.x = hazVelocity;
                        // Source: http://examples.phaser.io/_site/view_full.html?d=sprites&f=out%20of%20bounds.js&t=out%20of%20bounds
                        hazard.checkWorldBounds = true;
                        hazard.events.onOutOfBounds.add(hazardOutRight, this);
                    }
                }
            }
            // var currTime = new Date().getTime();
            // var delay = (Math.random() * 2000) + 1000;

            // while (new Date().getTime() < (now + delay)) {
            //     // Delay for an amount of time
            // }

            // setTimeout(1000) {

            // }
        // }

        livesText = game.add.text(16, 16, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });

        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
    // player.rotation = game.physics.arcade.accelerateToPointer( player, game.input.activePointer, 500, 500, 500 );
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -150;
        }
        if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;
        }
        if (cursors.up.isDown) {
            //  Move up
            player.body.velocity.y = -150;
        }
        if (cursors.down.isDown) {
            //  Move down
            player.body.velocity.y = 150;
        }

        if (player.y <= 50) {
            game.add.text(game.world.centerX-200, game.world.centerY-50, 'YOU WIN!', { fontSize: '75px', fill: '#00FF00' });
            done = true;
        }
        // if (hazard.position.x) {

        // }
        // player.enableBody = true;

        // game.physics.arcade.collide(player, hazards);

        //if (cursors.up.isDown && player.body.touching.up) {
        //    game.add.text(game.world.centerX-225, game.world.centerY-25, 'YOU WIN!', { fontSize: '75px', fill: '#00FF00' });
        //}

        if (done == false) {
            game.physics.arcade.overlap(player, hazards, playerDie, null, this);
        }
    }

//     function collectStar (player, star) {

//     // Removes the star from the screen
//     star.kill();
//     numStars -= 1;

//     //  Add and update the score
//     score += 10;
//     scoreText.text = 'Score: ' + score;

//     if (numStars == 0) {
//         game.add.text(300, 250, 'GAME OVER', { fontSize: '300px', fill: '#FF0000' });
//     }

// }

    function playerDie (player, hazard) {
        player.kill();
        numLives -= 1;
        livesText.text = 'Lives: ' + numLives;
        if (numLives == 0) {
            game.add.text(game.world.centerX-225, game.world.centerY-25, 'GAME OVER', { fontSize: '75px', fill: '#FF0000' });
        }
        else {
            player.reset(game.world.centerX, game.world.height - 50);
        }
    }

    function hazardOutLeft (hazard) {
        hazard.reset(game.world.width, hazard.y);
        hazard.body.velocity.x = -1 * hazVelocity;
    }

    function hazardOutRight (hazard) {
        hazard.reset(0, hazard.y);
        hazard.body.velocity.x = hazVelocity;
    }

};
