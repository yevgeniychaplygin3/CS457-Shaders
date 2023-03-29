#version 330 compatibility

uniform float uK, uP;

const float Y0 = 2;
const float PI = 3.1415926535897932384626433832795;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;




void
main( )
{    
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;

	newVertex.z = uK * (Y0-newVertex.y) * sin(2.*PI*(newVertex.x/uP));
	vMC = newVertex.xyz;

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	float dzdx = uK * (Y0-newVertex.y) * (2.*PI/uP) * cos( 2.*PI*newVertex.x/uP );
	float dzdy = -uK * sin( 2.*PI*newVertex.x/uP );
	vec3 xtangent = vec3(1., 0., dzdx );
	vec3 ytangent = vec3(0., 1., dzdy );
	
	vec3 newNormal = normalize( cross(xtangent,ytangent));
	//vNs = normalize( gl_NormalMatrix * newNormal);
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	       		

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}
