#version 330 compatibility

uniform sampler2D uImageUnit  ;

in  vec2  vST;			// texture cooruDs
uniform float uSc, uTc, uDs, uDt, uRad, uMagFactor, uRotAngle, uSharpFactor, uEdgeDetect;
uniform bool uCircle;

const vec3 LUMCOEFFS = vec3( 0.2125,0.7154,0.0721 );


vec3
EdgeDetect(vec3 myColor, vec2 st)
{

	ivec2 ires = textureSize( uImageUnit, 0 );
	float ResS = float( ires.s );
	float ResT = float( ires.t );

	vec2 stp0 = vec2(1./ResS, 0. );
	vec2 st0p = vec2(0. , 1./ResT);
	vec2 stpp = vec2(1./ResS, 1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);
	float i00 = dot( texture2D( uImageUnit, st ).rgb , LUMCOEFFS );
	float im1m1 = dot( texture2D( uImageUnit, st-stpp ).rgb, LUMCOEFFS );
	float ip1p1 = dot( texture2D( uImageUnit, st+stpp ).rgb, LUMCOEFFS );
	float im1p1 = dot( texture2D( uImageUnit, st-stpm ).rgb, LUMCOEFFS );
	float ip1m1 = dot( texture2D( uImageUnit, st+stpm ).rgb, LUMCOEFFS );
	float im10 = dot( texture2D( uImageUnit, st-stp0 ).rgb, LUMCOEFFS );
	float ip10 = dot( texture2D( uImageUnit, st+stp0 ).rgb, LUMCOEFFS );
	float i0m1 = dot( texture2D( uImageUnit, st-st0p ).rgb, LUMCOEFFS );
	float i0p1 = dot( texture2D( uImageUnit, st+st0p ).rgb, LUMCOEFFS);
	float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1 + 1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
	float v = -1.*im1m1 - 2.*im10 - 1.*im1p1 + 1.*ip1m1 + 2.*ip10 + 1.*ip1p1;
	float mag = sqrt( h*h + v*v );
	vec3 target = vec3( mag,mag,mag );
	return mix( myColor, target, uEdgeDetect );
}



vec3
Sharpen(vec3 myColor, vec2 st )
{
	ivec2 ires = textureSize( uImageUnit, 0 );
	float ResS = float( ires.s );
	float ResT = float( ires.t );

	vec2 stp0 = vec2(1./ResS, 0. );
	vec2 st0p = vec2(0. , 1./ResT);
	vec2 stpp = vec2(1./ResS, 1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);
	vec3 i00 = texture2D( uImageUnit, st ).rgb;
	vec3 im1m1 = texture2D( uImageUnit, st-stpp ).rgb;
	vec3 ip1p1 = texture2D( uImageUnit, st+stpp ).rgb;
	vec3 im1p1 = texture2D( uImageUnit, st-stpm ).rgb;
	vec3 ip1m1 = texture2D( uImageUnit, st+stpm ).rgb;
	vec3 im10 = texture2D( uImageUnit, st-stp0 ).rgb;
	vec3 ip10 = texture2D( uImageUnit, st+stp0 ).rgb;
	vec3 i0m1 = texture2D( uImageUnit, st-st0p ).rgb;
	vec3 i0p1 = texture2D( uImageUnit, st+st0p ).rgb;
	vec3 blur = vec3(0.,0.,0.);
	blur += 1.*(im1m1+ip1m1+ip1p1+im1p1);
	blur += 2.*(im10+ip10+i0m1+i0p1);
	blur += 4.*(i00);
	blur /= 16.;
	return mix( blur, myColor,  uSharpFactor);
}


void
main( )
{
	vec3 myColor = texture(uImageUnit  , vST).rgb;

	// draw a circle
	if ( uCircle){

		float s = vST.s;
		float t = vST.t;

		// if inside the circle
		if ( pow((s-uSc),2) + pow((t-uTc), 2) <= pow(uRad, 2) ){
			//magnify
			vec2 delta = vST - vec2(uSc, uTc);
			vec2 st = vec2(uSc,uTc) + delta / uMagFactor;


			// rotate

			float sp =  vec2(uSc,uTc).s +((delta/uMagFactor).s*cos(uRotAngle) -  (delta/uMagFactor).t*sin(uRotAngle));
			float tp =  vec2(uSc,uTc).t +((delta/uMagFactor).s*sin(uRotAngle) + (delta/uMagFactor).t*cos(uRotAngle));

			vec2 new_st = vec2(sp,tp);

			vec3 newColor = texture2D(uImageUnit, new_st).rgb;
			vec3 sharpenColor = Sharpen(newColor, new_st);
			vec3 edgeDetectColor = EdgeDetect(sharpenColor, new_st);

			myColor = newColor * edgeDetectColor;
		}
		//else{
			//gl_FragColor = vec4( myColor, 1.);
		//}

	}else{	// draw a square
		
		// if inside square
		if(	uSc-uDs/2. <= vST.s  &&  vST.s <= uSc+uDs/2.  && 
			uTc-uDt/2. <= vST.t  &&  vST.t <= uTc+uDt/2.  )
		{

			//magnify

			vec2 delta = vST - vec2(uSc, uTc);
			vec2 st = vec2(uSc,uTc) + delta / uMagFactor;

			// rotate
			float sp =  vec2(uSc,uTc).s +((delta/uMagFactor).s*cos(uRotAngle) -  (delta/uMagFactor).t*sin(uRotAngle));
			float tp =  vec2(uSc,uTc).t +((delta/uMagFactor).s*sin(uRotAngle) + (delta/uMagFactor).t*cos(uRotAngle));

			vec2 new_st = vec2(sp,tp);


			vec3 newColor= texture2D(uImageUnit, new_st).rgb ;

			vec3 sharpenColor = Sharpen(newColor, new_st);
			vec3 edgeDetectColor = EdgeDetect(sharpenColor, new_st);

			myColor = newColor * edgeDetectColor;
		}
		
		//else{
			//gl_FragColor = vec4( myColor,  1. );
		//}	
	} 

	
	gl_FragColor = vec4( myColor, 1. );

}


