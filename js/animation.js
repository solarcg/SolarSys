function render() {
    for (var objKey in celestialBodies) {
        celestialBodies[objKey].update(globalTime.getRelative());
    }
    var body = params.planets;
    var renderCamera = trackCamera[body].camera;
    trackCamera[body].setCamera();

    // if(Math.sqrt(
    //     cameraParameters.getX() * cameraParameters.getX()
    //     + cameraParameters.getY() * cameraParameters.getY()
    //     + cameraParameters.getZ() * cameraParameters.getZ()
    // ) > 2000) {
    //     sunMaterial.depthTest = false;
    // } else {
    //     sunMaterial.depthTest = true;
    // }
    renderer.render(scene, renderCamera);
}