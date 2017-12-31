var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var mouseStatus = { x:0, y:0,
    leftDown:false, centerDown:false, rightDown:false };

var cameraParameters = { theta: 0.2, phi: 0.3, 
    distance: 7500, safeDistance: 200, safeFar: 1e6,
    // centerObject: stars[0],
    getX: function() { return this.distance * Math.cos(this.theta) * Math.cos(this.phi); },
    getZ: function() { return this.distance * Math.sin(this.theta) * Math.cos(this.phi); },
    getY: function() { return this.distance * Math.sin(this.phi); }
};

function onWindowMouseMove(event) {
    // Keep the value in 0 -- 2 PI
    if(mouseStatus.leftDown) {
        if(cameraParameters.theta > 2 * Math.PI) {
            cameraParameters.theta
                = cameraParameters.theta
                    - 2 * Math.PI * Math.floor(cameraParameters.theta/(2*Math.PI));
        }
        if(cameraParameters.phi > 2 * Math.PI) {
            cameraParameters.phi
                = cameraParameters.phi
                    - 2 * Math.PI * Math.floor(cameraParameters.phi/(2*Math.PI));
        }
        cameraParameters.theta += (event.clientX - windowHalfX - mouseStatus.x) * 0.01;
        cameraParameters.phi += (event.clientY - windowHalfY - mouseStatus.y) * 0.01;
    }
    mouseStatus.x = event.clientX - windowHalfX;
    mouseStatus.y = event.clientY - windowHalfY;
}

function onWindowMouseDown(event) {
    switch(event.which) {
        case 1: mouseStatus.leftDown = true; break;
        case 2: mouseStatus.centerDown = true; break;
        case 3: default: mouseStatus.rightDown = true; break;
    }
}

function onWindowMouseUp(event) {
    switch(event.which) {
        case 1: mouseStatus.leftDown = false; break;
        case 2: mouseStatus.centerDown = false; break;
        case 3: default: mouseStatus.rightDown = false; break;
    }
}

function onMouseWheelChange(event) {
    let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    let newDistance = cameraParameters.distance - 0.05*cameraParameters.distance*delta;
    
    if(newDistance <= cameraParameters.safeDistance) {
        newDistance = cameraParameters.safeDistance;
    } else if(newDistance >= cameraParameters.safeFar) {
        newDistance = cameraParameters.safeFar;
    }
    
    cameraParameters.distance = newDistance;
}