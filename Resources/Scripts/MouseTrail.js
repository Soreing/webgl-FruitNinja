
//Data type describing past mouse points
function CurvePoint(pos, time, dir, orig)
{
	this.position   = pos,
	this.timestamp  = time,
	this.wDirection = dir,
	this.isOrigin   = orig
}
var colorss = [Color.red,Color.orange,Color.green,Color.blue,Color.cyan,	Color.magenta,Color.yellow];

//Mouse Trail behaviour
function MouseTrail(eng, alive, min, max, prob, tex, size)
{
	this.object = 0;
	this.engine = eng;
	
	this.points       =  [];
	this.aliveTime    =  alive;
	this.minWidth     =  min;
	this.maxWidth     =  max;
	this.particleProb =  prob;
	this.particleTex  =  tex;
	this.particleSize =  size;
		
	this.Start= function()
	{
		
	}
	
	this.Update = function()
	{	
		var scr      = this;	//Script reference
		var validPts = []; 	    //Array that will hold only timely mouse points
		
		//Copy mouse points with age that do not exceed the maximum alive time
		for(var i = 0; i < scr.points.length; i++)
		{	if( scr.engine.time - scr.points[i].timestamp < scr.aliveTime )
			{	validPts.push(scr.points[i]);
		}	}
		scr.points = validPts;
	
		//If the mouse is held down, add the current position to the points array
		//The position is accurate in the orthographic camera view, located at Z=0
		if(scr.engine.mouse[0])
		{	
			var position = new Vector3(  scr.engine.mousePosX * scr.engine.camera.right,   scr.engine.mousePosY * scr.engine.camera.up,   0);
			
			if(scr.points.length == 0 || Vector3.Distance(position, scr.points[scr.points.length-1].position) >scr.maxWidth)
				scr.points.push( new CurvePoint(position,  scr.engine.time,  new Vector3(0,0,0),  scr.engine.mouseDown[0] ) );
			
			if( scr.engine.mouseDeltaX != 0 && scr.engine.mouseDeltaY != 0 && scr.engine.deltaTime != 0 && (scr.engine.mouseDeltaX*scr.engine.mouseDeltaX +scr.engine.mouseDeltaY*scr.engine.mouseDeltaY)/scr.engine.deltaTime >7)
			{
				if (scr.engine.audios[1].ended) scr.engine.PlayAudio(1);
			}
			
			//Attempting to spawn a particle
			if( Math.random() < scr.particleProb * scr.engine.deltaTime )
			{
				//Create a new particle
				var newParticle = new GraphicsObject(Framework);
				//Setting basic object details
				newParticle.name="Particle";
				newParticle.depth = false;
				newParticle.type = 1;
				//Configuring the look of the object
				newParticle.mesh = new Pane(Framework.webGL);
				newParticle.material.color     = Color.white;
				newParticle.material.ambient   = new Color(1.0,1.0,1.0,1.0);
				newParticle.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
				newParticle.material.specular  = new Color(0.0,0.0,0.0,1.0);
				newParticle.material.shininess = 50;
				newParticle.material.textured  = scr.particleTex;
				//Configuringthe physics behaviour ofthe object
				newParticle.rigidbody.verDrag=0;
				newParticle.rigidbody.horDrag=0;
				newParticle.rigidbody.AddForce(Vector3.Normalize(new Vector3(-scr.engine.mouseDeltaX,-scr.engine.mouseDeltaY,0)), 3);
				//Transforming the object
				newParticle.transform.LocalRotate( new Vector3(0,0,0) );
				newParticle.transform.LocalScale( new Vector3(scr.particleSize, scr.particleSize, scr.particleSize) );
				newParticle.transform.WorldTranslate( new Vector3(scr.points[scr.points.length-1].position.x, scr.points[scr.points.length-1].position.y, 0) );
				//Attach Object Behaviour
				newParticle.scripts.push( new ShrinkDisappear(Framework, 0.2, 0.2) );
				//Instantiating the object in the engine
				newParticle.Instantiate();
			}
		}
		
		//Specifying width direction and magnitude
		for(var i = 0; i < this.points.length - 1; i++)
		{	
			//Direction to the next point
			var direction = Vector3.Normalize( Vector3.Sub( scr.points[i+1].position, scr.points[i].position ) );

			//Rotated direction by 90 degrees, and scaled by age
			var scaleFactor = ( scr.aliveTime - (scr.engine.time - scr.points[i+1].timestamp) ) / scr.aliveTime;

			scr.points[i+1].wDirection.x= -direction.y * (scr.minWidth + (scr.maxWidth - scr.minWidth) * scaleFactor);
			scr.points[i+1].wDirection.y=  direction.x * (scr.minWidth + (scr.maxWidth - scr.minWidth) * scaleFactor);
		}
		
		//Configuring the start and end points of the curve
		if( scr.points.length > 0 ) 
		{	scr.points[0].isOrigin=true;
			scr.points[0].wDirection.x = scr.minWidth;
			scr.points[0].wDirection.y = scr.minWidth;
			scr.points[scr.points.length-1].wDirection.x = scr.maxWidth;
			scr.points[scr.points.length-1].wDirection.y = scr.maxWidth;
		}
		
		//Drawing the trail
		if( scr.points.length > 0 ) 
		{
			var vertices = [];	//New Vertices for the shape
			var colors   = [];	//New Colors for the shape
			var uvmap    = [];	//New UV mapping for the shape
			var v1 = Vector3.Sub( scr.points[0].position, scr.points[0].wDirection );
			var v4 = Vector3.Add( scr.points[0].position, scr.points[0].wDirection );
			var v2 = 0; 
			var v3 = 0;
			
			for(var i=0; i < scr.points.length-1; i++)
			{
				
				v2 = Vector3.Sub( scr.points[i+1].position, scr.points[i+1].wDirection );
				v3 = Vector3.Add( scr.points[i+1].position, scr.points[i+1].wDirection );
				
				if( !scr.points[i+1].isOrigin )
				{
					vertices = vertices.concat ([v1.x, v1.y, v1.z,   v2.x, v2.y, v2.z,   v3.x, v3.y, v3.z,   v1.x, v1.y, v1.z,   v3.x, v3.y, v3.z,   v4.x, v4.y, v4.z]);
					colors   = colors.concat   ([   1,    1,    1,      1,    1,    1,      1,    1,    1,      1,    1,    1,      1,    1,    1,      1,    1,    1]);
					uvmap    = uvmap.concat    ([   0,    0,            1,    0,            1,    1,            0,    0,            1,    1,            0,    1      ]);
				}
				v1 = v2;
				v4 = v3;
			}
			
			vertices.push(0);
			colors.push(0);
			uvmap.push(0);
			//Setting the buffers and reloading the data
			scr.object.mesh.vertices = vertices;
			scr.object.mesh.colors   = colors;
			scr.object.mesh.UVMap    = uvmap;
			scr.object.mesh.Normals  = vertices;
			scr.object.mesh.Refresh();
		}
		return;
	}
}
