function Transform()
{
	this.position = new Vector3(),
	this.rotation = new Vector3(),
	this.scale    = new Vector3(1,1,1),
	
	this.pivotPosition = new Vector3(0,0,0),
	this.pivotRotation = new Vector3(0,0,0),
	this.pivotScale    = new Vector3(1,1,1),
	
	this.localPosition = new Vector3(0,0,0),
	this.localRotation = new Vector3(0,0,0),
	this.localScale    = new Vector3(1,1,1),
		
	this.right   = new Vector3(1,  0,  0),
	this.up      = new Vector3(0,  1,  0),
	this.forward = new Vector3(0,  0, -1),
		
	this.worldMatrix = new Matrix4(),
	this.localMatrix = new Matrix4(),
	this.pivotMatrix = new Matrix4(),
		
	this.WorldRotate = function(v)
	{	var t = this;
	
		t.rotation.x = MathPlus.Mod( t.rotation.x + v.x, 360 );
		t.rotation.y = MathPlus.Mod( t.rotation.y + v.y, 360 );
		t.rotation.z = MathPlus.Mod( t.rotation.z + v.z, 360 );
	
		var angles = [ MathPlus.Radian( t.rotation.x ),   MathPlus.Radian( t.rotation.y ),   MathPlus.Radian( t.rotation.z ) ];
		
		t.worldMatrix.RotateX(v.x*Math.PI/180);
		t.worldMatrix.RotateY(v.y*Math.PI/180);
		t.worldMatrix.RotateZ(v.z*Math.PI/180);
		
		var matrix = this.worldMatrix.Combine(this.localMatrix.Combine(this.pivotMatrix));
		
		t.right.x =  matrix.m[0];
		t.right.y =  matrix.m[1];
		t.right.z =  matrix.m[2];
		t.up.x =  matrix.m[4];
		t.up.y =  matrix.m[5];
		t.up.z =  matrix.m[6];
		t.forward.x =  -matrix.m[8];
		t.forward.y =  -matrix.m[9];
		t.forward.z =  -matrix.m[10];
		
		t.forward = Vector3.Normalize(this.forward);
			
	},
	
	this.LocalRotate = function(v)
	{	var t = this;
	
		t.localRotation.x = MathPlus.Mod( t.localRotation.x + v.x, 360 );
		t.localRotation.y = MathPlus.Mod( t.localRotation.y + v.y, 360 );
		t.localRotation.z = MathPlus.Mod( t.localRotation.z + v.z, 360 );
	
		var angles = [ MathPlus.Radian( t.localRotation.x ),   MathPlus.Radian( t.localRotation.y ),   MathPlus.Radian( t.localRotation.z ) ]; 
		
		t.localMatrix.RotateX(v.x*Math.PI/180);
		t.localMatrix.RotateY(v.y*Math.PI/180);
		t.localMatrix.RotateZ(v.z*Math.PI/180);
		
		var matrix = this.worldMatrix.Combine(this.localMatrix.Combine(this.pivotMatrix));
		
		t.right.x =  matrix.m[0];
		t.right.y =  matrix.m[1];
		t.right.z =  matrix.m[2];
		t.up.x =  matrix.m[4];
		t.up.y =  matrix.m[5];
		t.up.z =  matrix.m[6];
		t.forward.x =  -matrix.m[8];
		t.forward.y =  -matrix.m[9];
		t.forward.z =  -matrix.m[10];
	
	},
	
	this.PivotRotate = function(v)
	{	var t = this;
	
		t.pivotRotation.x = MathPlus.Mod( t.pivotRotation.x + v.x, 360 );
		t.pivotRotation.y = MathPlus.Mod( t.pivotRotation.y + v.y, 360 );
		t.pivotRotation.z = MathPlus.Mod( t.pivotRotation.z + v.z, 360 );
	
		var angles = [ MathPlus.Radian( t.pivotRotation.x ),   MathPlus.Radian( t.pivotRotation.y ),   MathPlus.Radian( t.pivotRotation.z ) ]; 
		
		t.pivotMatrix.RotateX(v.x*Math.PI/180);
		t.pivotMatrix.RotateY(v.y*Math.PI/180);
		t.pivotMatrix.RotateZ(v.z*Math.PI/180);
		
		var matrix = this.worldMatrix.Combine(this.localMatrix.Combine(this.pivotMatrix));
		
		t.right.x =  matrix.m[0];
		t.right.y =  matrix.m[1];
		t.right.z =  matrix.m[2];
		t.up.x =  matrix.m[4];
		t.up.y =  matrix.m[5];
		t.up.z =  matrix.m[6];
		t.forward.x =  -matrix.m[8];
		t.forward.y =  -matrix.m[9];
		t.forward.z =  -matrix.m[10];
	
	},
		
	this.WorldTranslate = function(v)
	{	var t = this;	
	
		t.position.x += v.x;
		t.position.y += v.y;
		t.position.z += v.z;
		
		t.worldMatrix.Translate(v.x, v.y, v.z);
	},
		
	this.LocalTranslate = function(v)
	{	var t = this;	
	
		t.localPosition.x += v.x;
		t.localPosition.y += v.y;
		t.localPosition.z += v.z;
		
		t.localMatrix.Translate(v.x, v.y, v.z);
	},
	
	this.PivotTranslate = function(v)
	{	var t = this;	
	
		t.pivotPosition.x += v.x;
		t.pivotPosition.y += v.y;
		t.pivotPosition.z += v.z;
		
		t.pivotMatrix.Translate(v.x, v.y, v.z);
	},
		
	this.WorldScale = function(v)
	{	var t = this;
	
		t.scale.x *= v.x;
		t.scale.y *= v.y;
		t.scale.z *= v.z;
		
		t.worldMatrix.Scale(v.x, v.y, v.z);
	},
		
	this.LocalScale = function(v)
	{	var t = this;
	
		t.localScale.x *= v.x;
		t.localScale.y *= v.y;
		t.localScale.z *= v.z;
		
		t.localMatrix.Scale(v.x, v.y, v.z);
	},
		
	this.SetLocalScale = function(v) 
	{	var t = this;
		t.LocalScale( new Vector3(v.x / t.localScale.x, v.y / t.localScale.y, v.z / t.localScale.z) );
	},
	
	this.SetLocalPosition = function(v) 
	{	var t = this;
		t.LocalTranslate( new Vector3(v.x - t.localPosition.x, v.y - t.localPosition.y, v.z - t.localPosition.z) );
	},
	
	this.SetLocalRotation = function(v) 
	{	var t = this;
		t.LocalRotate( new Vector3(v.x - t.localRotation.x, v.y - t.localRotation.y, v.z - t.localRotation.z) );
	},
	
	
		
	this.SetScale = function(v) 
	{	var t = this;
		this.WorldScale( new Vector3(v.x / t.scale.x, v.y / t.scale.y, v.z / t.scale.z) );
	},
	
	this.SetPosition = function(v) 
	{	var t = this;
	
		t.WorldTranslate( new Vector3(v.x - t.position.x, v.y - t.position.y, v.z - t.position.z) );
	},
	
	this.SetRotation = function(v) 
	{	var t = this;
		t.WorldRotate( new Vector3(v.x - t.rotation.x, v.y - t.rotation.y, v.z - t.rotation.z) );
	},
	
	
	this.Duplicate = function()
	{
		var obj = new Transform();
		
		obj.position = this.position.Duplicate();
		obj.rotation = this.rotation.Duplicate();
		obj.scale    = this.scale.Duplicate();
		
		obj.pivotPosition = this.pivotPosition.Duplicate();
		obj.pivotRotation = this.pivotRotation.Duplicate();
		obj.pivotScale    = this.pivotScale.Duplicate();
		
		obj.localPosition = this.localPosition.Duplicate();
		obj.localRotation = this.localRotation.Duplicate();
		obj.localScale    = this.localScale.Duplicate();
			
		obj.right   = this.right.Duplicate();
		obj.up      = this.up.Duplicate();
		obj.forward = this.forward.Duplicate();
			
		obj.worldMatrix = this.worldMatrix.Duplicate();
		obj.localMatrix = this.localMatrix.Duplicate();
		obj.pivotMatrix = this.pivotMatrix.Duplicate();
		
		return obj;
	},
	
	this.Debug = function()
	{	return	"World Position: ("+ this.position.Debug()      + ")\n" +
				"World Rotation: ("+ this.rotation.Debug()      + ")\n" +
				"World Scale:    ("+ this.scale.Debug()         + ")\n" +
				"Local Position: ("+ this.localPosition.Debug() + ")\n" +
				"Local Rotation: ("+ this.localRotation.Debug() + ")\n" +
				"Local Scale:    ("+ this.localScale.Debug()    + ")\n" +
				"Forward Vector: ("+ this.forward.Debug()       + ")\n" +
				"Up Vector:      ("+ this.up.Debug()            + ")\n" +
				"Right Vector:   ("+ this.right.Debug()         + ")\n" +
				"World Matrix:  \n"+ this.worldMatrix.Debug()   + "\n"  +
				"Local Matrix:  \n"+ this.localMatrix.Debug()   + "\n"  ;
	}
}