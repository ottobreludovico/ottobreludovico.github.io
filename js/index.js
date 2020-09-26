import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../jsm/loaders/MTLLoader.js';
import { FBXLoader } from '../jsm/loaders/FBXLoader.js';
import { GUI } from '../jsm/libs/dat.gui.module.js';	

var container;
var camera, scene, renderer;
var gun;
var gun1;
var t=[];
var tm=[];
var sound_shot;
var mouse = new THREE.Vector2();
var punteggio;
var interval=1/30;
var clock=new THREE.Clock();
var delta=0;
var hammer;
var k=false;
var direction=0;
var moving=false;
var sound_general;
var startGame = false;
var game1=false;
var game2=false;
var game3=false; 
var tex;
var s=false;
var stars=[];
var caricatore;
var bordo;
var centro;
var accuratezza;
var sound_target;
var num_colpi;
var livello;
var flag;
var bird=[];
var b=false;
var ww=false;
var www=false;
var gui; 
var light;

function init() {
    punteggio=0;

    caricatore = 0;

    bordo = 0;

    centro = 0;

    accuratezza = 0;

    livello = 1;

    flag = true;

    updatelevel(livello);

    container = document.createElement( 'div' );

    container.setAttribute("id", "scena");

    document.body.appendChild( container );

    createScene();

    createGround();

    createTarget(0, 0, 0);

    createGun();

    createBird(-350,0,-1200);

    createTree(-250,-20,-400);

    createTree(100,-10,-1600);

    clock.start();

    console.log(clock);

    createRenderer();

    createGeneralMusic();

    initGui();

    b=true;
    
    container.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'resize', onWindowResize, false );
  
    renderer.domElement.addEventListener("mousedown", onMouseDown, false);

    renderer.domElement.addEventListener("mousemove", onMouseMove, false);
}

function init2() {
    punteggio=0;

    num_colpi = 0;

    flag = true;

    container = document.createElement( 'div' );

    document.body.appendChild( container );

    createScene();

    createPlanets();

    createStar(0,0);

    createStarGun();

    createRenderer();

    createGeneralMusic();

    initGui();
    
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
  
    window.addEventListener("mousedown", onMouseDown);

    window.addEventListener("mousemove", onMouseMove);
}


function createScene(){
    if(game2){
        var loader = new THREE.TextureLoader();
        loader.load('textures/galassia.jpg' , function(texture){
        scene.background = texture;  
    });
    }

    if(game1){
        var loader = new THREE.TextureLoader();
        loader.load('/cloud2.jpg' , function(texture){
        scene.background = texture;  
    });
    }

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcce0ff );
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );


    // camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 50, 0 );

    // lights
    scene.add( new THREE.AmbientLight( 0x666666 ) );

    light = new THREE.DirectionalLight( 0xdfebff, 1 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    var d = 300;

    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;

    light.shadow.camera.far = 1000;

    scene.add( light );

}


function createRenderer(){
        //renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
}

function createGun(){
    var mtlloader1=new MTLLoader();
    mtlloader1.load('models/m1911-handgun-obj/m1911-handgun.mtl', function (materials1) {
        materials1.preload();
        var objloader=new OBJLoader();
            objloader.setMaterials(materials1)
            .load('models/m1911-handgun-obj/model.obj', function (obj1) {
                gun=obj1;
                obj1.name="gun";
                obj1.position.x=0;
                obj1.position.y=-100.050;
                obj1.position.z=-280.000;

                obj1.rotation.x=0;
                obj1.rotation.y=3.15;
                obj1.rotation.z=0;

                obj1.scale.x=5.000;
                obj1.scale.y=5.000;
                obj1.scale.z=5.000;
                var texture = new THREE.TextureLoader().load('models/m1911-handgun-obj/Tex_0008_1.png');

                obj1.traverse(function (child) {   // aka setTexture
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                    }
                    if(child.name=="Hammer"){
                        hammer=child;
                        hammer.rotation.x=0.25;
                    }
                });
                scene.add(obj1);
            });
    });
}

