var sun, mercury, venus, earth, moon, mars, jupiter, saturn, neptune, uranus, galaxy;
var mercuryPivot, venusPivot, earthPivot, marsPivot, jupiterPivot, saturnPivot, neptunePivot, uranusPivot;
function  createPlanet( name ) {
    switch (name) {
        case "galaxy":
            galaxy = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/galaxy.png', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 3500, 50, 50 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, side: THREE.BackSide } );
                var mesh = new THREE.Mesh( geometry, material );
                galaxy.add(mesh);
            } );
            scene.add(galaxy);
            break;
        case "sun":
            sun = new THREE.Group;
            var loader = new THREE.TextureLoader();
            loader.load( 'res/sun.png', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 200, 50, 50 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                sun.add(mesh);
            } );
            scene.add(sun);
            break;
        case "mercury":
            mercury = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/mercury.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 40, 50, 50 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                mercury.add(mesh);
            } );
            mercury.position.set(300, 0, 0);
            mercuryPivot = new THREE.Object3D();
            sun.add(mercuryPivot);
            mercuryPivot.add(mercury);
            break;
        case "venus":
            venus = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/venus.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 70, 50, 50 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                venus.add(mesh);
            } );
            venus.position.set(450, 0, 0);
            venusPivot = new THREE.Object3D();
            sun.add(venusPivot);
            venusPivot.add(venus);
            break;
        case "earth":
            earth = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/no_cloud.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 100, 20, 20 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var bumpLoader = new THREE.TextureLoader();
                bumpLoader.load( 'res/elev_bump.jpg', function ( texture ) {
                    material.bumpMap = texture;
                    material.bumpScale = 0.005;
                });
                var specularLoader = new THREE.TextureLoader();
                specularLoader.load( 'res/water.png', function ( texture ) {
                    material.specularMap = texture;
                    material.specular = new THREE.Color('grey');
                });
                var mesh = new THREE.Mesh( geometry, material );
                earth.add( mesh );
            } );
            // cloud
            var loader = new THREE.TextureLoader();
            loader.load( 'res/fair_cloud.png', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 100, 20, 20 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, transparent: true } );
                var mesh = new THREE.Mesh( geometry, material );
                earth.add( mesh );
            } );
            earth.position.set(700, 0, 0);
            earthPivot = new THREE.Object3D();
            sun.add(earthPivot);
            earthPivot.add(earth);
            break;
        case "mars":
            mars = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/mars.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 70, 20, 20 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                mars.add(mesh);
            } );
            mars.position.set(930, 0, 0);
            marsPivot = new THREE.Object3D();
            sun.add(marsPivot);
            marsPivot.add(mars);
            break;
        case "jupiter":
            jupiter = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/jupiter.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 150, 20, 20 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                jupiter.add(mesh);
            } );
            jupiter.position.set(1250, 0, 0);
            jupiterPivot = new THREE.Object3D();
            sun.add(jupiterPivot);
            jupiterPivot.add(jupiter);
            break;
        case "saturn":
            saturn = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/saturn.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 140, 20, 20 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                saturn.add( mesh );
            } );
            var loader = new THREE.TextureLoader();
            loader.load( 'res/saturn_circule.jpg', function ( texture ) {
                var geometry = new THREE.CylinderGeometry(180, 250, 0, 100, 100, true);
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, side: THREE.doubleSided} );
                var mesh = new THREE.Mesh( geometry, material );
                mesh.rotateY(90);
                saturn.add( mesh );
            } );
            var loader = new THREE.TextureLoader();
            loader.load( 'res/saturn_circule.jpg', function ( texture ) {
                var geometry = new THREE.CylinderGeometry(250, 180, 0, 100, 100, true);
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, side: THREE.doubleSided} );
                var mesh = new THREE.Mesh( geometry, material );
                mesh.rotateY(90);
                saturn.add( mesh );
            } );
            saturn.position.set(1750, 0, 0);
            saturn.rotation.z += 45;
            saturnPivot = new THREE.Object3D();
            sun.add(saturnPivot);
            saturnPivot.add(saturn);
            break;
        case "uranus":
            uranus = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/uranus.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 120, 20, 20 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                uranus.add(mesh);
            } );
            uranus.position.set(2300, 0, 0);
            uranusPivot = new THREE.Object3D();
            sun.add(uranusPivot);
            uranusPivot.add(uranus);
            break;
        case "neptune":
            neptune = new THREE.Group();
            var loader = new THREE.TextureLoader();
            loader.load( 'res/neptune.jpg', function ( texture ) {
                var geometry = new THREE.SphereGeometry( 130, 20, 20 );
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                var mesh = new THREE.Mesh( geometry, material );
                neptune.add( mesh );
            } );
            neptune.position.set(2900, 0, 0);
            neptunePivot = new THREE.Object3D();
            sun.add(neptunePivot);
            neptunePivot.add(neptune);
            break;
    }

}