var generalVS = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * mvPosition;
}
`;

var nightFS = `
uniform sampler2D nightTexture;

varying vec2 vUv;
varying vec3 vNormal;

void main( void ) {
    vec4 nightColor = vec4(texture2D( nightTexture, vUv ).rgb, 1.0);
    vec4 dayColor = vec4(0, 0, 0, 0);
    vec3 sunDirection = vec3(viewMatrix * vec4(0, 0, 0, 1));

    // compute cosine sun to normal so -1 is away from sun and +1 is toward sun.
    float cosineAngleSunToNormal = dot(normalize(vNormal), sunDirection);

    // sharpen the edge beween the transition
    cosineAngleSunToNormal = clamp( cosineAngleSunToNormal / 100.0, -1.0, 1.0);

    // convert to 0 to 1 for mixing
    float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;

    // Select day or night texture based on mixAmount.
    vec4 color = mix( nightColor, dayColor, mixAmount );

    gl_FragColor += vec4(color);

    // comment in the next line to see the mixAmount
    //gl_FragColor = vec4( mixAmount, mixAmount, mixAmount, 1.0 );
}
`;

// This stuff works, currently we do not use the scattering model
var atmosphereVS = `

varying float intensity1;
varying float intensity2;

const float PI = 3.14159265358979;

void main(void) {
    // Vertex position in world coordinate
    vec4 vertexPos = modelMatrix * vec4(position, 1.0);
    vec3 vertexPos3 = vertexPos.xyz/vertexPos.w;
    // Vertex light position in world coordinate
    vec4 lightPos = vec4(0., 0., 0., 1.);
    vec3 lightPos3 = lightPos.xyz/lightPos.w;
    // Light direction in world coordinate
    // Normal vector in world coordinate
    // Model view position of the vertex
    vec4 modelViewPos = modelViewMatrix * vec4(position, 1.0);
    // Camera
    vec4 centerPos4 = modelMatrix * vec4(0., 0., 0., 1.);
    vec3 centerPos3 = (centerPos4/centerPos4.w).xyz;
    vec3 cameraRelative = cameraPosition - centerPos3;

    vec3 cameraDir = normalize(cameraRelative);
    vec3 lightDir = normalize(lightPos3 - vertexPos3);
    vec3 normalVec = (modelMatrix * vec4(normal, 0.)).xyz;
    vec3 halfNormalVec = normalize(normalVec + cameraDir);

    intensity1 = 0.5*dot(lightDir, normalVec + 0.5 * lightDir) * dot(cameraDir + 0.5*lightDir, lightDir) * (1. - pow(dot(cameraDir, normalVec), 1.5));
    intensity2 = 1.5*dot(lightDir, normalVec + lightDir) * (1. - dot(cameraDir + 1.5*lightDir, lightDir)/2.5) * (1. - dot(cameraDir, normalVec));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Atomosphere fragment shader
var atmosphereFS = `
varying float intensity1;
varying float intensity2;

uniform vec3 atmosphereColor;
uniform vec3 sunsetColor;
uniform float atmosphereStrength;
uniform float sunsetStrength;

void main(void) {
    gl_FragColor = vec4(atmosphereStrength * intensity1 * atmosphereColor
        + sunsetStrength * intensity2 * sunsetColor, intensity1 + intensity2);
}
`;

var haloVS = `
varying float intensity;
const float PI = 3.14159265358979;

void main(void) {
    // Vertex position in world coordinate
    vec4 vertexPos = modelMatrix * vec4(position, 1.0);
    vec3 vertexPos3 = vertexPos.xyz/vertexPos.w;
    // Light direction in world coordinate
    // Normal vector in world coordinate
    // Model view position of the vertex
    vec4 modelViewPos = modelViewMatrix * vec4(position, 1.0);
    float distance = length(cameraPosition);
    // Camera
    vec4 centerPos4 = modelMatrix * vec4(0., 0., 0., 1.);
    vec3 centerPos3 = (centerPos4/centerPos4.w).xyz;
    vec3 cameraRelative = cameraPosition - centerPos3;

    vec3 cameraDir = normalize(cameraRelative);
    vec3 normalVec = (modelMatrix * vec4(normal, 0.)).xyz;
// pow(dot(normalVec, cameraDir), 4.) * 
    intensity = pow(dot(normalVec, cameraDir), 4.) * min(distance / 2000., 1.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Atomosphere fragment shader
var haloFS = `
varying float intensity;
uniform vec3 color;

void main(void) {
    gl_FragColor = vec4(intensity * color, intensity);
}
`;