function createBird(x,y,z){
    var mtlloader1=new MTLLoader();
    mtlloader1.load('models/bird/bird.mtl', function (materials1) {
        materials1.preload();
        var objloader=new OBJLoader();
        objloader.setMaterials(materials1)
        .load('models/bird/bird.obj', function (obj1) {
            
            obj1.position.x=x;
            obj1.position.y=y;
            obj1.position.z=z;

            obj1.rotation.x=0;
            
            obj1.rotation.z=0;

            obj1.scale.x=6;
            obj1.scale.y=6;
            obj1.scale.z=6;

            var dd=0;

            if(x>0){
                dd=0;
                obj1.rotation.y=1.3;
            }else if(x<=0){
                dd=1;
                obj1.rotation.y=-1.3;
            }

            var gambadx, gambasx;
            obj1.traverse(function (child) {   // aka setTexture
                if(child.name=="gambadx"){
                    gambadx=child;
                    gambadx.rotation.x=-0.05;
                }if(child.name=="gambasx"){
                    gambasx=child;
                }
            });

            var b={bird: obj1, dir: dd, rot: false, gdx: gambadx, gsx: gambasx, dirg:0};
            
            bird.push(b);
            scene.add(obj1);
        });
    });
}

function createTree(x,y,z){
    var mtlloader1=new MTLLoader();
    mtlloader1.load('models/tree/tree.mtl', function (materials1) {
        materials1.preload();
        var objloader=new OBJLoader();
        objloader.setMaterials(materials1)
        .load('models/tree/tree.obj', function (obj1) {
            
            obj1.position.x=x;
            obj1.position.y=y;
            obj1.position.z=z;

            obj1.scale.x=8;
            obj1.scale.y=8;
            obj1.scale.z=8;


            scene.add(obj1);
        });
    });
}

function createTarget(x,y,z){
    var objloader=new OBJLoader();
        objloader.load('models/targets/t71.obj', function (obj1) {

            obj1.position.x=x;
            obj1.position.y=-40+y;
            obj1.position.z=-1500+z;

            var texture = new THREE.TextureLoader().load('models/bow-target/textures/low_for_paint_obj_initialShadingGroup_Roug.png');
            var mat= new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 100, wireframe: false }) ;
            obj1.traverse(function (child) {   // aka setTexture
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
                if (child.name=="Cylinder"){
                    child.material = mat;
                }
            });
            t.push(obj1);
            scene.add(obj1);
        });
}

function createStar(x,y){
    var mtlloader1=new MTLLoader();
    mtlloader1.load('models/Obj/Gold_Star.mtl', function (materials1) {
        materials1.preload();
        var objloader=new OBJLoader();
        objloader.setMaterials(materials1)
            .load('models/Obj/Gold_Star.obj', function (obj1) {

                obj1.position.x=x;
                obj1.position.y=y;
                obj1.position.z=-1000;

                obj1.rotation.y=5;

                var s={star:obj1, dir:1};
                stars.push(s);
                scene.add(obj1);
            });
        });
}

var planets;

var earth,jupiter,mars,mercury,neptune,pluto,saturn,uranus,venus;

function createPlanets(){
    var mtlloader1=new MTLLoader();
    mtlloader1.load('models/planets-v3-not-to-scale-obj/planets-v3-not-to-scale.mtl', function (materials1) {
        materials1.preload();
        var objloader=new OBJLoader();
        objloader.setMaterials(materials1)
        .load('models/planets-v3-not-to-scale-obj/planets-v3-not-to-scale.obj', function (obj1) {
            
            obj1.position.x=-380;
            obj1.position.y=120;
            obj1.position.z=-1200;

            obj1.rotation.x=0;
            obj1.rotation.z=0;

            obj1.scale.x=3;
            obj1.scale.y=3;
            obj1.scale.z=3;

            planets=obj1;

            obj1.traverse(function (child) {   // aka setTexture
                if (child.name=="Earth") {
                    child.position.set(0,120,-600);
                    child.scale.set(9,9,9);
                    earth=child;
                }
                if (child.name=="Jupiter") {
                    jupiter=child;
                    child.position.set(-200,120,-800);
                    child.scale.set(12,12,12);
                }
                if (child.name=="Mars") {
                    mars=child;
                    child.position.set(300,120,-300);
                    child.scale.set(15,15,15);
                }
                if (child.name=="Mercury") {
                    mercury=child;
                    child.position.set(50,-120,-400);
                    child.scale.set(7,7,7);
                }
                if (child.name=="Neptune") {
                    neptune=child;
                    child.position.set(-50,50,-800);
                    child.scale.set(12,12,12);
                }
                if (child.name=="Pluto") {
                    pluto=child;
                    child.position.set(200,-150,-300);
                    child.scale.set(15,15,15);
                }
                if (child.name=="Saturn") {
                    saturn=child;
                    child.position.set(0,-200,-600);
                    child.scale.set(10,10,10);
                }
                if (child.name=="Uranus") {
                    uranus=child;
                    child.position.set(-200,-200,-800);
                    child.scale.set(6,6,6);
                }
                if (child.name=="Venus") {
                    venus=child;
                    child.position.set(400,-150,-300);
                    child.scale.set(8,8,8);
                }
            });

            scene.add(obj1);
        });
    });
}


