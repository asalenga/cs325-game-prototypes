// "use strict";

window.onload = function() {
    
    var game = new Phaser.Game( 1000, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'ship1', './assets/ship1.png' );
        game.load.image( 'ship2', './assets/ship2.png' );
        game.load.image( 'enemy', './assets/WallEve.png');
        // game.load.image( 'donut', './assets/donut.png');
        // game.load.image( 'greenLaser', './assets/greenLaser.png');
        game.load.image( 'blueLaser', './assets/blueLaser.png');

        game.load.audio('music', './assets/AzurefluxMusic.mp3');
        game.load.audio('laserSFX', './assets/Laser_Shoot7.wav');
    }
    
    var player1;
    var player2;
    var enemy;
    // var timer;
    var laserTime1 = 0;
    var laserTime2 = 0;
    var done = false;
    var currSpeedY = 50;
    var numEnemies = 10;
    var killCounter = 0;
    var score = 0;
    var p1Instructions;
    var p2Instructions;
    var pauseInstructions;
    var pauseText;
    var gameOver = false;

    function create() {
        // timer = game.time.create(false);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        // timer.start();

        music = game.add.audio('music');
        music.play();
        laserSFX = game.add.audio('laserSFX');
        laserSFX.volume = 0.5;
        // music.allowMultiple = true;

        // Create a sprite at the center of the screen using the 'logo' image.
        player1 = game.add.sprite( game.world.width - 200, game.world.height - 100, 'ship1' );
        player2 = game.add.sprite( 200, game.world.height - 100, 'ship2' );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( player1, Phaser.Physics.ARCADE );
        game.physics.enable( player2, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        player1.body.collideWorldBounds = true;
        player2.body.collideWorldBounds = true;

        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        botsText = game.add.text(350, 16, '*Beep boop* YoUr oRdER iS rEAdY', { fontSize: '15px', fill: '#FFF' });

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        // var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        // text.anchor.setTo( 0.5, 0.0 );

        // Source: http://phaser.io/examples/v2/arcade-physics/group-vs-group
        lasers = game.add.group();
        lasers.enableBody = true;
        lasers.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < 10; i++)
        {
            var a = lasers.create(0, 0, 'blueLaser');
            // a.name = 'blueLaser' + i;
            a.exists = false;
            a.visible = false;
            a.checkWorldBounds = true;
            a.events.onOutOfBounds.add(resetLaser, this);
        }

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < numEnemies; i++)
        {
            var b = enemies.create(50 + (Math.random() * (game.world.width - 100)), 0, 'enemy');
            b.body.velocity.y = currSpeedY + (Math.random() * 100);
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(endGame, this);
        }

    //     for (var i = 0; i < 50; i++)
    // {
    //     var s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
    //     s.name = 'alien' + s;
    //     s.body.collideWorldBounds = true;
    //     s.body.bounce.setTo(0.8, 0.8);
    //     s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    // }

        aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        cursors = game.input.keyboard.createCursorKeys();
        
        pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pKey.onDown.add(togglePause, this);
        
        game.physics.arcade.isPaused = true;
        
        pauseText = game.add.text(this.game.world.centerX, 200, 'PAUSED', { fontSize: '75px', fill: '#0055FF', align:'center' });
        pauseText.anchor.setTo(0.5,0.5);
        
        p1Instructions = game.add.text(this.game.world.width/4, this.game.world.centerY, 'Player 1\nA and D to move\n1 to shoot', { fontSize: '30px', fill: '#FFFFFF', align:'center' });
        p1Instructions.anchor.setTo(0.5,0.5);
        
        p2Instructions = game.add.text(3*this.game.world.width/4, this.game.world.centerY, 'Player 2\n<- and -> to move\nspacebar to shoot', { fontSize: '30px', fill: '#FFFFFF', align:'center' });
        p2Instructions.anchor.setTo(0.5,0.5);
        
        pauseInstructions = game.add.text(this.game.world.centerX, 600, 'Press P to begin (and pause)\n\nNote: Only 10 bullets can be on-screen at once. Shoot wisely!', { fontSize: '25px', fill: '#999999', align:'center' });
        pauseInstructions.anchor.setTo(0.5,0.5);
        
    }
    
    function update() {
        game.physics.arcade.overlap(lasers, enemies, enemyKill, null, this);
        player1.body.velocity.x = 0;
        // // player1.body.velocity.y = 0;

        player2.body.velocity.x = 0;
        // // player2.body.velocity.y = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            player1.body.velocity.x = -200;
        }
        if (cursors.right.isDown) {
            //  Move to the right
            player1.body.velocity.x = 200;
        }
        if (spaceKey.isDown) {
            fireLaserP1();
        }
        if (aKey.isDown) {
            player2.body.velocity.x = -200;
        }
        if (dKey.isDown) {
            player2.body.velocity.x = 200;
        }
        if (oneKey.isDown) {
            fireLaserP2();
        }


    }
        
    function togglePause() {
        if (gameOver == false) {
            p1Instructions.visible = (p1Instructions.visible) ? false : true;
            p2Instructions.visible = (p2Instructions.visible) ? false : true;
            pauseText.visible = (pauseText.visible) ? false : true;
            pauseInstructions.setText('Press P to unpause.\n\nNote: Only 6 bullets can be on-screen at once. Shoot wisely!');
            pauseInstructions.visible = (pauseInstructions.visible) ? false : true;
            game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
        }

    }

    function fireLaserP1 () {

        if (game.time.now > laserTime1)
        {
            laser = lasers.getFirstExists(false);

            if (laser)
            {
                laser.reset(player1.x + player1.body.width/2.0 - 7, player1.y - 60);
                laser.body.velocity.y = -300;
                laserTime1 = game.time.now + 150;
            }
        }

    }

    function fireLaserP2 () {

        if (game.time.now > laserTime2)
        {
            laser = lasers.getFirstExists(false);

            if (laser)
            {
                laser.reset(player2.x + player2.body.width/2.0 - 7, player2.y - 50);
                laser.body.velocity.y = -300;
                laserTime2 = game.time.now + 150;
            }
        }

    }

    //  Called if the laser goes out of the screen
    function resetLaser (laser) {

        laser.kill();

    }

    //  Called if the laser hits one of the enemy sprites
    function enemyKill (laser, enemy) {

        laser.kill();
        enemy.kill();
        laserSFX.play();
        killCounter++;
        score += 10;
        scoreText.text = 'Score: ' + score;
        if (killCounter == numEnemies) {currSpeedY += 20;}
        var b = enemies.create(50 + (Math.random() * (game.world.width - 100)), 0, 'enemy');
        b.body.velocity.y = currSpeedY + (Math.random() * 100);
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(endGame, this);

    }

    function endGame (enemy) {
        var gameOverText = game.add.text(game.world.centerX, game.world.centerY-25, 'GAME OVER', { fontSize: '75px', fill: '#FF0000' });
        gameOverText.anchor.setTo(0.5,0.5);
        var finalScoreText = game.add.text(game.world.centerX, game.world.centerY+50, 'Final Score: ' + score, { fontSize: '30px', fill: '#AAFF00' });
        finalScoreText.anchor.setTo(0.5,0.5);
        // music.pause();
        var gameOverComment = game.add.text(game.world.centerX, game.world.centerY+150, '', { fontSize: '20px', fill: '#FFFFFF' });
        gameOverComment.anchor.setTo(0.5,0.5);
        if (score <= 200) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, 'Bruh... Fr tho? Only ' +score + ' points? You done messed up.', { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText('Bruh... Fr tho? Only ' +score + ' points? You done messed up.');
        }
        else if (score <= 500) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, 'Meh. Maybe you should stretch first.', { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText('Meh. Maybe you should stretch first.');
        }
        else if (score <= 1000) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, "I mean... I guess that's an A for effort.", { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText("I mean... I guess that's an A for effort.");
        }
        else if (score <= 2000) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, 'Hey not bad, you could do better though.', { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText('Hey not bad, you could do better though.');
        }
        else if (score <= 3000) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, 'Noice! You beat my single player high score!', { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText("Noice! You beat my single player high score!");
        }
        else if (score <= 4000) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, "Weow. That's a solid number right there. How many times\nhave you played this?\n\n...Try-hard.", { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText("Weow. That's a solid number right there. How many times\nhave you played this?\n\n...Try-hard.");
        }
        else if (score <= 4000) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, "Hey, you do realize that you still have a life to live, right?\nGo hang out with friends or something.\nStop playing this game.", { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText("Hey, you do realize that you still have a life to live, right?\nGo hang out with friends or something.\nStop playing this game.");
        }
        else if (score <= 6000) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, "If you're seeing this message, well I don't believe you.\nI'm sitting here at 4 in the morning typing this out.\nWhy am I still awake? Idk. You tell me. You probably hacked the game\nor something, bc you weren't supposed to get " +score+" points.\nThanks for playing!\nI don't have any new messages beyond the 3000 point mark...\nor do I...? ;)", { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText("If you're seeing this message, well I don't believe you.\nI'm sitting here at 4 in the morning typing this out.\nWhy am I still awake? Idk. You tell me. You probably hacked the game\nor something, bc you weren't supposed to get " +score+" points.\nThanks for playing!\nI don't have any new messages beyond the 3000 point mark...\nor do I...? ;)");
        }
        else if (score > 7000) {
            //game.add.text(game.world.centerX-250, game.world.centerY+150, "Honestly, what is life? Who are you? Are you even real? You've seriously beaten this game.\nWhat a legend. Here's your reward: a thumbs up. Now stop playing. Seriously.", { fontSize: '20px', fill: '#FFFFFF' });
            gameOverComment.setText("Honestly, what is life? Who are you? Are you even real? You've seriously beaten this game.\nWhat a legend. Here's your reward: a thumbs up. Now stop playing. Seriously.");
        }
        var extraComment = game.add.text(game.world.width - 145, game.world.height - 35, 'I hope you had fun playing the game,\nbc I had sO mUch fUN cOdINg it.', { fontSize: '8px', fill: '#AAAAAA' });
        var emoji = game.add.text(game.world.width - 10, game.world.height - 10, '🙃', { fontSize: '12px'});
        // Source: https://github.com/photonstorm/phaser-examples/blob/master/examples/arcade%20physics/global%20pause.js
        gameOver = true;
        game.physics.arcade.isPaused = true;
    }
};
