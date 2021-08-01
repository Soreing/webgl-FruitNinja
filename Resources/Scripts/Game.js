function Game(eng)
{	
	this.engine = eng,		//Reference to the Engine object
	this.object = 0,		//Reference to the Graphics Object object
	
	this.distance   = 10.0,	//Distance of the fruits from the origin
	this.alive      = 1.0,	//Alive state of the player
	this.health     = 3.0,	//Current Health of the player. Used for terminating the game
	this.score      = 0.0,	//Current score of the player. Shown on the UI
	this.highscore  = 0.0,	//Highest score of the player. Shown on the UI
	this.lastHit    = 0.0,	//Time of cutting the last fruit. Used for combo calculation
	this.lastPos    = 0.0,	//Position of the last cut, where the combo must be displayed
	this.comboHit   = 0.0,	//Number of consecutive hits in a short period of time
	this.comboTime  = 0.5,	//Time to slice another fruit to increase combo
	this.bombProb   = 0.3,	//Chance of spawning a bomb 
	this.pomegProb  = 0.05,	//Chance of spawning a pomegranate
	this.timer      = 0.0,	//Tracks the time elapsed to affect game logic in seconds
	this.burstDelay = 4.0,	//Time Delay between bursts of fruits in secods
	this.fruits     = [],	//List of possible fruits to be instantiated
	this.bursts     = [],	//List of different fruit burst behaviours to pick from
	
	//Creating a Pineapple Prefab
	this.PineapplePrefab =  new GraphicsObject(this.engine);
	this.PineapplePrefab.name="Pineapple";
	this.PineapplePrefab.rigidbody.verDrag=9.81;
	this.PineapplePrefab.transform.LocalScale(new Vector3(0.1,0.1,0.1));
	this.PineapplePrefab.scripts.push( new PineappleBehaviour(this.engine, this) );
	this.fruits.push(this.PineapplePrefab);
	
	//Creating a Banana Prefab
	this.BananaPrefab =  new GraphicsObject(this.engine);
	this.BananaPrefab.name="Banana";
	this.BananaPrefab.rigidbody.verDrag=9.81;
	this.BananaPrefab.transform.LocalScale(new Vector3(0.025,0.025,0.025));
	this.BananaPrefab.scripts.push( new BananaBehaviour(this.engine, this) );
	this.fruits.push(this.BananaPrefab);
	
	//Creating a Pomegranate Prefab
	this.PomegranatePrefab =  new GraphicsObject(this.engine);
	this.PomegranatePrefab.name="Pomegranate";
	this.PomegranatePrefab.rigidbody.verDrag=9.81;
	this.PomegranatePrefab.transform.LocalScale(new Vector3(0.1,0.1,0.1));
	this.PomegranatePrefab.scripts.push( new PomegranateBehaviour(this.engine, this) );
	
	//Creating a Bomb Prefab
	this.BombPrefab = new GraphicsObject(this.engine);
	this.BombPrefab.name="Bomb";
	this.BombPrefab.rigidbody.verDrag=9.81;
	this.BombPrefab.transform.LocalScale(new Vector3(0.1,0.1,0.1));
	this.BombPrefab.scripts.push( new BombBehaviour(this.engine, this) );
	
	//Creating Bursting Behaviour where all fruits fly up at once
	this.Burst1Prefab =  new GraphicsObject(this.engine);
	this.Burst1Prefab.name="Burst1";
	this.Burst1Prefab.transform.WorldTranslate(new Vector3(0,0,-this.distance));
	this.Burst1Prefab.scripts.push( new BurstBottomAll(this.engine, 2,5, this.fruits) );
	this.bursts.push(this.Burst1Prefab);
	
	//Creating Bursting Behaviour where fruits fly up one by one
	this.Burst2Prefab =  new GraphicsObject(this.engine);
	this.Burst2Prefab.name="Burst2";
	this.Burst2Prefab.transform.WorldTranslate(new Vector3(0,0,-this.distance));
	this.Burst2Prefab.scripts.push( new BurstBottomOne(this.engine, 2, 5, 0.7, this.fruits, this.BombPrefab, this.bombProb) );
	this.bursts.push(this.Burst2Prefab);
	this.bursts.push(this.Burst2Prefab);
	
	this.Instruction1 = new GraphicsObject(this.engine);
	this.Instruction1.name="Instruction1";
	this.Instruction1.depth = false;
	this.Instruction1.noHide = true;
	this.Instruction1.type = 1;
	this.Instruction1.mesh = new Pane(Framework.webGL);
	this.Instruction1.material.color=Color.white.Duplicate();
	this.Instruction1.material.textured=21;
	this.Instruction1.rigidbody.verDrag=0;
	this.Instruction1.transform.LocalScale     ( new Vector3( 8,  8,  8) );
	this.Instruction1.transform.WorldTranslate ( new Vector3( 0.0,  0.0, 0.0) ); 
	this.Instruction1.scripts.push( new CameraScale(Framework) );
	this.Instruction1.Instantiate();
	
	this.Instruction2 = new GraphicsObject(this.engine);
	this.Instruction2.name="Instruction2";
	this.Instruction2.depth = false;
	this.Instruction2.noHide = true;
	this.Instruction2.type = 1;
	this.Instruction2.mesh = new Pane(Framework.webGL);
	this.Instruction2.material.color=Color.white.Duplicate();
	this.Instruction2.material.textured=20;
	this.Instruction2.rigidbody.verDrag=0;
	this.Instruction2.transform.LocalScale     ( new Vector3( 8,  8,  8) );
	this.Instruction2.transform.WorldTranslate ( new Vector3( 0.0,  0.0, 0.0) ); 
	this.Instruction2.scripts.push( new CameraScale(Framework) );
	this.Instruction2.Instantiate();
	this.Instruction2.Disable();
	
	
	this.engine.game = this;
	
	//Use this for initialization
	this.Start= function()
	{	var game = this;
	
		game.health   = 3.0;
		game.score    = 0.0;
		game.timer    = 0.0;
		game.lastHit  = 0.0;
		game.bombProb = 0.1;
		game.comboHit = 0.0;
		game.alive    = 1.0;
		return;
	}
	
	//Update is called once per frame
	this.Update = function()
	{	var game = this;
		
		if(game.Instruction1.enabled  && game.engine.mouseDown[0])
		{
			game.Instruction1.enabled = 0;
			game.Instruction2.enabled = 1;
			game.engine.mouseDown[0]  = 0;
			game.engine.PlayAudio(0);
			game.engine.PlayAudio(1);
			return;
		}
		else if (game.Instruction1.enabled) return;
		
		if(game.Instruction2.enabled  && game.engine.mouseDown[0])
		{
			game.Instruction2.enabled = 0;
			game.engine.mouseDown[0]  = 0;
			game.engine.PlayAudio(6);
		}
		else if (game.Instruction2.enabled) return;
		
		//If the player is dead, Game Over
		if(game.health < 1  && game.alive)
		{	game.alive = 0;
			game.engine.PlayAudio(7);
			for(var i = 0; i < game.engine.objects.length; i++)
			{	switch (game.engine.objects[i].name)
				{	case "Game Over"     : 
					case "MusicButton"   :
					case "SFXButton"     :
					case "RestartButton" :
					case "ResumeButton"  :
					case "QuitButton"    : game.engine.objects[i].Enable(); break;
					case "PauseButton"   : game.engine.objects[i].Disable(); break;
					case "Score"         : 
					case "HighScore"     : 
					case "Instruction1"  :
					case "Instruction2"  :
					case "Health1"       : 
					case "Health2"       : 
					case "Health3"       : 
					case "Mouse Cursor"  : 
					case "Mouse Trail"   : 
					case "SkyBox"        : 
					case "Game Manager"  : 
					case "Mistake"       : break;
					default : game.engine.objects[i].Destroy(); i--; break;
		}	}	}
		
		//Check if the combo should be awarded
		if(game.lastHit + game.comboTime < game.engine.time/1000)
		{	//If the combo is greated than 2, award extra points and display UI
			if(game.comboHit > 2)
			{	game.IncreaseScore(game.comboHit);

				var combo = new GraphicsObject(Framework);
				combo.name="Combo";
				combo.depth = false;
				combo.type = 2;
				combo.mesh = new ComboUI(Framework.webGL);
				combo.mesh.SetNumber(game.comboHit);
				combo.material.color     = new Color(1.0,1.0,0.2,1.0);
				combo.material.ambient   = new Color(1.0,1.0,1.0,1.0);
				combo.material.textured  = 1;
				combo.rigidbody.verDrag  = 0;
				combo.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  -45.0) );
				combo.transform.LocalScale     ( new Vector3( 0.7,  0.7,  0.7 ) );
				combo.transform.WorldTranslate ( new Vector3( game.lastPos.x,game.lastPos.y,0) );
				combo.scripts.push( new ShrinkDisappear(game.engine, 2, 0.25));
				combo.Instantiate();
			}
			
			game.comboHit=0;			
		}
		
		//Increment the timer of the game
		game.timer += game.engine.deltaTime;
		//If the timer is greater than the burst delay, start throwing fruits
		if(game.timer >= game.burstDelay && game.health > 0)
		{	game.timer = 0;
			if (Math.random()<game.pomegProb)
			{	game.PomegranatePrefab.Duplicate().Instantiate();
			}
			else
			{	var type   = Math.floor( Math.random() * game.bursts.length );
				var burst  = game.bursts[type].Duplicate();
				burst.Instantiate();
		}	}
		
		return;
	}
	
	//Reduces the player's health and updates the UI
	this.LoseHealth = function()
	{	var game = this;
	
		//If the player is dead, do not execute
		if(game.health == 0)
		{	return;
		}
		
		//Set the name of the UI element to search for based on the current Health
		var objectName = game.health > 2 ? "Health1" : game.health > 1 ? "Health2" : "Health3"; 
		//Search the list of objects in the engine, and set the image to show health
		for(var i = 0; i < game.engine.objects.length; i++)
		{	if(game.engine.objects[i].name == objectName)
			{	game.engine.objects[i].mesh.SetHealth(false);
		}	}
		
		game.health--;
		return;
	}
	
	//Increases the player's score, and updated the UI
	this.IncreaseScore= function(amount)
	{	var game = this;
	
		//Increase the score and set the UI element in the engine to show the same
		game.score+=amount;
		for(var i = 0; i < game.engine.objects.length; i++)
		{	if(game.engine.objects[i].name == "Score")
			{	game.engine.objects[i].mesh.SetNumber(game.score);
		}	}
			
		//If the score is higher than the previous highscore, set the current
		//score as the highscore, and update the UI element showing the highscore.
		//Also change the highscore to be green color, showing a new best.
		if(game.score >= game.highscore)
		{	game.highscore = game.score;
			for(var i = 0; i < game.engine.objects.length; i++)
			{	if(game.engine.objects[i].name == "HighScore")
				{	game.engine.objects[i].material.color=Color.green;
					game.engine.objects[i].mesh.SetNumber(game.highscore);
			}	}
		}
	}
}
