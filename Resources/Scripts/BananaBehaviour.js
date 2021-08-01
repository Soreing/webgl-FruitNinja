function BananaBehaviour(eng, game)
{
	this.engine     = eng,		//Reference to the Engine object
	this.game       = game,		//Reference to the Game Manager
	this.object     = 0,		//Reference to the Graphics Object object

	this.radius     = 80.0,		//Radius of the sphere that defines the fruit's volume
	this.rotation   = 0.0,		//Rotation of the fruit in 3 axes
	this.direction  = 0.0,		//Direction of the fruit being thrown
	this.yScale     = 0.0,		//Height Scale of the NDC canvas at Z where the object is located 
	this.xScale     = 0.0,		//Width Scale of the NDC canvas at Z where the object is located 
	this.entered    = 0.0,		//State of the object whether it entered the screen already or not
	this.explForce  = 1.5,		//Force of the explosion when the fruit is cut.
	this.maxSplash  = 2.0,		//Maximum number of splashes when the fruit is cut
	this.minSplash  = 1.0,		//Minimum number of splashes when the fruit is cut
	this.smokeTimer = 0.0,		//Time since the last projectile smoke was instantiated
	this.smokeDelay = 0.2,		//Time between projectile smokes spawned
	this.fruits     = [],		//List of fruit pieces that build up the fruit
	
	this.splashColor = new Color(1.0,1.0,0.4),	//Color of the splash the fruit leaves behind
	this.splashTexs  = [7,7,7], 				//Texture indexes of different splashes
	
	this.Duplicate = function()
	{
		var script = new BananaBehaviour(this.engine, this.game);
		
		script.radius      = this.radius;
		script.rotation    = this.rotation;
		script.direction   = this.direction;
		script.yScale      = this.yScale;
		script.xScale      = this.xScale;
		script.entered     = this.entered;
		script.explForce   = this.explForce;
		script.maxSplash   = this.maxSplash;
		script.minSplash   = this.minSplash;
		script.smokeTimer = this.smokeTimer;
		script.smokeDelay = this.smokeDelay;
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
		piece.name   = "Banana Left";
		piece.parent = this.object;
		piece.noHide = true;
		piece.mesh   = new BananaLeft(this.engine.webGL);
		piece.material.ambient   = new Color(0.5,0.5,0.5,1.0);
		piece.material.diffuse   = new Color(1.0,1.0,1.0,1.0);
		piece.material.shininess = 10;
		piece.material.textured  = 16;
		piece.rigidbody.verDrag  = 0;
		piece.transform.PivotTranslate( new Vector3(-29.007488,0.0,0.0) );
		piece.Instantiate();
		this.fruits.push(piece);
		
		piece        = new GraphicsObject(this.engine);
		piece.name   = "Banana Right";
		piece.parent = this.object;
		piece.noHide = true;
		piece.mesh   = new BananaRight(this.engine.webGL);
		piece.material.ambient   = new Color(0.5,0.5,0.5,1.0);
		piece.material.diffuse   = new Color(1.0,1.0,1.0,1.0);
		piece.material.shininess = 10;
		piece.material.textured  = 17;
		piece.rigidbody.verDrag  = 0;
		piece.transform.PivotTranslate( new Vector3(28.094233,0.0,0.0) );
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
		
		//Increment Timer
		scr.smokeTimer += scr.engine.deltaTime;
		if(scr.smokeTimer > scr.smokeDelay)
		{	scr.smokeTimer = 0;
			
			var smoke = new GraphicsObject(scr.engine);
			smoke.name   = "Smoke";
			smoke.depth  = false;
			smoke.type   = 1;
			smoke.mesh   = new Pane(scr.engine.webGL);
			smoke.material.color = Color.white.Duplicate();
			smoke.material.textured  = 10;
			smoke.rigidbody.verDrag  = 0;
			smoke.transform.WorldTranslate( new Vector3 (position.x/scr.xScale*8, position.y/scr.yScale*4.5, 0) );
			smoke.transform.LocalScale( new Vector3(0.5,0.5,0.5) );
			smoke.scripts.push( new FadeDisappear(scr.engine, 0.3, 0.3));
			smoke.Instantiate();
		}
		
		//If the object enters the screen space, set the entered property to true
		if(!scr.entered && position.x < scr.xScale && position.x > -scr.xScale && position.y < scr.yScale && position.y > -scr.yScale)
		{	scr.entered = true;	
			scr.engine.PlayAudio(3);
		}
		
		var volume = scr.radius*scr.object.transform.localScale.x*2;
		//If the object leaves the screen space after entering it, decrease player health
		if(scr.entered && (position.x > scr.xScale+volume || position.x < -scr.xScale-volume || position.y < -scr.yScale-volume))
		{	scr.game.LoseHealth();
			scr.object.Destroy();
			scr.engine.PlayAudio(5);
			
			var missPos = new Vector3(0,0,0);
			missPos.x = position.x >  scr.xScale+volume/2 ?   scr.xScale-volume/2 : position.x < -scr.xScale-volume/2 ? -scr.xScale+volume/2 : position.x;
			missPos.y = position.y < -scr.yScale-volume/2 ?  -scr.yScale+volume/2 : position.y;
			
			var mistake = new GraphicsObject(scr.engine);
			mistake.name   = "Mistake";
			mistake.depth  = false;
			mistake.type   = 2;
			mistake.mesh   = new Pane(scr.engine.webGL);
			mistake.material.color = Color.white.Duplicate();
			mistake.material.textured  = 13;
			mistake.rigidbody.verDrag  = 0;
			mistake.transform.WorldTranslate( new Vector3 (missPos.x/scr.xScale*8, missPos.y/scr.yScale*4.5, 0) );
			mistake.transform.LocalScale( new Vector3(0.5,0.5,0.5) );
			mistake.scripts.push( new FadeDisappear(scr.engine, 1, 0.5));
			mistake.Instantiate();
						
			for(var i = 0; i < scr.fruits.length; i++)
			{	scr.fruits[i].Destroy();
		}	}
		
		//Test if the object is sliced
		if( scr.entered && scr.engine.mouse[0] && scr.engine.timeScale > 0)
		{	//If object is in view distance
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
				
				//If both mouse positions are in the radius, the object is sliced
				if(curDistance < scr.radius*scr.object.transform.localScale.x && pasDistance < scr.radius*scr.object.transform.localScale.x)
				{
					scr.engine.PlayAudio(2);
					if (scr.engine.audios[1].ended) scr.engine.PlayAudio(1);
					scr.object.Destroy();
					scr.game.IncreaseScore(1);
					scr.game.lastHit = scr.engine.time/1000;
					scr.game.lastPos = new Vector3(curMouse.x/xScale*8, curMouse.y/yScale*4.5, 0);
					scr.game.comboHit++;
					
					//Separating the fruit pieces
					for(var i = 0; i < scr.fruits.length; i++)
					{	//Detaching fruit piece from the parent
						scr.fruits[i].parent = 0;
						scr.fruits[i].transform.LocalRotate    ( scr.object.transform.localRotation );
						scr.fruits[i].transform.LocalScale     ( scr.object.transform.localScale );
						scr.fruits[i].transform.WorldTranslate ( scr.object.transform.position );
						scr.fruits[i].rigidbody.AddForce       ( scr.object.rigidbody.force, 1 );
						scr.fruits[i].rigidbody.verDrag = 9.81;
						
						//Calculating explosion direction
						var explosionDirection = Vector3.Normalize( scr.fruits[i].transform.pivotMatrix.Multiply(new Vector3(0,0,0)));
						explosionDirection.x += explosionDirection.z;   
						explosionDirection.y += explosionDirection.z/2;  
						explosionDirection.z=0;
						
						//Adding extra behaviour
						scr.fruits[i].rigidbody.AddForce( explosionDirection, scr.explForce);
						scr.fruits[i].scripts.push( new Rotate( Framework, MathPlus.RandomRange(0,180)-90, MathPlus.RandomRange(0,180)-90, MathPlus.RandomRange(0,180)-90) );
						scr.fruits[i].scripts.push( new TimedDelete( Framework, 4) );
					}
					
					//Instantiate splashes on the screen
					var nSplashes = MathPlus.RandomRange(scr.minSplash, scr.maxSplash);
					for(var i = 0; i < nSplashes; i++)
					{	
						var splash    = new GraphicsObject(scr.engine);
						splash.name   = "Splash";
						splash.depth  = false;
						splash.type   = 1;
						splash.mesh   = new Pane(scr.engine.webGL);
						splash.material.color = scr.splashColor;
						splash.material.textured  = scr.splashTexs[MathPlus.RandomRange(0, scr.splashTexs.length)];
						splash.rigidbody.verDrag  = 0;
						splash.transform.WorldTranslate( new Vector3 ((position.x+MathPlus.RandomRange(0,volume)-volume/2)/scr.xScale*8, (position.y+MathPlus.RandomRange(0,volume)-volume/2)/scr.yScale*4.5, 0) );
						//splash.transform.LocalRotate( new Vector3(0.0,0.0,0.0) );
						splash.transform.LocalScale( new Vector3(1.2,1.2,1.2) );
						splash.scripts.push( new FadeDisappear(scr.engine, 3, 1));
						splash.Instantiate();
		}	}	}	}
		
		return;
	}
}
