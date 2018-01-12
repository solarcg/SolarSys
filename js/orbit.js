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
        // Now this is only a naive way of calculating the orbit
        // Note that zOx is the orbit plane
        // x -> z   y -> z  z -> x
        //1.11version
        //r=a*(1-e^2)/(1+ecoswt)
        //x=rcoswt+c
        //y=rsinwt
        var r = this.orbit.semiMajorAxis * (1 - this.orbit.eccentricity * this.orbit.eccentricity) / (1 + this.orbit.eccentricity * Math.cos(10.0 * time / this.orbit.period));
        var x = referenceFrameX + (r * Math.cos(10.0 * time / this.orbit.period) + this.orbit.semiMajorAxis * this.orbit.eccentricity) * Math.cos(this.orbit.inclination / 180.0 * Math.PI);
        var y = referenceFrameY + (r * Math.cos(10.0 * time / this.orbit.period) + this.orbit.semiMajorAxis * this.orbit.eccentricity) * Math.sin(this.orbit.inclination / 180.0 * Math.PI);
        var z = referenceFrameZ + r * Math.sin(10.0 * time / this.orbit.period);
        if (this.isComet) {
            if (cometSet) {
                this.objectGroup.position.set(x, y, z);
                lastCometX = x;
                lastCometY = y;
                lastCometZ = z;
                cometSet = false;
            }
            var delta = clock.getDelta() * spawnerOptions.timeScale;
            tick += delta;
            if (tick < 0) tick = 0;
            if (delta > 0) {
                options.position.x -= 3. * x / Math.sqrt(x * x + y * y + z * z);
                options.position.y -= 3. * y / Math.sqrt(x * x + y * y + z * z);
                options.position.z -= 3. * z / Math.sqrt(x * x + y * y + z * z);
                for (var i = 0; i < spawnerOptions.spawnRate * delta; i++) {
                    this.particleSystem.spawnParticle(options);
                }
                this.objectGroup.position.x += ( 3. * x / Math.sqrt(x * x + y * y + z * z) );
                this.objectGroup.position.y += ( 3. * y / Math.sqrt(x * x + y * y + z * z) );
                this.objectGroup.position.z += ( 3. * z / Math.sqrt(x * x + y * y + z * z) );
                this.objectGroup.position.x += (x - lastCometX);
                this.objectGroup.position.y += (y - lastCometY);
                this.objectGroup.position.z += (z - lastCometZ);
            }
            this.particleSystem.update(tick);
            lastCometX = x;
            lastCometY = y;
            lastCometZ = z;
        } else {
            this.objectGroup.position.set(x, y, z);
            // self-rotation
            this.objectGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1.0 / this.rotation.period);
        }

    }
};
