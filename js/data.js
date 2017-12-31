celestialBodies = {
    earth: new CelestialBody({
        name:"Earth",
        radius:100.,
        material:{
            type:"phong",
            diffuse:    { map: "res/earth/diffuse.jpg"},
            specular:   { map: "res/earth/spec.jpg", color: 0x80a0aa, shininess:10 },
            bump:       { map: "res/earth/bump.jpg", height: 0. }
        }
    })
}