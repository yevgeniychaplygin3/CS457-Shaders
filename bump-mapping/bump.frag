#version 330 compatibility 

uniform float uNoiseFreq, uNoiseAmp;
uniform sampler3D Noise3;


uniform float uKa, uKd, uKs;
uniform float uShininess;

in  vec2  vST;			// texture coords
in  vec3  vN;			// normal vector
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye

in vec3 vMCposition;

vec3
RotateNormal(float angx, float angy, vec3 n){
	float cx = cos( angx );
    float sx = sin( angx );
    float cy = cos( angy );
    float sy = sin( angy );

    // rotate about x:
    float yp =  n.y*cx - n.z*sx;    // y'
    n.z      =  n.y*sx + n.z*cx;    // z'
    n.y      =  yp;
    // n.x      =  n.x;

    // rotate about y:
    float xp =  n.x*cy + n.z*sy;    // x'
    n.z      = -n.x*sy + n.z*cy;    // z'
    n.x      =  xp;
    // n.y      =  n.y;

    return normalize( n );
}


void 
main()
{
	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	
	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 myColor = vec3(1.0, 0., 0. );


	//--------------------------------------------------------------------------------------------

	vec4 noisevx = texture (Noise3, uNoiseFreq * vMCposition); 
	float angx = noisevx.r + noisevx.g + noisevx.b + noisevx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;
	
	vec4 noisevy = texture (Noise3, uNoiseFreq * vec3(vMCposition.xy, vMCposition.z +0.5));
	float angy = noisevy.r + noisevy.g + noisevy.b + noisevy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;

	vec3 dispNormal = RotateNormal(angx,angy, Normal);
	vec3 dispNormal2 =  gl_NormalMatrix * dispNormal;	// normal vector
	
	//--------------------------------------------------------------------------------------------



	

	// LIGHTING-------------------------------------------------------------------------------

	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;
	if( dot(dispNormal2,Light) > 0. )	          // only do specular if the light can see the point
	{
		d = dot(dispNormal2,Light);       // only do diffuse if the light can see the point
		vec3 ref = normalize(  reflect( -Light, dispNormal2 )  );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}

	vec3 diffuse = uKd * d * myColor;
	vec3 specular = uKs * s * SpecularColor;
	myColor = vec3( ambient + diffuse + specular);
	// -------------------------------------------------------------------------------


	gl_FragColor = vec4( myColor,  1. );
	
}