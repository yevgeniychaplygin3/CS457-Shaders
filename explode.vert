#version 330 compatibility

out vec4  vColor;
out float vLightIntensity; 
out vec2  vST;
out vec3  vXYZ;

out vec3 vN;
out  vec3  vL;		// vector from point to light
out  vec3  vE;		// vector from point to eye
uniform float uLightDirX, uLightDirY, uLightDirZ;


uniform float Blend;

void main( )
{
//-------------------------------------------
	vN = gl_Normal;
	//vec3 vert = gl_Vertex.xyz;
	//vec4 ECposition = gl_ModelViewMatrix * vec4( vert, 1. );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vL = vec3(uLightDirX, uLightDirY, uLightDirZ) - ECposition.xyz;		// vectofrom the point						// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point

//-------------------------------------------
	vST  = gl_MultiTexCoord0.st;
	vXYZ = gl_Vertex.xyz;

    vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	vec3 LightPos = vec3( 5., 10., 10. );
	
    vLightIntensity  = abs( dot( normalize(LightPos - ECposition), tnorm ) );
	if( vLightIntensity < 0.2 )
		vLightIntensity = 0.2;
		
	vColor = gl_Color;
	if( gl_ProjectionMatrix[2][3] == 0. )
		vColor = vec4( 1., .5, 0., 1. );

	vec4 vert = gl_Vertex;
	vert.xyz *= 5 /length(vert.xyz);
	gl_Position = gl_ModelViewProjectionMatrix * mix(gl_Vertex, vert, Blend);
}