function createMovingTarget(x,y,z){
    moving=true;
    var objloader=new OBJLoader();
    objloader.load('models/targets/t71.obj', function (obj1) {
        obj1.position.x=x;
        obj1.position.y=-40+y;
        obj1.position.z=-1500+z;

        var mat= new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 100, wireframe: false }) ;
        //var mat1= new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 100, wireframe: false }) ;
        obj1.traverse(function (child) {   // aka setTexture
            if(child.name=="Cylinder"){
                child.material = mat;
            }
        });
        
        if(x>0){
            direction=0;//dx
        }else{
            direction=1;//sx
        }
        tm.push(obj1);
        scene.add(obj1);
    });
}

function createGround(){
    //ground
    var groundTexture = new THREE.TextureLoader().load( 'textures/grasslight-big.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name="ground";
    scene.add( mesh );
}

function onMouseMove(evt) {
    evt.preventDefault();
    if(game1){
        gun.rotation.y=(window.innerWidth/2-evt.clientX)/1500;
        gun.rotation.x=0.002+(window.innerHeight/2-evt.clientY)/1000;
    }else if(game2){
        gun1.rotation.y=4.7+(window.innerWidth/2-evt.clientX)/1500;
        gun1.rotation.x=(window.innerHeight/2-evt.clientY)/1000;
    }
}


function createShotMusic(){
    // create an AudioListener and add it to the camera
	var listener = new THREE.AudioListener();
	camera.add(listener);
	// create a global audio source
	sound_shot = new THREE.Audio(listener);
	// load a sound and set it as the Audio object's buffer
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load('sounds/shot.mp3', function(buffer) {
		sound_shot.setBuffer(buffer);
        sound_shot.setVolume(0.08);
        sound_shot.setLoop( false );
	    sound_shot.play();
		});
}

function createStarShotMusic(){
    // create an AudioListener and add it to the camera
	var listener = new THREE.AudioListener();
	camera.add(listener);
	// create a global audio source
	sound_shot = new THREE.Audio(listener);
	// load a sound and set it as the Audio object's buffer
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load('sounds/starShot.mp3', function(buffer) {
		sound_shot.setBuffer(buffer);
        sound_shot.setVolume(0.08);
        sound_shot.setLoop( false );
	    sound_shot.play();
		});
}

function createGeneralMusic(){
    // create an AudioListener and add it to the camera
    var listener = new THREE.AudioListener();
    camera.add(listener);
    // create a global audio source
    sound_general = new THREE.Audio(listener);
    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('sounds/general.mp3', function(buffer) {
        sound_general.setBuffer(buffer);
        sound_general.setVolume(0.04);
        sound_general.setLoop( true );
        sound_general.play();
        });
}

function createTargetMusic(){
    // create an AudioListener and add it to the camera
    var listener = new THREE.AudioListener();
    camera.add(listener);
    // create a global audio source
    sound_target = new THREE.Audio(listener);
    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('sounds/target.mp3', function(buffer) {
        sound_target.setBuffer(buffer);
        sound_target.setVolume(0.1);
        sound_target.setLoop( false );
        sound_target.play();
        });    
}

function fire(){
    if(game1){
        scene.remove(tex);
        createShotMusic();
        k=true;
        var raycaster = new THREE.Raycaster();	
        raycaster.setFromCamera(mouse,camera);
        var intersects = raycaster.intersectObjects( scene.children, true);
    	caricatore += 1;
        if( intersects.length > 0 ) {
            console.log(intersects[0]);
            if(intersects[0].object.name=="low_for_paint_obj:polySurface1"){
                createTargetMusic();
                bordo+=1;
                punteggio += 1;
                onepoint(intersects[0].point.x,intersects[0].point.y);
                updateHTML(punteggio);
                check();
                respawn();
            }else if(intersects[0].object.name=="Cylinder"){
                createTargetMusic();
                centro+=1;
                punteggio+=3;
                threepoints(intersects[0].point.x,intersects[0].point.y);
                updateHTML(punteggio);
                check();
                respawn();
            }
            else if(intersects[0].object.name=="corpo"){
                createTargetMusic();;
                punteggio -=1;
                negativepoint(intersects[0].point.x,intersects[0].point.y);
                updateHTML(punteggio);
                check();
                respawn();
            }else{
                check();
                respawn();
            }
        }else{
            check();
            respawn();
        }
    }else if(game2){
        scene.remove(tex);
        createStarShotMusic();
        var raycaster = new THREE.Raycaster();	
        raycaster.setFromCamera(mouse,camera);
        var intersects = raycaster.intersectObjects( scene.children, true);
        num_colpi += 1;
        if( intersects.length > 0 ) {
            punteggio+=1;
            updateHTML(punteggio);
            if(intersects[0].object.name=="Star001"){
                starfire(1);
                respawnStar();
            }
        }else{
            //starfire(0);
        }
    }
}

function dd(){
    scene.remove(tex);
}

function negativepoint(x,y){
    var loader = new THREE.FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
            var geometry = new THREE.TextGeometry( "-1", {
                font: font,
                size: 20,
                height: 20,
                bevelSize: 8,
                curveSegments: 12
            });
        var material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x=x;
        mesh.position.y=y;
        mesh.position.z=-1000;
        tex=mesh;
        scene.add(mesh);
        s=true;
    });
}

