var container, stats;
var camera, scene, renderer;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1e20);
    // camera.position.z = 10000;
    // camera.position.y = 5000;
    // camera.lookAt(0, 0, 0);
}

function initLight() {
    // Add light
    var sunLight = new THREE.PointLight(0xFFFFFF);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    // Add lense flare
    var flareTexture = textureLoader.load("res/effects/flare.jpg");
    var lensFlare = new THREE.LensFlare(flareTexture, 200, 0.0, THREE.AdditiveBlending, new THREE.Color( 0xffffff ));
    lensFlare.position.copy(sunLight.position);
    scene.add(lensFlare);
}

function initRender() {
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
}


function init() {
    container = document.getElementById( 'container' );

    initCamera();
    initScene();
    initLight();
    createStars();
    initRender();

    stats = new Stats();
    container.appendChild( stats.dom );
    container.addEventListener( 'mousedown', onContainerMouseDown, false );
    container.addEventListener( 'mousemove', onContainerMouseMove, false );
    container.addEventListener( 'mouseup', onContainerMouseUp, false );
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}

