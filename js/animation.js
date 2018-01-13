function remain( objKey ) {
    if (celestialBodies[objKey].parent == null)
        return true;
    if ((calculateParams[celestialBodies[objKey].parent.name] && celestialBodies[objKey].parent.name != "Sun") ||
        calculateParams[objKey])
        return true;
    return false;
}

function render() {
    for (var objKey in celestialBodies) {
        if ( firstflag || remain(objKey)) {
            celestialBodies[objKey].update(globalTime.getRelative());
            if (orbitParams[objKey]) {
                scene.add(orbitDraw[objKey]);
            } else {
                scene.remove(orbitDraw[objKey]);
            }
        }
    }
    if (firstflag) {
        $(function () {
            setTimeout(function () {
                $("#prompt").fadeOut(500);
                container.appendChild(stats.domElement);
                container.appendChild(renderer.domElement);
                gui.open();
            }, 6000);
        })
    }
    firstflag = false;
    if (needSet) {
        renderCamera.setCamera();
    }
    // if(Math.sqrt(
    //     cameraParameters.getX() * cameraParameters.getX()
    //     + cameraParameters.getY() * cameraParameters.getY()
    //     + cameraParameters.getZ() * cameraParameters.getZ()
    // ) > 2000) {
    //     sunMaterial.depthTest = false;
    // } else {
    //     sunMaterial.depthTest = true;
    // }
    renderer.render(scene, renderCamera.camera);
}