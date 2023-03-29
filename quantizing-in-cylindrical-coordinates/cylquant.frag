#version 330 compatibility


in float	glLightIntensity;


void 
main()
{
	vec3 color = vec3(1., 0.65, 0.40); 
	gl_FragColor = vec4(glLightIntensity * color, 1.);
}