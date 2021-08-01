function ShrinkDisappear(eng, visTime, disTime)
{
	this.engine = eng,		//Reference to the Engine object
	this.object = 0,		//Reference to the Graphics Object object
	
	this.timer         = 0.0,		//Timer in the script that handles the disappearing
	this.objectScale   = 0.0,		//Initial scale of the object
	this.visibleTime   = visTime,	//Amount of time the object should stay normal
	this.disappearTime = disTime,	//Amount of time the object takes to fully disappear
	
	this.Start= function()
	{	var scale = this.object.transform.localScale;
		this.objectScale = new Vector3(scale.x, scale.y, scale.z);
		
		return;
	},
	
	this.Update = function()
	{	var scr = this;
	
		//Increment the timer
		scr.timer += scr.engine.deltaTime;
		
		//If the timer exceeded the object's alive time, start shrinking
		if(scr.timer > scr.visibleTime)
		{	//Scale down the object
			var scaleAmount = Vector3.Mul(scr.objectScale, scr.engine.deltaTime/scr.disappearTime );
			scr.object.transform.SetLocalScale( Vector3.Sub( scr.object.transform.localScale, scaleAmount ));

			//If the scale time is over, delete the object
			if(scr.timer > scr.visibleTime+scr.disappearTime)
			{	scr.object.Destroy();
			}
		}
		
		return;
	}
}
