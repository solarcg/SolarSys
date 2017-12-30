var mouseStatus = { x:0, y:0,
    leftDown:false, centerDown:false, rightDown:false };

var cameraParameters = { theta: 0.5, phi: 0.3, 
    distance: 7500, safeDistance: 100, 
    centerObject: stars[0],
    getX: function() { return this.distance * Math.cos(this.theta) * Math.cos(this.phi); },
    getY: function() { return this.distance * Math.sin(this.theta) * Math.cos(this.phi); },
    getZ: function() { return this.distance * Math.sin(this.phi); }
};

function onContainerMouseMove( event ) {
    
    // mouseStatus.x = (event.clientX - windowHalfX);
    // mouseStatus.y = (event.clientY - windowHalfY);
    // camera.position.x += ( mouseStatus.x ) * 0.01;
    // camera.position.y += ( - mouseStatus.y ) * 0.01;
}

function onContainerMouseDown( event ) {
    switch(event.which) {
        case 1: mouseStatus.leftDown = true; break;
        case 2: mouseStatus.centerDown = true; break;
        case 3: default: mouseStatus.rightDown = true; break;
    }
}

function onContainerMouseUp() {
    switch(event.which) {
        case 1: mouseStatus.leftDown = false; break;
        case 2: mouseStatus.centerDown = false; break;
        case 3: default: mouseStatus.rightDown = false; break;
    }
}