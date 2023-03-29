#version 330 compatibility 

//uniform float uAmp;
//uniform float uFreq;

out vec3 vColor;
out float vX, vY;
out float vLightIntensity;

const vec3 LIGHTPOS = vec3(0.,0.,10.);

void
main()
{
	vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal ); 
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz; 
	vLightIntensity = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) ); 
	vColor = vec3 (1.,.5, 0.); // gl_Color.rgb; 
	vec3 MCposition = gl_Vertex.xyz; 
	vX = MCposition.x; 
	vY = MCposition.y; 
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}