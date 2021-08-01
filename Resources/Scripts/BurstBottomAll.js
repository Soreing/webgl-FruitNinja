function BurstBottomAll(eng, min, max, fruits)
{
	this.engine = eng,		//Reference to the Engine object
	this.object = 0,		//Reference to the Graphics Object object
	
	this.minFruits = min,		//Minimum amount of fruits spawned
	this.maxFruits = max,		//Maximum amount of fruits spawneds
	this.fruits    = fruits,	//List of fruits that can be spawned
	
	this.Duplicate = function()
	{
		var script = new BurstBottomAll(this.engine, this.minFruits, this.maxFruits, this.fruits);
		return script;
	}
	
	this.Start= function()
	{	var scr = this;	
		
		//Find the scale of the screen at Z
		var localObject = this.object.transform.localMatrix.CombineV4( [0,0,0,1]   );
		var worldObject = this.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = this.engine.camera.transform.localMatrix.CombineV4( worldObject );
		var worldCamera = this.engine.camera.transform.worldMatrix.CombineV4( localCamera );
		
		//Use Law of Sines to find the scale
		var c = -worldCamera[2]-this.engine.camera.zNear;
		var yScale = (c*Math.sin(this.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(this.engine.camera.fovy/2))*Math.PI/180);
		var xScale = yScale *this.engine.camera.aspect;
		

		//Calculating a random amount of fruits to throw
		var nFruits = MathPlus.RandomRange(scr.minFruits, scr.maxFruits);
		for(var i = 0; i < nFruits; i++)
		{
			var ypos = -yScale;
			var xpos = MathPlus.RandomRange(0, 2*xScale*0.8)-xScale*0.8;
			
			var fruit = scr.fruits[MathPlus.RandomRange(0, scr.fruits.length)].Duplicate();
			fruit.transform.WorldTranslate(new Vector3(xpos, ypos-26*fruit.transform.localScale.x, this.object.transform.position.z));
			fruit.rigidbody.AddForce(new Vector3(fruit.transform.position.x<0 ? 0.2 : -0.2,1,0), 15);
			fruit.Instantiate();
		}
		scr.object.Destroy();
		return;
	},
	
	this.Update = function()
	{	return;
	}
}
