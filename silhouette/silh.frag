#version 330 compatibility

uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent
in vec3 gN;
in  vec3  gL;			// vector from point to light
in  vec3  gE;			// vector from point to eye




void
main()
{

	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 Normal    = normalize(gN);
	vec3 Light     = normalize(gL);
	vec3 Eye       = normalize(gE);
	vec4 color = vec4( 1., 0., 0. , 1.);;
	vec3 ambient = uKa * color.xyz;
	float d = max( dot(Normal,Light), 0. );    
	vec3 diffuse = uKd * d * color.xyz;
	float s = 0.;
	if( dot(Normal,Light) > 0. )	         
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * s * SpecularColor.rgb;

	gl_FragColor = vec4 (vec3(1.,0.,0.), 1);
}