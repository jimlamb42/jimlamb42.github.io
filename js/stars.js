/**
 * Created by James Lamb on 4/12/2015.

    Feature list:

    Priority:
    1. make particle movement independent of scale to avoid global movement
    2. Gui fullscreen toggle
    3. Gui Song Selection
    4. Gui FPS Toggle
    5. Smooth textures in star4.png (darken tool)

    Extra:
    0. Change unison track
    1. beatmatching to rotation speed and side line movement
    2. LENS FLARES
    3. upon reaching a threshold particles extend out until they pass 20 then their value is reset
    (detach from rotation?)
    4.modify the smoothing variable and remove the 50 limit pass statement?
    5.having loading come up between song transition



    Indefinate Hold:
    3 Ball morph

    Done:
    multiple sphere
    multiple particles
    loading going away
    sprite variation
    cube length and width modifer
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
    analyser.fftSize = 128;
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
var centerHole = 6;

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


scene.fog	= new THREE.Fog( 0x000000, 20,30 );


/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////            SPHERE            ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function makeSphere() {
    //creates sphere
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    //Code for Multi materials ( not working )
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
    var sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    //scene.add(sphere);
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


    return [sphere, glowSprite];
}
var sphere1 = makeSphere();

//small sphere 1
var ss2x = -6.5;
var ss2y = -6.5;
var ss2z = 0;
var ss2 = makeSmallSphere(ss2x,ss2y,ss2z);

var sphere2 = ss2[0];
var glowSprite2 = ss2[1];
var sphereGroup2 = new THREE.Object3D();
sphereGroup2.add(sphere2);
scene.add(sphereGroup2);

//Second small sphere
var ss3x = 7.5;
var ss3y = 7.5;
var ss3z = 0;
var ss3 = makeSmallSphere(ss3x,ss3y,ss3z);

var sphere3 = ss3[0];
var glowSprite3 = ss3[1];
var sphereGroup3 = new THREE.Object3D();
sphereGroup3.add(sphere3);
scene.add(sphereGroup3);

//third small sphere
var ss4x = 7;
var ss4y = -7;
var ss4z = 0;
var ss4 = makeSmallSphere(ss4x,ss4y,ss4z);

var sphere4 = ss4[0];
var glowSprite4 = ss4[1];
var sphereGroup4 = new THREE.Object3D();
sphereGroup4.add(sphere4);
scene.add(sphereGroup4);

//fourth small sphere
var ss5x = -8;
var ss5y = 8;
var ss5z = 0;
var ss5 = makeSmallSphere(ss5x,ss5y,ss5z);

var sphere5 = ss5[0];
var glowSprite5 = ss5[1];
var sphereGroup5 = new THREE.Object3D();
sphereGroup5.add(sphere5);
scene.add(sphereGroup5);



//Temp lensFlare code
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
var particleTexture = THREE.ImageUtils.loadTexture('media/particle.png');

function makeParticles(particleTexture, totalParticles, radiusRange) {

    var particleGroup = new THREE.Object3D();
    var particleAttributes = {startSize: [], startPosition: [], randomness: []};

    for (var i = 0; i < totalParticles; i++) {
        var spriteMaterial = new THREE.SpriteMaterial({
            map: particleTexture,
            useScreenCoordinates: false, color: 0xffffff
        });

        var sprite = new THREE.Sprite(spriteMaterial);
        var spriteX = randomRange(3, 5);
        var spriteY = spriteX;
        sprite.scale.set(spriteX, spriteY, 1.0); // imageWidth, imageHeight
        sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

        sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));

        //sprite.material.color.set(0xffffff);
        sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
        sprite.material.color.set(0xCCCCDD);
        particleGroup.add(sprite);
        particleAttributes.startPosition.push(sprite.position.clone());
        particleAttributes.randomness.push(Math.random());
    }
    particleGroup.position.z = 0;
    return [particleGroup, particleAttributes];
}
/// (Texture, totalParticles, radiusRange)
var pg1 = makeParticles(particleTexture,64,10);
var particleGroup1 = pg1[0];
var particleAttributes1 = pg1[1];
scene.add( particleGroup1 );

var pg2 = makeParticles(particleTexture,16,4.5);
var particleGroup2 = pg2[0];
var particleAttributes2 = pg2[1];
scene.add( particleGroup2 );


var pg3 = makeParticles(particleTexture,16,4.5);
var particleGroup3 = pg3[0];
var particleAttributes3 = pg3[1];
scene.add( particleGroup3 );


var pg4 = makeParticles(particleTexture,16,4.5);
var particleGroup4 = pg4[0];
var particleAttributes4 = pg4[1];
scene.add( particleGroup4 );


var pg5 = makeParticles(particleTexture,16,4.5);
var particleGroup5 = pg5[0];
var particleAttributes5 = pg5[1];
scene.add( particleGroup5 );




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
 fulscreen toggle

 */

