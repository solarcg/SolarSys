var cameraParameters = { theta: 0.2, phi: 0.3, 
    distance: 7500, safeDistance: 200, safeFar: 1e6,
    // centerObject: stars[0],
    getCenterX: function() { return celestialBodies.sun.getX(); },
    getCenterY: function() { return celestialBodies.sun.getY(); },
    getCenterZ: function() { return celestialBodies.sun.getZ(); },
    getX: function() { return this.getCenterX() + this.distance * Math.cos(this.theta) * Math.cos(this.phi); },
    getZ: function() { return this.getCenterZ() + this.distance * Math.sin(this.theta) * Math.cos(this.phi); },
    getY: function() { return this.getCenterY() + this.distance * Math.sin(this.phi); }
};