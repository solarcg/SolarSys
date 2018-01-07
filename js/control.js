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
        if (trackCamera[body].theta > 2 * Math.PI) {
            trackCamera[body].theta
                = trackCamera[body].theta
                - 2 * Math.PI * Math.floor(trackCamera[body].theta / (2 * Math.PI));
        }
        if (trackCamera[body].phi > 2 * Math.PI) {
            trackCamera[body].phi
                = trackCamera[body].phi
                - 2 * Math.PI * Math.floor(trackCamera[body].phi / (2 * Math.PI));
        }
        trackCamera[body].theta += (event.clientX - windowHalfX - mouseStatus.x) * 0.01;
        trackCamera[body].phi += (event.clientY - windowHalfY - mouseStatus.y) * 0.01;
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