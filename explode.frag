#version 330 compatibility

uniform bool  uUseST;
uniform float uX, uY, uZ;
uniform float uDx, uDy, uDz;
uniform float uS, uT;
uniform float uDs, uDt;
uniform float uLightDirX, uLightDirY, uLightDirZ;
uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent

in vec2  gST;
in vec3  gXYZ;
in vec4  gColor;
in float gLightIntensity;

in vec3 gN;
in  vec3  gL;			
in  vec3  gE;			


const vec3 RED = vec3( .5, .9, .25);

void main( )
{

	//-----------------------------------------------

	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 Normal    = normalize(gN);
	vec3 Light     = normalize(gL);
	vec3 Eye       = normalize(gE);

	float intensity;
	intensity = dot(vec3 (uLightDirX,uLightDirY,uLightDirZ),gN);
	
	vec3 newColor = gColor.rgb;

	if (intensity > 0.95)
		newColor = vec3(1.0,0.5,0.5);
	else if (intensity > 0.5)
		newColor = vec3(0.6,0.3,0.3);
	else if (intensity > 0.25)
		newColor = vec3(0.4,0.2,0.2);
	else
		newColor = vec3(0.2,0.1,0.1);
	

	vec3 ambient = uKa * newColor.xyz;
	
	float d = max( dot(Normal,Light), 0. );       // /only /do diffuse if the light can see the point
	vec3 diffuse = uKd * d * newColor.xyz;
	
	float s = 0.;
	if( dot(Normal,Light) > 0. )	          // only do //specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * s * SpecularColor.rgb;

	//-----------------------------------------------



	if( uUseST )
	{
		if( uS-uDs <= gST.s  &&  gST.s <= uS+uDs  &&   uT-uDt <= gST.t  &&  gST.t <= uT+uDt )
			newColor = RED;
	}
	else
	{
		if( uX-uDx <= gXYZ.x  &&  gXYZ.x <= uX+uDx  &&   uY-uDy <= gXYZ.y  &&  gXYZ.y <= uY+uDy  &&  uZ-uDz <= gXYZ.z  &&  gXYZ.z <= uZ+uDz )
			newColor = RED;
	}

	newColor *= gLightIntensity;
	gl_FragColor = vec4( newColor + ambient + diffuse + specular, 1. );
}