function threepoints(x,y){
    var loader = new THREE.FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
            var geometry = new THREE.TextGeometry( "+3, Great!", {
                font: font,
                size: 20,
                height: 20,
                bevelSize: 8,
                curveSegments: 12
            });
        var material = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x=x;
        mesh.position.y=y;
        mesh.position.z=-1000;
        tex=mesh;
        scene.add(mesh);
        s=true;
    });
}

function onepoint(x,y){
    var loader = new THREE.FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
            var geometry = new THREE.TextGeometry( "+1", {
                font: font,
                size: 20,
                height: 20,
                bevelSize: 8,
                curveSegments: 12
            });
        var material = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x=x;
        mesh.position.y=y;
        mesh.position.z=-1000;
        tex=mesh;
        scene.add(mesh);
        s=true;
    });
}

function del(e){
    if(game1){
        var x=e.shift();
        if(x){
            scene.remove(x);
        }
    }else if(game2){
        var x=e.shift();
        if(x){
            scene.remove(x.star);
        }
    }  
}

function respawn(){
    del(t);
    del(tm);
    ww=false;
    www=false;
    if((Math.floor(Math.random() * 2) + 1) == 1){
        if((Math.floor(Math.random() * 2) + 1) == 1){
            createTarget(Math.floor(Math.random() * 500) + 3, Math.floor(Math.random() * 20) + 3 ,Math.floor(Math.random() * 200) + 3);
        }  
        else{
            createTarget(-Math.floor(Math.random() * 500) + 3, Math.floor(Math.random() * 20) + 3 ,Math.floor(Math.random() * 200) + 3);
        }
    }else{
        createMovingTarget(Math.floor(Math.random() * 500) + 3, Math.floor(Math.random() * 20) + 3 ,Math.floor(Math.random() * 200) + 3 );
    }
}

