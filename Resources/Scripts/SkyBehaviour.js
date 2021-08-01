function SkyBehaviour(cam)
{
	this.object = 0
	this.camera = cam;
	
	this.Start= function()
	{
		
	}
	
	this.Update = function()
	{	
		this.object.transform.SetPosition ( Vector3.Sub(new Vector3(), this.camera.transform.worldMatrix.Multiply( this.camera.transform.localMatrix.Multiply( new Vector3() ) ) ) );
		return;
	}
}
