#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles )  in;
layout( triangle_strip, max_vertices=204 )  out;

in vec3		vNormal[3];
out float	glLightIntensity; // quick and dirt lighting

uniform int uLevel;
uniform int uQuantize;
uniform int uRadius;

vec3 V0, V01, V02;
vec3 N0, N01, N02;



const vec3 LIGHTPOS = vec3( 0., 10., 0. );

// out vec3	gNs, gEs, gLs; // better lighting
//set gl_Position and all out variables before each call to EmitVertex( ).


float
Sign( float f )
{
        if( f >= 0. )   return  1.;
        return -1.;
}


float
Quantize( float f )
{
        f *= uQuantize;
        f += 0.5 * Sign(f);                // round-off
        int fi = int( f );
        f = float( fi ) / uQuantize;
        return f;
}

const float PI = 3.14159265;

float
atan2( float y, float x )
{
        if( x == 0. )
        {
                if( y >= 0. )
                        return  PI/2.;
                else
                        return -PI/2.;
        }
        return atan(y,x);
}

void ProduceVertex(float s, float t)
{
	vec3 v = V0 + s*V01 + t*V02;


	float radius = length( v.xz );
	float theta = atan2( v.z, v.x );
	float height = v.y;
	
	
	radius = Quantize(radius);
	height = Quantize(height);

	// turn back into Cartesian v = vec3(x,y,z) for drawing
	v.xz = radius * vec2( cos(theta), sin(theta) );
	v.y = height;
	


	v = normalize(v);
	vec3 n = v;
	n = N0 + s* N01 + t*N02;
	vec3 tnorm = normalize (gl_NormalMatrix * n);


	


	vec4 ECposition = gl_ModelViewMatrix * vec4 ( (radius*v), 1.);
	glLightIntensity = abs( dot(normalize(LIGHTPOS - ECposition.xyz), tnorm ));


	

	gl_Position = gl_ProjectionMatrix * ECposition;
	EmitVertex();
}





void
main()
{

	V01 = ( gl_PositionIn[1] - gl_PositionIn[0] ).xyz;
	V02 = ( gl_PositionIn[2] - gl_PositionIn[0] ).xyz; 
	V0 = gl_PositionIn[0].xyz;

	N01 = ( vNormal[1] - vNormal[0] ).xyz;
	N02 = ( vNormal[2] - vNormal[0] ).xyz; 
	N0 = vNormal[0].xyz;
	
	int numLayers = 1 << uLevel;

	float dt = 1. / float( numLayers );
	float t_top = 1.;

	for( int it = 0; it < numLayers; it++ ){

		float t_bot = t_top - dt;
		float smax_top = 1. - t_top;
		float smax_bot = 1. - t_bot;
		int nums = it + 1;
		float ds_top = smax_top / float( nums - 1 );
		float ds_bot = smax_bot / float( nums );
		float s_top = 0.;
		float s_bot = 0.;

		for( int is = 0; is < nums; is++ ) 
		{ 
			ProduceVertex( s_bot, t_bot ); 
			ProduceVertex( s_top, t_top ); 
			s_top += ds_top;
			s_bot += ds_bot; 
		}
		ProduceVertex( s_bot, t_bot );
		EndPrimitive( );
		t_top = t_bot;
		t_bot -= dt;
	}
}
