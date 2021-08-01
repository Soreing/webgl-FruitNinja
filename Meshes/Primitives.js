function CalculateNormals(ver)
{
	var normals = [];
	
	for(var i = 0; i<ver.length; i+=9)
	{
		var v1 = new Vector3(ver[i  ], ver[i+1], ver[i+2]);
		var v2 = new Vector3(ver[i+3], ver[i+4], ver[i+5]);
		var v3 = new Vector3(ver[i+6], ver[i+7], ver[i+8]);
		
		var e1 = Vector3.Sub(v2, v1);
		var e2 = Vector3.Sub(v3, v2);
		
		var normal = Vector3.Normalize(Vector3.CrossProduct(e1, e2));
		
		normals.push(normal.x); normals.push(normal.y); normals.push(normal.z);
		normals.push(normal.x); normals.push(normal.y); normals.push(normal.z);
		normals.push(normal.x); normals.push(normal.y); normals.push(normal.z);
	}
	
	return normals;
}
	
function Empty()
{
	this.vertices = [ ];
	
	this.colors   = [ ];
				 
	this.UVMap    = [ ];
	
	this.Normals   = [ ];
	
	this.Duplicate = function()
	{
		var obj      = new Empty();
		obj.vertices = this.vertices.slice();
		obj.colors   = this.colors.slice();
		obj.UVMap    = this.UVMap.slice();		
		obj.Normals  = this.Normals.slice();
		
		return obj;
	}
}

function Placeholder(gl)
{
	this.vertices=[];
	
	this.colors=[];
				 
	this.UVMap =[];
					
	this.Normals = [];
	
	this.vertexBuff =  gl.createBuffer();	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer();	//Buffer for loading colors into the shader
	this.normalBuff =  gl.createBuffer();	//Buffer for loading normals into the shader
	this.texCorBuff =  gl.createBuffer();	//Buffer for loading object indexes into the shader
	
	this.Duplicate = function(gl)
	{
		var obj      = new Placeholder();
		obj.vertices = this.vertices.slice();
		obj.colors   = this.colors.slice();
		obj.UVMap    = this.UVMap.slice();		
		obj.Normals  = this.Normals.slice();
		
		obj.vertexBuff =  gl.createBuffer();
		obj.colorBuff  =  gl.createBuffer();
		obj.normalBuff =  gl.createBuffer();
		obj.texCorBuff =  gl.createBuffer();
		
		obj.Refresh();
		return obj;
	},
	
	this.Refresh = function()
	{
		//Loading the vertex information into the vertex buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

			
		//Loading the color information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );
		
		
		//Loading the normals information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.Normals), gl.STATIC_DRAW );

			
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	};
}

function Cube(gl)
{
	this.vertices=[	-1, -1, -1,    1,  1, -1,    1, -1, -1,
					-1, -1, -1,   -1,  1, -1,    1,  1, -1,
					-1, -1,  1,    1, -1,  1,    1,  1,  1,
					-1, -1,  1,    1,  1,  1,   -1,  1,  1,
					-1, -1,  1,   -1,  1,  1,   -1,  1, -1,
					-1, -1,  1,   -1,  1, -1,   -1, -1, -1,
					 1, -1,  1,    1,  1, -1,    1,  1,  1,
					 1, -1,  1,    1, -1, -1,    1,  1, -1,
					-1, -1, -1,    1, -1, -1,    1, -1,  1,
					-1, -1, -1,    1, -1,  1,   -1, -1,  1,
					-1,  1, -1,    1,  1,  1,    1,  1, -1,
					-1,  1, -1,   -1,  1,  1,    1,  1,  1, ];
	
	this.colors=[	1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1, ];
				 
	this.UVMap =[   0,  0,    1, 1,    1, 0,
					0,  0,    0, 1,    1, 1,
					1,  0,    0, 0,    0, 1,
					1,  0,    0, 1,    1, 1,
					0,  0,    0, 1,    1, 1,
					0,  0,    1, 1,    1, 0,
					1,  0,    0, 1,    1, 1,
					1,  0,    0, 0,    0, 1,
					0,  0,    0, 1,    1, 1,
					0,  0,    1, 1,    1, 0,
					0,  0,    1, 1,    1, 0,
					0,  0,    0, 1,    1, 1 ];
					
	this.Normals = CalculateNormals(this.vertices);
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.normalBuff =  gl.createBuffer(),	//Buffer for loading normals into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	this.Duplicate = function(gl)
	{
		var obj      = new Cube();
		obj.vertices = this.vertices.slice();
		obj.colors   = this.colors.slice();
		obj.UVMap    = this.UVMap.slice();		
		obj.Normals  = this.Normals.slice();
		
		obj.vertexBuff =  gl.createBuffer();
		obj.colorBuff  =  gl.createBuffer();
		obj.normalBuff =  gl.createBuffer();
		obj.texCorBuff =  gl.createBuffer();
		
		obj.Refresh();
		return obj;
	},
	
	this.Refresh = function()
	{
		//Loading the vertex information into the vertex buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

			
		//Loading the color information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );
		
		
		//Loading the normals information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.Normals), gl.STATIC_DRAW );

			
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	};
	
	this.Refresh();
}

