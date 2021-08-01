var textTextureCoordinates = [	9/10,  7/8,   10/10, 7/8,   10/10, 8/8, //0
								9/10,  7/8,   10/10, 8/8,    9/10, 8/8,
								0/10,  7/8,    1/10, 7/8,    1/10, 8/8, //1
								0/10,  7/8,    1/10, 8/8,    0/10, 8/8,
								1/10,  7/8,    2/10, 7/8,    2/10, 8/8, //2
								1/10,  7/8,    2/10, 8/8,    1/10, 8/8,
								2/10,  7/8,    3/10, 7/8,    3/10, 8/8, //3
								2/10,  7/8,    3/10, 8/8,    2/10, 8/8,
								3/10,  7/8,    4/10, 7/8,    4/10, 8/8, //4
								3/10,  7/8,    4/10, 8/8,    3/10, 8/8,
								4/10,  7/8,    5/10, 7/8,    5/10, 8/8, //5
								4/10,  7/8,    5/10, 8/8,    4/10, 8/8,
								5/10,  7/8,    6/10, 7/8,    6/10, 8/8, //6
								5/10,  7/8,    6/10, 8/8,    5/10, 8/8,
								6/10,  7/8,    7/10, 7/8,    7/10, 8/8, //7
								6/10,  7/8,    7/10, 8/8,    6/10, 8/8,
								7/10,  7/8,    8/10, 7/8,    8/10, 8/8, //8
								7/10,  7/8,    8/10, 8/8,    7/10, 8/8,
								8/10,  7/8,    9/10, 7/8,    9/10, 8/8, //9
								8/10,  7/8,    9/10, 8/8,    8/10, 8/8,
								8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
								8/10,  6/8,    9/10, 7/8,    8/10, 7/8, ];

function ScoreUI(gl)
{
	this.vertices=[	-2.0*0.8, -0.5, 0,   -1.0*0.8, -0.5, 0,   -1.0*0.8,  0.5, 0,
	                -2.0*0.8, -0.5, 0,   -1.0*0.8,  0.5, 0,   -2.0*0.8,  0.5, 0,
					-1.0*0.8, -0.5, 0,    0.0*0.8, -0.5, 0,    0.0*0.8,  0.5, 0,
	                -1.0*0.8, -0.5, 0,    0.0*0.8,  0.5, 0,   -1.0*0.8,  0.5, 0,
					 0.0*0.8, -0.5, 0,    1.0*0.8, -0.5, 0,    1.0*0.8,  0.5, 0,
	                 0.0*0.8, -0.5, 0,    1.0*0.8,  0.5, 0,    0.0*0.8,  0.5, 0,
					 1.0*0.8, -0.5, 0,    2.0*0.8, -0.5, 0,    2.0*0.8,  0.5, 0,
	                 1.0*0.8, -0.5, 0,    2.0*0.8,  0.5, 0,    1.0*0.8,  0.5, 0, ];
	
	this.colors=[	1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 0.2,    1.0, 1.0, 0.2,    1.0, 1.0, 0.2,
					1.0, 1.0, 0.2,    1.0, 1.0, 0.2,    1.0, 1.0, 0.2,
					1.0, 1.0, 0.2,    1.0, 1.0, 0.2,    1.0, 1.0, 0.2,
					1.0, 1.0, 0.2,    1.0, 1.0, 0.2,    1.0, 1.0, 0.2,
					1.0, 1.0, 0.2,    1.0, 1.0, 0.2,    1.0, 1.0, 0.2,
					1.0, 1.0, 0.2,    1.0, 1.0, 0.2,    1.0, 1.0, 0.2, ];
				 
	this.UVMap =[   8/10,  4/8,   10/10, 4/8,   10/10, 6/8,
					8/10,  4/8,   10/10, 6/8,    8/10, 6/8,
					9/10,  7/8,   10/10, 7/8,   10/10, 8/8,
					9/10,  7/8,   10/10, 8/8,    9/10, 8/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8,
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8,
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8,
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8, ];
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	//Loading the vertex information into the vertex buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

		
	//Loading the color information into the color buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );

		
	//Loading the object index information into the texture coordinate buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	
	this.SetNumber = function(value)
	{
		var num = value > 999 ? 999 : value < 0 ? 0 : Math.floor(value);
		var N = [36, 24, 12];
		var D = num.toString().length;

		for(var i=0; i<D; i++)
		{
			for(var j=0; j<12; j++)
			{
				this.UVMap[N[(3-D)+i]+j] = textTextureCoordinates[(num%10)*12 + j];
			}
			num=Math.floor(num/10);
		}
		
		for(var i=0; i<3-D; i++)
		{
			for(var j=0; j<12; j++)
			{
				this.UVMap[N[i]+j] = textTextureCoordinates[10*12 + j];
			}
		}
		
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	}
}

