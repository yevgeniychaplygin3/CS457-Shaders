#version 330 compatibility

out vec3 vN;
out  vec3  vL;		// vector from point to light
out  vec3  vE;		// vector from point to eye
uniform float uLightDirX, uLightDirY, uLightDirZ;

void main()
{
	vN = gl_Normal;
	vec4 ECposition = gl_ModelViewMatrix * vec4( gl_Vertex.xyz, 1. );
	vL = vec3(uLightDirX, uLightDirY, uLightDirZ) - ECposition.xyz;		
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}