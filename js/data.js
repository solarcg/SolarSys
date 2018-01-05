celestialBodies = {
    sun: new CelestialBody({
        name:"Sun",
        star: true,
        radius: 100.,
        orbit: {
            semiMajorAxis: 0.
        },
        rotation: {
            period: 2500,
            inclination: 0,
        },
        material: {
            type:       "basic",
            diffuse:    { map: "res/sol/diffuse.png" }
        },
        atmosphere: {
            cloud: {
                map:    "res/sol/overlay.png",
                height: 1,
                speed:  1
            }
        }
    }),
    earth: new CelestialBody({
        name:"Earth",
        radius: 60.,
        parent: this.sun,
        shineColor: 0x9999ff,
        orbit: {
            period: 5,
            semiMajorAxis: 1000.,
            eccentricity: 0.,
            inclination: 0.
        },
        rotation: {
            period: 100.,
            inclination: 23.5,
            meridianAngle: 0., 
            offset: 0.
        },
        material: {
            type:       "phong",
            diffuse:    { map: "res/earth/diffuse.jpg" },
            specular:   { map: "res/earth/spec.jpg", color: 0x243232, shininess:25 },
            bump:       { map: "res/earth/bump.jpg", height: 0. }
        },
        atmosphere: {
            cloud: {
                map:        "res/earth/clouds.png",
                height:     0.5,
                speed:      0.02
            }
        }
    })
}