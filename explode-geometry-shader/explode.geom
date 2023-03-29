#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles ) in;
layout( triangle_strip, max_vertices=200 ) out;

//---------------------------------
//in from vertex
in vec4 vColor[3];
out vec4 gColor;

in float vLightIntensity[3]; 
out float gLightIntensity;

in vec2 vST[3];
out vec2 gST;

in vec3 vXYZ[3];
out vec3 gXYZ;

in vec3 vN[3];
in  vec3  vL[3];	
in  vec3  vE[3];

out vec3 gN;
out vec3 gL;
out vec3 gE;

//---------------------------------


//---------------------------------
// to get current space

uniform bool  uUseST;
uniform float uX, uY, uZ;
uniform float uDx, uDy, uDz;
uniform float uS, uT;
uniform float uDs, uDt;

//---------------------------------

uniform int   uLevel;
uniform float uChange;
uniform float uTime;
uniform float uMove;


vec3 V0, V01, V02; 
vec3 CG;

const vec3 RED = vec3( 1., 0., 0. );



void ProduceVertex( float s, float t ){
	vec3 newColor = gColor.rgb;

			vec3 v = V0 + s*V01 + t*V02;
	
	if( (uS-uDs <= gST.s  &&  gST.s <= uS+uDs  &&   uT-uDt <= gST.t  &&  gST.t <= uT+uDt) ){
			newColor = RED;
			newColor *= gLightIntensity;
		vec3 vel = uMove * ( v - CG );
		v = CG + vel*uMove + 0.5*vec3(0.,uChange,0.)*uMove*uMove;

			//EmitVertex();
	}
		
		gl_Position = gl_ProjectionMatrix * vec4( v, 1. );
		

	
	EmitVertex( );
	
		
	
		
			
		
}

void main()
{
//-------------------------------

	gColor = vColor[0];


	gLightIntensity = vLightIntensity[1]; 

	gST = vST[1];

	gXYZ = vXYZ[0];

	gN = vN[1];
	gL = vL[1];
	gE = vE[1];


//--------------------------------

			

	V01 = ( gl_PositionIn[1] - gl_PositionIn[0] ).xyz;
	V02 = ( gl_PositionIn[2] - gl_PositionIn[0] ).xyz;
	V0 = gl_PositionIn[0].xyz;
	CG = ( gl_PositionIn[0].xyz + gl_PositionIn[1].xyz + gl_PositionIn[2].xyz ) / 3.;
	
	int numLayers = 1 << uLevel;

	float dt = 1. / float( numLayers );

	float t = 1.;

	for( int it = 0; it <= numLayers;it++ ) {
		float smax = 1. - t;

		int nums = it + 1;

		float ds = smax / float( nums - 1 );

		float s = 0.;

		for( int is = 0; is < nums; is++ ) { 

		
			ProduceVertex(s,t);
			s+=ds;
		}

		t-=dt;
	}


}