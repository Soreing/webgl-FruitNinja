function WorldRotate(eng, x, y, z)
{
	this.object = 0;
	this.engine = eng;
	this.xRot   = x;
	this.yRot   = y;
	this.zRot   = z;
	
	this.Start= function()
	{
		
	}
	
	this.Update = function()
	{	
		this.object.transform.WorldRotate(new Vector3(this.xRot*deltaTime, this.yRot*deltaTime, this.zRot*deltaTime));
		return;
	}
}