// transparently support window resize
THREEx.WindowResize.bind(renderer, camera);

// allow 'f' to go fullscreen where this feature is supported
if( THREEx.FullScreen.available() ){
    THREEx.FullScreen.bindKey();
}else{
    document.getElementById('fullscreenDoc').style.display	= "none";
}



var gui = new dat.GUI();
gui.close();
var parameters =
{
    S : '...',    // dummy value, only type is important
    f : function(){}// note this does not actually activate any function
    //F: false // boolean (checkbox)
};

function newSong(){
    var song = parameters.S;
    if (song == "Mitis") {
        loadSound("media/Mitis.mp3");
        context.start();
        load = true;
    }
    else if (song == "Bangarang") {
        loadSound("media/Bangarang.mp3");
        context.start();
        load = true;
    }
    else if (song == "Seven") {
        loadSound("media/Seven.mp3");
        context.start();
        load = true;
    }
    else if (song == "Time") {
        loadSound("media/Time.mp3");
        context.start();
        load = true;
    }
    else if (song == "Unison") {
        loadSound("media/Unison.mp3");
        context.start();
        load = true;
    }
}

//gui.add( parameters, 'F' ).name('Full Screen');
gui.add(parameters, 'f').name("F for FullScreen");
var songList = gui.add(parameters,'S',
    ["Mitis", "Bangarang", "Seven", "Time", "Unison"]).name("Songs").listen();
    songList.onChange(function(value){
        newSong();
});


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


    var total = 0;


    ////////////////////////////////////////////Particle code////////////////////////////////////////
    var time = 4 * clock.getElapsedTime();
    var mod =1;
    var base = 120;
    var gate =120;

    //Second Particle Group
    particleGroup2.position.copy(sphere2.matrixWorld.getPosition());
    for ( var c2 = 0; c2 < particleGroup2.children.length; c2 ++ ){
        var sprite2 = particleGroup2.children[ c2 ];
            mod = dataArray[total + c2];
        if(mod < gate){
            mod =base;
        }
        var pulseFactor = mod/220;
        sprite2.position.x = particleAttributes2.startPosition[c2].x * pulseFactor;
        sprite2.position.y = particleAttributes2.startPosition[c2].y * pulseFactor;
        sprite2.position.z = particleAttributes2.startPosition[c2].z * pulseFactor;}
    // rotate the entire group
    //particleGroup2.rotation.x = time * 0.25;
    particleGroup2.rotation.y = time * 0.5;
    particleGroup2.rotation.z = time * .25;
    total += particleGroup2.children.length;


    //Third Particle Group
    particleGroup3.position.copy(sphere3.matrixWorld.getPosition());
    for ( var c3 = 0; c3 < particleGroup3.children.length; c3 ++ ){
        var sprite3 = particleGroup3.children[ c3 ];
        mod = dataArray[total + c3];
        if(mod < gate){
            mod =base;
        }
        sprite3.position.x = particleAttributes3.startPosition[c3].x * pulseFactor;
        sprite3.position.y = particleAttributes3.startPosition[c3].y * pulseFactor;
        sprite3.position.z = particleAttributes3.startPosition[c3].z * pulseFactor;}
    // rotate the entire group
    particleGroup3.rotation.x = time * 0.25;
    //particleGroup3.rotation.y = time * 0.5;
    particleGroup3.rotation.z = time * .25;
    total += particleGroup3.children.length;


    for ( var c = 0; c < particleGroup1.children.length; c ++ ){
        var sprite = particleGroup1.children[ c ];

        // 100 used to be 50

        mod = dataArray[total + c];
        if(mod < gate){
            mod =base;
        }

        sprite.position.x = particleAttributes1.startPosition[c].x * pulseFactor;
        sprite.position.y = particleAttributes1.startPosition[c].y * pulseFactor;
        sprite.position.z = particleAttributes1.startPosition[c].z * pulseFactor;
    }
    // rotate the entire group
    particleGroup1.rotation.x = time * 0.25;
    particleGroup1.rotation.y = time * 0.5;
    // particleGroup.rotation.z = time * .75;
    total += particleGroup1.children.length;


    //Fourth particle Group
    particleGroup4.position.copy(sphere4.matrixWorld.getPosition());
    for ( var c4 = 0; c4 < particleGroup4.children.length; c4 ++ ){
        var sprite4 = particleGroup4.children[ c4 ];
        mod = dataArray[total + c4];
        if(mod < gate){
            mod =base;
        }
        sprite4.position.x = particleAttributes4.startPosition[c4].x * pulseFactor;
        sprite4.position.y = particleAttributes4.startPosition[c4].y * pulseFactor;
        sprite4.position.z = particleAttributes4.startPosition[c4].z * pulseFactor;}
    // rotate the entire group
    particleGroup4.rotation.x = time * 0.5;
    particleGroup4.rotation.y = time * 0.25;
    // particleGroup.rotation.z = time * .75;
    total += particleGroup4.children.length;


    //Fifth particle Group
    particleGroup5.position.copy(sphere5.matrixWorld.getPosition());
    for ( var c5 = 0; c5 < particleGroup5.children.length; c5 ++ ){
        var sprite5 = particleGroup5.children[ c5];
        mod = dataArray[total + c5];
        if(mod < gate){
            mod =base;
        }
        sprite5.position.x = particleAttributes5.startPosition[c5].x * pulseFactor;
        sprite5.position.y = particleAttributes5.startPosition[c5].y * pulseFactor;
        sprite5.position.z = particleAttributes5.startPosition[c5].z * pulseFactor;}
    // rotate the entire group
    //particleGroup5.rotation.x = time * 0.25;
    particleGroup5.rotation.y = time * 0.25;
    particleGroup5.rotation.z = time * .5;
    //total += particleGroup5.children.length;



    //////////////////////////////////////////SPHERES/////////////////////////////////////
    sphereGroup2.rotation.y= time * 0.2;
    sphereGroup2.rotation.z = time * 0.2;
    sphereGroup2.rotation.x = time * 0.2;
    glowSprite2.position.copy(sphere2.matrixWorld.getPosition());

    sphereGroup3.rotation.x= time * 0.13;
    sphereGroup3.rotation.y = time * 0.13;

    glowSprite3.position.copy(sphere3.matrixWorld.getPosition());

    sphereGroup4.rotation.z= time * 0.21;

    sphereGroup4.rotation.y= time * 0.21;
    glowSprite4.position.copy(sphere4.matrixWorld.getPosition());

    sphereGroup5.rotation.y= time * 0.2;
    sphereGroup5.rotation.z = time * 0.2;
    sphereGroup5.rotation.x = time * 0.2;
    glowSprite5.position.copy(sphere5.matrixWorld.getPosition());




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
