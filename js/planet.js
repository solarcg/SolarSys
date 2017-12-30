var count = 0;
var galaxy;
var sun;
var planets = [];
var tplanets = [];
var planetsPivot = [];
var satlites = [];
var satlitesPivot = [];
var satlitesSpeed = [];
var satlitesAngle = [];

var textureLoader = new THREE.TextureLoader();

function loadSun(sun) {
    textureLoader.load(stars[0].src, function (texture) {
        var geometry = new THREE.SphereGeometry(stars[0].radius, 50, 50);
        var material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
        var mesh = new THREE.Mesh(geometry, material);
        sun.add(mesh);
        scene.add(sun);
    });

}

function drawTrackLine(color, radius) {

    var size = 360 / radius;
    var linegeometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: color, opacity: 1.0 });
    for (var i = 0; i <= radius; i++) {
        var segment = (i * size) * Math.PI / 180;
        linegeometry.vertices.push(new THREE.Vector3(Math.cos(segment) * radius, 0, Math.sin(segment) * radius));
    }

    return new THREE.Line(linegeometry, material);

}

function loadPlanetTexture(index) {
    planets[index] = new THREE.Group();
    planetsPivot[index] = new THREE.Group();
    textureLoader.load(stars[index].src, function (texture) {
        var geometry = new THREE.SphereGeometry(stars[index].radius, 50, 50);
        var material = new THREE.MeshLambertMaterial({map: texture, overdraw: 0.5});
        if (stars[index].usebump) {
            var bumpLoader = new THREE.TextureLoader();
            bumpLoader.load(stars[index].bump, function (texture) {
                material.bumpMap = texture;
                material.bumpScale = 0.005;
            });
        }
        var mesh = new THREE.Mesh(geometry, material);
        planets[index].add(mesh);
        if (stars[index].usecloud) {
            var cloudLoader = new THREE.TextureLoader();
            cloudLoader.load(stars[index].cloud, function (texture) {
                var geometry = new THREE.SphereGeometry( stars[index].radius + 5, 50, 50 );
                var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5, transparent: true } );
                var mesh = new THREE.Mesh( geometry, material );
                planets[index].add(mesh);
            });
        }
        if (stars[index].ring != null) {
        
            textureLoader.load( stars[index].ring, function ( texture ) {
                var geometry = new THREE.CylinderGeometry(stars[index].radius * 1.1,stars[index].radius * 1.4, 0, 100, 100, true);
                var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5} );
                var mesh = new THREE.Mesh( geometry, material );
                planets[index].add( mesh );
            } );
        
            textureLoader.load( stars[index].ring, function ( texture ) {
                var geometry = new THREE.CylinderGeometry(stars[index].radius * 1.4, stars[index].radius * 1.1, 0, 100, 100, true);
                var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5} );
                var mesh = new THREE.Mesh( geometry, material );
                planets[index].add( mesh );
            } );
        }
        var mesh = drawTrackLine(0xffffff, stars[index].revRadius);
        tplanets[index] = new THREE.Group();
        tplanets[index].position.set(stars[index].revRadius, 0, 0);
        tplanets[index].rotation.z += stars[index].tilt / ( 360.0) * (2.0 * Math.PI);
        tplanets[index].add(planets[index]);
        sun.add(planetsPivot[index]);
        planetsPivot[index].add(tplanets[index]);
        planetsPivot[index].add(mesh);
        planetsPivot[index].rotateZ(stars[index].stilt / ( 360.0) * (2.0 * Math.PI))
    });
}

function loadSatliteTexture(index, index1, index2) {
    satlites[index] = new THREE.Group();
    satlitesPivot[index] = new THREE.Group();
    textureLoader.load(stars[index1].satlites[index2].src, function (texture) {
        var geometry = new THREE.SphereGeometry(stars[index1].satlites[index2].radius, 50, 50);
        var material = new THREE.MeshLambertMaterial({map: texture, overdraw: 0.5});
        if (stars[index1].satlites[index2].usebump) {
            var bumpLoader = new THREE.TextureLoader();
            bumpLoader.load(stars[index1].satlites[index2].bump, function (texture) {
                material.bumpMap = texture;
                material.bumpScale = 0.005;
            });
        }
        var mesh = new THREE.Mesh(geometry, material);
        satlites[index].add(mesh);
        if (stars[index1].satlites[index2].usecloud) {
            var cloudLoader = new THREE.TextureLoader();
            cloudLoader.load(stars[index1].satlites[index2].cloud, function (texture) {
                var geometry = new THREE.SphereGeometry( stars[index1].satlites[index2].radius + 5, 50, 50 );
                var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5, transparent: true } );
                var mesh = new THREE.Mesh( geometry, material );
                satlites[index].add(mesh);
            });
        }
        if (stars[index1].satlites[index2].ring != null) {
        
            textureLoader.load( stars[index1].satlites[index2].ring, function ( texture ) {
                var geometry = new THREE.CylinderGeometry(stars[index1].satlites[index2].radius * 1.1, stars[index1].satlites[index2].radius * 1.4, 0, 100, 100, true);
                var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5} );
                var mesh = new THREE.Mesh( geometry, material );
                satlites[index].add( mesh );
            } );
        
            textureLoader.load( stars[index1].satlites[index2].ring, function ( texture ) {
                var geometry = new THREE.CylinderGeometry(stars[index1].satlites[index2].radius * 1.4, stars[index1].satlites[index2].radius * 1.1, 0, 100, 100, true);
                var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5} );
                var mesh = new THREE.Mesh( geometry, material );
                satlites[index].add( mesh );
            } );
        }
        var mesh = drawTrackLine(0xffffff, stars[index1].satlites[index2].revRadius);
        satlites[index].rotateZ(stars[index1].satlites[index2].tilt / ( 360.0) * (2.0 * Math.PI));
        satlites[index].position.set(stars[index1].satlites[index2].revRadius, 0, 0);
        planets[index1].add(satlitesPivot[index]);
        satlitesPivot[index].add(satlites[index]);
        satlitesPivot[index].add(mesh);
        satlitesPivot[index].rotateZ(stars[index1].satlites[index2].stilt / ( 360.0) * (2.0 * Math.PI));

    });
}

function createStars() {
    galaxy = new THREE.Group();
    textureLoader.load('res/galaxy.png', function (texture) {
        var geometry = new THREE.SphereGeometry(10000, 50, 50);
        var material = new THREE.MeshLambertMaterial({map: texture, overdraw: 0.5, side: THREE.BackSide});
        var mesh = new THREE.Mesh(geometry, material);
        galaxy.add(mesh);
    });
    scene.add(galaxy);
    sun = new THREE.Group();
    loadSun(sun);
    for (var i = 1; i < stars.length; i++) {
        loadPlanetTexture(i);
        for (var j = 0; j < stars[i].satlites.length; j++) {
            satlitesSpeed[count] = stars[i].satlites[j].time;
            satlitesAngle[count] = stars[i].satlites[j].stilt + stars[i].stilt;
            loadSatliteTexture(count, i, j);
            count++;
        }
    }
}