function check(){
    if(caricatore == 10){
    	console.log(clock.getElapsedTime());
    	console.log(clock);
   		// Get the modal
		var modal = document.getElementById("myModal");

		var sfondo = document.getElementById("back");
		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

        var butt = document.getElementById("button");

        var n_lev = document.getElementById("n_level");

        var r = (centro+bordo)/caricatore;

		var a = "</p><p>Perfect hits:";

		var b = "</p><p>Hits:";

		var c = "</p><p>Time:";

        var q = "</p><p>Accuracy:";

        var d = "</p>";

		document.getElementById("stats").innerHTML = a.concat(String(centro), b, String(bordo), c, String(clock.getElapsedTime()), String(q), r, d);
		
		modal.style.display = "block";

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
            game1=false;
		  	modal.style.display = "none";
		  	location.reload(true);
		}

        butt.onclick = function() {
            game1=false;
            modal.style.display = "none";
            location.reload(true);            
        }

        if(r >= 0.5){
        	sfondo.style.backgroundImage = "url('textures/exc.png')";
    		sfondo.style.backgroundRepeat = "repeat-y";
    		sfondo.style.backgroundPosition = "center center";
        	document.getElementById("n_level").style.display = "block"; 
	        n_lev.onclick = function(){
	        	//game1 = true;
	        	modal.style.display = "none";
	        	livello += 1;
	        	updatelevel(livello);
                createBird(-300,0,-1100);
                createTree(200,-40,-300);

	        }
    	}
    	else{
    		sfondo.style.backgroundImage = "url('textures/over.png')";
    		sfondo.style.backgroundRepeat = "repeat-y";
    		sfondo.style.backgroundPosition = "center center";
    		document.getElementById("stats").innerHTML = a.concat(String(centro), b, String(bordo), c, String(clock.getElapsedTime()), String(q), r, d);
    	}
    	return;
    }

    //secondo livello di gioco
    else if(caricatore == 18){
		console.log(clock.getElapsedTime());
    	console.log(clock);
   		// Get the modal
		var modal = document.getElementById("myModal");

		var sfondo = document.getElementById("back");
		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

        var butt = document.getElementById("button");

        var n_lev = document.getElementById("n_level");

        var r = (centro+bordo)/caricatore;

		var a = "</p><p>Perfect hits:";

		var b = "</p><p>Hits:";

		var c = "</p><p>Time:";

        var q = "</p><p>Accuracy:";

        var d = "</p>";

		document.getElementById("stats").innerHTML = a.concat(String(centro), b, String(bordo), c, String(clock.getElapsedTime()), String(q), r, d);
		
		modal.style.display = "block";

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
            game1=false;
		  	modal.style.display = "none";
		  	location.reload(true);
		}

        butt.onclick = function() {
            game1=false;
            modal.style.display = "none";
            location.reload(true);            
        }

        if(r >= 0.7){
        	sfondo.style.backgroundImage = "url('textures/exc.png')";
    		sfondo.style.backgroundRepeat = "repeat-y";
    		sfondo.style.backgroundPosition = "center center";
        	document.getElementById("n_level").style.display = "block"; 
	        n_lev.onclick = function(){
	        	game1 = true;
	        	modal.style.display = "none";
	        	livello += 1;
	        	updatelevel(livello);             
                createBird(150,0,-800);
                createTree(-200,-30,-800);
                createBird(-50,0,-900);
	        }
    	}
    	else{
    		sfondo.style.backgroundImage = "url('textures/over.png')";
    		sfondo.style.backgroundRepeat = "repeat-y";
    		sfondo.style.backgroundPosition = "center center";
    		document.getElementById("stats").innerHTML = a.concat(String(centro), b, String(bordo), c, String(clock.getElapsedTime()), String(q), r, d);
    	}
    	return;
    }

    //terzo livello
    else if(caricatore == 25){
    	   	// Get the modal
		var modal = document.getElementById("myModal");

		var sfondo = document.getElementById("back");
		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

        var butt = document.getElementById("button");

        var n_lev = document.getElementById("n_level");

        var r = (centro+bordo)/caricatore;

        if(r>= 0.9){
        	sfondo.style.backgroundImage = "url('textures/win.jpg')";
    		sfondo.style.backgroundRepeat = "repeat-y";
    		sfondo.style.backgroundPosition = "center center";
        }
        else{
        	sfondo.style.backgroundImage = "url('textures/over.png')";
    		sfondo.style.backgroundRepeat = "repeat-y";
    		sfondo.style.backgroundPosition = "center center";
        }

		var a = "</p><p>Perfect hits:";

		var b = "</p><p>Hits:";

		var c = "</p><p>Time:";

        var q = "</p><p>Accuracy:";

        var d = "</p>";

		document.getElementById("stats").innerHTML = a.concat(String(centro), b, String(bordo), c, String(clock.getElapsedTime()), String(q), r, d);
		
		modal.style.display = "block";
		n_level.style.display = "none";

		butt.onclick = function() {
            game1=false;
            modal.style.display = "none";
            location.reload(true);            
        }

    }
}


