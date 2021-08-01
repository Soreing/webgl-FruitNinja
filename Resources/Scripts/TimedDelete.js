function TimedDelete(eng, delay)
{
	this.en     = eng
	this.object = 0;
	this.time   = 0;
	this.limit  = delay;
	
	this.Start = function()
	{
		
	};
	
	this.Update = function()
	{
		if(this.time<this.limit)
			this.time+=deltaTime;
		else
			this.object.Destroy();
		return;
	};
}
