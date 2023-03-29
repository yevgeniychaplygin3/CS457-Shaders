#version 330 compatibility


uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent
uniform float uLightDirX, uLightDirY, uLightDirZ;

//uniform float numColorSteps; 

in vec3 vN;
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye


void main(){

	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);
	
	
	float intensity;
	vec4 color;
	intensity = dot(vec3 (uLightDirX,uLightDirY,uLightDirZ),vN);
	
	
	
	
	if (intensity > 0.95)
		color = vec4(1.0,0.5,0.5,1.0);
	else if (intensity > 0.5)
		color = vec4(0.6,0.3,0.3,1.0);
	else if (intensity > 0.25)
		color = vec4(0.4,0.2,0.2,1.0);
	else
		color = vec4(0.2,0.1,0.1,1.0);
	
	
	
	
	vec3 ambient = uKa * color.xyz;
	
	float d = max( dot(Normal,Light), 0. );       // /only /do diffuse if the light can see the point
	vec3 diffuse = uKd * d * color.xyz;
	
	float s = 0.;
	if( dot(Normal,Light) > 0. )	          // only do //specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * s * SpecularColor.rgb;
	
	
	
	
	gl_FragColor = vec4( ambient + diffuse + specular, 1.);

	// vec3 lightPos = vec3 (uLightDirX,uLightDirY,uLightDirZ);
	// vec3 FragPos = gl_FragCoord.xyz;
	// vec3 color = vec3 (1.,0.,0);
	//
	//// ambient
	//float ambientStrength = 0.1;
	//vec3 ambient = ambientStrength * vec3(1.,1.,1);
	//
	//// diffuse
	//vec3 normal = normalize(Normal);
	//vec3 lightDir = normalize(lightPos - FragPos);
	//// if angle between normal and lightDir > 90 degrees, dot product is neg
	//float diffuse = dot(normal, lightDir);
	//float diffuseToon = max(ceil(diffuse * float(numColorSteps )) / float(numColorSteps ), 0.0);
	//
	//vec3 toonColor = diffuseToon * vec3(1.,1.,1) * color;
	//
	//gl_FragColor = vec4(toonColor, 1.0);
}