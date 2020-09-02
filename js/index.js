import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../jsm/loaders/MTLLoader.js';

var container;
var camera, scene, renderer;
var gun;
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
var direction=0;//dx
var moving=false;
var sound_general;
var startGame = false;
var game1=false;
var game2=false;
var tex;
var s=false;
var stars=[];
var caricatore;
var bordo;
var centro;
var accuratezza;
var sound_target;

function init() {
    punteggio=0;

    caricatore = 0;

    bordo = 0;

    centro = 0;

    accuratezza = 0;

    container = document.createElement( 'div' );

    container.setAttribute("id", "scena");

    document.body.appendChild( container );

    createScene();

    createGround();

    createTarget(0, 0, 0);

    createGun();

    clock.start();

    console.log(clock);

    createRenderer();

    createGeneralMusic();
    
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
  
    window.addEventListener("mousedown", onMouseDown);

    window.addEventListener("mousemove", onMouseMove);
}

function init2() {
    punteggio=0;

    container = document.createElement( 'div' );

    document.body.appendChild( container );

    createScene();

    createStar(0,0);

    createGun();

    createRenderer();

    createGeneralMusic();
    
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
  
    window.addEventListener("mousedown", onMouseDown);

    window.addEventListener("mousemove", onMouseMove);
}

function createScene(){
    if(game2){
        var loader = new THREE.TextureLoader();
        loader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture){
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

    var light = new THREE.DirectionalLight( 0xdfebff, 1 );
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
            objloader.load('models/Obj/Gold_Star.obj', function (obj1) {

                obj1.position.x=x;
                obj1.position.y=y;
                obj1.position.z=-1000;

                obj1.rotation.y=5;

                var texture = new THREE.TextureLoader().load('models/Obj/Bump.jpg');
                obj1.traverse(function (child) {   // aka setTexture
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                    }
                });
                stars.push(obj1);
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
        var mat1= new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 100, wireframe: false }) ;
        obj1.traverse(function (child) {   // aka setTexture
            if(child.name=="Cylinder"){
                child.material = mat;
            }if(child.name=="Torus"){
                child.material = mat1;
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
    mouse.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;	
    gun.rotation.y=(window.innerWidth/2-evt.clientX)/1500;
    gun.rotation.x=0.002+(window.innerHeight/2-evt.clientY)/1000;
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
    scene.remove(tex);
    createShotMusic();
    k=true;
    var raycaster = new THREE.Raycaster();	
    raycaster.setFromCamera(mouse,camera);
    var intersects = raycaster.intersectObjects( scene.children, true);
    if(game1){
    	caricatore += 1;
        if( intersects.length > 0 ) {
            console.log(intersects[0]);
            if(intersects[0].object.name=="low_for_paint_obj:polySurface1"){
                createTargetMusic();
                bordo+=1;
                punteggio += 1;
                updateHTML(punteggio);
                respawn();
            }else if(intersects[0].object.name=="Cylinder"){
                createTargetMusic();
                centro+=1;
                punteggio+=3;
                func(intersects[0].point.x,intersects[0].point.y);
                updateHTML(punteggio);
                respawn();
            }else{
                respawn();
            }
        }else{
            respawn();
        }
    }else if(game2){
        if( intersects.length > 0 ) {
            punteggio+=1;
            updateHTML(punteggio);
            if(intersects[0].object.name=="Star001"){
                respawnStar();
            }
        }
    }
}

function dd(){
    scene.remove(tex);
}

function func(x,y){
    var loader = new THREE.FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
            var geometry = new THREE.TextGeometry( "HeadShot", {
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
    var x=e.shift();
    if(x){
        scene.remove(x);
    }
}


function respawn(){
    del(t);
    del(tm);
    if(caricatore == 15){
    	console.log(clock.getElapsedTime());
    	console.log(clock);
   		// Get the modal
		var modal = document.getElementById("myModal");
		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

        var butt = document.getElementById("button");

        var r = (centro+bordo)/caricatore;

		var a = "<p>Centri:";

		var b = "</p><p>Bordi:";

		var c = "</p><p>Tempo:";

        var q = "</p><p>Accuratezza:";

        var d = "</p>";

		document.getElementById("stats").innerHTML = a.concat(String(centro), b, String(bordo), c, String(clock.getElapsedTime()), String(q), r, d);
		
		modal.style.display = "block";

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		  	modal.style.display = "none";
		  	location.reload(true);
		}

        butt.onclick = function() {
            modal.style.display = "none";
            location.reload(true);            
        }

    	return;
    }
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

function respawnStar(){
    del(stars);
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

function updateHTML(x){
    document.getElementById("score").innerHTML = x;
    return;
}

function onMouseDown(evt){
    fire();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var beta=0;

function animate( now ) {
    requestAnimationFrame(animate);

    tm.forEach(element => {
        if(direction==0){
            element.translateX(-1.8);
        }else if(direction==1){
            element.translateX(1.3);
        }
    });

    
    stars.forEach(e => {
        e.rotation.y+=0.1;
        beta+=0.08;
        e.position.x=e.position.x+(beta*Math.cos(beta)/50);
        e.position.y=e.position.y+(beta*Math.sin(beta)/50);
        if(e.scale.x > 0.03){
            e.scale.x -= 0.001;
            e.scale.y -= 0.001;
            e.scale.z -= 0.001;
        }
        
    })
    
    if(k){
        animateCloseHammer();
        setTimeout(animateOpenHammer,300);
    }  

    if(s){
        setTimeout(dd,100);
        s=false;
    }
    render();
}

function animate2( now ) {
    requestAnimationFrame(animate);

    tm.forEach(element => {
        if(direction==0){
            element.translateX(-1.8);
        }else if(direction==1){
            element.translateX(1.3);
        }
    });
    
    if(k){
        animateCloseHammer();
        setTimeout(animateOpenHammer,300);
    }  

    if(s){
        setTimeout(dd,100);
        s=false;
    }
    render();
}

function render() {
    renderer.render( scene, camera );
}

document.getElementById("start").addEventListener("click", function(){
    document.getElementById("start").style.display = "none";
    document.getElementById("start2").style.display = "none";
    game1=true;
    init();
    animate();
});

document.getElementById("start2").addEventListener("click", function(){
    document.getElementById("start2").style.display = "none";
    document.getElementById("start").style.display = "none";
    game2=true;
    init2();
    animate();
});

