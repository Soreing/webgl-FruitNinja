function SpawnSplash(eng, delay, visible, disappear, texture, color)
{
	this.engine = eng,		//Reference to the Engine object
	this.object = 0,		//Reference to the Graphics Object object
	
	this.timer         = 0.0,		//Timer in the script that handles the spawning
	this.spawnDelay    = delay,		//Delay between spawning splashes
	this.visibleTime   = visible,	//Amount of time the splash should stay normal
	this.disappearTime = disappear,	//Amount of time the splash takes to fully disappear
	this.texture       = texture	//Texture of the splash
	this.color         = color  	//Color of the splash
	
	this.Start= function()
	{	return;
	},
	
	this.Update = function()
	{	var scr = this;
	
		//Increment the timer
		scr.timer += scr.engine.deltaTime;
		
		//If the timer exceeds the delay
		if(scr.timer > scr.spawnDelay)
		{	scr.timer = 0
	
			//Calculate the object's final position
			var localObject = scr.object.transform.localMatrix.CombineV4( [0,0,0,1]   );
			var worldObject = scr.object.transform.worldMatrix.CombineV4( localObject );
			var localCamera = scr.engine.camera.transform.worldMatrix.CombineV4( worldObject );
			var worldCamera = scr.engine.camera.transform.localMatrix.CombineV4( localCamera );
			var position    = new Vector3(worldCamera[0], worldCamera[1], worldCamera[2]);
		
			//Get scale with current camera view
			var c = -position.z;
			yScale = (c*Math.sin(scr.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(scr.engine.camera.fovy/2))*Math.PI/180);
			xScale = yScale *scr.engine.camera.aspect;
				
			//Spawn Splash
			var splash = new GraphicsObject(scr.engine);
			splash.name   = "Splash";
			splash.depth  = false;
			splash.type   = 1;
			splash.mesh   = new Pane(scr.engine.webGL);
			splash.material.color = scr.color.Duplicate();
			splash.material.textured  = scr.texture;
			splash.rigidbody.verDrag  = 0;
			splash.transform.WorldTranslate( new Vector3 (position.x/xScale*8, position.y/yScale*4.5, 0) );
			splash.transform.LocalScale( new Vector3(0.6,0.6,0.6) );
			splash.scripts.push( new FadeDisappear(scr.engine, scr.visibleTime, scr.disappearTime));
			splash.Instantiate();
		}
		
		return;
	}
}
