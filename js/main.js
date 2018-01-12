var container, stats, gui;
var switchCamera, scene, renderer;
var roamingCamera, cameraControl;
var goRoaming = false, roamingStatus = false;
var tween;
var trackCamera = new Map();
var renderCamera;
var needSet = true;
var curBody = "Galaxy", nextBody = curBody;
var saveCur, saveNext;
var orbitDraw = new Map();
var clock = new THREE.Clock();
var tick = 0;
var cometSet = true;
var lastCometX, lastCometY, lastCometZ;
var params = {
    Camera: "Galaxy",
};
var calculateParams;
var orbitParams;
var firstflag = true;

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
    verticalSpeed: 1.33,    timeScale: 1
};

init();
animate();

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}
function initCamera() {
    roamingCamera = new cameraParameters(3000, 200, "Astronaut");
    switchCamera = new cameraParameters(3000, 200, "Sun");
    switchCamera.setCamera();
    trackCamera["Galaxy"] = new cameraParameters(3000, 200, "Sun");
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





function drawOrbit(color, celestialBody) {
    var radius = celestialBody.orbit.semiMajorAxis;
    var angle = celestialBody.orbit.inclination / 180.0 * Math.PI;
    var size = 360 / radius;
    var orbit = new THREE.Geometry();
    var e = celestialBody.orbit.eccentricity;
    var material = new THREE.LineBasicMaterial({ vertexColors: true });
    for (var i = 0; i <= radius; i++) {
        var segment = (i * size) * Math.PI / 180;
        var r = radius*(1-e*e)/(1+e*Math.cos(segment));
        orbit.vertices.push(new THREE.Vector3((Math.cos(segment) * r +radius*e)* Math.cos(angle),
            (Math.cos(segment) * r +radius*e)* Math.sin(angle),
            Math.sin(segment) * r));
        var color1 = new THREE.Color(0xffffff);  
        var quad = (radius / 4.0);
        if (i < quad) {
            color1.setRGB((0 + (4 * i / radius) * 100) / 255, (50 + (4 * i / radius) * 50) / 255, 100.0 / 255 );
        } else if ( i >= quad && i < 2 * quad) {
            color1.setRGB((100 - (4 * i / radius - 1) * 100) / 255, (100 - (4 * i / radius - 1) * 50) / 255, 100.0 / 255 );
        } else if ( i >= 2 * quad && i < 3 * quad) {
            color1.setRGB((0 + (4 * i / radius - 2) * 100) / 255, (50 + (4 * i / radius - 2) * 50) / 255, 100.0 / 255 );
        } else {
            color1.setRGB((100 - (4 * i / radius - 3) * 100) / 255, (100 - (4 * i / radius - 3) * 50) / 255, 100.0 / 255 );
        }
        
        orbit.colors.push(color1);
    }
    return new THREE.Line(orbit, material);
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
    var orbits = ["Comet", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Uranus", "Neptune", "Pluto"];
    for (var i in orbits) {
        orbitDraw[orbits[i]] = drawOrbit(0xffffff, celestialBodies[orbits[i]]);
    }
    for (var objKey in celestialBodies) {
        celestialBodies[objKey].generateObjectsOnScene(scene);
    }
    for (var objKey in celestialBodies) {
        if (celestialBodies[objKey].parent != null)
            celestialBodies[objKey].parent = celestialBodies[celestialBodies[objKey].parent];
    }
}


function initGui() {
    gui.add(params, 'Camera', ["Galaxy", "Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]).onChange(function (val) {
        nextBody = val;
        if (nextBody != switchCamera.body || (curBody == "Galaxy" && nextBody == "Sun")) {
            initTween();
            cameraCopy(switchCamera, trackCamera[curBody]);
            setTween(curBody, nextBody);
            tween.start();
        }
    });

    var calculate = gui.addFolder('Calculate');
    calculateParams = {Sun:true, Comet: true, Mercury: false, Venus: false, Earth: false, Mars: false, Jupiter: false, Saturn: false, Uranus: false, Neptune: false, Pluto: false};
    for (var i in calculateParams)
        calculate.add(calculateParams, i);
    var orbit = gui.addFolder('Orbit');
    orbitParams = {Comet: true, Mercury: false, Venus: false, Earth: true, Mars: false, Jupiter: false, Saturn: false, Uranus: false, Neptune: false, Pluto: false};
    for (var i in orbitParams)
        orbit.add(orbitParams, i);
    
    var control = new function () {
        this.Roam = function () {
            if (roamingStatus == false) {
                roamingCamera.camera.position.x = celestialBodies["Astronaut"].objectGroup.position.x;
                roamingCamera.camera.position.y = celestialBodies["Astronaut"].objectGroup.position.y;
                roamingCamera.camera.position.z = celestialBodies["Astronaut"].objectGroup.position.z;
                goRoaming = true;
                initTween();
                cameraCopy(switchCamera, trackCamera[curBody]);
                setTween(curBody, null, celestialBodies["Astronaut"].objectGroup.position.x, celestialBodies["Astronaut"].objectGroup.position.y, celestialBodies["Astronaut"].objectGroup.position.z);
                tween.start();
            } else {
                cameraControl.dispose();
                roamingStatus = false;
                initTween();
                setTween(null, curBody, roamingCamera.camera.position.x, roamingCamera.camera.position.y, roamingCamera.camera.position.z);
                tween.start();
            }
        };
    };
    gui.add(control, "Roam");
}


function init() {
    container = document.getElementById('container');
    initCamera();
    initScene();
    initLight();
    initObjects();
    initRender();
    renderCamera = trackCamera["Galaxy"];
    stats = new Stats();
    gui = new dat.GUI();
    gui.close();
    window.addEventListener('mousedown', onWindowMouseDown, false);
    window.addEventListener('mousemove', onWindowMouseMove, false);
    window.addEventListener('mouseup', onWindowMouseUp, false);
    window.addEventListener('mousewheel', onMouseWheelChange, false);
    window.addEventListener('DOMMouseScroll', onMouseWheelChange, false);
    window.addEventListener('resize', onWindowResize, false);
    initGui()
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    if (roamingStatus)
        cameraControl.handleResize();
    renderCamera.aspect = window.innerWidth / window.innerHeight;
    renderCamera.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    if (roamingStatus)
        cameraControl.update(clock.getDelta());
    render();
    stats.update();
}

