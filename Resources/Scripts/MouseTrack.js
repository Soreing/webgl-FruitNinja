function MouseTrack(eng)
{
	this.object = 0
	this.engine = eng;
	
	this.Start= function()
	{
		
	}
	
	this.Update = function()
	{	
		this.object.transform.SetPosition ( new Vector3(this.engine.mousePosX*(this.engine.camera.right-this.engine.camera.left)/2, this.engine.mousePosY*(this.engine.camera.up-this.engine.camera.bottom)/2, 0) );
		return;
	}
}