function respawnStar(){
    del(stars);
    if(clock.getElapsedTime() >= 20){

  		var modal = document.getElementById("myModal");
		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

        var butt = document.getElementById("button");

        var c = "<p>Time: 20s";

        var q = "</p><p>Score:";

        var w = "</p><p>Num Shots:"

        var d = "</p>";

        document.getElementById("stats").innerHTML = c.concat(q, String(punteggio), w, num_colpi, d);
		
		modal.style.display = "block";

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
            game2=false;
		  	modal.style.display = "none";
		  	location.reload(true);
		}

        butt.onclick = function() {
            game2=false;
            modal.style.display = "none";
            location.reload(true);            
        }

    	return;

  	
    }
    if((Math.floor(Math.random() * 4) + 1) == 1){
        createStar((Math.random() * 400), (Math.random() * 300));
    }else if((Math.floor(Math.random() * 4) + 1) == 2){
        createStar(100+(Math.random() * 300), -100+(Math.random() * 200));
    }else if((Math.floor(Math.random() * 4) + 1) == 3){
        createStar(-100-(Math.random() * 300), -100+(Math.random() * 200));
    }else{
        createStar(-(Math.random() * 400), (Math.random() * 300));
    }
}


function animateCloseHammer(){
    hammer.rotation.x=0;
}


function animateOpenHammer(){
    hammer.rotation.x=0.25;
    k=false;
}

function updatelevel(x){
	document.getElementById("level").innerHTML = x;
	return;
}

function updateHTML(x){
    document.getElementById("score").innerHTML = x;
    return;
}

function onMouseDown(evt){
    mouse.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;	
    fire();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var beta=0;

function anb(b){
    if(b.gdx.rotation.x>0.05){
        b.dirg=1;
    }if(b.gdx.rotation.x<-0.05){
        b.dirg=0;
    }if(b.dirg==0){
        b.gdx.rotation.x+=0.0025;
        b.gsx.rotation.x-=0.0025;
    }if(b.dirg==1){
        b.gdx.rotation.x-=0.0025;
        b.gsx.rotation.x+=0.0025;
    }
}

function animateBird(){
    bird.forEach( b => {
        anb(b);
        if(b.rot==true){
            if(b.dir==1){
                if(b.bird.rotation.y>=-1.3){
                    b.bird.rotation.y-=0.05;
                }else{
                    b.rot=false;
                }
            }
            if(b.dir==0){
                if(b.bird.rotation.y<=1.3){
                    b.bird.rotation.y+=0.05;
                }else{
                    b.rot=false;
                }
            }
        }
        if(b.bird.position.x>450){
            b.rot=true;
            b.dir=1;
        }if(b.bird.position.x<-450){
            b.rot=true;
            b.dir=0;
        }if(b.dir==0){
            b.bird.position.x+=1;
        }if(b.dir==1){
            b.bird.position.x-=1;
        }
    }); 
}


function animate( now ) {
    requestAnimationFrame(animate);

    if(game1){
        tm.forEach(e => {
            if(e.position.x>600){
                direction=1;
            }if(e.position.x<-600){
                direction=0;
            }
            if(direction==0){//dx
                e.position.x+=1.7;
            }if(direction==1){//sx
                e.position.x-=1.7;
            }
        });

        if(b){
            animateBird();
        }
       
        
        if(k){
            animateCloseHammer();
            setTimeout(animateOpenHammer,300);
        }  
    
        if(s){
            setTimeout(dd,100);
            s=false;
        }

    }
    

    if(game2){
        earth.rotation.y+=0.001;
        earth.rotation.x-=0.001;
        earth.rotation.z+=0.001;

        jupiter.rotation.y-=0.001;
        jupiter.rotation.x+=0.001;
        jupiter.rotation.z+=0.001;

        mars.rotation.y-=0.001;
        mars.rotation.x+=0.001;
        mars.rotation.z-=0.001;

        mercury.rotation.y-=0.001;
        mercury.rotation.x+=0.001;
        mercury.rotation.z+=0.001;

        neptune.rotation.y-=0.001;
        neptune.rotation.x+=0.001;
        neptune.rotation.z+=0.001;

        pluto.rotation.y-=0.001;
        pluto.rotation.x+=0.001;
        pluto.rotation.z+=0.001;

        saturn.rotation.y-=0.001;
        saturn.rotation.x-=0.001;
        saturn.rotation.z-=0.001;

        uranus.rotation.y+=0.001;
        uranus.rotation.x-=0.001;
        uranus.rotation.z+=0.001;

        venus.rotation.y-=0.001;
        venus.rotation.x+=0.001;
        venus.rotation.z-=0.001;

        stars.forEach(e => {
            e.star.rotation.y+=0.1;
            beta+=0.05;
            e.star.position.x=e.star.position.x+(beta*Math.cos(beta)/50);
            e.star.position.y=e.star.position.y+(beta*Math.sin(beta)/50);
            if(e.star.scale.x < 0.5){
                e.dir=1;
            }
            if(e.star.scale.x > 1){
                e.dir=0;
            }
            if(e.dir==0){
                e.star.scale.x -= 0.005;
                e.star.scale.y -= 0.005;
                e.star.scale.z -= 0.005;
            }
            if(e.dir==1){
                e.star.scale.x += 0.005;
                e.star.scale.y += 0.005;
                e.star.scale.z += 0.005;
            }
        });
    }

    render();
}


function render() {
   renderer.render( scene, camera );
}

//keyboard listener
document.body.onkeyup = function(e){
    if(e.keyCode == 72){
    	location.reload(true);
    }
}


document.getElementById("start").addEventListener("click", function(){
    document.getElementById("start").style.display = "none";
    document.getElementById("start2").style.display = "none";
    document.getElementById("start3").style.display = "none";
    document.getElementById("prova").style.display = "block";
    document.getElementById("prova").style.color = "white";
    document.getElementById("score").style.color = "white";
    document.getElementById("prova1").style.display = "block";
    document.getElementById("instruction").style.display = "none";    
    game1=true;
    init();
    animate();
});

document.getElementById("start2").addEventListener("click", function(){
    document.getElementById("start2").style.display = "none";
    document.getElementById("start").style.display = "none";
    document.getElementById("start3").style.display = "none";
    document.getElementById("prova").style.display = "block";
    document.getElementById("prova").style.color = "white";
    document.getElementById("score").style.color = "white";
    document.getElementById("instruction").style.display = "none";    
    game2=true;
    init2();
    animate();
});


function createStarGun(){
    var loader = new FBXLoader();
            loader.load( 'models/space-gun/source/Spacegun_LP.fbx', function ( obj1 ) {
                gun1=obj1;
                obj1.name="gun1";
                obj1.position.x=0;
                obj1.position.y=0;
                obj1.position.z=-280.000;

                obj1.rotation.x=0;
                obj1.rotation.y=4.7;
                obj1.rotation.z=0;
                obj1.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.material.Map = new THREE.TextureLoader().load('models/space-gun/textures/Spacegun_LP_01_-_Default_BaseColor.png');
                        //child.castShadow = true;
                        //child.receiveShadow = false;
                        //child.flatshading = true;
                    }
                } );

                scene.add( obj1 );
            } );
}

