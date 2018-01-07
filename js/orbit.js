CelestialBody.prototype.updateOrbitAndRotation = function(time) {
    // Calculate the orbit
    // The reference frame (X, Y, Z) is the center coordinate of
    // the object's parent body.
    var referenceFrameX = 0;
    var referenceFrameY = 0;
    var referenceFrameZ = 0;
    var semiMajorAxis = this.orbit.semiMajorAxis;
    if(this.parent != null) {
        referenceFrameX = this.parent.getX();
        referenceFrameY = this.parent.getY();
        referenceFrameZ = this.parent.getZ();
    }
    // Now this is only a naive way of calculating the orbit
    // Note that zOx is the orbit plane
    // x -> z   y -> z  z -> x
    if (this.name == "Earth") {
        referenceFrameX = this.parent.getX();
        referenceFrameY = this.parent.getY();
        referenceFrameZ = this.parent.getZ();
    }

    var x = referenceFrameX + this.orbit.semiMajorAxis * Math.sin(10.0 * time / this.orbit.period);
    var y = referenceFrameY;
    var z = referenceFrameZ + this.orbit.semiMajorAxis * Math.cos(10.0 * time / this.orbit.period);
    
    this.objectGroup.position.set(x, y, z);
    // self-rotation
    this.objectGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1.0 / this.rotation.period);
}