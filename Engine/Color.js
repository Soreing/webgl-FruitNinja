function Color(r, g, b, a)
{
	this.r = (typeof r !== 'undefined') ? r : 0;
	this.g = (typeof g !== 'undefined') ? g : 0;
	this.b = (typeof b !== 'undefined') ? b : 0;
	this.a = (typeof a !== 'undefined') ? a : 1;
		
	this.Duplicate = function()
	{
		return new Color(this.r, this.g, this.b, this.a);
	}
		
	this.Debug = function(v)
	{	return ((this.r<0? "r=": "r= ")     + this.r.toFixed(3) + 
				(this.g<0? "  g=": "  g= ") + this.g.toFixed(3) +
				(this.b<0? "  b=": "  b= ") + this.b.toFixed(3) +
				(this.a<0? "  a=": "  a= ") + this.a.toFixed(3));
	};
}

Color.red     = new Color(1.0, 0.0, 0.0, 1.0);
Color.orange  = new Color(1.0, 0.7, 0.0, 1.0)
Color.green   = new Color(0.0, 1.0, 0.0, 1.0);
Color.blue    = new Color(0.0, 0.0, 1.0, 1.0);
Color.cyan    = new Color(0.0, 1.0, 1.0, 1.0);	
Color.magenta =	new Color(1.0, 0.0, 1.0, 1.0);
Color.yellow  =	new Color(1.0, 1.0, 0.0, 1.0);
Color.white   = new Color(1.0, 1.0, 1.0, 1.0);
Color.black   =	new Color(0.0, 0.0, 0.0, 1.0);
Color.grey    =	new Color(0.5, 0.5, 0.5, 1.0);
Color.none    =	new Color(0.0, 0.0, 0.0, 0.0);

Color.Mul= function(c1, c2)
{	return new Color( c1.r * c2.r, c1.g * c2.g, c1.b * c2.b, c1.a * c2.a );
};