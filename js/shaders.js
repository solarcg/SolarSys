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
    vec3 sunDirection = -vec3(viewMatrix * vec4(0, 0, 0, -1));

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