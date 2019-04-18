"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();

		// this.add.sprite(0, 0, 'titlePage');

		this.titleText = this.add.text(this.world.centerX, 350, 'Send It Over!', {font: "30px Verdana", fill: "#00FF00", align: "center"});
		this.titleText.anchor.setTo(0.5,0.5);

		this.p1text = this.add.text(this.world.width/4, this.world.height-200, 'Player 1:\nW A S D keys to move\n2 key to throw a held item\n1 key to fire (if holding a weapon)', {font: "20px Verdana", fill: "#FFFFFF", align: "center"});
		this.p1text.anchor.setTo(0.5,0.5);
		this.p2text = this.add.text(3 * this.world.width/4, this.world.height-200, 'Player 2:\narrow keys to move\nj key to throw a held item\nh key to fire (if holding a weapon)', {font: "20px Verdana", fill: "#FFFFFF", align: "center"});
		this.p2text.anchor.setTo(0.5,0.5);

		this.storyText = this.add.text(this.world.centerX, 50, "Two astronauts (you) have been stranded on an alien planet. Your ships have been\nseverely damaged, and the pieces of your ships have been scattered throughout the map.\nYou must gather these pieces (they are labeled either P1 or P2) and bring them back\nto your respective ships to rebuild, and escape! But, that's easier said than done.\nSomehow you've been (conveniently) separated from each other by a wall spanning\nthe length of the terrain. What's strange though, is that the wall appears to have\ndifferent colored gates. You can't pass through the wall or gates, but what about items?\nYou see 4 rayguns on the ground, and you soon find out what they're for...", {font: "20px Verdana", fill: "#FFFFFF", align: "center"});
		this.storyText.anchor.setTo(0.5,0);

		this.playButton = this.add.button( this.world.centerX, this.world.height-100, 'playButton', this.startGame, this, 'over', 'out', 'down');
		this.playButton.anchor.setTo(0.5,0.5);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
