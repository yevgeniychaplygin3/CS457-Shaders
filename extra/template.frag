#version 330 compatibility

uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent
in vec3 vN;
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye


void main(){
	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);
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
	gl_FragColor = vec4( ambient + diffuse + specular, 1.);
}