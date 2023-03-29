#version 330 compatibility 



uniform sampler2D sceneTex; // 0
uniform float vx_offset;
uniform float Timer;
uniform float rt_w; // GeeXLab built-in
uniform float rt_h; // GeeXLab built-in
uniform float pixel_w; // 15.0
uniform float pixel_h; // 10.0

in vec3 vMCposition;

uniform float uKa, uKd, uKs;
uniform float uShininess;

in  vec2  vST;			// texture coords
in  vec3  vN;			// normal vector
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye


void main() 
{ 
	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	
	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 myColor = vec3(1.0, 0., 0. );

  vec2 uv = vMCposition.xy;


  
  vec3 tc = vec3(1.0, 0.0, 0.0);
  if (uv.x < (vx_offset-0.005))
  {
    float dx = pixel_w*(1./rt_w);
    float dy = pixel_h*(1./rt_h);
    vec2 coord = vec2(dx*floor(uv.x/dx),
                      dy*floor(uv.y/dy));
    tc = texture2D(sceneTex, coord).rgb;
  }
  else if (uv.x>=(vx_offset+0.005))
  {
    tc = texture2D(sceneTex, uv).rgb;
  

	  vec3 ambient = uKa * myColor;
		float d = 0.;
		float s = 0.;
		if( dot(Normal,Light) > 0. )	          // only do specular if the light can see the point
		{
			d = dot(Normal,Light);       // only do diffuse if the light can see the point
			vec3 ref = normalize(  reflect( -Light, Normal )  );
			s = pow( max( dot(Eye,ref),0. ), uShininess );
		}

		vec3 diffuse = uKd * d * myColor;
		vec3 specular = uKs * s * SpecularColor;
		myColor = vec3( ambient + diffuse + specular);
	
	}





	gl_FragColor = vec4(tc, 1.0);
}
