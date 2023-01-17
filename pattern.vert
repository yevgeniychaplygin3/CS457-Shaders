#version 330 compatibility

uniform float	uTime;
out  vec2  vST;		// texture coords
out  vec3  vN;		// normal vector
out  vec3  vL;		// vector from point to light
out  vec3  vE;		// vector from point to eye

vec3 LightPosition = vec3(  0., 5., 5. );

const float AMP = 0.2;
const float PI = 3.14159265;
const float W = 2.;

out vec3 vColor;
out float vX, vY;
out float vLightIntensity;

const vec3 LIGHTPOS = vec3(0.,0.,10.);



void
main( )
{ 
	vST = gl_MultiTexCoord0.st;
	vec3 vert = gl_Vertex.xyz;
	vec3 norm = normalize( vert );
	vec4 ECposition = gl_ModelViewMatrix * vec4( vert, 1. );
	vN = normalize( gl_NormalMatrix * norm );	// normal vector
	vL = LightPosition - ECposition.xyz;		// vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
							// to the eye position 
	gl_Position = gl_ModelViewProjectionMatrix * vec4( vert, 1. );




	vec3 tnorm = normalize(gl_NormalMatrix * gl_Normal);
	vec3 ECPosition = (gl_ModelViewMatrix * gl_Vertex).xyz;
	vLightIntensity = abs(dot(normalize(LIGHTPOS - ECPosition), tnorm));

	vColor = vec3 (1,0,0); //gl_Color.rgb;
	vec3 MCPosition = gl_Vertex.xyz;
	vX = MCPosition.x;
	vY = MCPosition.y;

	// vX = vX + uAmp * sin(uFreq * vY); // gives the S curve stripes
	//gl_Position - gl_ModelViewProjectionMatrix * gl_Vertex;
}
