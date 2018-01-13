var cameraParameters = function (distance, safeDistance, body) {
    this.theta = 0.2;
    this.phi = 0.3;
    this.distance = distance;
    this.safeDistance = safeDistance;
    this.safeFar = 1e6;
    this.body = body;
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.4, 1e7);
};

cameraParameters.prototype.getDistance = function () {
    return this.distance;
};
cameraParameters.prototype.getCenterX = function () {
    if (this.body == "Comet")
        return celestialBodies["Comet"].cometPivot.position.getComponent(0);
    else
        return celestialBodies[this.body].getX();
};
cameraParameters.prototype.getCenterY = function () {
    if (this.body == "Comet")
        return celestialBodies["Comet"].cometPivot.position.getComponent(1);
    else
        return celestialBodies[this.body].getY();
};
cameraParameters.prototype.getCenterZ = function () {
    if (this.body == "Comet")
        return celestialBodies["Comet"].cometPivot.position.getComponent(2);
    else
        return celestialBodies[this.body].getZ();
};
cameraParameters.prototype.getX = function () {
    return this.getCenterX() - (celestialBodies[this.body].getRadius() + this.distance) * Math.cos(this.theta) * Math.cos(this.phi);
};
cameraParameters.prototype.getZ = function () {
    return this.getCenterZ() - (celestialBodies[this.body].getRadius() + this.distance) * Math.sin(this.theta) * Math.cos(this.phi);
};
cameraParameters.prototype.getY = function () {
    return this.getCenterY() - (celestialBodies[this.body].getRadius() + this.distance) * Math.sin(this.phi);
};
cameraParameters.prototype.setCamera = function () {
    this.camera.position.x = this.getX();
    this.camera.position.y = this.getY();
    this.camera.position.z = this.getZ();
    this.camera.lookAt(this.getCenterX(), this.getCenterY(), this.getCenterZ());
};