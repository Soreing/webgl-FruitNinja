function PomegranateBehaviour(eng, game)
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
	this.explForce  = 20.0,		//Force of the explosion when the fruit is cut.
	this.maxSplash  = 0.0,		//Maximum number of splashes when the fruit is cut
	this.minSplash  = 0.0,		//Minimum number of splashes when the fruit is cut
	this.sparkTimer = 0.0,		//Time since the last projectile sparkle was instantiated
	this.sparkDelay = 0.2,		//Time between projectile sparkles spawned
	
	this.slices     = 0.0,		//Total number of times the pomegranate was sliced
	this.slicing    = 0.0,		//State if the pomegranate's slicing was initiated
	this.sliced     = 0.0,		//Current state of the mouse, used for slice calculation
	this.sliceLen   = 2.0,		//Total time for slicing before explosion
	this.sliceTimer = 0.0,		//Timer that measures the time left for slicing
	this.exploLen   = 0.5,		//Total time before the object explodes after slicing
	this.exploTimer = 0.0,		//Timer that measures the time left for explosion
	this.sliceui    = 0.0,		//The UI tracking the slices
	
	this.fruits     = [],		//List of fruit pieces that build up the fruit
	
	this.splashColor = new Color(1.0,0.1,0.1),	//Color of the splash the fruit leaves behind
	this.splashTexs  = [7,7,7], 				//Texture indexes of different splashes
	
	this.Duplicate = function()
	{
		var script = new PomegranateBehaviour(this.engine, this.game);
		
		script.radius      = this.radius;
		script.rotation    = this.rotation;
		script.direction   = this.direction;
		script.yScale      = this.yScale;
		script.xScale      = this.xScale;
		script.entered     = this.entered;
		script.explForce   = this.explForce;
		script.maxSplash   = this.maxSplash;
		script.minSplash   = this.minSplash;
		script.sparkTimer  = this.sparkTimer;
		script.sparkDelay  = this.sparkDelay;
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
		for(var deg = 0 ; deg < 360; deg += 90)
		{
			var piece    = new GraphicsObject(this.engine);
			piece.name   = "Pomegranate Top";
			piece.parent = this.object;
			piece.noHide = true;
			piece.mesh   = new PomegranateTop(this.engine.webGL);
			piece.material.ambient   = new Color(0.5,0.5,0.5,1.0);
			piece.material.diffuse   = new Color(1.0,1.0,1.0,1.0);
			piece.material.shininess = 10;
			piece.material.textured  = 6;
			piece.rigidbody.verDrag  = 0;
			piece.transform.PivotRotate    ( new Vector3(0.0,  deg, 0.0) );
			piece.transform.PivotTranslate ( new Vector3(5.0, 5.25, 5.0) );
			piece.Instantiate();
			this.fruits.push(piece);
		}
		
		for(var deg = 0 ; deg < 360; deg += 90)
		{
			var piece    = new GraphicsObject(this.engine);
			piece.name   = "Pomegranate Bottom";
			piece.parent = this.object;
			piece.noHide = true;
			piece.mesh   = new PomegranateBottom(this.engine.webGL);
			piece.material.ambient   = new Color(0.5,0.5,0.5,1.0);
			piece.material.diffuse   = new Color(1.0,1.0,1.0,1.0);
			piece.material.shininess = 10;
			piece.material.textured  = 6;
			piece.rigidbody.verDrag  = 0;
			piece.transform.PivotRotate    ( new Vector3(0.0,  deg, 0.0) );
			piece.transform.PivotTranslate ( new Vector3(5.0, -5.0, 5.0) );
			piece.Instantiate();
			this.fruits.push(piece);
		}
		
		//Setup rotation
		this.rotation = new Vector3(MathPlus.RandomRange(0,180)-90,MathPlus.RandomRange(0,180)-90,MathPlus.RandomRange(0,360)-180);
		this.object.scripts.push(new Rotate(this.engine, this.rotation.x, this.rotation.y, this.rotation.z));
		
		
		//Find the scale of the screen at Z
		this.object.transform.WorldTranslate( new Vector3(0,0,-this.game.distance) );
		var localObject = this.object.transform.localMatrix.CombineV4( [0,0,0,1] );
		var worldObject = this.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = this.engine.camera.transform.localMatrix.CombineV4( worldObject );
		var worldCamera = this.engine.camera.transform.worldMatrix.CombineV4( localCamera );
		
		//Use Law of Sines to find the scale
		var c = -worldCamera[2];
		this.yScale = (c*Math.sin(this.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(this.engine.camera.fovy/2))*Math.PI/180);
		this.xScale = this.yScale *this.engine.camera.aspect;
		
		//Setup Position and physics
		this.object.rigidbody.horDrag  = 0;
		this.object.rigidbody.verDrag  = 0.5;
		var position = new Vector3((this.xScale+this.radius) * (Math.random() <0.5 ? -1 : 1), Math.random()*this.yScale/2+this.yScale/2, 0);
		this.object.transform.WorldTranslate( position );
		this.object.rigidbody.AddForce(new Vector3(position.x < 0 ? 1 : -1, 0, 0), 10);
	},
	
	this.Update = function()
	{	var scr = this;
		
		//Calculate the object's final position
		var localObject = scr.object.transform.localMatrix.CombineV4( [0,0,0,1]   );
		var worldObject = scr.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = scr.engine.camera.transform.worldMatrix.CombineV4( worldObject );
		var worldCamera = scr.engine.camera.transform.localMatrix.CombineV4( localCamera );
		var position    = new Vector3(worldCamera[0], worldCamera[1], worldCamera[2]);
		
		//HandleTimer Logic
		scr.sparkTimer += scr.engine.deltaTime;
		if(scr.sparkTimer > scr.sparkDelay)
		{	scr.sparkTimer = 0;

			var sparkle = new GraphicsObject(scr.engine);
			sparkle.name   = "Sparkle";
			sparkle.depth  = false;
			sparkle.type   = 2;
			sparkle.mesh   = new Pane(scr.engine.webGL);
			sparkle.material.color = Color.white.Duplicate();
			sparkle.material.textured  = 14;
			sparkle.rigidbody.verDrag  = 4;
			sparkle.transform.WorldTranslate( new Vector3 (position.x/scr.xScale*8, position.y/scr.yScale*4.5, 0) );
			sparkle.transform.LocalScale( new Vector3(0.9,0.9,0.9) );
			sparkle.scripts.push( new ShrinkDisappear(scr.engine, 0.5, 0.5));
			sparkle.Instantiate();
		}
		
		//If the object was sliced, count till end of slicing
		if(scr.sliced)
		{	scr.sliceTimer+=scr.engine.deltaTime/scr.engine.timeScale;
		}
		//if slicing ended, count till explosion
		if(scr.sliceTimer > scr.sliceLen)
		{	scr.exploTimer+=scr.engine.deltaTime/scr.engine.timeScale;
			scr.engine.camera.transform.SetPosition(new Vector3(0, 0, 0));
			scr.engine.timeScale=1;
		}
		//If explosion timer ended, explode fruit
		if(scr.exploTimer > scr.exploLen)
		{	//Separating the fruit pieces
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
				explosionDirection.x += Math.random()-0.5 
				explosionDirection.y += explosionDirection.z/2;  
				explosionDirection.z=0;
				
				//Adding extra behaviour
				scr.fruits[i].rigidbody.AddForce( explosionDirection, scr.explForce);
				scr.fruits[i].scripts.push( new Rotate( scr.engine, MathPlus.RandomRange(0,180)-90, MathPlus.RandomRange(0,180)-90, MathPlus.RandomRange(0,180)-90) );
				scr.fruits[i].scripts.push( new TimedDelete( scr.engine, 2) );
				scr.fruits[i].scripts.push( new SpawnSplash( scr.engine, 0.2, 1,0.5, 7, scr.splashColor) );
			}
			
			scr.sliceui.scripts.push( new ShrinkDisappear(scr.engine, 1, 0.25));
			scr.object.Destroy();
			scr.game.IncreaseScore(scr.slices);
			scr.game.lastHit = scr.engine.time/1000;
			scr.game.lastPos = new Vector3(position.x/xScale*8, position.y/yScale*4.5, 0);
			scr.game.comboHit++;
			scr.engine.PlayAudio(2);
		}
	
		//If the object enters the screen space, set the entered property to true
		if(!scr.entered && position.x < scr.xScale && position.x > -scr.xScale && position.y < scr.yScale && position.y > -scr.yScale)
		{	scr.entered = true;	
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
				
				//Distance of the mouse positions from the centre of the object
				var curDistance = Vector3.Distance( position, curMouse); 
				
				//If both mouse positions are in the radius, the object is sliced
				if(curDistance < scr.radius*scr.object.transform.localScale.x && !scr.sliced && scr.exploTimer == 0)
				{
					if (scr.engine.audios[1].ended) scr.engine.PlayAudio(1);
					scr.slicing = 1;
					scr.sliced  = 1;
					scr.slices++;
					
					//If this is the first hit, instantiate the UI
					if(scr.slices==1)
					{
						scr.sliceui       = new GraphicsObject(scr.engine);
						scr.sliceui.name  = "Slice";
						scr.sliceui.depth = false;
						scr.sliceui.type  = 2;
						scr.sliceui.mesh  = new HitsUI(scr.engine.webGL);
						scr.sliceui.mesh.SetNumber(scr.slices);
						scr.sliceui.material.color     = new Color(1.0,1.0,0.2,1.0);
						scr.sliceui.material.ambient   = new Color(1.0,1.0,1.0,1.0);
						scr.sliceui.material.textured  = 1;
						scr.sliceui.rigidbody.verDrag  = 0;
						scr.sliceui.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  -45.0) );
						scr.sliceui.transform.LocalScale     ( new Vector3( 0.7,  0.7,  0.7 ) );
						scr.sliceui.transform.WorldTranslate ( new Vector3( position.x/scr.xScale*8, position.y/scr.yScale*4.5,0) );
						scr.sliceui.Instantiate();
						scr.engine.camera.scripts.push(new CameraTransition(scr.engine,new Vector3(-position.x, -position.y, -position.z-2), 0.04));
						scr.engine.timeScale = 0.1;
						scr.object.rigidbody.force = new Vector3(0,0,0);
						scr.object.rigidbody.verDrag = 0;
					}
					//Else, change the UI
					else
					{
						scr.sliceui.mesh.SetNumber(scr.slices);
						scr.sliceui.material.color = new Color(1.0, scr.sliceui.material.color.g - (scr.sliceui.material.color.g > 0.2 ? 0.05 : 0), scr.sliceui.material.color.b + (scr.sliceui.material.color.g > 0.2 ? 0 : 0.05));
					}	
				}
				else if (curDistance > scr.radius*scr.object.transform.localScale.x)
				{
					scr.sliced  = 0;
				}
			}	
		}	
		
		return;
	}
}
