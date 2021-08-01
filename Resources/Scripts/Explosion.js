function Explosion(eng, del, fade)
{
	this.engine    = eng,		//Reference to the Engine object
	this.object    = 0,			//Reference to the Graphics Object object
	
	this.time      = eng.time,	//Tiime when the script was attached
	this.delay     = del,		//Amount of time before the explosion
	this.fade      = fade,		//Amount of time for the screen to turn white
	this.deltaTime = 0,
	this.timer0    = 0,
	this.timer1    = 0,
	this.timer2    = 0,
	
	//Create a Background
	this.explosion = new GraphicsObject(Framework);	
	this.explosion.name = "Explosion";
	this.explosion.depth = false;
	this.explosion.noHide = true;
	this.explosion.type = 3;
	this.explosion.mesh = new Pane(Framework.webGL);
	this.explosion.material.color=new Color(1,1,1,0);
	this.explosion.material.textured=-1;
	this.explosion.rigidbody.verDrag=0;
	this.explosion.transform.LocalScale     ( new Vector3( 8,  8,  8) );
	this.explosion.transform.WorldTranslate ( new Vector3( 0.0,  0.0, 0) ); 
	this.explosion.scripts.push( new CameraScale(Framework) );
	this.explosion.Instantiate();
	
	
	this.Start = function()
	{
		
	};
	
	this.Update = function()
	{	var scr = this;
		
	
		//Track time
		scr.engine.timeScale = 0;
		scr.deltaTime = (scr.engine.time - scr.time) /1000;
		scr.time = scr.engine.time
		scr.timer0+=scr.deltaTime;
		scr.timer1+=scr.deltaTime;
		scr.timer2+=scr.deltaTime;
		
		//Shake camera
		if(scr.timer0 > 0.015)
		{
			scr.timer0=0;
			var shake = Vector3.Normalize(new Vector3(Math.random()-0.5,Math.random()-0.5,0));
			scr.engine.camera.transform.SetPosition(Vector3.Mul(shake, 0.03*10));
		}
		
		//Find the scale of the screen at Z
		var localObject = scr.object.transform.localMatrix.CombineV4( [0,0,0,1]   );
		var worldObject = scr.object.transform.worldMatrix.CombineV4( localObject );
		var localCamera = scr.engine.camera.transform.localMatrix.CombineV4( worldObject );
		var worldCamera = scr.engine.camera.transform.worldMatrix.CombineV4( localCamera );
		var position    = new Vector3(worldCamera[0], worldCamera[1], worldCamera[2]);
		
		var c = -position.z;
		var yScale = (c*Math.sin(scr.engine.camera.fovy/2*Math.PI/180))/Math.sin((90-(scr.engine.camera.fovy/2))*Math.PI/180);
		var xScale = yScale *scr.engine.camera.aspect;
			
		if(scr.timer1 > 0.1)
		{
			scr.timer1=0;
	
			var beam    = new GraphicsObject(scr.engine);
			beam.name   = "Beam";
			beam.depth  = false;
			beam.noHide = true;
			beam.type   = 1;
			beam.mesh   = new Pane(scr.engine.webGL);
			beam.material.color = Color.white.Duplicate();
			beam.material.textured  = 22;
			beam.rigidbody.verDrag  = 0;
			beam.transform.WorldTranslate( new Vector3 (position.x/xScale*8, position.y/yScale*4.5, 0) );
			beam.transform.LocalRotate( new Vector3(0.0,0.0,MathPlus.RandomRange(0,360)) );
			beam.transform.LocalScale( new Vector3(8,8,8) );
			beam.Instantiate();
		}
		
		if(scr.timer2 > scr.delay)
		{
			scr.explosion.material.color.a = (scr.timer2-scr.delay)*2/scr.fade;
		}
		
		if(scr.timer2 > scr.delay+scr.fade)
		{
			scr.engine.PlayAudio(8);
			scr.Update = function(){};
			scr.engine.game.LoseHealth();
			scr.engine.game.LoseHealth();
			scr.engine.game.LoseHealth();
			scr.engine.timeScale = 1;
		}
		return;
	};
}