function SliceUI(gl)
{
	this.vertices=[	-2.0*0.8, -0.5, 0,    2.0*0.8, -0.5, 0,    2.0*0.8,  0.5, 0,
	                -2.0*0.8, -0.5, 0,    2.0*0.8,  0.5, 0,   -2.0*0.8,  0.5, 0 ];
	
	this.colors=[	1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0 ];
				 
	this.UVMap =[   4/10,  5/8,    8/10, 5/8,    8/10, 6/8,
					4/10,  5/8,    8/10, 6/8,    4/10, 6/8 ];
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	//Loading the vertex information into the vertex buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

		
	//Loading the color information into the color buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );

		
	//Loading the object index information into the texture coordinate buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
}

function GameOverUI(gl)
{
	this.vertices=[	-4.0*0.8, -0.5, 0,    4.0*0.8, -0.5, 0,    4.0*0.8,  0.5, 0,
	                -4.0*0.8, -0.5, 0,    4.0*0.8,  0.5, 0,   -4.0*0.8,  0.5, 0 ];
	
	this.colors=[	1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0 ];
				 
	this.UVMap =[   0/10,  4/8,    8/10, 4/8,    8/10, 5/8,
					0/10,  4/8,    8/10, 5/8,    0/10, 5/8 ];
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	//Loading the vertex information into the vertex buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

		
	//Loading the color information into the color buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );

		
	//Loading the object index information into the texture coordinate buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
}


function BestUI(gl)
{
	this.vertices=[	-3.5*0.8, -0.5, 0,    0.5*0.8, -0.5, 0,    0.5*0.8,  0.5, 0,
	                -3.5*0.8, -0.5, 0,    0.5*0.8,  0.5, 0,   -3.5*0.8,  0.5, 0,
					 0.5*0.8, -0.5, 0,    1.5*0.8, -0.5, 0,    1.5*0.8,  0.5, 0,
	                 0.5*0.8, -0.5, 0,    1.5*0.8,  0.5, 0,    0.5*0.8,  0.5, 0,
					 1.5*0.8, -0.5, 0,    2.5*0.8, -0.5, 0,    2.5*0.8,  0.5, 0,
	                 1.5*0.8, -0.5, 0,    2.5*0.8,  0.5, 0,    1.5*0.8,  0.5, 0,
					 2.5*0.8, -0.5, 0,    3.5*0.8, -0.5, 0,    3.5*0.8,  0.5, 0,
	                 2.5*0.8, -0.5, 0,    3.5*0.8,  0.5, 0,    2.5*0.8,  0.5, 0 ];
	
	this.colors=[	1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0 ];
				 
	this.UVMap =[   0/10,  6/8,    4/10, 6/8,    4/10, 7/8, //Best:
					0/10,  6/8,    4/10, 7/8,    0/10, 7/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8, ];
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	//Loading the vertex information into the vertex buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

		
	//Loading the color information into the color buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );

		
	//Loading the object index information into the texture coordinate buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	
	this.SetNumber = function(value)
	{
		var num = value > 999 ? 999 : value < 0 ? 0 : Math.floor(value);
		var N = [36, 24, 12];
		var D = num.toString().length;

		for(var i=0; i<D; i++)
		{
			for(var j=0; j<12; j++)
			{
				this.UVMap[N[(3-D)+i]+j] = textTextureCoordinates[(num%10)*12 + j];
			}
			num=Math.floor(num/10);
		}
		
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	}
}


