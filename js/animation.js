function render() {
    for (var i = 1; i < planets.length; i++) {
        planetsPivot[i].rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 0.01 / stars[i].time);
    }
    for (var i = 1; i < stars.length; i++) {
        planets[i].rotation.y += 0.01 / stars[i].selftime;
    }
    for (var i = 0; i < count; i++) {
        satlitesPivot[i].rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 0.0001 / satlitesSpeed[i]);
    }
    camera.position.x += ( mouseX ) * 0.01;
    camera.position.y += ( - mouseY ) * 0.01;
    camera.lookAt( 0, 0, 0 );
    renderer.render( scene, camera );
}