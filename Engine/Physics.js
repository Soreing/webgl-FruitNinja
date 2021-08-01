function Rigidbody()
{
	this.force = new Vector3(),
	this.horDrag = 1,
	this.verDrag = 1,
	this.airResi = 1,
		
	this.weight = 1,
		
	this.AddForce = function(v, s)
	{	var rb = this;
	
		rb.force.x += v.x*s;
		rb.force.y += v.y*s;
		rb.force.z += v.z*s;
	},
		
	this.UpdateForce = function(t)
	{	var rb = this;
	
		rb.force.x = rb.force.x > 0 ? rb.force.x - rb.horDrag * t < 0 ? 0 : rb.force.x - rb.horDrag * t : rb.force.x + rb.horDrag * t > 0 ? 0 : rb.force.x + rb.horDrag * t;
		rb.force.y = rb.force.y - rb.verDrag * t;
		rb.force.z = rb.force.z > 0 ? rb.force.z - rb.horDrag * t < 0 ? 0 : rb.force.z - rb.horDrag * t : rb.force.z + rb.horDrag * t > 0 ? 0 : rb.force.z + rb.horDrag * t;
	},
		
	this.Duplicate = function()
	{
		var obj     = new Rigidbody();
		
		obj.force   = this.force.Duplicate();
		obj.horDrag = this.horDrag;
		obj.verDrag = this.verDrag;
		obj.airResi = this.airResi;
		obj.weight  = this.weight;
		
		return obj;
	},
	
	this.Debug = function()
	{	return 	"Force:           (" + this.force.Debug() + ")\n" +
				"Horizontal Drag: (" + this.horDrag       + ")\n" +
				"Vertical Drag:   (" + this.verDrag       + ")\n" +
				"Air Resistance:  (" + this.airResi       + ")\n" +
				"Weight:          (" + this.weight        + ")\n" ;
	}
}