var powerLine;

function removestarfire(){
    scene.remove(powerLine);
}

function starfire(x){
    var powerLineGeometry = new THREE.Geometry();
    var vec;
    if(x==0){
        vec=new THREE.Vector3(mouse.x, mouse.y , 0.5);
    } else if(x==1){
        vec=stars[0].star.position;
    }
    console.log(vec);
    powerLineGeometry.vertices.push(new THREE.Vector3(0, 20, -300), vec);
    var powerLineMaterial = new THREE.LineDashedMaterial({
        color: 0x22ff00,
        linewidth: 10,
        dashSize: 1,
        gapSize: 2
    });

 
    powerLine = new THREE.Line(powerLineGeometry, powerLineMaterial);
    powerLine.dashScale = 0.3;
    scene.add(powerLine);

    setTimeout(removestarfire, 100);
}


function initGui() {

	gui = new GUI();

	var param = {
                    'Directional Light': 0,
					'Dir Light on X': 50,
                    'Dir Light on Y': 200,
                    'Dir Light on Z': 100,
                    'Music': 0
		};

	gui.add( param, 'Directional Light', { 'On': 0, 'Off': 1 } ).onChange( function ( val ) {

			switch ( val ) {

				case '0':
					scene.add(light);
					break;

				case '1':
					scene.remove(light);
					break;
				}

	} );

	gui.add( param, 'Dir Light on X', -150, 200 ).onChange( function ( val ) {

                light.position.x = val;

		} );

    gui.add( param, 'Dir Light on Y', -0, 400 ).onChange( function ( val ) {

                light.position.y = val ;

        } );

    gui.add( param, 'Dir Light on Z', -100, 300 ).onChange( function ( val ) {

                light.position.z = val ;

        } );

    gui.add( param, 'Music', { 'On': 0, 'Off': 1 } ).onChange( function ( val ) {

			switch ( val ) {

				case '0':
					sound_general.play();
					break;

				case '1':
					sound_general.pause();
					break;
				}

	} );

		
}