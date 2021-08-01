function CameraScale(eng)
{
	this.engine = eng,		//Reference to the Engine object
	this.object = 0,		//Reference to the Graphics Object object
	this.scale  = 0,
	
	this.Start= function()
	{	this.scale = this.object.transform.localScale.x;
		return;
	},
	
	this.Update = function()
	{	var scr = this;
		
		//Calculate the camera's final position
		var localCamera = scr.engine.camera.transform.worldMatrix.CombineV4( [0,0,0,1] );
		var worldCamera = scr.engine.camera.transform.localMatrix.CombineV4( localCamera );
		var position    = new Vector3(worldCamera[0], worldCamera[1], worldCamera[2]);
	
		//Get scale with current camera view
		var c = position.z+1.257;
		yScale = (c*Math.sin(scr.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(scr.engine.camera.fovy/2))*Math.PI/180);
		xScale = yScale;
			
		scr.object.transform.SetLocalScale(new Vector3(xScale*scr.scale, yScale*scr.scale, 1));		
		return;
	}
	
}
