var container, stats;
var camera, scene, renderer;
var trackCamera = new Map();
var clock = new THREE.Clock();
var gui = new dat.GUI();
var tick = 0;
var params = {
    Camera: "Galaxy",
};
var calculateParams;

var options = {
    position: new THREE.Vector3(),
    positionRandomness: .3,
    velocity: new THREE.Vector3(),
    velocityRandomness: 3.0,
    color: 0xaa88ff,
    colorRandomness: .2,
    turbulence: 0.,
    lifetime: 2.,
    size: 5,
    sizeRandomness: 1
};

var spawnerOptions = {
    spawnRate: 15000,
    horizontalSpeed: 1.5,
    verticalSpeed: 1.33,
    timeScale: 1
};

init();
animate();

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1e10);
    trackCamera["Galaxy"] = new cameraParameters(7500, 200, "Sun");
    trackCamera["Sun"] = new cameraParameters(200, 200, "Sun");
    trackCamera["Mercury"] = new cameraParameters(30, 30, "Mercury");
    trackCamera["Venus"] = new cameraParameters(30, 30, "Venus");
    trackCamera["Earth"] = new cameraParameters(30, 30, "Earth");
    trackCamera["Mars"] = new cameraParameters(30, 30, "Mars");
    trackCamera["Jupiter"] = new cameraParameters(150, 150, "Jupiter");
    trackCamera["Saturn"] = new cameraParameters(150, 150, "Saturn");
    trackCamera["Uranus"] = new cameraParameters(150, 150, "Uranus");
    trackCamera["Neptune"] = new cameraParameters(150, 150, "Neptune");
    trackCamera["Pluto"] = new cameraParameters(150, 150, "Pluto");
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    // renderer.shadowCameraNear = 3;
    // renderer.shadowCameraFar = camera.far;
    // renderer.shadowCameraFov = 50;
    // renderer.shadowMapBias = 0.0039;
    // renderer.shadowMapDarkness = 0.5;
    // renderer.shadowMapWidth = 1024;
    // renderer.shadowMapHeight = 1024;

    container.appendChild(renderer.domElement);
}

function initObjects() {
    // Add sky box
    var skyboxTextureFilenames = [
        "res/skybox/posX.jpg", "res/skybox/negX.jpg",
        "res/skybox/posY.jpg", "res/skybox/negY.jpg",
        "res/skybox/posZ.jpg", "res/skybox/negZ.jpg"];
    var materialArray = [];
    var skyGeometry = new THREE.CubeGeometry(10000000, 10000000, 10000000);
    for (var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: textureLoader.load(skyboxTextureFilenames[i]),
            side: THREE.BackSide
        }));
    var skyBox = new THREE.Mesh(skyGeometry, materialArray);
    skyBox.rotateX(Math.PI / 2);
    scene.add(skyBox);
    for (var objKey in celestialBodies) {
        celestialBodies[objKey].generateObjectsOnScene(scene);
    }
    for (var objKey in celestialBodies) {
        celestialBodies[objKey].parent = celestialBodies[celestialBodies[objKey].parent];
    }
}

function init() {
    container = document.getElementById('container');

    initCamera();
    initScene();
    initLight();
    initObjects();
    initRender();

    stats = new Stats();
    container.appendChild(stats.dom);
    window.addEventListener('mousedown', onWindowMouseDown, false);
    window.addEventListener('mousemove', onWindowMouseMove, false);
    window.addEventListener('mouseup', onWindowMouseUp, false);
    window.addEventListener('mousewheel', onMouseWheelChange, false);
    window.addEventListener('DOMMouseScroll', onMouseWheelChange, false);
    window.addEventListener('resize', onWindowResize, false);

    gui.add(params, 'Camera', ["Galaxy", "Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]);
    var calculate = gui.addFolder('Calculate');
    calculateParams = new function () {
        this.Sun = true;
        this.Comet = true;
        this.Mercury = false;
        this.Venus = false;
        this.Earth = true;
        this.Mars = false;
        this.Jupiter = false;
        this.Saturn = false;
        this.Uranus = false;
        this.Neptune = false;
        this.Pluto = false;
    };
    calculate.add(calculateParams, 'Comet');
    calculate.add(calculateParams, 'Mercury');
    calculate.add(calculateParams, 'Venus');
    calculate.add(calculateParams, 'Earth');
    calculate.add(calculateParams, 'Mars');
    calculate.add(calculateParams, 'Jupiter');
    calculate.add(calculateParams, 'Saturn');
    calculate.add(calculateParams, 'Uranus');
    calculate.add(calculateParams, 'Neptune');
    calculate.add(calculateParams, 'Pluto');
    gui.open();
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

