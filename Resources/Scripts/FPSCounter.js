FPSCounter = function(eng)
{	this.En    = eng,
	this.count = 0,
	this.sum   = 0,
	
	this.Update = function()
	{
		this.count++;
		this.sum += this.En.deltaTime;
	
		if (this.sum > 0.3)
		{
			document.getElementById('fpsCounter').innerHTML = (this.count/this.sum).toFixed(0); 
			this.count=0;
			this.sum=0;
		}
	}
}
