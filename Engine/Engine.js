var deltaTime = 0;

function Engine()
{	
	this.mousePosX   = 0,		//Current mouse position on the X axis
	this.mousePosY   = 0,		//Current mouse position on the Y axis
	this.mouseDeltaX = 0,		//Mouse position change on the X axis
	this.mouseDeltaY = 0,		//Mouse position change on the Y axis
	this.mouse       = [0,0,0],	//Held down state of the mouse buttons
	this.mouseDown   = [0,0,0],	//Pressed state of the mouse buttons
	this.mouseUp     = [0,0,0],	//Released state of the mouse buttons
	
	this.canvas  = 0,		//Reference to the canvas WebGL renders to
	this.program = 0,		//Reference to the shader program used
	this.webGL   = 0,		//Reference to the WebGL context
	this.FPSCap  = 60,		//Maximum FPS allowed during rendering
	this.cutDist = 0.2,		//Extra distance of obejct outside of clip space 
	
	this.lightAmbient  = new Color(1.0, 1.0, 1.0, 1.0),
	this.lightDiffuse  = new Color(1.0, 1.0, 1.0, 1.0),
	this.lightSpecular = new Color(1.0, 1.0, 1.0, 1.0),
	this.lightPosition = new Vector3(0.0, 0.0, 0.0),
	
	
	this.vertexAttrib= 0,	//Location of the vertex attribute in the shader
	this.colorAttrib=  0,	//Location of the color attribute in the shader
	this.normalAttrib= 0,	//Location of the normals attribute in the shader
	this.tCoordAttrib= 0,	//Location of the texture coordinate attribute in the shader
	
	this.textures = [],		//List of textures loaded into the engine
	this.audios   = [],		//List of audios loaded into the engine
	
	this.texedUniform     = 0,	//Location of the object's textured state in the shader
	this.typeUniform      = 0,	//Location of the object's type in the shader
	this.ambientUniform   = 0,	//Location of the ambient product in the shader
	this.diffuseUniform   = 0,	//Location of the diffuse product in the shader
	this.specularUniform  = 0,	//Location of the specular product in the shader
	this.shininessUniform = 0,	//Location of the shininess factor in the shader
	
	this.lightUniform     = 0,	//Location of the light position in the shader
	
	this.pivotUniform= 0,	//temp
	this.loCamUniform= 0,	//Location of the camera's local transform matrix uniform in the shader
	this.woCamUniform= 0,	//Location of the camera's world transform matrix uniform in the shader
	this.loParUniform= 0,	//Location of the objects' parent's local transform matrix uniform in the shader
	this.woParUniform= 0,	//Location of the objects' parent's world transform matrix uniform in the shader
	this.loMatUniform= 0,	//Location of the objects' local transform matrix uniform in the shader
	this.woMatUniform= 0,	//Location of the objects' world transform matrix uniform in the shader
	this.projUniform=  0,	//Location of the camera's projection matrix uniform in the shader
	
	this.time=      0,		//Time when the current frame started drawing in milliseconds
	this.deltaTime= 0,		//Time between the current and last frame in seconds
	this.timeScale= 1,		//Scale of the time passed. Used for slow or fast motion
	
	this.objects    = [],	//List of objects handled by the engine
	this.interfaces = [],	//List of objects handled by the engine
	this.scripts    = [],	//List of scripts attached to the engine
	
	this.skybox= new GraphicsObject(this),	//Skybox object
	this.camera= new Camera(this),			//Camera settings used by the engine and the shaders to render
	
	
	this.visible= function(obj, t)
	{	var En = this;
	
		var localObject = obj.transform.localMatrix.CombineV4( [0,0,0,1]   );
		var worldObject = obj.transform.worldMatrix.CombineV4( localObject );
		var localCamera = En.camera.transform.localMatrix.CombineV4( worldObject );
		var worldCamera = En.camera.transform.worldMatrix.CombineV4( localCamera );
		var projection  = En.camera.perspMatrix.CombineV4( worldCamera );
		var normalized  = [ projection[0]/projection[3], projection[1]/projection[3], projection[2]/projection[3] ];
		
		return (normalized[0] > -(1+t) && normalized[0] < (1+t) && normalized[1] > -(1+t) && normalized[1] < (1+t) &&normalized[2] > -(1+t) && normalized[2] < (1+t));
	},
	
	this.LoadAudio= function(audioID)
	{	var En = this;
		var audio = new Audio();
		audio.src=audioID;
		En.audios.push(audio);
	},
	
	this.PlayAudio= function(index)
	{	this.audios[index].load();
		this.audios[index].play();
	},
	
	this.SetVolume= function(index, volume)
	{	this.audios[index].volume=volume;
	},
	
	this.LoadTexture= function(texID)
	{	var En = this;
		var tex = En.webGL.createTexture();
		En.textures.push(tex);
		
		var img = new Image;
		img.onload = function(){
			En.webGL.bindTexture    ( En.webGL.TEXTURE_2D, tex );
			En.webGL.pixelStorei    ( En.webGL.UNPACK_FLIP_Y_WEBGL, true);
			En.webGL.pixelStorei    ( En.webGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			En.webGL.texImage2D     ( En.webGL.TEXTURE_2D, 0, En.webGL.RGBA, En.webGL.RGBA, En.webGL.UNSIGNED_BYTE, img );
			En.webGL.generateMipmap ( En.webGL.TEXTURE_2D );
			En.webGL.texParameteri  ( En.webGL.TEXTURE_2D, En.webGL.TEXTURE_MIN_FILTER, En.webGL.LINEAR_MIPMAP_LINEAR );
			En.webGL.texParameteri  ( En.webGL.TEXTURE_2D, En.webGL.TEXTURE_MAG_FILTER, En.webGL.LINEAR );
		}
			
		img.src = texID;
	},
	
	this.Start= function()
	{	var En = this;
		
		//Getting the Canvas and WebGL references
		En.canvas = document.getElementById( "Canvas" );
		En.webGL = WebGLUtils.setupWebGL( En.canvas );
		if ( !En.webGL ) { alert( "WebGL isn't available" ); }
		
		//Setup the default state of the canvas
		En.webGL.viewport( 0, 0, En.canvas.width, En.canvas.height );
		En.webGL.clearColor( 0.411, 0.384, 0.372, 1 );
		En.webGL.colorMask(true, true, true, false);
		En.canvas.getContext("webgl", {alpha:false});
		
		//Load Shaders specified in the html file
		En.program = initShaders( En.webGL, "vertexShader", "fragmentShader" );
		En.webGL.useProgram( En.program );
		
		En.canvas.onmousemove = function(evt)
		{
			//console.out("hi");
			var rect = En.canvas.getBoundingClientRect();
			//console.log(evt.clientX);
			if(rect.x==undefined)
			{
				var X= (evt.clientX-rect.left)/(rect.width/2)-1;
				var Y= (evt.clientY-rect.top)/(-rect.height/2)+1;
			}
			else
			{
				var X= (evt.clientX-rect.x)/(rect.width/2)-1;
				var Y= (evt.clientY-rect.y)/(-rect.height/2)+1;
			}
			En.mouseDeltaX= X-En.mousePosX; 
			En.mouseDeltaY= Y-En.mousePosY; 
			En.mousePosX = X;
			En.mousePosY = Y;
			//console.log(En.mouseDeltaX);
		};
		
		En.canvas.onmousedown = function(evt)
		{
			En.mouseDown [evt.button] = true;
			En.mouse     [evt.button] = true;
		};
		
		En.canvas.onmouseup = function(evt)
		{
			En.mouseUp [evt.button] = true;
			En.mouse   [evt.button] = false;
		};
		
		//Locate Vertex Shader attribute locations
		En.vertexAttrib  = En.webGL.getAttribLocation( En.program, "veCoords" );
		En.colorAttrib   = En.webGL.getAttribLocation( En.program, "veColors" );
		En.normalAttrib  = En.webGL.getAttribLocation( En.program, "veNormal" );
		En.texCorAttrib  = En.webGL.getAttribLocation( En.program, "veTexCor" );
		
		//Locate Vertex Shader uniform locations
		En.texedUniform     = En.webGL.getUniformLocation( En.program, "textured"  );
		En.typeUniform      = En.webGL.getUniformLocation( En.program, "type"      );
		En.ambientUniform   = En.webGL.getUniformLocation( En.program, "ambient"   );
		En.diffuseUniform   = En.webGL.getUniformLocation( En.program, "diffuse"   );
		En.specularUniform  = En.webGL.getUniformLocation( En.program, "specular"  );
		En.shininessUniform = En.webGL.getUniformLocation( En.program, "shininess" );
		En.lightUniform     = En.webGL.getUniformLocation( En.program, "lightPosition" );
		
		En.pivotUniform  = En.webGL.getUniformLocation( En.program, "pivotTransf");
		En.loCamUniform  = En.webGL.getUniformLocation( En.program, "localCamera");
		En.woCamUniform  = En.webGL.getUniformLocation( En.program, "worldCamera");
		En.loParUniform  = En.webGL.getUniformLocation( En.program, "localParent");
		En.woParUniform  = En.webGL.getUniformLocation( En.program, "worldParent");
		En.loMatUniform  = En.webGL.getUniformLocation( En.program, "localTransf");
		En.woMatUniform  = En.webGL.getUniformLocation( En.program, "worldTransf");
		En.projUniform   = En.webGL.getUniformLocation( En.program, "projection" );
		
		//Setting the camera to be used
		En.camera.SetProjection();
		En.camera.Instantiate();
	
		//Configure Skybox
		En.skybox.name = "SkyBox";
		En.skybox.depth = false;
		En.skybox.noHide = true;
		En.skybox.mesh = new SkyBox(En.webGL);
		En.skybox.material.color=Color.white;
		En.skybox.material.textured=0;
		En.skybox.rigidbody.verDrag=0;
		En.skybox.scripts.push(new SkyBehaviour(En.objects[0]));
		En.skybox.transform.LocalTranslate( new Vector3(0,0,0) );
		En.skybox.transform.LocalScale( new Vector3(8,8,8) );
		En.skybox.Instantiate(En);
		
		//Setting the starting time
		En.time = new Date().getTime();
		
		//Enable hiding backward facing polygons
		En.webGL.enable(En.webGL.CULL_FACE);
		//Enable hiding parts of polygons based on depth
		En.webGL.enable(En.webGL.DEPTH_TEST);
		//Enable transparency of polygons
		En.webGL.enable(En.webGL.BLEND);
		En.webGL.blendFunc(En.webGL.SRC_ALPHA, En.webGL.ONE_MINUS_SRC_ALPHA);
		//Start rendering the scene
		setInterval(En.Render, 1000/En.FPSCap);
	},
	
	this.Load= function(obj)
	{	var En = this;
	
		//Putting the vertex buffer into the shader
		En.webGL.bindBuffer( En.webGL.ARRAY_BUFFER, obj.mesh.vertexBuff );
		En.webGL.vertexAttribPointer(En.vertexAttrib, 3, En.webGL.FLOAT, 0, 0, 0);
		En.webGL.enableVertexAttribArray( En.vertexAttrib );
		
		//Putting the color buffer into the shader
		En.webGL.bindBuffer( En.webGL.ARRAY_BUFFER, obj.mesh.colorBuff );
		En.webGL.vertexAttribPointer(En.colorAttrib, 3, En.webGL.FLOAT, 0, 0, 0);
		En.webGL.enableVertexAttribArray( En.colorAttrib );
		
		//Putting the normals buffer into the shader
		En.webGL.bindBuffer( En.webGL.ARRAY_BUFFER, obj.type == 0 ? obj.mesh.normalBuff : obj.mesh.vertexBuff);
		En.webGL.vertexAttribPointer(En.normalAttrib, 3, En.webGL.FLOAT, 0, 0, 0);
		En.webGL.enableVertexAttribArray( En.normalAttrib );
		
		//Putting the texture coordinate buffer into the shader
		En.webGL.bindBuffer( En.webGL.ARRAY_BUFFER, obj.mesh.texCorBuff );
		En.webGL.vertexAttribPointer(En.texCorAttrib, 2, En.webGL.FLOAT, 0, 0, 0);
		En.webGL.enableVertexAttribArray( En.texCorAttrib );
		
		//Setting Uniforms
		En.webGL.uniformMatrix4fv (En.projUniform , false, new Float32Array(obj.type == 0 ? En.camera.perspMatrix.m : En.camera.orthoMatrix.m));
		En.webGL.uniformMatrix4fv (En.loParUniform, false, new Float32Array(obj.parent!=0 ? obj.parent.transform.localMatrix.m : new Matrix4().m));
		En.webGL.uniformMatrix4fv (En.woParUniform, false, new Float32Array(obj.parent!=0 ? obj.parent.transform.worldMatrix.m : new Matrix4().m));
		En.webGL.uniformMatrix4fv (En.pivotUniform, false, new Float32Array(obj.transform.pivotMatrix.m));
		En.webGL.uniformMatrix4fv (En.loMatUniform, false, new Float32Array(obj.transform.localMatrix.m));
		En.webGL.uniformMatrix4fv (En.woMatUniform, false, new Float32Array(obj.transform.worldMatrix.m));
		

		var ambient  = Color.Mul ( Color.Mul(En.lightAmbient,  obj.material.ambient),  obj.material.color);
		var diffuse  = Color.Mul ( Color.Mul(En.lightDiffuse,  obj.material.diffuse),  obj.material.color);
		var specular = Color.Mul (En.lightSpecular, obj.material.specular);
		
		En.webGL.uniform4fv (En.ambientUniform,  new Float32Array([ambient.r,  ambient.g,  ambient.b,  ambient.a]));
		En.webGL.uniform4fv (En.diffuseUniform,  new Float32Array([diffuse.r,  diffuse.g,  diffuse.b,  diffuse.a]));
		En.webGL.uniform4fv (En.specularUniform, new Float32Array([specular.r, specular.g, specular.b, specular.a]));
		En.webGL.uniform4fv (En.lightUniform,    new Float32Array([En.lightPosition.x, En.lightPosition.y, En.lightPosition.z, 1]));
		En.webGL.uniform1f  (En.shininessUniform, obj.material.shininess);
		En.webGL.uniform1f  (En.texedUniform, obj.material.textured);
		En.webGL.uniform1f  (En.typeUniform,  obj.type);
		
		
		//Loading Textures
		if(obj.material.textured >= 0.0)
		{	En.webGL.uniform1i     (En.webGL.getUniformLocation(En.program, "texture"), 0);
			En.webGL.activeTexture (En.webGL.TEXTURE0);
			En.webGL.bindTexture   (En.webGL.TEXTURE_2D, En.textures[obj.material.textured]);
		}
	},
	
	this.Render= function()
	{	var En = Framework;
	
		//Calculating the delta time between frames and setting the new time
		En.deltaTime = ((new Date().getTime() - En.time) /1000)* En.timeScale;
		deltaTime=En.deltaTime;
		En.time = new Date().getTime();
		
		En.webGL.clear( En.webGL.COLOR_BUFFER_BIT | En.webGL.DEPTH_BUFFER_BIT );
		
		//Applying the camera projection
		En.webGL.uniformMatrix4fv(En.loCamUniform, false, new Float32Array(En.camera.transform.localMatrix.m));
		En.webGL.uniformMatrix4fv(En.woCamUniform, false, new Float32Array(En.camera.transform.worldMatrix.m));
		
		//Simulating Physics on objects
		for(i=0; i< En.objects.length; i++)
		{	En.objects[i].transform.WorldTranslate(	new Vector3(En.objects[i].rigidbody.force.x * En.deltaTime, En.objects[i].rigidbody.force.y * En.deltaTime, En.objects[i].rigidbody.force.z * En.deltaTime));
			En.objects[i].rigidbody.UpdateForce(En.deltaTime);
		}
		
		//Updating Object Logic
		for(i=0; i< En.objects.length; i++)
		{	if(En.objects[i].enabled)
			{	En.objects[i].Update();
		}	}
		
		//Updating Engine Scripts
		for(i=0; i< En.scripts.length; i++)
		{	En.scripts[i].Update();
		}
		
		//Loading buffer data into the shaders for transparent objects
		for(var i=0; i<En.objects.length; i++)
		{	
			if(En.objects[i].enabled && En.objects[i].mesh.vertices.length>3 && !En.objects[i].depth)
			{	En.Load(En.objects[i]);
				En.webGL.depthMask(En.objects[i].depth);
				if (En.objects[i].noHide || En.objects[i].type== 1 || En.visible(En.objects[i], En.cutDist))
				{
					//console.log(En.objects[i].name);
					En.webGL.drawArrays( En.webGL.TRIANGLES, 0, En.objects[i].mesh.vertices.length/3);
				}
			}
		}
		
		//Loading buffer data into the shaders for solid objects
		for(var i=0; i<En.objects.length; i++)
		{	
			if(En.objects[i].enabled && En.objects[i].mesh.vertices.length>3 && En.objects[i].depth && En.objects[i].type == 0)
			{	En.Load(En.objects[i]);
				En.webGL.depthMask(En.objects[i].depth);
				if (En.objects[i].noHide || En.objects[i].type > 0 || En.visible(En.objects[i], En.cutDist))
				{
					//console.log(En.objects[i].name);
					En.webGL.drawArrays( En.webGL.TRIANGLES, 0, En.objects[i].mesh.vertices.length/3);
				}
			}
		}
		
		//Loading buffer data into the shaders for UI objects
		for(var i=0; i<En.objects.length; i++)
		{	
			if(En.objects[i].enabled && En.objects[i].mesh.vertices.length>3 && !En.objects[i].depth && En.objects[i].type == 2)
			{	En.Load(En.objects[i]);
				En.webGL.depthMask(En.objects[i].depth);
				if (En.objects[i].noHide || En.objects[i].type > 0 || En.visible(En.objects[i], En.cutDist))
				{
					//console.log(En.objects[i].name);
					En.webGL.drawArrays( En.webGL.TRIANGLES, 0, En.objects[i].mesh.vertices.length/3);
				}
			}
		}
		
		//Loading buffer data into the shaders for UI objects
		for(var i=0; i<En.objects.length; i++)
		{	
			if(En.objects[i].enabled && En.objects[i].mesh.vertices.length>3 && !En.objects[i].depth && En.objects[i].type == 3)
			{	En.Load(En.objects[i]);
				En.webGL.depthMask(En.objects[i].depth);
				if (En.objects[i].noHide || En.objects[i].type > 0 || En.visible(En.objects[i], En.cutDist))
				{
					//console.log(En.objects[i].name);
					En.webGL.drawArrays( En.webGL.TRIANGLES, 0, En.objects[i].mesh.vertices.length/3);
				}
			}
		}
		
		En.mouseDown = [false,false,false];
		En.mouseUp   = [false,false,false];
	}
}