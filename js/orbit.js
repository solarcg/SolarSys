CelestialBody.prototype.updateOrbitAndRotation = function (time) {
    // Calculate the orbit
    // The reference frame (X, Y, Z) is the center coordinate of
    // the object's parent body.
    var referenceFrameX = 0;
    var referenceFrameY = 0;
    var referenceFrameZ = 0;
    if (this.parent != null) {
        referenceFrameX = this.parent.getX();
        referenceFrameY = this.parent.getY();
        referenceFrameZ = this.parent.getZ();
    }
    // Now this is only a naive way of calculating the orbit
    // Note that zOx is the orbit plane
    // x -> z   y -> z  z -> x

    var x = referenceFrameX + this.orbit.semiMajorAxis * Math.sin(10.0 * time / this.orbit.period);
    var y = referenceFrameY;
    var z = referenceFrameZ + this.orbit.semiMajorAxis * Math.cos(10.0 * time / this.orbit.period);

    if (this.isComet) {
        var delta = clock.getDelta() * spawnerOptions.timeScale;
        tick += delta;
        if (tick < 0) tick = 0;
        if (delta > 0) {
            options.position.x = x;
            options.position.y = y;
            options.position.z = z;
            for (var i = 0; i < spawnerOptions.spawnRate * delta; i++) {
                this.particleSystem.spawnParticle(options);
            }
        }
        this.particleSystem.update(tick);
    } else {
        this.objectGroup.position.set(x, y, z);
        // self-rotation
        this.objectGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1.0 / this.rotation.period);
    }
}