
uniform vec2  resolution;
uniform float time;
uniform mat3  camMat;

vec3 lorenz( vec2 p ){
	float D  = 1.0/(1.0+dot(p,p));
	return vec3( p*(-2.0*D*D), D );
}

void warp_sin( inout vec2 p, inout mat2 dT ){
	vec2  scl=vec2(1.25,1.0);
	vec2  amp=vec2(0.8,0.8);
	vec2  frq=vec2(1.9,1.0);
	//vec2  shf=vec2(0.8,0.0);
	p =p*scl;
	mat2 jacobian = mat2( 
	    scl.x,      frq.x*cos(p.y*frq.x)*amp.x,
	    frq.y*cos(p.x*frq.y)*amp.y, scl.y      
	);
	p   += sin(p.yx*frq)*amp;
	dT   = dT*jacobian;	
}

mat2 wraping( inout vec2 p ){
    mat2 dT = mat2(1.0);
	for(int i=0; i<6; i++){
		warp_sin( p, dT );
	}
	return dT;
}

vec3 warped_function( vec2 p ){
	float fscale  = 8.0;
	p *= fscale;
	mat2 dT = wraping( p );
	float ifscale = 1.0/fscale;
	vec3 fd = lorenz( p * ifscale );
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
    //gl_FragColor =  vec4( o*0.5+0.5, 1.0 );
    gl_FragColor   =  vec4( o.yx*0.05+0.5,0.5, 1.0 ); 
    //gl_FragColor =  vec4( vec3(o.z)*0.5+0.5, 1.0 );     
}


