var container, stats;
var camera, scene, renderer;

init();
animate();

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1e10);
}

function initLight() {
    // Add light
    var sunLight = new THREE.PointLight(0xFFFFFF);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);
}  

function initRender() {
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    // renderer.shadowCameraNear = 3;
    // renderer.shadowCameraFar = camera.far;
    // renderer.shadowCameraFov = 50;
    // renderer.shadowMapBias = 0.0039;
    // renderer.shadowMapDarkness = 0.5;
    // renderer.shadowMapWidth = 1024;
    // renderer.shadowMapHeight = 1024;

    container.appendChild( renderer.domElement );
}

function initObjects() {
    // Add sky box
    let skyboxTextureFilenames = [
        "res/skybox/posX.jpg", "res/skybox/negX.jpg",
        "res/skybox/posY.jpg", "res/skybox/negY.jpg",
        "res/skybox/posZ.jpg", "res/skybox/negZ.jpg"];
    var materialArray = [];
    var skyGeometry = new THREE.CubeGeometry(10000000, 10000000, 10000000);	
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: textureLoader.load(skyboxTextureFilenames[i]),
			side: THREE.BackSide
		}));
	var skyBox = new THREE.Mesh( skyGeometry, materialArray );
    scene.add(skyBox);
    for(objKey in celestialBodies) {
        celestialBodies[objKey].generateObjectsOnScene(scene);
    }
}

function init() {
    container = document.getElementById( 'container' );

    initCamera();
    initScene();
    initLight();
    initObjects();
    // createStars();
    initRender();

    stats = new Stats();
    container.appendChild( stats.dom );
    window.addEventListener( 'mousedown', onWindowMouseDown, false );
    window.addEventListener( 'mousemove', onWindowMouseMove, false );
    window.addEventListener( 'mouseup', onWindowMouseUp, false );
	window.addEventListener( 'mousewheel', onMouseWheelChange, false);
	window.addEventListener( 'DOMMouseScroll', onMouseWheelChange, false);
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

