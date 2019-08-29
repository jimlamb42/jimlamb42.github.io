/**
 * Created by James on 4/12/2015.

    Feature list:

    modify the smoothing variable and remove the 50 limit pass statement

    1. Loading not going away
    2. make particle movement independent of scale to avoid global movement
    6. Smooth textures in star4 (darken tool)

    7. beatmatching to rotation speed and side line movement
    8. LENS FLARES
    9. upon reaching a threshold particles extend out until they pass 2000 then their value is reset
    (detach from rotation?)

    Indefinate Hold:
    3 Ball morph

    Done:
    sprite variation
    cube length and width modifyer
    Looping
    Tube (Pretty much)
    controls start closed
    color matching

 */

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////           SETUP           /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////



//creates the scene
var scene = new THREE.Scene();
//creates camera
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 30 );
//creates rednder
var renderer = new THREE.WebGLRenderer();


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );





//Utility

//Emulates the map function of processing
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            AUDIO            ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// check if the default naming is enabled, if not use the chrome one.
if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}

var context = new AudioContext();
var sourceNode;


// load the sound
setupAudioNodes();
loadSound("media/Seven.mp3");

function setupAudioNodes() {
    // create a buffer source node
    sourceNode = context.createBufferSource();
    // and connect to destination
    sourceNode.connect(context.destination);
}

// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            playSound(buffer);
        }, onError);
    };
    request.send();
}


function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.loop = true;
    context.loop = true;
    sourceNode.start(0);
}

// log if an error occurs
function onError(e) {
    console.log(e);
}


//////////////////////////////////////ANALYSER///////////////////////////////////

//establishes the analyser
    var analyser = context.createAnalyser();
// connects it to the audio source
    sourceNode.connect(analyser);
//???
    var smooth = 1;
    analyser.smoothingTimeConstant = smooth;
    //number of sample points
    analyser.fftSize = 2048;
//???
    var bufferLength = analyser.frequencyBinCount;
//creates the array for the values
    var dataArray = new Uint8Array(bufferLength);








/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            STARS             ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


//Position variables
var zView = 21;
var depth = 21;
var width = 11;
var centerHole = 6 ;

camera.position.z = zView;


//////////////////////////////LIGHTING////////////////////////////
//lighting
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
var pointLight = new THREE.PointLight( 0xCCCCDD, 15, 20 );
pointLight.position.set( 0, 0,zView -1 );
scene.add( pointLight );




function randomRange(min, max){
    return Math.random()*(max-min) + min;
}

//cubes

var cubeArray = [];
for(var zpos= -depth; zpos<depth; zpos+= .1) {
    var randW = randomRange(.02,.08);
    var randD = randomRange(3, 6);
    var geometry = new THREE.BoxGeometry(randW, randW, randD);
    var material = new THREE.MeshPhongMaterial({color: 0x141414});
    var cube = new THREE.Mesh(geometry, material);
    var randX = randomRange(-width, width);
    var randY = randomRange(-width, width);


    if((randX<-centerHole ||randX>centerHole)&&
        (randY<-centerHole || randY > centerHole)){
        cubeAdd(cube);
    }else if (randX< -centerHole){
        cubeAdd(cube);
    }else if (randX> centerHole){
        cubeAdd(cube);
    }else if (randY > centerHole){
        cubeAdd(cube);
    }else if (randY < -centerHole){
        cubeAdd(cube);
    }
}
function cubeAdd(cube){
    cube.position.y = randY;
    cube.position.x = randX;
    scene.add(cube);
    cubeArray.push(cube);
    cube.position.z = zpos;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            TUNNEL             //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//(3000,...
var tunnelGeometry	= new THREE.CylinderGeometry( 50, 0, 35, 32, 20, true );
texture		= THREE.ImageUtils.loadTexture( "media/star4.jpg" );
texture.wrapT	= THREE.RepeatWrapping;

var tunnelMaterial	= new THREE.MeshBasicMaterial({ map : texture,
    side: THREE.BackSide});
var mesh	= new THREE.Mesh( tunnelGeometry, tunnelMaterial );
mesh.rotation.x	= Math.PI/2;
mesh.position.set(0,0,0);
mesh.flipSided	= true;
scene.add( mesh );

//(x,1000,x)
scene.fog	= new THREE.Fog( 0x000000, 20,30 );


/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            SPHERE            ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function makeSphere() {
    //creates sphere
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
   // var accentMaterial = new THREE.MeshBasicMaterial({color: 0x191919, transparent: true,
   //     useScreenCoordinates: false, blending:THREE.AdditiveBlending});
   // var multiMaterial = [ sphereMaterial, accentMaterial ];
    var sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(0,0,0);
// adds sprite
    var glowSpriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.ImageUtils.loadTexture("media/glow4.png"),
        useScreenCoordinates: false,
        color: 0xFFFFFF, transparent: true, blending: THREE.AdditiveBlending
    });
    var glowSprite = new THREE.Sprite(glowSpriteMaterial);

    glowSprite.material.color.set(0xCCCCDD);
    glowSprite.scale.set(16, 16, 0.1);
    scene.add(glowSprite);
    glowSprite.position.set(0,0,0);


    return sphere;
}


