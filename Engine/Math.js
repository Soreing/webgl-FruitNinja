//Extended mathematical operations not covered by the standard Math library.
//Includes conversion of values to other measurements.
function MathPlus() { }

//Calculates the proper modulus of even a negative number
MathPlus.Mod= function(n, m)
{	return ((n%m)+m)%m;
};
	
//Converts radians to degrees
MathPlus.Degree= function(rad)
{	return rad*180/Math.PI;
};
	
//Converts degrees to radians
MathPlus.Radian= function(deg)
{	return deg*Math.PI/180;
};

MathPlus.RandomRange = function(min,max)
{
	return Math.floor(Math.random()*(max-min))+min;
};
