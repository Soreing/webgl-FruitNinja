function MusicBehaviour(eng)
{
	this.engine  = eng,	//Reference to the Engine object
	this.object  = 0,	//Reference to the Graphics Object object
	
	this.width   = 1.0;	//Width of the object used for click detection		
	this.height  = 1.0;	//Height of the object used for click detection
	this.enabled = true //State of the setting
	
	this.Start = function()
	{
		
	};
	
	this.Update = function()
	{	var scr = this;
	
		//Find the scale of the screen at Z
		var localObject = scr.object.transform.localMatrix.CombineV4( [0,0,0,1]   );
		var worldObject = scr.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = scr.engine.camera.transform.localMatrix.CombineV4( worldObject );
		var worldCamera = scr.engine.camera.transform.worldMatrix.CombineV4( localCamera );
		var position    = new Vector3(worldCamera[0], worldCamera[1], worldCamera[2]);
		
		//Test if the object is clicked
		if( scr.engine.mouseDown[0])
		{	//Get scale with current camera view
			yScale = scr.engine.camera.up;
			xScale = scr.engine.camera.right;
			
			//Get the vector position of the click
			var click = new Vector3(scr.engine.mousePosX*xScale, scr.engine.mousePosY*yScale, 0);
			if( click.x < position.x+scr.width/2 && click.x > position.x-scr.width/2 && click.y > position.y-scr.height/2 && click.y < position.y+scr.height/2)
			{	//change desired elements
				scr.enabled = !scr.enabled;
				scr.object.transform.LocalScale( scr.enabled ? new Vector3(2,2,2) : new Vector3(0.5,0.5,0.5));
				
				scr.engine.SetVolume(0,scr.enabled? 1:0);
			}
		}
		return;
	};
}
