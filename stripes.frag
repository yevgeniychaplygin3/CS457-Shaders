#version 330 compatibility 

uniform float uA; 
uniform float uP; 
uniform float uTol;
in float vX, vY;
in vec3 vColor;
in float vLightIntensity; 
const vec3 WHITE = vec3( 1., 1., 1. ); 

void 
main( ) 
{

	float r = sqrt( vX*vX + vY*vY );
	float rfrac = fract( uA*r );
	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, rfrac ) - smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, rfrac ); // “smoothpulse” 
	vec3 rgb = vLightIntensity * mix( WHITE, vColor, t ); 
	gl_FragColor = vec4( rgb, 1. );
}