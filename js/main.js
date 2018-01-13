var container, stats, gui, promptSound;
var switchCamera, scene, renderer;
var roamingCamera, cameraControl;
var sunLight;
var ambientLight;
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
var cometParams;
var control;
var firstflag = true;

var options = {
    position: new THREE.Vector3(),
    positionRandomness: .3,
    velocity: new THREE.Vector3(),
    velocityRandomness: 3.0,
    color: 0x000011,
    colorRandomness: .2,
    turbulence: 0.,
    lifetime: 2.,
    size: 10,
    sizeRandomness: 2
};

var spawnerOptions = {
    spawnRate: 15000,
    horizontalSpeed: 1.5,
    verticalSpeed: 1.33, timeScale: 1,
};

$('.progress').progressInitialize();

var progressBar = $('#control');

progressBar.click(function (e) {
    e.preventDefault();
    progressBar.progressSet(0);
    pre();
    $(this).removeAttr('onclick');
});


function pre() {
    var manifest = [
        "res/callisto/diffuse.jpg",
        "res/comet/particle2.png",
        "res/comet/perlin-512.png",
        "res/deimos/diffuse.jpg",
        "res/deimos/bump.jpg",
        "res/dione/diffuse.jpg",
        "res/earth/diffuse.jpg",
        "res/earth/bump.jpg",
        "res/earth/clouds.png",
        "res/earth/night.png",
        "res/earth/spec.jpg",
        "res/effects/flare.jpg",
        "res/europa/diffuse.jpg",
        "res/io/diffuse.png",
        "res/jupiter/clouds.png",
        "res/jupiter/diffuse.jpg",
        "res/jupiter/ring.png",
        "res/loading/splash.png",
        "res/mars/diffuse.jpg",
        "res/mars/bump.jpg",
        "res/mercury/diffuse.jpg",
        "res/mercury/bump.jpg",
        "res/moon/diffuse.jpg",
        "res/moon/bump.jpg",
        "res/neptune/diffuse.jpg",
        "res/neptune/ring.png",
        "res/phobos/diffuse.jpg",
        "res/phobos/bump.jpg",
        "res/pluto/diffuse.jpg",
        "res/saturn/diffuse.png",
        "res/saturn/bump.png",
        "res/saturn/clouds.png",
        "res/saturn/ring.png",
        "res/skybox/posX.jpg",
        "res/skybox/posY.jpg",
        "res/skybox/posZ.jpg",
        "res/skybox/negX.jpg",
        "res/skybox/negY.jpg",
        "res/skybox/negZ.jpg",
        "res/sol/diffuse.png",
        "res/titan/diffuse.jpg",
        "res/uranus/diffuse.jpg",
        "res/uranus/ring.png",
        "res/venus/diffuse.jpg",
        "res/venus/bump.jpg",
        "res/venus/clouds.jpg",
    ];
    $.preLoad(manifest, {
        each: function (count) {
            progressBar.progressSet(count * 2);
            progressBar.attr({'data-loading': (parseInt(count / manifest.length * 100)).toString() + "%"});
        },
        all: function () {
            progressBar.progressSet(100);
            progressBar.attr({'data-loading': (100).toString() + "%"});
            init();
            animate();
        }
    });
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function initCamera() {
    roamingCamera = new cameraParameters(3000, 200, "Astronaut");
    switchCamera = new cameraParameters(3000, 200, "Sun");
    switchCamera.setCamera();
    trackCamera["Galaxy"] = new cameraParameters(7000, 200, "Sun");
    trackCamera["Galaxy"].theta = 80.0;
    trackCamera["Galaxy"].phi = 0.0;
    trackCamera["Comet"] = new cameraParameters(1000, 1000, "Comet");
    var planets = ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
    for (var i in planets) {
        trackCamera[planets[i]] = new cameraParameters(3.0 * celestialBodies[planets[i]].radius, 3.0 * celestialBodies[planets[i]].radius, planets[i]);
    }
    trackCamera["Ship"] = new cameraParameters(3.0 * celestialBodies["Ship"].radius, 3.0 * celestialBodies["Ship"].radius, "Ship")
}

function initLight() {
    // Add light
    sunLight = new THREE.PointLight(0xFFFFFF, 1.0);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.intensity = 0;
    scene.add(ambientLight)
    // sunLight.castShadow = true;
}


function drawOrbit(celestialBody) {
    var radius = celestialBody.orbit.semiMajorAxis;
    var angle = celestialBody.orbit.inclination / 180.0 * Math.PI;
    var size = 360 / radius;
    var orbit = new THREE.Geometry();
    var e = celestialBody.orbit.eccentricity;
    var material = new THREE.LineBasicMaterial({vertexColors: true});
    for (var i = 0; i <= radius; i++) {
        var segment = (i * size) * Math.PI / 180;
        var r = radius * (1 - e * e) / (1 + e * Math.cos(segment));
        orbit.vertices.push(new THREE.Vector3((Math.cos(segment) * r) * Math.cos(angle),
            (Math.cos(segment) * r) * Math.sin(angle),
            Math.sin(segment) * r));
        var color1 = new THREE.Color(0xffffff);
        var quad = (radius / 4.0);
        if (i < quad) {
            color1.setRGB((0 + (4 * i / radius) * 100) / 255, (50 + (4 * i / radius) * 50) / 255, 100.0 / 255);
        } else if (i >= quad && i < 2 * quad) {
            color1.setRGB((100 - (4 * i / radius - 1) * 100) / 255, (100 - (4 * i / radius - 1) * 50) / 255, 100.0 / 255);
        } else if (i >= 2 * quad && i < 3 * quad) {
            color1.setRGB((0 + (4 * i / radius - 2) * 100) / 255, (50 + (4 * i / radius - 2) * 50) / 255, 100.0 / 255);
        } else {
            color1.setRGB((100 - (4 * i / radius - 3) * 100) / 255, (100 - (4 * i / radius - 3) * 50) / 255, 100.0 / 255);
        }

        orbit.colors.push(color1);
    }
    return new THREE.Line(orbit, material);
}


function initRender() {
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    // renderer.shadowMap.enabled = true;
    // renderer.shadowCameraNear = 3;
    // renderer.shadowCameraFar = 100;
    // renderer.shadowMapDarkness = 0.2;
    // renderer.shadowCameraFov = 50;
    // renderer.shadowMapBias = 0.0039;
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
    var orbits = ["Comet", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
    for (var i in orbits) {
        orbitDraw[orbits[i]] = drawOrbit(celestialBodies[orbits[i]]);
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
    var calculate = gui.addFolder('Calculate');
    calculateParams = {
        Sun: true,
        Comet: true,
        Mercury: true,
        Venus: true,
        Earth: true,
        Mars: true,
        Jupiter: true,
        Saturn: true,
        Uranus: true,
        Neptune: true,
        Pluto: true
    };
    for (var i in calculateParams)
        calculate.add(calculateParams, i);
    var orbit = gui.addFolder('Orbit');
    orbitParams = {
        Comet: false,
        Mercury: false,
        Venus: false,
        Earth: false,
        Mars: false,
        Jupiter: false,
        Saturn: false,
        Uranus: false,
        Neptune: false,
        Pluto: false
    };
    var comet = gui.addFolder('CometParameters');
    cometParams = {
        Length: 6000.,
        Size: 15000.
    };
    comet.add(cometParams, "Length", 1000, 100000)
        .onChange(function () {
            window.removeEventListener('mousedown', onWindowMouseDown, false);
        })
        .onFinishChange(function () {
            window.addEventListener('mousedown', onWindowMouseDown, false);
        });
    comet.add(cometParams, "Size", 1000, 100000)
        .onChange(function () {
            window.removeEventListener('mousedown', onWindowMouseDown, false);
        })
        .onFinishChange(function () {
            window.addEventListener('mousedown', onWindowMouseDown, false);
        });
    for (var i in orbitParams)
        orbit.add(orbitParams, i);
    gui.add(params, 'Camera', ["Galaxy", "Sun", "Comet", "Ship", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]).onChange(function (val) {
        nextBody = val;
        if (nextBody != switchCamera.body || (curBody == "Galaxy" && nextBody == "Sun")) {
            initTween();
            cameraCopy(switchCamera, trackCamera[curBody]);
            setTween(curBody, nextBody);
            tween.start();
        }
    });
    control = new function () {
        this.Roam = function () {
            if (roamingStatus == false) {
                roamingCamera.camera.position.x = celestialBodies["Astronaut"].objectGroup.position.x;
                roamingCamera.camera.position.y = celestialBodies["Astronaut"].objectGroup.position.y;
                roamingCamera.camera.position.z = celestialBodies["Astronaut"].objectGroup.position.z;
                goRoaming = true;
                initTween();
                if (curBody != "Earth") {
                    saveNext = calculateParams["Earth"];
                    calculateParams["Earth"] = false;
                }
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
        this.Collision = false;
        this.Light = 1.0;
        this.Ambient = 0.0;
        this.TimeScale = 1.0;
        this.Screenshot = function () {
            var dataURL = renderer.domElement.toDataURL();
            var newWindow = window.open()
            var img = newWindow.document.createElement("img");
            img.src = dataURL;
            newWindow.document.body.appendChild(img);
        }
    };

    gui.add(control, 'Light', 0.0, 2.0)
        .onChange(function (val) {
            window.removeEventListener('mousedown', onWindowMouseDown, false);
            sunLight.intensity = val;
        })
        .onFinishChange(function () {
            window.addEventListener('mousedown', onWindowMouseDown, false);
        });
    gui.add(control, 'Ambient', 0.0, 1.0)
        .onChange(function (val) {
            window.removeEventListener('mousedown', onWindowMouseDown, false);
            ambientLight.intensity = val;
        })
        .onFinishChange(function () {
            window.addEventListener('mousedown', onWindowMouseDown, false);
        });
    gui.add(control, 'TimeScale', 0.0, 10.0)
        .onChange(function (val) {
            window.removeEventListener('mousedown', onWindowMouseDown, false);
            globalTime.scale = val;
        })
        .onFinishChange(function () {
            window.addEventListener('mousedown', onWindowMouseDown, false);
        });
    gui.add(control, "Collision");
    gui.add(control, "Roam");
    gui.add(control, "Screenshot");
    gui.autoPlace = false;
}


function init() {
    container = document.getElementById('container');
    promptSound = document.getElementById('promptSound');
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

function checkCrash() {
    var cameraPos = roamingCamera.camera.position.clone();
    for (var objKey in celestialBodies) {
        if (celestialBodies[objKey].parent == celestialBodies["Sun"]) {
            var r = celestialBodies[objKey].radius;
            var dX = celestialBodies[objKey].getX() - roamingCamera.camera.position.x;
            var dY = celestialBodies[objKey].getY() - roamingCamera.camera.position.y;
            var dZ = celestialBodies[objKey].getZ() - roamingCamera.camera.position.z;
            if (Math.sqrt(dX * dX + dY * dY + dZ * dZ) > 2 * r)
                continue;
            var localBodyPos = celestialBodies[objKey].objectGroup.position.clone();
            var globalBodyPos = localBodyPos.applyMatrix4(celestialBodies[objKey].objectGroup.matrix);
            var directVector = globalBodyPos.sub(cameraPos).normalize();
            var ray = new THREE.Raycaster(cameraPos, directVector);
            var collisionResults = ray.intersectObject(celestialBodies[objKey].objectGroup, true);
            if (collisionResults.length > 0 && collisionResults[0].distance < celestialBodies[objKey].radius + directVector.length()) {
                return true;
            }

        }
    }
    return false;
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    if (roamingStatus) {
        cameraControl.update(clock.getDelta());
        if (control.Collision && checkCrash()) {
            promptSound.play();
        }
    }
    render();
    stats.update();
}

