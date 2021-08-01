function Camera(Eng)
{
	this.fovy   = 60;
	this.aspect = 1;
	this.zNear   = 2.5;
	this.zFar    = 1000;
		
	this.left   = -2;
	this.right  =  2;
	this.bottom = -2;
	this.up     =  2;
	this.near   = -2;
	this.far    =  2;
	
	this.En=Eng
	this.rigidbody.verDrag = 0;
		
	this.perspMatrix = Matrix4.Perspective (this.fovy, this.aspect, this.zNear,  this.zFar);
	this.orthoMatrix = Matrix4.Orthographic(this.left, this.right,  this.bottom, this.up, this.near, this.far);
		
	this.SetProjection = function()
	{	var cam = this;
			
		//Constructing the projection Matrices
		cam.perspMatrix = Matrix4.Perspective (cam.fovy, cam.aspect, cam.zNear, cam.zFar); 
		cam.orthoMatrix = Matrix4.Orthographic(cam.left, cam.right, cam.bottom, cam.up, cam.near, cam.far); 
	}
}

Camera.prototype = new GraphicsObject();