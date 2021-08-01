function Material()
{
	this.color     = Color.white;
	this.ambient   = new Color(1.0, 1.0, 1.0, 1.0);
	this.diffuse   = new Color(0.0, 0.0, 0.0, 1.0);
	this.specular  = new Color(0.0, 0.0, 0.0, 1.0);
	this.shininess =  1.0;
	this.textured  = -1.0;
	
	this.Duplicate = function()
	{
		var obj = new Material();
		
		obj.color     = this.color.Duplicate();
		obj.ambient   = this.ambient.Duplicate();
		obj.diffuse   = this.diffuse.Duplicate();
		obj.specular  = this.specular.Duplicate();
		obj.shininess = this.shininess;
		obj.textured  = this.textured;
		
		return obj;
	}
	
	this.Debug = function()
	{	return	"Color:     ("+ this.color.Debug()    + ")\n" +
				"Ambient:   ("+ this.ambient.Debug()  + ")\n" +
				"Diffuse:   ("+ this.diffuse.Debug()  + ")\n" +
				"Specular:  ("+ this.specular.Debug() + ")\n" +
				"Shininess: ("+ this.shininess        + ")\n" ;
	};
	
}