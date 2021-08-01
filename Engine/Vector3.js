function Vector3(x, y, z)
{
	this.x = (typeof x !== 'undefined') ? x : 0,
	this.y = (typeof y !== 'undefined') ? y : 0,
	this.z = (typeof z !== 'undefined') ? z : 0,
	
	this.Duplicate = function()
	{	return new Vector3(this.x, this.y, this.z);
	},	
	
	this.Debug = function(v)
	{	return ((this.x<0? "x="  : "x= "  ) + this.x.toFixed(3) + 
				(this.y<0? "  y=": "  y= ") + this.y.toFixed(3) +
				(this.z<0? "  z=": "  z= ") + this.z.toFixed(3));
	}
};

Vector3.Add= function(v1, v2)
{	return new Vector3( v1.x + v2.x, v1.y + v2.y, v1.z + v2.z );
};
	
Vector3.Sub= function(v1, v2)
{	return new Vector3( v1.x - v2.x, v1.y - v2.y, v1.z - v2.z );
};
	
Vector3.Mul= function(v, n)
{	return new Vector3( v.x * n, v.y * n, v.z * n );
};
	
Vector3.Div= function(v, n)
{	return new Vector3( v.x / n, v.y / n, v.z / n );
};
	
Vector3.Distance= function(v1, v2)
{	
	var x=v2.x-v1.x;
	var y=v2.y-v1.y;
	var z=v2.z-v1.z;
	return Math.sqrt(x * x + y * y + z * z);
};
	
Vector3.Normalize= function(v)
{	var len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	return new Vector3( v.x / len, v.y / len, v.z / len );
};
	
Vector3.DotProduct= function(v1, v2)
{	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
	
Vector3.CrossProduct= function(v1, v2)
{	return new Vector3(  v1.y * v2.z - v1.z * v2.y,
						 v1.z * v2.x - v1.x * v2.z, 
						 v1.x * v2.y - v1.y * v2.x );
};
	
Vector3.MoveTowards= function(v1, v2, max)
{	var change = Vector3.Normalize( Vector3.Sub(v2, v1) );
	return Vector3.Add( change < max ? change > -max ? change : -max : max );
};
