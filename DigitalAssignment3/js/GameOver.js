"use strict";

BasicGame.GameOver = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.GameOver.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.sprite(0, 0, 'nightSky');

		var style = { font: "50px Verdana", fill: "#FF0000", align: "center" };
     		var text = this.game.add.text( 50, this.game.world.centerY, "GAME OVER", style );

        // text.anchor.setTo( 0.5, 0.0 );

	}

// 	update: function () {

// 		//	Do some nice funky main menu effect here

// 	},

// 	startGame: function (pointer) {

// 		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
// 		this.music.stop();

// 		//	And start the actual game
// 		this.state.start('Game');

// 	}

};
