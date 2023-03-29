#version 330 compatibility

out vec4 vColor;
uniform float Blend;


//const float TWOPI = 2.*3.14159265;
//uniform float OffsetS, OffsetT, Blend;


void 
main()
{
	// original model coords (sphere): 
	//vec4 vertex0 = gl_Vertex;
	//vec3 norm0 = gl_Normal;
	//
	/	// circle coords: 
	//
	//vST= gl_MultiTexCoord0.st;
	//
	//float radius = 1.0 - vST.t;
	//
	//float theta = TWOPI * vST.s;
	//vec4 circle = vec4( radius*cos(theta), radius*sin(theta), 0., 1. );
	//vec3 circlenorm = vec3( 0., 0., 1. );
	//vST += vec2( OffsetS, OffsetT );
	//
	/	// blend: 
	//vec4 theVertex = mix( vertex0, circle, Blend );
	//vec3 theNormal = normalize( mix( norm0, circlenorm, Blend ) );
	//
	/	// do the lighting: 
	//vec3 tnorm = normalize( vec3( gl_NormalMatrix * theNormal ) );
	//vec3 LightPos = vec3( 5., 10., 10. );
	//vec3 ECposition = vec3( gl_ModelViewMatrix * theVertex );
	//vLightIntensity = 1.5 * abs( dot( normalize(LightPos - ECposition), tnorm ) );
	//vColor = gl_Color;
	//gl_Position = gl_ModelViewProjectionMatrix * theVertex;
	//--------------------------------------------------
	//if (1 == 0){
	//vert.xyz = clamp (vert.xyz, -1., 1.);
	//}
	//vec3 tnorm = normalize(vec3(gl_NormalMatrix * gl_Normal));
	//vec3 LightPos = vec3(5.,10.,10.);
	//vec3 EC = vec3(gl_ModelViewMatrix * gl_Vertex);
	//--------------------------------------------------

	vec4 vert = gl_Vertex;
	vert.xyz *= 2./length(vert.xyz);
	vColor = gl_Color;
	gl_Position = gl_ModelViewProjectionMatrix * mix(gl_Vertex, vert, Blend);
}





