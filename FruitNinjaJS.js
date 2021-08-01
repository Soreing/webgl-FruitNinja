var Framework = new Engine();

window.onload = async function setup()
{	
//---------------------SETUP ENGINE-----------------------//
	
	//Setting FPS cap
	Framework.FPSCap=60;
	
	//Changing the camera settings
	Framework.camera.left = -8;
	Framework.camera.right = 8;
	Framework.camera.up = 4.5;
	Framework.camera.bottom = -4.5;
	Framework.camera.zNear = 0.5;
	Framework.camera.zFar = 1000;
	Framework.camera.aspect = 16/9;
	Framework.camera.fovy = 77;
	Framework.camera.cameraType=1;
	Framework.camera.transform.WorldTranslate(new Vector3(0,0,0));
	
	//Moving the light in the scene
	Framework.lightPosition = new Vector3(0.0, 0.0, 0.0);
	
	//Custom FPS counter added to the engine
	Framework.scripts.push(new FPSCounter(Framework));
	
	//Starting the game engine
	Framework.Start();
	
	//Load textures
	Framework.LoadTexture("resources/Textures/sky.png");
	Framework.LoadTexture("resources/Textures/GameTexture.png");
	Framework.LoadTexture("resources/Textures/StarCursor.png");
	Framework.LoadTexture("resources/Textures/Rainbow.png");
	Framework.LoadTexture("resources/Textures/FruitNinjaBackground.png");
	Framework.LoadTexture("resources/Textures/PineappleTexture.png");
	Framework.LoadTexture("resources/Textures/PomegranateTexture.png");
	Framework.LoadTexture("resources/Textures/Splat1.png");
	Framework.LoadTexture("resources/Textures/Splat2.png");
	Framework.LoadTexture("resources/Textures/Splat3.png");
	Framework.LoadTexture("resources/Textures/FruitSmoke.png");
	Framework.LoadTexture("resources/Textures/Sparkle2.png");
	Framework.LoadTexture("resources/Textures/Smoke.png");
	Framework.LoadTexture("resources/Textures/Miss.png");
	Framework.LoadTexture("resources/Textures/PSparkle.png");
	Framework.LoadTexture("resources/Textures/black.png");
	Framework.LoadTexture("resources/Textures/banana_left_texture.png");
	Framework.LoadTexture("resources/Textures/banana_right_texture.png");
	Framework.LoadTexture("resources/Textures/bomb_texture_left.png");
	Framework.LoadTexture("resources/Textures/bomb_texture_right.png");
	Framework.LoadTexture("resources/Textures/Instruction1.png");
	Framework.LoadTexture("resources/Textures/Instruction2.png");
	Framework.LoadTexture("resources/Textures/Beam.png");
	 
	//Load audios
	Framework.LoadAudio("resources/Audio/RainyBGM.mp3");
	Framework.LoadAudio("resources/Audio/Cut.mp3");
	Framework.LoadAudio("resources/Audio/Splash.mp3");
	Framework.LoadAudio("resources/Audio/FruitThrow.mp3");
	Framework.LoadAudio("resources/Audio/Bomb.mp3");
	Framework.LoadAudio("resources/Audio/HealthLose.mp3");
	Framework.LoadAudio("resources/Audio/Start.mp3");
	Framework.LoadAudio("resources/Audio/GameOver.mp3");
	Framework.LoadAudio("resources/Audio/Explosion.mp3");

//--------------------CREATING A SCENE--------------------//
	
	//Changing the skybox
	Framework.skybox.mesh = new Pane(Framework.webGL);
	Framework.skybox.material.textured = 4;
	Framework.skybox.transform.LocalTranslate ( new Vector3( 0.0,  0.0, -0.7) ); 
	
	//Create a Background
	var SkyPane = new GraphicsObject(Framework);	
	SkyPane.name = "SkyBox";
	SkyPane.depth = false;
	SkyPane.noHide = true;
	SkyPane.type = 1;
	SkyPane.mesh = new Pane(Framework.webGL);
	SkyPane.material.color=Color.white.Duplicate();
	SkyPane.material.textured=4;
	SkyPane.rigidbody.verDrag=0;
	SkyPane.transform.LocalScale     ( new Vector3( 8,  8,  8) );
	SkyPane.transform.WorldTranslate ( new Vector3( 0.0,  0.0, 0.0) ); 
	SkyPane.scripts.push( new CameraScale(Framework) );
	SkyPane.Instantiate();
	
	//Create a Game Manager in charge of handling game logic
	var GameManager = new GraphicsObject(Framework);	
	GameManager.name = "Game Manager";
	GameManager.rigidbody.verDrag=0;
	GameManager.scripts.push( new Game(Framework) );
	GameManager.Instantiate();
	
	//Create a new User Interface
	var over = new GraphicsObject(Framework);
	//Setting basic object details
	over.name="Game Over";
	over.depth = false;
	over.type = 2;
	//Configuring the look of the object
	over.mesh = new GameOverUI(Framework.webGL);
	over.material.color     = Color.red.Duplicate();
	over.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	over.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	over.material.specular  = new Color(0.0,0.0,0.0,1.0);
	over.material.shininess = 50;
	over.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	over.rigidbody.verDrag=0;
	//Transforming the object
	over.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	over.transform.LocalScale     ( new Vector3( 1.5,  1.5,  1.5) );
	over.transform.WorldTranslate ( new Vector3( 0.0,  0.0,  0.0) );
	//Attach Object Behaviour
	//
	//Instantiating the object in the engine
	over.Instantiate();
	over.Disable();
	
	//Create a new User Interface
	var score = new GraphicsObject(Framework);
	//Setting basic object details
	score.name="Score";
	score.depth = false;
	score.type = 2;
	//Configuring the look of the object
	score.mesh = new ScoreUI(Framework.webGL);
	score.mesh.SetNumber(0);
	score.material.color     = Color.white;
	score.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	score.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	score.material.specular  = new Color(0.0,0.0,0.0,1.0);
	score.material.shininess = 50;
	score.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	score.rigidbody.verDrag=0;
	//Transforming the object
	score.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	score.transform.LocalScale     ( new Vector3( 0.8,  0.8,  0.8) );
	score.transform.WorldTranslate ( new Vector3(-6.5,  4.0,  0.0) );
	//Attach Object Behaviour
	//
	//Instantiating the object in the engine
	score.Instantiate();
	
	
	//Create a new User Interface
	var hiscore = new GraphicsObject(Framework);
	//Setting basic object details
	hiscore.name="HighScore";
	hiscore.depth = false;
	hiscore.type = 2;
	//Configuring the look of the object
	hiscore.mesh = new BestUI(Framework.webGL);
	hiscore.mesh.SetNumber(0);
	hiscore.material.color     = new Color(1.0,1.0,0.2,1.0);
	hiscore.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	hiscore.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	hiscore.material.specular  = new Color(0.0,0.0,0.0,1.0);
	hiscore.material.shininess = 50;
	hiscore.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	hiscore.rigidbody.verDrag=0;
	//Transforming the object
	hiscore.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	hiscore.transform.LocalScale     ( new Vector3( 0.4,  0.4,  0.4) );
	hiscore.transform.WorldTranslate ( new Vector3(-6.6,  3.4,  0.0) );
	//Attach Object Behaviour
	//
	//Instantiating the object in the engine
	hiscore.Instantiate();
	
	
	//Create a new User Interface
	var hp1 = new GraphicsObject(Framework);
	//Setting basic object details
	hp1.name="Health1";
	hp1.depth = false;
	hp1.type = 2;
	//Configuring the look of the object
	hp1.mesh = new HealthUI(Framework.webGL);
	hp1.material.color     = new Color(1.0,1.0,1.0,1.0);
	hp1.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	hp1.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	hp1.material.specular  = new Color(0.0,0.0,0.0,1.0);
	hp1.material.shininess = 50;
	hp1.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	hp1.rigidbody.verDrag=0;
	//Transforming the object
	hp1.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	hp1.transform.LocalScale     ( new Vector3( 0.5,  0.5,  0.5) );
	hp1.transform.WorldTranslate ( new Vector3( 5.6,  4.0,  0.0) );
	//Attach Object Behaviour
	//
	//Instantiating the object in the engine
	hp1.Instantiate();
	
	
	//Create a new User Interface
	var hp2 = new GraphicsObject(Framework);
	//Setting basic object details
	hp2.name="Health2";
	hp2.depth = false;
	hp2.type = 2;
	//Configuring the look of the object
	hp2.mesh = new HealthUI(Framework.webGL);
	hp2.material.color     = new Color(1.0,1.0,1.0,1.0);
	hp2.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	hp2.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	hp2.material.specular  = new Color(0.0,0.0,0.0,1.0);
	hp2.material.shininess = 50;
	hp2.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	hp2.rigidbody.verDrag=0;
	//Transforming the object
	hp2.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	hp2.transform.LocalScale     ( new Vector3( 0.4,  0.4,  0.4) );
	hp2.transform.WorldTranslate ( new Vector3( 6.6,  3.8,  0.0) );
	//Attach Object Behaviour
	//
	//Instantiating the object in the engine
	hp2.Instantiate();
	
	
	//Create a new User Interface
	var hp3 = new GraphicsObject(Framework);
	//Setting basic object details
	hp3.name="Health3";
	hp3.depth = false;
	hp3.type = 2;
	//Configuring the look of the object
	hp3.mesh = new HealthUI(Framework.webGL);
	hp3.material.color     = new Color(1.0,1.0,1.0,1.0);
	hp3.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	hp3.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	hp3.material.specular  = new Color(0.0,0.0,0.0,1.0);
	hp3.material.shininess = 50;
	hp3.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	hp3.rigidbody.verDrag=0;
	//Transforming the object
	hp3.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	hp3.transform.LocalScale     ( new Vector3( 0.3,  0.3,  0.3) );
	hp3.transform.WorldTranslate ( new Vector3( 7.3,  3.4,  0.0) );
	//Attach Object Behaviour
	//
	//Instantiating the object in the engine
	hp3.Instantiate();
	
	
	//Create a new User Interface
	var pause = new GraphicsObject(Framework);
	//Setting basic object details
	pause.name="PauseButton";
	pause.depth = false;
	pause.type = 2;
	//Configuring the look of the object
	pause.mesh = new Pane(Framework.webGL);
	pause.mesh.UVMap =[ 4/10,  0/8,    6/10, 0/8,    6/10, 2/8,    4/10,  0/8,    6/10, 2/8,    4/10, 2/8 ];
	pause.mesh.Refresh();
	pause.material.color     = new Color(1.0,1.0,1.0,1.0);
	pause.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	pause.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	pause.material.specular  = new Color(0.0,0.0,0.0,1.0);
	pause.material.shininess = 50;
	pause.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	pause.rigidbody.verDrag=0;
	//Transforming the object
	pause.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	pause.transform.LocalScale     ( new Vector3( 0.5*0.8,  0.5,  0.5) );
	pause.transform.WorldTranslate ( new Vector3( -7.0,  -3.6,  0.0) );
	//Attach Object Behaviour
	pause.scripts.push( new PauseBehaviour(Framework) );
	//Instantiating the object in the engine
	pause.Instantiate();
	
	
	//Create a new User Interface
	var quit = new GraphicsObject(Framework);
	//Setting basic object details
	quit.name="QuitButton";
	quit.depth = false;
	quit.type = 2;
	//Configuring the look of the object
	quit.mesh = new Pane(Framework.webGL);
	quit.mesh.UVMap =[ 6/10,  2/8,    8/10, 2/8,    8/10, 4/8,    6/10,  2/8,    8/10, 4/8,    6/10, 4/8 ];
	quit.mesh.Refresh();
	quit.material.color     = new Color(1.0,1.0,1.0,1.0);
	quit.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	quit.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	quit.material.specular  = new Color(0.0,0.0,0.0,1.0);
	quit.material.shininess = 50;
	quit.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	quit.rigidbody.verDrag=0;
	//Transforming the object
	quit.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	quit.transform.LocalScale     ( new Vector3( 0.9*0.8,  0.9,  0.9) );
	quit.transform.WorldTranslate ( new Vector3( -2.5,  -2.0,  0.0) );
	//Attach Object Behaviour
	quit.scripts.push( new CloseBehaviour(Framework) );
	//Instantiating the object in the engine
	quit.Instantiate();
	quit.Disable();
	
	
	//Create a new User Interface
	var restart = new GraphicsObject(Framework);
	//Setting basic object details
	restart.name="RestartButton";
	restart.depth = false;
	restart.type = 2;
	//Configuring the look of the object
	restart.mesh = new Pane(Framework.webGL);
	restart.mesh.UVMap =[ 4/10,  2/8,    6/10, 2/8,    6/10, 4/8,    4/10,  2/8,    6/10, 4/8,    4/10, 4/8 ];
	restart.mesh.Refresh();
	restart.material.color     = new Color(1.0,1.0,1.0,1.0);
	restart.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	restart.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	restart.material.specular  = new Color(0.0,0.0,0.0,1.0);
	restart.material.shininess = 50;
	restart.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	restart.rigidbody.verDrag=0;
	//Transforming the object
	restart.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	restart.transform.LocalScale     ( new Vector3( 0.9*0.8,  0.9,  0.9) );
	restart.transform.WorldTranslate ( new Vector3( 0.0,  -2.0,  0.0) );
	//Attach Object Behaviour
	restart.scripts.push( new RestartBehaviour(Framework) );
	//Instantiating the object in the engine
	restart.Instantiate();
	restart.Disable();
	
	
	//Create a new User Interface
	var resume = new GraphicsObject(Framework);
	//Setting basic object details
	resume.name="ResumeButton";
	resume.depth = false;
	resume.type = 2;
	//Configuring the look of the object
	resume.mesh = new Pane(Framework.webGL);
	resume.mesh.UVMap =[ 6/10,  0/8,    8/10, 0/8,    8/10, 2/8,    6/10,  0/8,    8/10, 2/8,    6/10, 2/8 ];
	resume.mesh.Refresh();
	resume.material.color     = new Color(1.0,1.0,1.0,1.0);
	resume.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	resume.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	resume.material.specular  = new Color(0.0,0.0,0.0,1.0);
	resume.material.shininess = 50;
	resume.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	resume.rigidbody.verDrag=0;
	//Transforming the object
	resume.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	resume.transform.LocalScale     ( new Vector3( 0.9*0.8,  0.9,  0.9) );
	resume.transform.WorldTranslate ( new Vector3( 2.5,  -2.0,  0.0) );
	//Attach Object Behaviour
	resume.scripts.push( new ResumeBehaviour(Framework) );
	//Instantiating the object in the engine
	resume.Instantiate();
	resume.Disable();
	
	
	//Create a new User Interface
	var music = new GraphicsObject(Framework);
	//Setting basic object details
	music.name="MusicButton";
	music.depth = false;
	music.type = 2;
	//Configuring the look of the object
	music.mesh = new Pane(Framework.webGL);
	music.mesh.UVMap =[ 2/10,  0/8,    4/10, 0/8,    4/10, 2/8,    2/10,  0/8,    4/10, 2/8,    2/10, 2/8 ];
	music.mesh.Refresh();
	music.material.color     = new Color(1.0,1.0,1.0,1.0);
	music.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	music.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	music.material.specular  = new Color(0.0,0.0,0.0,1.0);
	music.material.shininess = 50;
	music.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	music.rigidbody.verDrag=0;
	//Transforming the object
	music.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	music.transform.LocalScale     ( new Vector3( 0.5*0.8,  0.5,  0.5) );
	music.transform.WorldTranslate ( new Vector3( 6.0,  -3.6,  0.0) );
	//Attach Object Behaviour
	music.scripts.push( new MusicBehaviour(Framework) );
	//Instantiating the object in the engine
	music.Instantiate();
	music.Disable();
	
	
	//Create a new User Interface
	var soundfx = new GraphicsObject(Framework);
	//Setting basic object details
	soundfx.name="SFXButton";
	soundfx.depth = false;
	soundfx.type = 2;
	//Configuring the look of the object
	soundfx.mesh = new Pane(Framework.webGL);
	soundfx.mesh.UVMap =[ 0/10,  0/8,    2/10, 0/8,    2/10, 2/8,    0/10,  0/8,    2/10, 2/8,    0/10, 2/8 ];
	soundfx.mesh.Refresh();
	soundfx.material.color     = new Color(1.0,1.0,1.0,1.0);
	soundfx.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	soundfx.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	soundfx.material.specular  = new Color(0.0,0.0,0.0,1.0);
	soundfx.material.shininess = 50;
	soundfx.material.textured  = 1;
	//Configuringthe physics behaviour ofthe object
	soundfx.rigidbody.verDrag=0;
	//Transforming the object
	soundfx.transform.LocalRotate    ( new Vector3( 0.0,  0.0,  0.0) );
	soundfx.transform.LocalScale     ( new Vector3( 0.5*0.8,  0.5,  0.5) );
	soundfx.transform.WorldTranslate ( new Vector3( 7.0,  -3.6,  0.0) );
	//Attach Object Behaviour
	soundfx.scripts.push( new SoundBehaviour(Framework) );
	//Instantiating the object in the engine
	soundfx.Instantiate();
	soundfx.Disable();
	
	//Create a new User Interface
	var mouseTrail = new GraphicsObject(Framework);
	//Setting basic object details
	mouseTrail.name="Mouse Trail";
	mouseTrail.depth = false;
	mouseTrail.type = 3;
	//Configuring the look of the object
	mouseTrail.mesh = new Placeholder(Framework.webGL);
	mouseTrail.material.color     = Color.white;
	mouseTrail.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	mouseTrail.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	mouseTrail.material.specular  = new Color(0.0,0.0,0.0,1.0);
	mouseTrail.material.shininess = 50;
	mouseTrail.material.textured  = 3;
	//Configuringthe physics behaviour ofthe object
	mouseTrail.rigidbody.verDrag=0;
	//Transforming the object
	mouseTrail.transform.LocalRotate( new Vector3(0,0,0) );
	mouseTrail.transform.LocalScale( new Vector3(1,1,1) );
	//Attach Object Behaviour
	mouseTrail.scripts.push( new MouseTrail(Framework, 150, 0.05, 0.15, 18.0, 2, 0.2) );
	//Instantiating the object in the engine
	mouseTrail.Instantiate();
	
	
	//Create a new User Interface
	var mouse = new GraphicsObject(Framework);
	//Setting basic object details
	mouse.name="Mouse Cursor";
	mouse.depth = false;
	mouse.type = 3;
	//Configuring the look of the object
	mouse.mesh = new Pane(Framework.webGL);
	mouse.material.color     = Color.white;
	mouse.material.ambient   = new Color(1.0,1.0,1.0,1.0);
	mouse.material.diffuse   = new Color(0.0,0.0,0.0,1.0);
	mouse.material.specular  = new Color(0.0,0.0,0.0,1.0);
	mouse.material.shininess = 50;
	mouse.material.textured  = 2;
	//Configuringthe physics behaviour ofthe object
	mouse.rigidbody.verDrag=0;
	//Transforming the object
	mouse.transform.LocalRotate( new Vector3(0,0,-30) );
	mouse.transform.LocalScale( new Vector3(0.2,0.2,0.2) );
	//Attach Object Behaviour
	mouse.scripts.push( new Rotate(Framework, 0,0,-90) );
	mouse.scripts.push( new MouseTrack(Framework) );
	//Instantiating the object in the engine
	mouse.Instantiate();
}