function SkyBox(gl)
{
	this.vertices=[	-1, -1, -1,    1, -1, -1,    1,  1, -1,
					-1, -1, -1,    1,  1, -1,   -1,  1, -1,
					-1, -1,  1,    1,  1,  1,    1, -1,  1,
					-1, -1,  1,   -1,  1,  1,    1,  1,  1,
					-1, -1,  1,   -1,  1, -1,   -1,  1,  1,
					-1, -1,  1,   -1, -1, -1,   -1,  1, -1,
					 1, -1,  1,    1,  1,  1,    1,  1, -1,
					 1, -1,  1,    1,  1, -1,    1, -1, -1,
					-1, -1, -1,    1, -1,  1,    1, -1, -1,
					-1, -1, -1,   -1, -1,  1,    1, -1,  1,
					-1,  1, -1,    1,  1, -1,    1,  1,  1,
					-1,  1, -1,    1,  1,  1,   -1,  1,  1, ];
	
	this.colors=[	1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1,
					1,  1,  1,    1,  1,  1,    1,  1,  1, ];
				 
	this.UVMap =[   0.25,  0.50,    0.00, 0.50,    0.00, 0.75,
					0.25,  0.50,    0.00, 0.75,    0.25, 0.75,
					0.50,  0.50,    0.75, 0.75,    0.75, 0.50,
					0.50,  0.50,    0.50, 0.75,    0.75, 0.75,
					0.50,  0.50,    0.25, 0.75,    0.50, 0.75,
					0.50,  0.50,    0.25, 0.50,    0.25, 0.75,
					0.75,  0.50,    0.75, 0.75,    1.00, 0.75,
					0.75,  0.50,    1.00, 0.75,    1.00, 0.50,
					0.25,  0.50,    0.50, 0.25,    0.25, 0.25,
					0.25,  0.50,    0.50, 0.50,    0.50, 0.25,
					0.25,  0.75,    0.25, 1.00,    0.50, 1.00,
					0.25,  0.75,    0.50, 1.00,    0.50, 0.75 ];
				
	this.Normals = CalculateNormals(this.vertices);
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.normalBuff =  gl.createBuffer(),	//Buffer for loading normals into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	this.Duplicate = function(gl)
	{
		var obj      = new SkyBox();
		obj.vertices = this.vertices.slice();
		obj.colors   = this.colors.slice();
		obj.UVMap    = this.UVMap.slice();		
		obj.Normals  = this.Normals.slice();
		
		obj.vertexBuff =  gl.createBuffer();
		obj.colorBuff  =  gl.createBuffer();
		obj.normalBuff =  gl.createBuffer();
		obj.texCorBuff =  gl.createBuffer();
		
		obj.Refresh();
		return obj;
	},
	
	this.Refresh = function()
	{
		//Loading the vertex information into the vertex buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

			
		//Loading the color information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );
		
		
		//Loading the normals information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.Normals), gl.STATIC_DRAW );

			
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	};
	
	this.Refresh();
}

function Pane(gl)
{
	this.vertices=[	-1, -1,  0,    1, -1,  0,    1,  1,  0,
					-1, -1,  0,    1,  1,  0,   -1,  1,  0, ];
	
	this.colors=[	 1,  1,  1,    1,  1,  1,    1,  1,  1,
					 1,  1,  1,    1,  1,  1,    1,  1,  1, ];
				 
	this.UVMap =[   0,  0,    1, 0,    1, 1,
					0,  0,    1, 1,    0, 1 ];
	
	this.Normals = CalculateNormals(this.vertices);
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.normalBuff =  gl.createBuffer(),	//Buffer for loading normals into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	this.Duplicate = function(gl)
	{
		var obj      = new Pane();
		obj.vertices = this.vertices.slice();
		obj.colors   = this.colors.slice();
		obj.UVMap    = this.UVMap.slice();		
		obj.Normals  = this.Normals.slice();
		
		obj.vertexBuff =  gl.createBuffer();
		obj.colorBuff  =  gl.createBuffer();
		obj.normalBuff =  gl.createBuffer();
		obj.texCorBuff =  gl.createBuffer();
		
		obj.Refresh();
		return obj;
	},
	
	this.Refresh = function()
	{
		//Loading the vertex information into the vertex buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

			
		//Loading the color information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );
		
		
		//Loading the normals information into the color buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.Normals), gl.STATIC_DRAW );

			
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	};
	
	this.Refresh();
}