function HitsUI(gl)
{
	this.vertices=[	-3.0*0.8,  0.0, 0,   -2.0*0.8,  0.0, 0,   -2.0*0.8,  1.0, 0,
	                -3.0*0.8,  0.0, 0,   -2.0*0.8,  1.0, 0,   -3.0*0.8,  1.0, 0,
					-2.0*0.8,  0.0, 0,   -1.0*0.8,  0.0, 0,   -1.0*0.8,  1.0, 0,
	                -2.0*0.8,  0.0, 0,   -1.0*0.8,  1.0, 0,   -2.0*0.8,  1.0, 0,
					-1.0*0.8,  0.0, 0,    0.0*0.8,  0.0, 0,    0.0*0.8,  1.0, 0,
	                -1.0*0.8,  0.0, 0,    0.0*0.8,  1.0, 0,   -1.0*0.8,  1.0, 0,
					 0.0*0.8,  0.0, 0,    3.0*0.8,  0.0, 0,    3.0*0.8,  1.0, 0,
	                 0.0*0.8,  0.0, 0,    3.0*0.8,  1.0, 0,    0.0*0.8,  1.0, 0,
					-2.0*0.8, -1.0, 0,   -1.0*0.8, -1.0, 0,   -1.0*0.8,  0.0, 0,
	                -2.0*0.8, -1.0, 0,   -1.0*0.8,  0.0, 0,   -2.0*0.8,  0.0, 0,
					-1.0*0.8, -1.0, 0,    0.0*0.8, -1.0, 0,    0.0*0.8,  0.0, 0,
	                -1.0*0.8, -1.0, 0,    0.0*0.8,  0.0, 0,   -1.0*0.8,  0.0, 0,
					 0.0*0.8, -1.0, 0,    1.0*0.8, -1.0, 0,    1.0*0.8,  0.0, 0,
	                 0.0*0.8, -1.0, 0,    1.0*0.8,  0.0, 0,    0.0*0.8,  0.0, 0,
					 1.0*0.8, -1.0, 0,    2.0*0.8, -1.0, 0,    2.0*0.8,  0.0, 0,
	                 1.0*0.8, -1.0, 0,    2.0*0.8,  0.0, 0,    1.0*0.8,  0.0, 0 
					 ];
	
	this.colors=[	1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0 ];
				 
	this.UVMap =[   8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					9/10,  7/8,   10/10, 7/8,   10/10, 8/8, //0
					9/10,  7/8,   10/10, 8/8,    9/10, 8/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					0/10,  3/8,    3/10, 3/8,    3/10, 4/8, //Hits
					0/10,  3/8,    3/10, 4/8,    0/10, 4/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					9/10,  6/8,   10/10, 6/8,   10/10, 7/8, //+
					9/10,  6/8,   10/10, 7/8,    9/10, 7/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					9/10,  7/8,   10/10, 7/8,   10/10, 8/8, //0
					9/10,  7/8,   10/10, 8/8,    9/10, 8/8,
					];
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	//Loading the vertex information into the vertex buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

		
	//Loading the color information into the color buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );

		
	//Loading the object index information into the texture coordinate buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	
	this.SetNumber = function(value)
	{
		var num = value > 99 ? 99 : value < 0 ? 0 : Math.floor(value);
		var upN1 = 0;
		var upN0 = 12;
		var dnN1 = 72;
		var dnN0 = 84;

		for(var i = 0 ; i < 12; i++)
		{	this.UVMap[upN0+i] = textTextureCoordinates[(num%10)*12 + i];
			this.UVMap[dnN0+i] = textTextureCoordinates[(num%10)*12 + i];
		}	num=Math.floor(num/10);

		for(var i = 0 ; i < 12; i++)
		{	this.UVMap[upN1+i] = textTextureCoordinates[(num%10)*12 + i];
			this.UVMap[dnN1+i] = textTextureCoordinates[num == 0 ? 120 : (num%10)*12 + i];
		}	num=Math.floor(num/10);
		
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	}
}

