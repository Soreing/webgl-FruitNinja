function FadeDisappear(eng, visTime, disTime)
{
	this.engine = eng,		//Reference to the Engine object
	this.object = 0,		//Reference to the Graphics Object object
	
	this.timer         = 0.0,		//Timer in the script that handles the disappearing
	this.alphaValue    = 0.0,		//Initial alpha value of the object's color
	this.visibleTime   = visTime,	//Amount of time the object should stay normal
	this.disappearTime = disTime,	//Amount of time the object takes to fully disappear
	
	this.Start= function()
	{	this.alphaValue = this.object.material.color.a;
		//console.log(alphaValue);
		
		return;
	},
	
	this.Update = function()
	{	var scr = this;
	
		//Increment the timer
		scr.timer += scr.engine.deltaTime;
		
		//If the timer exceeded the object's alive time, start fading
		if(scr.timer > scr.visibleTime)
		{	//Scale down the object
			var fadeAmount = scr.alphaValue * (scr.engine.deltaTime / scr.disappearTime) ;
			scr.object.material.color.a -= fadeAmount;

			//If the scale time is over, delete the object
			if(scr.timer > scr.visibleTime+scr.disappearTime)
			{	scr.object.Destroy();
			}
		}
		
		return;
	}
}
