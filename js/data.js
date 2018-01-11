celestialBodies = {
    Sun: new CelestialBody({
        name: "Sun",
        star: true,
        parent: "Sun",
        radius: 100.,
        orbit: {
            semiMajorAxis: 0.
        },
        rotation: {
            period: 2500,
            inclination: 0,
        },
        material: {
            type: "basic",
            diffuse: {map: "res/sol/diffuse.png"}
        },
        atmosphere: {
            cloud: {
                map: "res/sol/overlay.png",
                height: 1,
                speed: 1
            }
        }
    }),
    Mercury: new CelestialBody({
        name: "Mercury",
        radius: 3.825,
        parent: "Sun",
        shineColor: 0x9999ff,
        orbit: {
            period: 1.2,
            semiMajorAxis: 200.,
            eccentricity: 0.2056,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/mercury/diffuse.jpg"},
            bump: {map: "res/mercury/bump.jpg", height: 0.}
        }
    }),
    Venus: new CelestialBody({
        name: "Venus",
        radius: 9.488,
        parent: "Sun",
        shineColor: 0x9999ff,
        orbit: {
            period: 3.1,
            semiMajorAxis: 600.,
            eccentricity: 0.0068,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/venus/diffuse.jpg"},
            bump: {map: "res/venus/bump.jpg", height: 0.}
        },
        atmosphere: {
            cloud: {
                map: "res/venus/clouds.jpg",
                height: 0.5,
                speed: 0.02
            }
        }
    }),
    Earth: new CelestialBody({
        name: "Earth",
        radius: 10.,
        parent: "Sun",
        shineColor: 0x6666ff,
        orbit: {
            period: 5,
            semiMajorAxis: 1000.,
            eccentricity: 0.0167,
            inclination: 30.
        },
        rotation: {
            period: 100.,
            inclination: 23.5,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "phong",
            diffuse: {map: "res/earth/diffuse.jpg"},
            specular: {map: "res/earth/spec.jpg", color: 0x243232, shininess: 25},
            bump: {map: "res/earth/bump.jpg", height: 0.05},
            night: {map: "res/earth/night.png"}
        },
        atmosphere: {
            cloud: {
                map: "res/earth/clouds.png",
                height: 0.1,
                speed: 0.02
            }
        }
    }),
    Comet: new CelestialBody({
        name: "Comet",
        parent: "Sun",
        radius: 0,
        spherical: false,
        isComet: true,
        orbit: {
            period: 3.5,
            semiMajorAxis: 1300.,
            eccentricity: 1.0,
            inclination: 0.0,
        },
    }),
    Ship: new CelestialBody({
        name: "Ship",
        parent: "Earth",
        radius: 150.,
        spherical: false,
        obj: {
            path: "res/space/",
            objPath: "frigate.obj",
            mtlPath: "frigate.mtl",
            angle: -30,
            scale: 0.15,
        },
        orbit: {
            period: 1.0,
            semiMajorAxis: 20.,
            inclination: 30,
        },
        rotation: {
            period: 1000000,
            inclination: 0,
        },
    }),
    Astronaut: new CelestialBody({
        name: "Astronaut",
        parent: "Earth",
        radius: 10.,
        spherical: false,
        obj: {
            path: "res/space/",
            objPath: "man.obj",
            mtlPath: null,
            scale: 1.0,
            angle: 235,
        },
        orbit: {
            period: 1.0,
            semiMajorAxis: 20.,
            inclination: 0,
        },
        rotation: {
            period: 1000000,
            inclination: 0,
        },
    }),
    Moon: new CelestialBody({
        name: "Moon",
        radius: 1.0,
        parent: "Earth",
        shineColor: 0xff9988,
        orbit: {
            period: 9.4,
            semiMajorAxis: 30.,
            eccentricity: 0.0549,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0.,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/moon/diffuse.jpg"},
        }
    }),
    Mars: new CelestialBody({
        name: "Mars",
        radius: 5.3226,
        parent: "Sun",
        shineColor: 0xff9988,
        orbit: {
            period: 9.4,
            semiMajorAxis: 1300.,
            eccentricity: 0.0934,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0.,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/mars/diffuse.jpg"},
            bump: {map: "res/mars/bump.jpg", height: 1.}
        }
    }),
    Jupiter: new CelestialBody({
        name: "Jupiter",
        radius: 40.,
        parent: "Sun",
        shineColor: 0x9999ff,
        orbit: {
            period: 59.3,
            semiMajorAxis: 1600.,
            eccentricity: 0.0484,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0.,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/jupiter/diffuse.jpg"},
        },
        atmosphere: {
            cloud: {
                map: "res/jupiter/clouds.png",
                height: 0.5,
                speed: 0.02
            }
        }
    }),
    Saturn: new CelestialBody({
        name: "Saturn",
        radius: 40.,
        parent: "Sun",
        shineColor: 0x9999ff,
        orbit: {
            period: 40.0,
            semiMajorAxis: 1900.,
            eccentricity: 0.0542,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0.,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/saturn/diffuse.png"},
            bump: {map: "res/saturn/bump.png"},
        },
        atmosphere: {
            cloud: {
                map: "res/saturn/clouds.png",
                height: 0.5,
                speed: 0.02
            }
        },
        ring: {
            map: "res/saturn/ring.png",
            lower: 10,
            higher: 20,
        }
    }),
    Uranus: new CelestialBody({
        name: "Uranus",
        radius: 30.,
        parent: "Sun",
        shineColor: 0x9999ff,
        orbit: {
            period: 50.0,
            semiMajorAxis: 2200.,
            eccentricity: 0.0472,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0.,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/uranus/diffuse.jpg"},
        },
        ring: {
            map: "res/uranus/ring.png",
            lower: 10,
            higher: 20,
        }
    }),
    Neptune: new CelestialBody({
        name: "Neptune",
        radius: 30.,
        parent: "Sun",
        shineColor: 0x9999ff,
        orbit: {
            period: 50.0,
            semiMajorAxis: 2500.,
            eccentricity: 0.0086,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0.,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/neptune/diffuse.jpg"},
        },
        ring: {
            map: "res/neptune/ring.png",
            lower: 10,
            higher: 20,
        }
    }),
    Pluto: new CelestialBody({
        name: "Pluto",
        radius: 30.,
        parent: "Sun",
        shineColor: 0x9999ff,
        orbit: {
            period: 50.0,
            semiMajorAxis: 2900.,
            eccentricity: 0.003484,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 0.,
            meridianAngle: 0.,
            offset: 0.
        },
        material: {
            type: "lambert",
            diffuse: {map: "res/pluto/diffuse.jpg"},
        },
    }),
}