function makeSmallSphere(x,y,z) {
    //creates sphere

    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    // var accentMaterial = new THREE.MeshBasicMaterial({color: 0x191919, transparent: true,
    //     useScreenCoordinates: false, blending:THREE.AdditiveBlending});
    // var multiMaterial = [ sphereMaterial, accentMaterial ];
    var sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
// adds sprite
    var glowSpriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.ImageUtils.loadTexture("media/glow4.png"),
        useScreenCoordinates: false,
        color: 0xCCCCDD, transparent: true, blending: THREE.AdditiveBlending
    });
    var glowSprite = new THREE.Sprite(glowSpriteMaterial);

    glowSprite.material.color.set(0xCCCCDD);
    glowSprite.scale.set(8, 8, 0.1);
    scene.add(glowSprite);
    glowSprite.position.x = x;
    glowSprite.position.y = y;
    glowSprite.position.z = z;
    //glowSprite.position.copy( sphere.matrixWorld.getPosition() );


    return [sphere, glowSprite];
}
var sphere1 = makeSphere();
var ss1x = -5;
var ss1y = -5;
var ss1z = 0;
var ss2 = makeSmallSphere(ss1x,ss1y,ss1z);

var sphere2 = ss2[0];
var glowSprite2 = ss2[1];



/**
var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}
*/



/**
//Spotlight for Lens Flare
var pointColor = "#303030";
var spotLight = new THREE.SpotLight(pointColor);
spotLight.position.set(0, 0, 0);
spotLight.target = sphere1;
scene.add(spotLight);
//Lens Flare
var textureFlare = THREE.ImageUtils.loadTexture("media/lensflare.png");
var flareColor = new THREE.Color(0xFFFFFF);
var lensFlare = new THREE.LensFlare(textureFlare, -1,.5, flareColor);
lensFlare.position.set(0,0,0);
    scene.add(lensFlare);
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            PARTICLES         ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

var clock = new THREE.Clock();

var particleTexture = THREE.ImageUtils.loadTexture( 'media/particle.png' );

var particleGroup = new THREE.Object3D();
var particleAttributes = { startSize: [], startPosition: [], randomness: [] };

var totalParticles = 70;
var radiusRange = 10;
for( var i = 0; i < totalParticles; i++ )
{
    var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture,
        useScreenCoordinates: false, color: 0xffffff } );

    var sprite = new THREE.Sprite( spriteMaterial );
    var spriteX = randomRange(3,5);
    var spriteY = spriteX;
    sprite.scale.set(spriteX, spriteY, 1.0 ); // imageWidth, imageHeight
    sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

    sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );

    //sprite.material.color.set(0xffffff);
    sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
    sprite.material.color.set(0xCCCCDD);
    particleGroup.add( sprite );
    particleAttributes.startPosition.push( sprite.position.clone() );
    particleAttributes.randomness.push( Math.random() );
}
particleGroup.position.z =0;
scene.add( particleGroup );


/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            FPS/CONTROLS      ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//USed for FPS counter
function initStats() {
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.bottom = '0px';
    $("#Stats-output").append( stats.domElement );
    return stats;
}
var stats = initStats();
/**
 * Gui on side options:

 Song selection
 slider for partical distance modifier
 Smoothing

 */

// transparently support window resize
THREEx.WindowResize.bind(renderer, camera);

// allow 'f' to go fullscreen where this feature is supported
if( THREEx.FullScreen.available() ){
    THREEx.FullScreen.bindKey();
}else{
    document.getElementById('fullscreenDoc').style.display	= "none";
}


