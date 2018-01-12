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
    vec4 nightColor = vec4(texture2D( nightTexture, vUv ).rgb, 0.8);
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

// Atmosphere vertex shader
// ref:
//      [1] https://developer.nvidia.com/gpugems/GPUGems2/gpugems2_chapter16.html
//      [2] https://github.com/TPZF/GlobWeb/blob/master/shaders/SkyFromSpaceVert.glsl
var atmosphereScatteringVS = `
uniform float innerRadius;
uniform float outerRadius;
uniform float scaleDepth;
uniform vec3 invWaveLength;
uniform float Kr;
uniform float Km;
uniform float Esun;

varying vec3 color;
varying vec3 secondaryColor;
varying vec3 direction;
varying vec3 frontColor;
varying vec3 test;

const int nSamples = 4;
const float invSamples = 0.25;

float scale(float fcos) {
    float x = 1. - fcos;
    return scaleDepth
        * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
}

void main()
{
    // Vertex position in world coordinate
    vec4 vertexPos = modelMatrix * vec4(position, 1.0);
    // Vertex light position in world coordinate
    vec4 lightPos = vec4(0., 0., 0., 1.);
    vec3 lightPos3 = lightPos.xyz/lightPos.w;
    // Light direction in world coordinate
    vec3 lightDir = normalize((lightPos/lightPos.w).xyz - (vertexPos/vertexPos.w).xyz);
    // Normal vector in world coordinate
    vec3 normalVec = (modelMatrix * vec4(normal, 0.)).xyz;
    // Model view position of the vertex
    vec4 modelViewPos = modelViewMatrix * vec4(position, 1.0);

    // Calculate the camera height
    vec4 centerPos4 = modelMatrix * vec4(0., 0., 0., 1.);
    vec3 centerPos3 = (centerPos4/centerPos4.w).xyz;
    vec3 cameraRelative = cameraPosition - centerPos3;
    float cameraHeight = length(cameraRelative);

    // Get the ray from the camera to the vertex and its length
    vec3 ray = (vertexPos/vertexPos.w).xyz - cameraPosition;
    float far = length(ray);
    ray /= far;
    
    // Calculate the closest interaction of the ray with the outer atmosphere
    float B = 2.0 * dot(cameraPosition, ray);
    float C = cameraHeight * cameraHeight - outerRadius * outerRadius;
    float delta = max(0., B*B - 4.0 * C);
    float near = 0.5 * (-B - sqrt(delta));

    // Calculate the ray's starting position, then calculate its scattering offset
    vec3 start = cameraPosition + ray * near;
    far -= near;
    float startAngle = dot(ray, start) / outerRadius;
    float startDepth = exp(-1.0 / scaleDepth);
    float startOffset = startDepth * scale(startAngle);

    // Initialize the scattering loop variables
    float sampleLength = far * invSamples;
    float scaledLength = sampleLength/(outerRadius - innerRadius);
    vec3 sampleRay = ray * sampleLength;
    vec3 samplePoint = start + sampleRay * 0.5;

    // Now loop through the sample rays
    vec3 frontColor = vec3(0., 0., 0.);
    float Kr4PI = Kr * 4. * 3.14159265358979;
    float Km4PI = Km * 4. * 3.14159265358979;
    for(int i = 0; i < nSamples; i++) {
        float height = length(samplePoint);
        float depth = exp((innerRadius - height)/scaleDepth/(outerRadius-innerRadius));
        float lightAngle = dot(lightPos3, samplePoint) / height;
        float cameraAngle = dot(ray, samplePoint) / height;
        float scatter = (startOffset + depth * (scale(lightAngle) - scale(cameraAngle)));
        vec3 attenuate = exp(-scatter * (invWaveLength * Kr4PI + Km4PI));
        frontColor += attenuate * (depth * scaledLength);
        samplePoint += sampleRay;
    }

    // Finally scale the Mie and Rayleigh colors
    // and set up the varying variables for the fragment shader
    secondaryColor = frontColor * Km * Esun;
    color = frontColor * (invWaveLength * Kr * Esun);
    direction = normalize(cameraRelative);

    // lightDense = max(dot(lightDir, normalVec) * cameraHeight / 100., 0.);
    test = vec3(startDepth, 0., 0.);
    
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

var atmosphereScatteringFS = `
varying vec3 color;
varying vec3 secondaryColor;
varying vec3 direction;
varying vec3 frontColor;

uniform float rayleighSymmetry;
uniform vec3 lightPos;
varying vec3 test;

const float exposure = 2.;

void main()
{
    float g = rayleighSymmetry;
    float g2 = rayleighSymmetry * rayleighSymmetry;
    float fcos = dot(lightPos, direction)/length(direction);
    float rayleighPhase = 0.75 * (1.0 + fcos * fcos);
    float miePhase = 1.5 * ((1.0 - g2)/(2.0 + g2))
        * (1.0 + fcos * fcos) / pow(abs(1.0 + g2 - 2.0 * g * fcos), 1.5);
    gl_FragColor.rgb = 1.0 - exp(-exposure * (rayleighPhase * color + miePhase * secondaryColor));
    // gl_FragColor.rgb = test;
    gl_FragColor.a = 1.0;
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
