#version 330 compatibility


uniform float uAr, uBr, uD, uTol, uNoiseFreq, uNoiseAmp;

uniform sampler2D Noise2;

in  vec2  vST;			// texture coords
in  vec3  vN;			// normal vector
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye

in vec3 vMCposition;

const vec3 WHITE = vec3( 1., 1., 1. ); 

void 
main()
{

	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 myColor = vec3(1.0, 0.5, 0.0 );

	//float Diam = .1f;
	int numins = int(vST.s/uD);
	int numint = int(vST.t/uD);

	float R = uD/2;
	float sc = float(numins) * uD + R;
	float tc = float(numint) * uD + R;

	float ss = vST.s;
	float t = vST.t;




	//vec4 noisev = texture2D (Noise2, uNoiseFreq * vMCposition); //using x y z
	vec4 noisev = texture2D (Noise2, uNoiseFreq * vST); //using S T

	// giving the noise a range of -1 to 1
	float noise = noisev.r + noisev.g + + noisev.b+ noisev.a;  // range is 1->3
	noise = noise - 2.; // -1 to 1
	noise  *= uNoiseAmp;

	


	float result = (pow((ss-sc),2)/ pow(uAr,2)) + (pow((t-tc),2)/ pow(uBr,2));

	if ( ( (pow((ss-sc),2)/ pow(uAr,2)) + (pow((t-tc),2)/ pow(uBr,2)) )    ==1)
	{
		//myColor = vec3(0.,0.,1.);
	}      



	//float sc = float(numins) * uAr  +  R;
	float ds = vST.s - sc;                   // wrt ellipse center
	//float tc = float(numint) * uBr  +  R;
	float dt = vST.t - tc;                   // wrt ellipse center
	
	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + noise;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

	ds *= scale;
	dt *= scale;
	ds /= R;
	dt /= R;
	float d = ds*ds + dt * dt;
	float smoothstepT = smoothstep(1 - uTol, 1 + uTol, d);

	vec3 ambient = .1 * myColor;

	float dott = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = .6 * dott * myColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. )	          // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		s = pow( max( dot(Eye,ref),0. ), 8.0f );
	}

	vec3 specular = .3 * s * SpecularColor.rgb;
	//gl_FragColor = vec4( ambient + diffuse + specular,  1. );
	
	//smoothstep 
	//float smoothstepT = smoothstep(1. - uTol, 1. + uTol, result );
	vec3 mixResult = mix(WHITE, myColor, smoothstepT);
	gl_FragColor = vec4(mixResult, 1.);
	
}