function ComboUI(gl)
{
	this.vertices=[	-3.0*0.8,  0.5, 0,   -2.0*0.8,  0.5, 0,   -2.0*0.8,  1.5, 0,
					-3.0*0.8,  0.5, 0,   -2.0*0.8,  1.5, 0,   -3.0*0.8,  1.5, 0,
					-2.0*0.8,  0.5, 0,   -1.0*0.8,  0.5, 0,   -1.0*0.8,  1.5, 0,
					-2.0*0.8,  0.5, 0,   -1.0*0.8,  1.5, 0,   -2.0*0.8,  1.5, 0,
					-1.0*0.8,  0.5, 0,    3.0*0.8,  0.5, 0,    3.0*0.8,  1.5, 0,
					-1.0*0.8,  0.5, 0,    3.0*0.8,  1.5, 0,   -1.0*0.8,  1.5, 0,
					-2.0*0.8, -0.5, 0,    2.0*0.8, -0.5, 0,    2.0*0.8,  0.5, 0,
					-2.0*0.8, -0.5, 0,    2.0*0.8,  0.5, 0,   -2.0*0.8,  0.5, 0,
					-2.0*0.8, -1.5, 0,   -1.0*0.8, -1.5, 0,   -1.0*0.8, -0.5, 0,
					-2.0*0.8, -1.5, 0,   -1.0*0.8, -0.5, 0,   -2.0*0.8, -0.5, 0,
					-1.0*0.8, -1.5, 0,    0.0*0.8, -1.5, 0,    0.0*0.8, -0.5, 0,
					-1.0*0.8, -1.5, 0,    0.0*0.8, -0.5, 0,   -1.0*0.8, -0.5, 0,
					 0.0*0.8, -1.5, 0,    1.0*0.8, -1.5, 0,    1.0*0.8, -0.5, 0,
					 0.0*0.8, -1.5, 0,    1.0*0.8, -0.5, 0,    0.0*0.8, -0.5, 0
					 ];
	
	this.colors=[	1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,    1.0, 1.0, 1.0,    1.0, 1.0, 1.0 ];
				 
	this.UVMap =[   8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					9/10,  7/8,   10/10, 7/8,   10/10, 8/8, //0
					9/10,  7/8,   10/10, 8/8,    9/10, 8/8,
					4/10,  6/8,    8/10, 6/8,    8/10, 7/8, //Fruit
					4/10,  6/8,    8/10, 7/8,    4/10, 7/8,
					0/10,  5/8,    4/10, 5/8,    4/10, 6/8, //Combo
					0/10,  5/8,    4/10, 6/8,    0/10, 6/8,
					9/10,  6/8,   10/10, 6/8,   10/10, 7/8, //+
					9/10,  6/8,   10/10, 7/8,    9/10, 7/8,
					8/10,  6/8,    9/10, 6/8,    9/10, 7/8, //_
					8/10,  6/8,    9/10, 7/8,    8/10, 7/8,
					9/10,  7/8,   10/10, 7/8,   10/10, 8/8, //0
					9/10,  7/8,   10/10, 8/8,    9/10, 8/8,
					];
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	//Loading the vertex information into the vertex buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

		
	//Loading the color information into the color buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW );

		
	//Loading the object index information into the texture coordinate buffer
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	
	this.SetNumber = function(value)
	{
		var num = value > 99 ? 99 : value < 0 ? 0 : Math.floor(value);
		var upN1 = 0;
		var upN0 = 12;
		var dnN1 = 60;
		var dnN0 = 72;

		for(var i = 0 ; i < 12; i++)
		{	this.UVMap[upN0+i] = textTextureCoordinates[(num%10)*12 + i];
			this.UVMap[dnN0+i] = textTextureCoordinates[(num%10)*12 + i];
		}	num=Math.floor(num/10);
		
		for(var i = 0 ; i < 12; i++)
		{	this.UVMap[upN1+i] = textTextureCoordinates[num == 0 ? 120 : (num%10)*12 + i];
			this.UVMap[dnN1+i] = textTextureCoordinates[num == 0 ? 120 : (num%10)*12 + i];
		}	num=Math.floor(num/10);
		
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	}
}

function HealthUI(gl)
{
	this.vertices=[	-1, -1,  0,    1, -1,  0,    1,  1,  0,
					-1, -1,  0,    1,  1,  0,   -1,  1,  0, ];
	
	this.colors=[	 1,  1,  1,    1,  1,  1,    1,  1,  1,
					 1,  1,  1,    1,  1,  1,    1,  1,  1, ];
				 
	this.UVMap =[   8/10,  2/8,   10/10, 2/8,   10/10, 4/8,
					8/10,  2/8,   10/10, 4/8,    8/10, 4/8 ];
	
	this.Normals = CalculateNormals(this.vertices);
	
	this.vertexBuff =  gl.createBuffer(),	//Buffer for loading vertexes into the shader
	this.colorBuff  =  gl.createBuffer(),	//Buffer for loading colors into the shader
	this.normalBuff =  gl.createBuffer(),	//Buffer for loading normals into the shader
	this.texCorBuff =  gl.createBuffer(),	//Buffer for loading object indexes into the shader
	
	this.SetHealth = function(opt)
	{
		if(opt)
		{
			this.UVMap =[   8/10,  2/8,   10/10, 2/8,   10/10, 4/8,
							8/10,  2/8,   10/10, 4/8,    8/10, 4/8 ];
		}
		else
		{
			this.UVMap =[   8/10,  0/8,   10/10, 0/8,   10/10, 2/8,
							8/10,  0/8,   10/10, 2/8,    8/10, 2/8 ];
		}
		
		//Loading the object index information into the texture coordinate buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCorBuff );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.UVMap), gl.STATIC_DRAW );
	}
	
	this.refresh = function()
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
	
	this.refresh();
}