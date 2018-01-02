celestialBodies = {
    sun: new CelestialBody({
        name:"Sun",
        star: true,
        radius: 100.,
        orbit: {
            semiMajorAxis: 0.
        },
        material: {
            type:       "basic",
            diffuse:    { map: "res/sol/diffuse.png" }
        }
    }),
    earth: new CelestialBody({
        name:"Earth",
        radius: 100.,
        parent: this.sun,
        orbit: {
            period: 10.,
            semiMajorAxis: 1000.,
            eccentricity: 0.,
            inclination: 0.
        },
        material: {
            type:       "phong",
            diffuse:    { map: "res/earth/diffuse.jpg" },
            specular:   { map: "res/earth/spec.jpg", color: 0x80a0aa, shininess:10 },
            bump:       { map: "res/earth/bump.jpg", height: 0. }
        }
    })
}