function get(id)
{
	return document.getElementById(id);
}

function clunkyGame()
{
	var game = {}; // public game object to be returned
	
	var canvas = get('gamecanvas');
	var context = canvas.getContext('2d');
	
	// canvas width and heights -- dont't override this
	var w = canvas.width;
	var h = canvas.height;
	
	var noobimg = get('supernoob');
	var pirateimg = get('superpirate');
	var splodeimg = get('splode');
	
	var explosionwav = new Audio();
	explosionwav.src = '../../Clunkygame/wav/explosion1.wav';
	
	// main loop for the game
	game.run = function()
	{
		// requestAnimationFrame stuff
		var animationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = animationFrame;
		
		var player = makeDude(pirateimg);
		player.x = 0;
		player.y = 0;
		player.xspeed = 0;
		player.yspeed = 0;
		
		var noobs = new Array();
		for (var i = 0; i < 8; i++)
		{
			noobs[i] = makeDude(noobimg);
		}
		
		var keydownHandler = function(event)
		{
			var key = String.fromCharCode(event.keyCode);
			
			switch (key)
			{
				case 'W':
					player.yspeed = -2;
					break;
				case 'A':
					player.xspeed = -2;
					break;
				case 'S':
					player.yspeed = 2;
					break;
				case 'D':
					player.xspeed = 2;
					break;
			}
		}
		
		var keyupHandler = function(event)
		{
			var key = String.fromCharCode(event.keyCode);
			
			switch (key)
			{
				case 'W':
				case 'S':
					player.yspeed = 0;
					break;
				case 'A':
				case 'D':
					player.xspeed = 0;
					break;
			}
		}

		document.addEventListener('keydown', keydownHandler, false);
		document.addEventListener('keyup', keyupHandler, false);

		// game logic goes here
		var update = function()
		{
			player.x += player.xspeed;
			player.y += player.yspeed;
			
			for (var i = 0; i < noobs.length; i++)
			{
				if (!noobs[i].dead && player.collided(noobs[i]))
				{
					noobs[i].explode();
				}
			}
		}
		
		// render stuff here
		var draw = function()
		{
			player.draw();
			
			for (var i = 0; i < noobs.length; i++)
			{
				noobs[i].draw();
			}
		}
		
		var loop = function()
		{
			context.fillStyle = 'CornflowerBlue';
			context.fillRect(0, 0, w, h);
			
			update();
			draw();
			
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	}
	
	var makeDude = function(image)
	{
		var dude =
		{
			img: image,
			x: 128 + Math.floor(Math.random() * 1024),
			y: 128 + Math.floor(Math.random() * 384),
			s: 128, // side length
			dead: false
		}
		
		dude.collided = function(other)
		{
			var collided = 
			(	// within x boundaries
				(dude.x < other.x && other.x < dude.x + dude.s) ||
				(dude.x > other.x && dude.x < other.x + other.s)
			)
			&&
			(	// within y boundaries
				(dude.y < other.y && other.y < dude.y + dude.s) ||
				(dude.y > other.y && dude.y < other.y + other.s)
			);
			
			return collided;
		}
		
		dude.explode = function()
		{
			dude.img = splodeimg;
			explosionwav.play();
			dude.dead = true;
		}
		
		dude.draw = function()
		{
			context.drawImage(dude.img, dude.x, dude.y);
		}
		
		return dude;
	}
	
	return game;
}
