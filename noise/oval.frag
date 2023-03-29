#version 330 compatibility


uniform float uAd, uBd, uTol, uNoiseFreq, uNoiseAmp, uAlpha;

uniform sampler2D Noise2;
uniform sampler3D Noise3;

in  vec2  vST;			// texture coords
in  vec3  vN;			// normal vector
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye

in vec3 vMCposition;


void 
main()
{
	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	vec3 SpecularColor = vec3( 1., 1., 1. );
	vec3 myColor = vec3(1.0, 1., 1. );


	float Ar = uAd / 2;
	float Br = uBd / 2;

	int numInS = int(vST.s/uAd);
	int numInT = int(vST.t/uBd);

	float sc = float(numInS) * uAd + Ar;
	float tc = float(numInT) * uBd + Br;

	float ds = vST.s - sc;                   // wrt ellipse center
	float dt = vST.t - tc;                   // wrt ellipse center

	float ss = vST.s;
	float t = vST.t;


	//vec4 noisev = texture3D (Noise3, uNoiseFreq * vMCposition); //using x y z
	vec4 noisev = texture2D (Noise2, uNoiseFreq * vST); //using S T

	// giving the noise a range of -1 to 1
	float noise = noisev.r + noisev.g + + noisev.b+ noisev.a;  // range is 1->3
	noise = noise - 2.; // -1 to 1
	noise  *= uNoiseAmp;


	//float s_Squared = (ss-sc) * (ss-sc);
	//float t_Squared = (t-tc) * (t-tc);
	//
	//float aR_Squared = (Ar) * (Ar);
	//float bR_Squared = (Br) * (Br);
	//
	//float div1 = s_Squared / aR_Squared;
	//float div2 = t_Squared / bR_Squared;
	//
	//float _sum = div1 + div2;

	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + noise;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.
	
	ds *= scale;
	dt *= scale;
	ds /= Ar;
	dt /= Br;
	float d = ds*ds + dt * dt;

	

	float smoothstepT = smoothstep(1 - uTol, 1 + uTol, d);






	// LIGHTING-------------------------------------------------------------------------------
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
	myColor = vec3( ambient + diffuse + specular);
	// -------------------------------------------------------------------------------
	
	vec3 WHITE = vec3 (1.,1.,1.);
	
	vec3 mixResult = mix( myColor, WHITE, smoothstepT);

	if (d < 1)
		gl_FragColor =  vec4 (mixResult, 1);
	else{
		if(uAlpha == 0 && ss < d && t < d){
			discard;
		}
		else
			gl_FragColor = vec4 (mixResult, uAlpha);
	}
}