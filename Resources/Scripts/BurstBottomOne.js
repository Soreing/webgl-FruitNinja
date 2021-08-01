function BurstBottomOne(eng, min, max, delay, fruits, bomb, bombProb)
{
	this.engine = eng,			//Reference to the Engine object
	this.object = 0,			//Reference to the Graphics Object object
	
	this.minFruits  = min,		//Minimum amount of fruits spawned
	this.maxFruits  = max,		//Maximum amount of fruits spawneds
	this.leftFruits = 0.0,		//Remaining number of fruits to be thrown
	
	this.timer      = 0.0,		//Time spent since the last throw
	this.throwDelay = delay,	//Delay between throws in secods
	
	this.xScale     = 0.0;		//Scale of the screen width at some value Z
	this.yScale     = 0.0;		//Scale of the screen height at some value Z
	
	this.fruits     = fruits,	//List of fruits that can be spawned
	this.bomb       = bomb,		//Bomb prefab that can be spawned
	this.bombProb   = bombProb,	//Probability that a bomb is spawned
	
	
	this.Duplicate = function()
	{
		var script      = new BurstBottomOne(this.engine, this.minFruits, this.maxFruits, this.throwDelay, this.fruits);
		script.timer    = this.timer;
		script.xScale   = this.xScale;
		script.yScale   = this.yScale;
		script.bomb     = this.bomb;
		script.bombProb = this.bombProb;
		return script;
	}
	
	this.Start= function()
	{	var scr = this;	
		
		//Find the scale of the screen at Z
		var localObject = scr.object.transform.localMatrix.CombineV4( [0,0,0,1]   );
		var worldObject = scr.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = scr.engine.camera.transform.localMatrix.CombineV4( worldObject );
		var worldCamera = scr.engine.camera.transform.worldMatrix.CombineV4( localCamera );
		
		//Use Law of Sines to find the scale
		var c = -worldCamera[2];
		scr.yScale = (c*Math.sin(scr.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(scr.engine.camera.fovy/2))*Math.PI/180);
		scr.xScale = scr.yScale *scr.engine.camera.aspect;

		//Calculating a random amount of fruits to throw
		scr.leftFruits = MathPlus.RandomRange(scr.minFruits, scr.maxFruits);
		
		return;
	},
	
	this.Update = function()
	{	var scr = this;	
	
		//Incrementing time
		scr.timer += scr.engine.deltaTime;
		
		if(scr.leftFruits == 0)
		{	scr.object.Destroy();
		}
		
		if(scr.timer > scr.throwDelay)
		{	scr.timer = 0;
			scr.leftFruits--;
			
			var ypos = -scr.yScale;
			var xpos = MathPlus.RandomRange(0, 2*scr.xScale*0.8)-scr.xScale*0.8;
			var fruit;
			if(Math.random() > scr.bombProb)
			{	fruit = scr.fruits[MathPlus.RandomRange(0, scr.fruits.length)].Duplicate();
			}
			else
			{	fruit = scr.bomb.Duplicate();
			}
			fruit.transform.WorldTranslate(new Vector3(xpos, ypos-26*fruit.transform.localScale.x, this.object.transform.position.z));
			fruit.rigidbody.AddForce(new Vector3(fruit.transform.position.x<0 ? 0.4 : -0.4,1,0), 15);
			fruit.Instantiate();
		}
		return;
	}
}
