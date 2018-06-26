
// For inspiration
// https://www.shadertoy.com/view/4s23WK
// https://www.shadertoy.com/view/lsl3RH
// https://www.shadertoy.com/view/lllXz4



/*
// Contemplating

 - According to schodeinger smoke we can create vorticity field by inversion of some complex "psi" function (zeros become poles = vortex cores )
 - http://multires.caltech.edu/pubs/SchrodingersSmoke.pdf   
 - the complex function "psi" can be found as fractal turbulence function  

*/

#define PI 3.14159275358979
#define POSITIVE_INF 1e+8
#define SKY_DIST     1e+7
#define PREC_STEP    1e-5

vec2 mul_complx( vec2 a, vec2 b ){
    return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x );
}


// Structs
struct Ray     { vec3 o;  vec3 d;  };
struct Sphere  { vec3  p; float R; };

// === Ray 

vec3 point( Ray r, float t ){ return r.o + t*r.d; }

// === Sphere

float dist2( Sphere sph, vec3 p ){
    vec3 dp = p - sph.p;
    return dot(dp,dp)-(sph.R*sph.R);
}

float ray_t( Sphere sph, Ray ray ){
    vec3 op   = sph.p - ray.o;
    float b   = dot(op, ray.d);
    float det = b*b - dot(op,op) + sph.R*sph.R;
    if (det<0.0) return POSITIVE_INF;
    det       = sqrt(det);
    float t   = b - det; 
    if (t < 0.0) t = b + det;
    return t;
}

vec3 normal( Sphere sph, vec3 p ){ return (p-sph.p)/sph.R; }

// === Main - RayTrace

uniform vec2  resolution;
uniform float time;
uniform mat3  camMat;

#define MAX_BOUNCES 2
float gamma = 2.2;

struct DirectionalLight{  vec3 d; vec3 c; };
struct Material{ vec3 color; float gloss; };

DirectionalLight sunLight = DirectionalLight( normalize(vec3(1.0, 0.5, 0.5)), vec3(1.0) );

float Lorenz( float x ){ return 1.0/(1.0+x*x); }
    
void main( ){	

    mat3 camMat_ = camMat;
	vec3 uvz = vec3( 2.0 * gl_FragCoord.xy / resolution.xy - 1.0, 5.0 );
	
	
    vec3 d  = normalize(vec3(resolution.x/resolution.y * uvz.x, uvz.y, -uvz.z ) );
    Ray ray = Ray(camMat_*vec3(0.0, 0.0, 10.0 ), camMat_*d);
    
    // === Scene  ( planet, rings?, moon? )	
	Sphere planet = Sphere( vec3(0.0,0.0,0.0), 2.0 );
	float t = ray_t( planet, ray );
	vec3 p = ray.o + ray.d*t;
	
	//vec2 uv = vec2( p.y/planet.R, atan(p.x,p.z) );
	
    if( t<SKY_DIST ){
       // gl_FragColor = vec4( sin(p*100.0)*0.5+0.5, 1.0 );
        gl_FragColor = vec4( sin(p*50.0)*0.1+0.9, 1.0 );
    }else{
        //gl_FragColor = vec4( vec3(0.5), 1.0 );
        discard;
    }
    
}


