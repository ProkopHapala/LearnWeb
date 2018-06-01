
uniform vec2  resolution;
uniform float time;
uniform mat3  camMat;

vec3 lorenz( vec2 p ){
	float D  = 1.0/(1.0+dot(p,p));
	return vec3( p*(-2.0*D*D), D );
}

void warp_sin( inout vec2 p, inout mat2 dT, vec2  scl, vec2  amp, vec2  frq ){
	p =p*scl;
	vec2 phi = p.yx*frq;
	vec2 f   =     amp*sin(phi); 
	vec2 df  = frq*amp*cos(phi);
	p       += f;
	dT       = dT*mat2( scl.x, df.x,  // jacobian transform
	                    df.y, scl.y   ); 
}

mat2 warping( inout vec2 p, vec2 freq, vec2 freqFac ){
    mat2 dT = mat2(1.0);
    vec2  scl = vec2(1.25,1.0);
    vec2  amp = vec2(0.8,0.8);
    for( int i=0; i<4; i++ ){ 
        warp_sin( p, dT, scl, amp, freq );
        warp_sin( p, dT, scl, amp, freq );
        freq *= freqFac;
    }
    return dT;
}

vec3 warped_function( vec2 p ){
	float fscale  = 12.0; 
	p *= fscale;
		
	//float warp_strength = 1.5/(1.0+p.y*p.y);
	
	mat2 dT = warping( p, vec2(1.0,2.0), vec2(1.5,0.8) );
	//mat2 dT = warping( p, freq0, vec2(1.5,0.8) );

	// mat2 dT = mat2(1.0);
	//for( int i=0; i<2; i++ ){ warp_sin( p, dT, vec2(1.25,1.0), vec2(0.5,0.5), vec2(4.0,4.0) ); }
	//for( int i=0; i<2; i++ ){ warp_sin( p, dT, vec2(1.25,1.0), vec2(0.8,0.8), vec2(1.0,1.0) ); }
	
	vec3 fd = lorenz( p / fscale );
	fd.xy   = (dT * fd.xy);	
	return fd;
}
    
void main( ){	
	vec2 p = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	vec3 o = warped_function( p );
    if( p.y > 0.0){
        float dd = 0.001;
        o.x = warped_function( p + vec2(dd,0.0) ).z - o.z;
        o.y = warped_function( p + vec2(0.0,dd) ).z - o.z;
        o.xy /= dd;
    };
    //gl_FragColor =  vec4( vec3(o.z*0.5)+0.5, 1.0 );
    gl_FragColor =  vec4( vec3(o.xy*0.02,0.0)+vec3(o.z*0.5)+0.2, 1.0 );
    //gl_FragColor =  vec4( o*vec3(0.05,0.05,0.5) +0.5, 1.0 );
    //gl_FragColor   =  vec4( o.yx*0.05+0.5,0.5, 1.0 ); 
    //gl_FragColor =  vec4( vec3(o.z)*0.5+0.5, 1.0 );   
    
}


