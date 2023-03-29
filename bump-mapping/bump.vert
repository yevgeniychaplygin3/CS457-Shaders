#version 330 compatibility 

uniform float uK, uP;

uniform float uLightX, uLightY, uLightZ;

const float Y0 = 1;
const float PI = 3.1415926535897932384626433832795;

out vec2 vST;		// texture coords
out  vec3  vN;		// normal vector
out  vec3  vL;		// vector from point to light
out  vec3  vE;		// vector from point to eye

out vec3 vMCposition;

//vec3 LightPosition = vec3(  uLightX, uLightY, uLightZ );
vec3 LightPosition = vec3(  0., 5., 10. );

void
main()
{
	vST = gl_MultiTexCoord0.st;
	vec3 vert = gl_Vertex.xyz;

	vert.z = uK * (Y0-vert.y) * sin(2.*PI*(vert.x/uP));
	vMCposition = vert.xyz;
	

	float dzdx = uK * (Y0-vert.y) * (2.*PI/uP) * cos( 2.*PI*vert.x/uP );
	float dzdy = -uK * sin( 2.*PI*vert.x/uP );
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vec3 norm = normalize( cross(Tx,Ty));

	// norm = normalize( vert );

	vec4 ECposition = gl_ModelViewMatrix * vec4( vert, 1. );

	vN = normalize( gl_NormalMatrix * norm );	// normal vector

	vL = LightPosition - ECposition.xyz;		// vector from the point to the light position

	vE = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point to the eye position 

	gl_Position = gl_ModelViewProjectionMatrix * vec4( vert, 1. );

	
}