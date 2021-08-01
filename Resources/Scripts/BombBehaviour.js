function BombBehaviour(eng, game)
{
	this.engine     = eng,		//Reference to the Engine object
	this.game       = game,		//Reference to the Game Manager
	this.object     = 0,		//Reference to the Graphics Object object

	this.radius     = 15.0,		//Radius of the sphere that defines the fruit's volume
	this.rotation   = 0.0,		//Rotation of the fruit in 3 axes
	this.direction  = 0.0,		//Direction of the fruit being thrown
	this.yScale     = 0.0,		//Height Scale of the NDC canvas at Z where the object is located 
	this.xScale     = 0.0,		//Width Scale of the NDC canvas at Z where the object is located 
	this.entered    = 0.0,		//State of the object whether it entered the screen already or not
	this.explForce  = 1.0,		//Force of the explosion when the fruit is cut.
	this.maxSplash  = 2.0,		//Maximum number of splashes when the fruit is cut
	this.minSplash  = 1.0,		//Minimum number of splashes when the fruit is cut
	this.parTimer   = 0.0,		//Time since the last particle was instantiated
	this.parDelay   = 0.1,		//Time between particles spawned
	this.fruits     = [],		//List of fruit pieces that build up the fruit
	
	this.splashColor = new Color(1.0,1.0,0.1),	//Color of the splash the fruit leaves behind
	this.splashTexs  = [7,7,7], 				//Texture indexes of different splashes
	
	this.Duplicate = function()
	{
		var script = new BombBehaviour(this.engine, this.game);
		
		script.radius      = this.radius;
		script.rotation    = this.rotation;
		script.direction   = this.direction;
		script.yScale      = this.yScale;
		script.xScale      = this.xScale;
		script.entered     = this.entered;
		script.explForce   = this.explForce;
		script.maxSplash   = this.maxSplash;
		script.minSplash   = this.minSplash;
		script.parTimer    = this.parTimer;
		script.parDelay    = this.parDelay;
		script.fruits      = [];
		script.splashColor = this.splashColor.Duplicate();
		script.splashTexs  = this.splashTexs.slice();
		
		return script;
	},
	
	//Use this for initialization
	this.Start = function()
	{	
		this.fruits=[];
		
		//Create fruit pieces
		var piece    = new GraphicsObject(this.engine);
		piece.name   = "Bomb Right";
		piece.parent = this.object;
		piece.noHide = true;
		piece.mesh   = new BombRight(this.engine.webGL);
		piece.material.ambient   = new Color(0.5,0.5,0.5,1.0);
		piece.material.diffuse   = new Color(1.0,1.0,1.0,1.0);
		piece.material.shininess = 10;
		piece.material.textured  = 19;
		piece.rigidbody.verDrag  = 0;
		piece.transform.PivotTranslate( new Vector3(4.5390580,0.0,0.0) );
		piece.Instantiate();
		this.fruits.push(piece);
		
		piece        = new GraphicsObject(this.engine);
		piece.name   = "Bomb Left";
		piece.parent = this.object;
		piece.noHide = true;
		piece.mesh   = new BombLeft(this.engine.webGL);
		piece.material.ambient   = new Color(0.5,0.5,0.5,1.0);
		piece.material.diffuse   = new Color(1.0,1.0,1.0,1.0);
		piece.material.shininess = 10;
		piece.material.textured  = 18;
		piece.rigidbody.verDrag  = 0;
		piece.transform.PivotTranslate( new Vector3(-4.696170,0.0,0.0) );
		piece.Instantiate();
		this.fruits.push(piece);
		
		
		piece        = new GraphicsObject(this.engine);
		piece.name   = "Particle Emitter";
		piece.parent = this.object;
		piece.mesh   = new Empty(this.engine.webGL);
		piece.rigidbody.verDrag  = 0;
		piece.transform.PivotTranslate( new Vector3(0.0,26.0,0.0) );
		piece.Instantiate();
		this.fruits.push(piece);
		
		
		//Setup rotation
		this.rotation = new Vector3(MathPlus.RandomRange(0,180)-90,MathPlus.RandomRange(0,180)-90,MathPlus.RandomRange(0,360)-180);
		this.object.scripts.push(new Rotate(this.engine, this.rotation.x, this.rotation.y, this.rotation.z));
		
		//Find the scale of the screen at Z
		var localObject = this.object.transform.localMatrix.CombineV4( [0,0,0,1] );
		var worldObject = this.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = this.engine.camera.transform.localMatrix.CombineV4( worldObject );
		var worldCamera = this.engine.camera.transform.worldMatrix.CombineV4( localCamera );
		
		//Use Law of Sines to find the scale
		var c = -worldCamera[2];
		this.yScale = (c*Math.sin(this.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(this.engine.camera.fovy/2))*Math.PI/180);
		this.xScale = this.yScale *this.engine.camera.aspect;
	},
	
	this.Update = function()
	{	var scr = this;
		
		//Calculate the object's final position
		var localObject = scr.object.transform.localMatrix.CombineV4( [0,0,0,1]   );
		var worldObject = scr.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = scr.engine.camera.transform.worldMatrix.CombineV4( worldObject );
		var worldCamera = scr.engine.camera.transform.localMatrix.CombineV4( localCamera );
		var position    = new Vector3(worldCamera[0], worldCamera[1], worldCamera[2]);
		
		//Calculate the Particle Emitter's final position
		var emiPivotTransf = scr.fruits[2].transform.pivotMatrix.CombineV4( [0,0,0,1]   );
		var emiLocalObject = scr.object.transform.localMatrix.CombineV4( emiPivotTransf   );
		var emiWorldObject = scr.object.transform.worldMatrix.CombineV4( emiLocalObject );
		var emiLocalCamera = scr.engine.camera.transform.worldMatrix.CombineV4( emiWorldObject );
		var emiWorldCamera = scr.engine.camera.transform.localMatrix.CombineV4( emiLocalCamera );
		var emiPosition    = new Vector3(emiWorldCamera[0], emiWorldCamera[1], emiWorldCamera[2]);
		
		//Increment Timer
		scr.parTimer += scr.engine.deltaTime;
		if(scr.parTimer > scr.parDelay)
		{	scr.parTimer = 0;
			
			var smoke = new GraphicsObject(scr.engine);
			smoke.name   = "Smoke";
			smoke.depth  = false;
			smoke.type   = 1;
			smoke.mesh   = new Pane(scr.engine.webGL);
			smoke.material.color = Color.white.Duplicate();
			smoke.material.textured  = 12;
			smoke.rigidbody.verDrag  = 0;
			smoke.transform.WorldTranslate( new Vector3 (emiPosition.x/scr.xScale*8, emiPosition.y/scr.yScale*4.5, 0) );
			smoke.transform.LocalScale( new Vector3(0.2,0.2,0.2) );
			smoke.scripts.push( new FadeDisappear(scr.engine, 0.3, 0.3));
			smoke.Instantiate();
			
			var sparkle = new GraphicsObject(scr.engine);
			sparkle.name   = "Sparkle";
			sparkle.depth  = false;
			sparkle.type   = 2;
			sparkle.mesh   = new Pane(scr.engine.webGL);
			sparkle.material.color = Color.white.Duplicate();
			sparkle.material.textured  = 11;
			sparkle.rigidbody.verDrag  = 4.9;
			sparkle.transform.WorldTranslate( new Vector3 (emiPosition.x/scr.xScale*8, emiPosition.y/scr.yScale*4.5, 0) );
			sparkle.transform.LocalScale( new Vector3(0.2,0.2,0.2) );
			sparkle.scripts.push( new ShrinkDisappear(scr.engine, 0.3, 0.3));
			sparkle.scripts.push( new Rotate(scr.engine,0,0,MathPlus.RandomRange(180, 360)*(Math.random()<0.5? -1:1)));
			sparkle.Instantiate();
		}
		
		//If the object enters the screen space, set the entered property to true
		if(!scr.entered && position.x < scr.xScale && position.x > -scr.xScale && position.y < scr.yScale && position.y > -scr.yScale)
		{	scr.entered = true;	
			scr.engine.PlayAudio(4);
		}
		
		var volume = scr.radius*scr.object.transform.localScale.x*2;
		//If the object leaves the screen space after entering it, delete it
		if(scr.entered && (position.x > scr.xScale+volume || position.x < -scr.xScale-volume || position.y < -scr.yScale-volume))
		{	scr.object.Destroy();
	
			for(var i = 0; i < scr.fruits.length; i++)
			{	scr.fruits[i].Destroy();
		}	}
		
		//Test if the object is sliced
		if( scr.entered && scr.engine.mouse[0] && scr.engine.timeScale > 0)
		{	
			//If object is in view distance
			if (-position.z > scr.engine.camera.zNear && -position.z < scr.engine.camera.zFar)
			{	//Get scale with current camera view
				var c = -position.z;
				yScale = (c*Math.sin(scr.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(scr.engine.camera.fovy/2))*Math.PI/180);
				xScale = yScale *scr.engine.camera.aspect;
				
				//Get the vector position of the current and previous mouse position
				var curMouse = new Vector3(scr.engine.mousePosX*xScale, scr.engine.mousePosY*yScale, position.z);
				var pasMouse = new Vector3((scr.engine.mousePosX-scr.engine.mouseDeltaX)*xScale, (scr.engine.mousePosY-scr.engine.mouseDeltaY)*yScale, position.z);
				
				//Distance of the mouse positions from the centre of the object
				var curDistance = Vector3.Distance( position, curMouse); 
				var pasDistance = Vector3.Distance( position, pasMouse);
				
				//If both mouse positions are in the radius, the object is sliced and the player dies
				if(curDistance < scr.radius*scr.object.transform.localScale.x && pasDistance < scr.radius*scr.object.transform.localScale.x)
				{
					this.object.rigidbody.verDrag=0;
					this.object.rigidbody.horDrag=0;
					this.object.rigidbody.force = new Vector3(0,0,0);
					this.object.scripts.push(new Explosion(this.engine, 2, 1.5));
		}	}	}
		
		return;
	}
}
