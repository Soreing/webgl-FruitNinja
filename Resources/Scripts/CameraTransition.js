function CameraTransition(eng, location, time)
{
	this.engine = eng,		//Reference to the Engine object
	this.object = 0,		//Reference to the Graphics Object object
	
	this.timer         = 0.0,		//Timer in the script that handles the disappearing
	this.destination   = location	//Destination vector of the camera
	this.direction,
	this.travelTime    = time,	    //Amount of time the camera takes to reach its position
	
	this.Start= function()
	{	return;
	},
	
	this.Update = function()
	{	var scr = this;
	
		console.log(typeof scr.direction === 'undefined')
		if(typeof scr.direction === 'undefined')
		{	scr.direction = Vector3.Sub(scr.destination, scr.object.transform.position);
		}
		
		//Increment the timer
		scr.timer += scr.engine.deltaTime;
		
		//If the travel time is greated than the timer, move the object
		if(scr.timer < scr.travelTime)
		{	//Move the Camera
			var move = Vector3.Mul(scr.direction, (scr.engine.deltaTime / scr.travelTime));
			scr.object.transform.WorldTranslate(move);

			//If the scale time is over, delete the script
			if(scr.timer > scr.visibleTime+scr.disappearTime)
			{	
				//scr.Start  = function() {};
				//scr.Update = function() {};
			}
		}
		
		return;
	}
	
}
