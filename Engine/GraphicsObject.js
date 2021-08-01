function clone(obj)
{
	var clone;
	var i = 0;
    var len = obj.length;
	
	if (typeof obj !== "object") 
	{	clone = obj;
    }
}

function GraphicsObject(Eng)
{	this.En = Eng;

	this.ID     = 0;
	this.name   = "Object";
	this.type   = 0;
	this.parent = 0;
	
	this.created = 0;
	this.enabled = false;
	this.depth   = true;
	this.noHide  = false;
		
	this.transform = new Transform();
	this.rigidbody = new Rigidbody();
	this.material  = new Material();
	
	this.mesh= new Empty();
	
	this.scripts = [];
		
	this.Instantiate = function()
	{	var obj = this;
	
		if(obj.created == 0)
		{
			obj.created = 1;
			obj.ID = obj.En.objects.length;
			obj.En.objects.push(obj);
			
			obj.Enable();
		}
	};
		
	this.Destroy = function()
	{	var obj = this;
		var offset = 0;

		for(var i=0; i< obj.En.objects.length-1;i++)
		{
			if (obj.En.objects[i].ID==obj.ID)
			{
				offset=1;
			}
			obj.En.objects[i] = obj.En.objects[i+offset];
			obj.En.objects[i].ID = i;
		}
	
		obj.En.objects.pop();
	};
	
	this.Enable = function()
	{	this.enabled=1;
		for(j=0; j<this.scripts.length; j++)
		{	this.scripts[j].object=this;
			this.scripts[j].Start();
		}
		return;
	};
		
	this.Disable = function()
	{	this.enabled=0;
	};
		
		
	this.Update = function()
	{
		for(j=0; j<this.scripts.length; j++)
		{	this.scripts[j].object=this;
			this.scripts[j].Update();
		}
		return;
	};
		
	this.Duplicate = function()
	{	//Make new Object
		var newObj = new GraphicsObject(this.En);
		
		//Copy Object Details
		newObj.name    = this.name;
		newObj.type    = this.type;
		newObj.parent  = this.parent;
		newObj.created = this.created;
		newObj.enabled = this.enabled;
		newObj.depth   = this.depth;
		newObj.noHide  = this.noHide;
		
		//Clone Transform
		newObj.transform = this.transform.Duplicate();
		//Clone Rigidbody
		newObj.rigidbody = this.rigidbody.Duplicate();
		//Clone Material
		newObj.material  = this.material.Duplicate();
		//Clone Mesh
		newObj.mesh      = this.mesh.Duplicate(this.En.webGL); 

		//Clone Scripts
		for(var i = 0; i<this.scripts.length; i++)
		{	newObj.scripts.push(this.scripts[i].Duplicate());
		}

		return newObj;
	}
	this.Debug = function()
	{	return	"OBJECT INFORMATION\n------------------"  + "\n" + 
				"ID:      " + this.ID                     + "\n" +
				"Name:    " + this.name                   + "\n" +
				"Polys:   " + this.mesh.vertices.length   + "\n" +
				"Enabled: " + this.enabled                + "\n" +
				"\nTransform:\n" + this.transform.Debug() + "\n" +
				"\nRigidbody:\n" + this.rigidbody.Debug() + "\n" +
				"\nMaterial:\n"  + this.material.Debug()  + "\n" ;
	};
	
}