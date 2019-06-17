var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var mouseStatus = {
    x: 0, y: 0,
    leftDown: false, centerDown: false, rightDown: false
};

function onWindowMouseMove(event) {
    // Keep the value in 0 -- 2 PI
    var body = params.Camera;
    if (mouseStatus.leftDown) {
        trackCamera[body].theta = trackCamera[body].theta % (2 * Math.PI);
        trackCamera[body].phi = trackCamera[body].phi % (0.5 * Math.PI);
        
        trackCamera[body].theta += (event.clientX - windowHalfX - mouseStatus.x) * 0.01;

        if (trackCamera[body].phi - (event.clientY - windowHalfY - mouseStatus.y) * 0.01 >= -0.5 * Math.PI &&
            trackCamera[body].phi - (event.clientY - windowHalfY - mouseStatus.y) * 0.01 <= 0.5 * Math.PI)
            trackCamera[body].phi -= (event.clientY - windowHalfY - mouseStatus.y) * 0.01;
    }
    mouseStatus.x = event.clientX - windowHalfX;
    mouseStatus.y = event.clientY - windowHalfY;
}

function onWindowMouseDown(event) {
    switch (event.which) {
        case 1:
            mouseStatus.leftDown = true;
            break;
        case 2:
            mouseStatus.centerDown = true;
            break;
        case 3:
        default:
            mouseStatus.rightDown = true;
            break;
    }
}

function onWindowMouseUp(event) {
    switch (event.which) {
        case 1:
            mouseStatus.leftDown = false;
            break;
        case 2:
            mouseStatus.centerDown = false;
            break;
        case 3:
        default:
            mouseStatus.rightDown = false;
            break;
    }
}

function onMouseWheelChange(event) {
    var body = params.Camera;
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    var newDistance = trackCamera[body].distance - 0.05 * trackCamera[body].distance * delta;

    if (newDistance <= trackCamera[body].safeDistance) {
        newDistance = trackCamera[body].safeDistance;
    } else if (newDistance >= trackCamera[body].safeFar) {
        newDistance = trackCamera[body].safeFar;
    }
    trackCamera[body].distance = newDistance;
}

var posSrc = { pos: 0.0 };
var oX, oY, oZ, dX, dY, dZ, oTheta, dTheta, oPhi, dPhi, oDistance, dDistance, oSafeDis, dSafeDis;
var oCX, oCY, oCZ, dCX, dCY, dCZ;
tween = new TWEEN.Tween(posSrc)
    .to({ pos: 1.0 }, 4000)
    .easing(TWEEN.Easing.Quartic.InOut)
    .onStart(function () {
        globalTimeFlag = false;
    })
    .onUpdate(function () {
        var pos = posSrc.pos;
        switchCamera.camera.position.set(oX + dX * pos, oY + dY * pos, oZ + dZ * pos);
        switchCamera.theta = oTheta + dTheta * pos;
        switchCamera.phi = oPhi + dPhi * pos;
        switchCamera.distance = oDistance + dDistance * pos;
        switchCamera.safeDistance = oSafeDis + dSafeDis * pos;
        switchCamera.camera.lookAt(oCX + dCX * pos, oCY + dCY * pos, oCZ + dCZ * pos);
    })
    .onComplete(function () {
        // Need switching to roaming mode
        if (goRoaming) {
            calculateParams[curBody] = saveCur;
            calculateParams["Earth"] = saveNext;
            renderCamera = roamingCamera;
            cameraControl = new THREE.FirstPersonControls(roamingCamera.camera);
            cameraControl.lookSpeed = 0.1;
            cameraControl.movementSpeed = 150;
            cameraControl.noFly = true;
            cameraControl.constrainVertical = true;
            cameraControl.verticalMin = 1.0;
            cameraControl.verticalMax = 2.0;
            cameraControl.lon = -150;
            cameraControl.lat = 120;
            needSet = false;
            roamingStatus = true;
            goRoaming = false;
            roamingCamera.camera.lookAt(0, 0, 0);
        } else {
            calculateParams[curBody] = saveCur;
            calculateParams[nextBody] = saveNext;
            switchCamera.body = nextBody;
            curBody = nextBody;
            needSet = true;
            renderCamera = trackCamera[nextBody];
        }
        globalTimeFlag = true;
    });

function initTween() {
    saveCur = calculateParams[curBody];
    saveNext = calculateParams[nextBody];
    calculateParams[curBody] = false;
    calculateParams[nextBody] = false;
    renderCamera = switchCamera;
    posSrc.pos = 0.0;
    needSet = false;
}

function setTween(cur, next) {
    if (cur == null) {
        oX = arguments[2];
        oY = arguments[3];
        oZ = arguments[4];
        oTheta = 0.2;
        oPhi = 0.3;
        oDistance = 30;
        oSafeDis = 30;
        oCX = roamingCamera.camera.position.x;
        oCY = roamingCamera.camera.position.y;
        oCZ = roamingCamera.camera.position.z;
    } else {
        oX = trackCamera[cur].getX();
        oY = trackCamera[cur].getY();
        oZ = trackCamera[cur].getZ();
        oTheta = trackCamera[cur].theta;
        oPhi = trackCamera[cur].phi;
        oDistance = trackCamera[cur].distance;
        oSafeDis = trackCamera[cur].safeDistance;
        oCX = trackCamera[cur].getCenterX();
        oCY = trackCamera[cur].getCenterY();
        oCZ = trackCamera[cur].getCenterZ();
    }
    if (next == null) {
        dCX = dX = arguments[2] - oX;
        dCY = dY = arguments[3] - oY;
        dCZ = dZ = arguments[4] - oZ;
        dTheta = 0.2 - oTheta;
        dPhi = 0.3 - oPhi;
        dDistance = 30 - oDistance;
        dSafeDis = 30 - oSafeDis;
    } else {
        dX = trackCamera[next].getX() - oX;
        dY = trackCamera[next].getY() - oY;
        dZ = trackCamera[next].getZ() - oZ;
        dCX = trackCamera[next].getCenterX() - oCX;
        dCY = trackCamera[next].getCenterY() - oCY;
        dCZ = trackCamera[next].getCenterZ() - oCZ;
        dTheta = trackCamera[next].theta - oTheta;
        dPhi = trackCamera[next].phi - oPhi;
        dDistance = trackCamera[next].distance - oDistance;
        dSafeDis = trackCamera[next].safeDistance - oSafeDis;
    }
}

function cameraCopy(cameraDst, cameraSrc) {
    cameraDst.theta = cameraSrc.theta;
    cameraDst.phi = cameraSrc.phi;
    cameraDst.distance = cameraSrc.distance;
    cameraDst.safeDistance = cameraSrc.safeDistance;
    cameraDst.body = cameraSrc.body;
    cameraDst.setCamera();
}