/**
var gui = new dat.GUI();
gui.close();
var parameters =
{
    a : '...',    // dummy value, only type is important
    c : "#000055", // color (hex)
    p: 1, // numeric slider Particle Distance Modifier
    s: 1, // numeric slider Smoothing
    v: false // boolean (checkbox) USE FOR V BYPASS




    //e: "#ff8800", // color (hex)
    //f: function() { alert("Hello!") },
    //g: function() { alert( parameters.c ) },
    // c: "Hello, GUI!", // string
    //w: "...", // dummy value, only type is important
    //x: 0, y: 0, z: 0
};


gui.add(parameters, 's').min(0.01).max(4).step(.01).name('Smoothing');
gui.add( parameters, 'p' ).min(128).max(256).step(1).name('Particle Distance');
gui.add( parameters, 'd' ).name('V Bypass');
var songList = ["Mitis.mp3", "Bangarang.mp3", "Seven.mp3", "Time.mp3", "Unison.mp3"];
gui.add( parameters, 'v', songList ).name('Songs');


*/
/**
 * gui.add( parameters )
 * gui.add( parameters, 'a' ).name('Number');
 * gui.add( parameters, 'c' ).name('String');
 * gui.add( parameters, 'f' ).name('Say "Hello!"');
 * gui.add( parameters, 'g' ).name("Alert Message");
 * var folder1 = gui.addFolder('Coordinates');
 * folder1.add( parameters, 'x' );
 * folder1.add( parameters, 'y' );
 * folder1.close();
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            RENDER LOOP        //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//Moves the camera from side to side
var right = true;
    //moves the camera up and down
var upper = true;

camera.position.x = - 3;

// loading variables
var loadText = THREE.ImageUtils.loadTexture( 'media/loading.png' );
loadText.minFilter = THREE.LinearFilter;
var loadingMat = new THREE.SpriteMaterial( { map: loadText, useScreenCoordinates: true} );
var loadingSprite = new THREE.Sprite( loadingMat );
var load = true;

///Sphere rotation variables
var vector2 = new THREE.Vector3( -5, -5, 0 );
var vector2a = new THREE.Vector3(0,0,0);
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);
var angle2 = .03;
var angle3 = .04;

var work = true;
//excecuted each frame
function render() {



    //Used for the FPS stats
    stats.update();

    //Creates and moves the star field
    for (var i =0; i<cubeArray.length; i++){
        var aCube = cubeArray[i];
        aCube.position.z += .4;
        if(aCube.position.z> depth){
            aCube.position.z -= (depth *2);
        }
    }

    //analyser code
    //populates the dataArray with the frequency values 1-255
    analyser.getByteTimeDomainData(dataArray);

    var v = dataArray[7];
    v = map_range(v, 0, 255, 1, 3)/2.5;

    ///////Particle code//////
    var time = 4 * clock.getElapsedTime();
    for ( var c = 0; c < particleGroup.children.length; c ++ ){
        var sprite = particleGroup.children[ c ];
        var mod = 1;
        // 100 used to be 50
        if (dataArray[(10*c)]>100){
           mod = dataArray[(10*c)];
        }
        var pulseFactor = mod/220;
        sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
        sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor;
        sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor;
    }
    // rotate the entire group
     particleGroup.rotation.x = time * 0.25;
    particleGroup.rotation.y = time * 0.5;
    // particleGroup.rotation.z = time * .75;



    //////////////////////////////////////////SPHERES/////////////////////////////////////

if(work) {
    vector2.applyAxisAngle(yAxis, angle2);
    sphere2.position.x = vector2.getComponent(0);
    sphere2.position.y = vector2.getComponent(1);
    sphere2.position.z = vector2.getComponent(2);
    glowSprite2.position.copy(sphere2.matrixWorld.getPosition());

    vector2a.setComponent(0, vector2.getComponent(0));
    vector2a.setComponent(1, vector2.getComponent(1));
    vector2a.setComponent(2, vector2.getComponent(0));
    work = false;
}else {
    vector2a.applyAxisAngle(xAxis, angle2);
    sphere2.position.x = vector2a.getComponent(0);
    sphere2.position.y = vector2a.getComponent(1);
    sphere2.position.z = vector2a.getComponent(2);
    glowSprite2.position.copy(sphere2.matrixWorld.getPosition());

    vector2.setComponent(0, vector2a.getComponent(0));
    vector2.setComponent(1, vector2a.getComponent(1));
    vector2.setComponent(2, vector2a.getComponent(0));
    work = true;
}






    /////////////////////////////////////////LOADING/////////////////////////////////////

    if(load){
        loadingSprite.position.set( 0, -window.innerHeight/200, 16 );
        loadingSprite.scale.set( 8,3, 1.0 ); // imageWidth, imageHeight
        scene.add( loadingSprite );
    }

    var firstValue = dataArray[1];
    if (firstValue> 128){
        load = false;
        scene.remove(loadingSprite);
    }

    /////////////////////////////////////TUNNEL/////////////////////////////////////////
    // move the texture to give the illusion of moving thru the tunnel
    texture.offset.y	-= 0.008;
    texture.offset.y	%= 1;
    texture.needsUpdate	= true;


//Moves the camera from side to side
  camera.lookAt(sphere1.position);

    if (camera.position.x < -3.9){
        right = true;
    }
    if (camera.position.x > 3.9){
        right = false;
    }
    if (camera.position.y < - 3.9){
        upper = true;
    }
    if (camera.position.y > 3.9){
        upper = false;
    }
    if (camera.position.x < 4 && right) {
        camera.position.x += .02;
    }
    if (camera.position.x > -4 && right == false){
        camera.position.x -= .02;
    }
    if (upper){
        camera.position.y +=.02;
    }else{
        camera.position.y -= .02;
    }

    requestAnimationFrame( render );
    renderer.render( scene, camera );

}
render();
