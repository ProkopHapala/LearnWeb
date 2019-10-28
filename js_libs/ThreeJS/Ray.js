
// js introspection
//  https://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class

// ========== Primitives

function float(x){ return Number.parseFloat(x).toFixed(5); }
function glsl_vec2(v){ return `vec2(${float(v.x)},${float(v.y)})`; }
function glsl_vec3(v){ return `vec3(${float(v.x)},${float(v.y)},${float(v.z)})`; }
function glsl_vec4(v){ return `vec4(${float(v.x)},${v.y},${v.z},${v.w})`; }

//function glsl_point( ){ return `vec3 point( Ray r, float t ){ return r.o + t*r.d; }`; }

function glsl_var( obj, name ){ return obj.name + name + " = " + obj.glsl_new() +";"; }

function glsl_add   ( obj ){ console.log(obj); return `ADD( `+obj.glsl_new() +` );` };
function glsl_define( obj ){ return obj.glsl_type() +'\n'+ obj.glsl_dist() +'\n'+ obj.glsl_ray() +'\n'+ obj.glsl_normal(); };

function glsl_scene( inner_code ){
    return "vec4 scene( Ray ray ){\n\tvec4 hit = vec4( POSITIVE_INF, vec3(0.0) );\n\t" 
        +  inner_code 
        +  "\n\treturn hit;\n}";
}

// ========== Sphere

//var 

class Sphere{
    constructor(pos,R){
        this.pos = pos;
        this.R   = R;
    }
    glsl_new(){ let spos=glsl_vec3(this.pos); return `Sphere( ${spos}, ${float(this.R)} )`;}

//Sphere.glsl_name = `Sphere`;
static glsl_type(){ return `struct Sphere{ vec3 p; float R; };`;}

static glsl_dist(){ return `
float dist2( Sphere sph, vec3 p ){
    vec3 dp = p - sph.p;
    return dot(dp,dp)-(sph.R*sph.R);
}`;}

static glsl_ray(){ return `
vec2 ray_ts( Sphere sph, Ray ray ){
    vec3 op   = sph.p - ray.o;
    float b   = dot(op, ray.d);
    float det = b*b - dot(op,op) + sph.R*sph.R;
    if (det<0.0) return vec2(POSITIVE_INF,POSITIVE_INF);
    det       = sqrt(det);
    return vec2( b-det, b+det );
}`;}

    static glsl_normal(){ return `\nvec3 normal( Sphere sph, vec3 p ){ return (p-sph.p)/sph.R; }`;}
// https://stackoverflow.com/questions/51381966/how-do-i-use-a-static-variable-in-es6-class
}

/*
//Sphere.glsl_name = `Sphere`;
Sphere.glsl_type = function(){ return `struct Sphere{ vec3 p; float R; };`;};
Sphere.glsl_dist = function(){ return `
float dist2( Sphere sph, vec3 p ){
    vec3 dp = p - sph.p;
    return dot(dp,dp)-(sph.R*sph.R);
}`;};
Sphere.glsl_ray = function(){ return `
vec2 ray_ts( Sphere sph, Ray ray ){
    vec3 op   = sph.p - ray.o;
    float b   = dot(op, ray.d);
    float det = b*b - dot(op,op) + sph.R*sph.R;
    if (det<0.0) return vec2(POSITIVE_INF,POSITIVE_INF);
    det       = sqrt(det);
    return vec2( b-det, b+det );
}`;};
Sphere.glsl_normal = function(){ return `vec3 normal( Sphere sph, vec3 p ){ return (p-sph.p)/sph.R; }`;};

Sphere.prototype={
    glsl_new:  function(){ let spos=glsl_vec3(this.pos); return `Sphere( ${spos}, ${this.R} )`;},
} // Sphere.prototype

*/


/*
// ========== Slab

var Slab = function(dir,Cmin,Cmax){
    this.dir  = dir;
    this.Cmax = Cmin;
    this.Cmin = Cmax;
}

// static methods
//Slab.glsl_name = `Slab`;
Slab.glsl_type: function(){ return `struct Slab{ vec3 n; float Cmin; float Cmax; };`;},
Slab.glsl_type: function(){ return `
float dist( Slab sl, vec3 p ){
    float c = dot(sl.n,p);
    if (c<sl.Cmin){ return sl.Cmin-c; } else if (c>sl.Cmax){ return c-sl.Cmax; } else { return -1.0; };
}`;};
Slab.glsl_type: function(){ return `
vec2 ray_ts( Slab sl, Ray ray){
    float cnd = dot(sl.n, ray.d);
    float c   = dot(sl.n, ray.o);
    float t1  = -(c + sl.Cmin) / cnd;
    float t2  = -(c + sl.Cmax) / cnd;
    if(t1<t2){ return vec2(t1,t2); }else{ return vec2(t2,t1); };
}`;};
Slab.glsl_type: function(){ return `
float ray_t( Slab sl, Ray ray){
    vec2 ts = ray_ts( sl, ray);
    if (ts.x>0.0){ return ts.x; }else{ return ts.y; };
}`;};
Slab.glsl_type: function(){ return `
vec3 normal( Slab sl, vec3 p ){ 
    float c = dot(sl.n,p);
    if( c > 0.5*(sl.Cmin+sl.Cmax) ){ return sl.n; }else{ return -sl.n; } 
}`;};


Slab.prototype={
    glsl_new:  function(){ let sdir=glsl_vec3(this.dir); return `Slab( ${sdir}, ${this.Cmin}, ${this.Cmax} );"`;},
} // Slab.prototype

// ========== Cylinder

//var = cylinder `Cylinder SURF1 = Cylinder( vec3(0.0,-1.0,0.0), vec3(0.0,1.0,0.0), 0.5      );`

var Cylinder = function(pos1,pos2,R){
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.R    = R;
}

// static methods
Cylinder.glsl_type = function(){ return `struct Cylinder{ vec3  a; vec3 b;  float R; };`;};
Cylinder.glsl_type: function(){ return `
float dist2( Cylinder cl, vec3 p ){
    // http://mathworld.wolfram.com/Point-LineDistance3-Dimensional.html
    vec3  da  = p-cl.a;
    vec3  db  = p-cl.b;
    vec3  aXb = cross(da,db);
    vec3  dc  = cl.b-cl.a;
    float d2  = dot(aXb,aXb)/dot( dc,dc );
    return sqrt(d2) - cl.R;
}`;};

Cylinder.glsl_type = function(){ return `
vec2 ray_ts( Cylinder cl, Ray ray ){

    vec3  cc  = 0.5*(cl.a+cl.b);
    float ch  = length(cl.b-cl.a);
    vec3  ca  = (cl.b-cl.a)/ch;
    ch       *= 0.5;

    vec3  oc = ray.o - cc;

    float card = dot(ca,ray.d);
    float caoc = dot(ca,oc);
    
    float a = 1.0 - card*card;
    float b = dot( oc, ray.d) - caoc*card;
    float c = dot( oc, oc   ) - caoc*caoc - cl.R*cl.R;
    float h = b*b - a*c;
    if( h<0.0 ) return vec2(POSITIVE_INF,POSITIVE_INF);
    h = sqrt(h);
    
    vec2 ts;
    
    float t = (-b-h)/a;
    float y = caoc + t*card; // position of hit along axis
    if( abs(y)<ch ){
        ts.x = t;
    } else{
        float t = (sign(y)*ch - caoc)/card;
        if( abs(b+a*t)<h ){
            ts.x = t;
        }else{
            ts.x = POSITIVE_INF;
        }
    }
    
    if( ts.x < POSITIVE_INF ){
        float t = (-b+h)/a;
        float y = caoc + t*card; // position of hit along axis
        if( abs(y)<ch ){
            ts.y = t;
        } else{
            ts.y = (sign(y)*ch - caoc)/card;
        }
    }

    return ts;
}`;};

Cylinder.glsl_type = function(){ return `
vec3 normal( Cylinder cl, vec3 p ){ 
    vec3  dc  = cl.b-cl.a;
    float h   = length(dc); 
    dc       *= (1.0/h);
    vec3  dp  = p-cl.a;
    float c   = dot(dp,dc);
    if      (c<PREC_STEP){
        return  dc*-1.0;
    }else if(c>h-PREC_STEP){
        return  dc;
    }else {
        return normalize( dp - dc*c );
    }
}`;};

Cylinder.prototype={
    glsl_new:  function(){ let spos1=glsl_vec3(this.pos1); let spos2=glsl_vec3(this.pos2); return `Cylinder( ${spos1}, ${spos2}, ${this.Cmax} );"`;},
} // Cylinder.prototype

// ========== COMMON

*/

var glsl_pre = `
#define PI 3.14159275358979
#define POSITIVE_INF 1e+8
#define SKY_DIST     1e+7
#define PREC_STEP    1e-5

struct Ray     { vec3 o;  vec3 d; };

vec3 point( Ray r, float t ){ return r.o + t*r.d; }
`;


var glsl_macros = `
#define ADD( SURF ){ vec2 ts1 = ray_ts( SURF, ray ); if(  ts1.x < hit.x ){ hit = vec4(ts1.x, normal(SURF,point(ray,ts1.x))); }  }
`;

/*
var glsl_macros = `
#define ADD( SURF ) {                  \\
    ts1 = ray_ts( SURF, ray );         \\
    if(  ts1.x < hit.x ){              \\
        hit = vec4(ts1.x, normal(SURF,point(ray,ts1.x)));    \\ 
    }                                  \\
}

#define SUB( SURF ) {                               \\ 
    vec2 ts2 = ray_ts( SURF, ray );                 \\
    if( (ts1.x > ts2.x) && (ts1.x<ts2.y) ){         \\
        if( ts2.y<ts1.y ){                          \\
            hit = vec4(ts2.y, normal(SURF,point(ray,ts2.y))*-1.0 );    \\ 
        }else{                                      \\
            hit = vec4( POSITIVE_INF, vec3(0.0) );  \\
        }                                           \\
    }                                               \\
}
`;


*/



function glsl_RayTracer( str_pixelMap ){ return `
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
	
	vec3 p  = vec3(0.0, 0.0, 10.0 );
    vec3 d  = normalize(vec3(resolution.x/resolution.y * uvz.x, uvz.y, -uvz.z ) );
    Ray ray = Ray(camMat_*p, camMat_*d);
 
	vec4 hit = scene(ray);

	Material mat = Material( vec3(1.0,0.5,0.5), 1.0 ); // we don't care for now

    if( hit.x<SKY_DIST ){
        float c_diffuse  = clamp( dot(hit.yzw,sunLight.d), 0.0, 1.0);
        //-- specular
        vec3  nn = sunLight.d-ray.d;
        float cn = dot(hit.yzw,nn);
        float c_specular = Lorenz( 100.0*(1.0-clamp( (cn*cn)/dot(nn,nn), 0.0, 1.0)) );
        //-- output
        gl_FragColor = ${str_pixelMap} 
    }else{
        discard;
    }
}`;
}



var pixelMaps = {
    phong   : "vec4( (c_diffuse + c_specular*mat.gloss)*mat.color + vec3(0.1,0.1,0.2)*mat.color, 1.0 );",
    t       : "vec4( vec3(   (hit.x-8.0)*0.25  ), 1.0 );",
    log_t   : "vec4( vec3(log(hit.x-8.0)       ), 1.0 );",
    sin_t   : "vec4( sin(hit.x*10.0),log(hit.x-8.0),sin(hit.x*100.0), 1.0 );",
    sin_pos : "vec4( sin((ray.o+ray.d*hit.x)*100.0), 1.0 );",
    normal  : "vec4( hit.yzw*0.5 + 0.5, 1.0 );",
}


function makeSceneCode(scene, types){
    let str_scene = "";
    for (let i = 0; i < scene.length; i++) {
        let obj = scene[i];
        let tname = obj.constructor.name;
        //console.log( obj + "  TYPE_NAME: " + tname );
        //types[obj.name] = types[obj.name] + 1 || 1;
        types[tname] = obj.constructor;
        str_scene += glsl_add(  obj ) + "\n\t";
    }
    return str_scene;
}

function makePrimitivesCode(types){
    let str_primitives = "";
    //for (let i = 0; i < types.length; i++) {
    for( let key of Object.keys(types) ){
        let cls = types[key];
        //console.log( " types[ "+key+" ] "+cls.glsl_type() );
        str_primitives += `\n//===========  ${key} \n\n`
        str_primitives += glsl_define( cls );
    }
    return str_primitives;
}

 function makeFragCode( scene, str_pixelMap, parts=null  ){
    //console.log( glsl_macros );
    //let types = { apple:  28, orange: 17 };
    let types = {};
    let str_scene      = makeSceneCode(scene, types);
    let str_primitives = makePrimitivesCode(types);
    let str_main       = glsl_RayTracer( str_pixelMap );
    let sep = "\n//===========================\n"
    if ( parts ){
        parts.pre    = glsl_pre;
        parts.primitives = str_primitives;
        parts.macros = glsl_macros;
        parts.scene  = str_scene;
        parts.main   = str_main;
    }
    str_scene      = glsl_scene( str_scene );
    return glsl_pre +sep+ str_primitives +sep+ glsl_macros +sep+ str_scene +sep+ str_main;
    //return glsl_pre +sep+ str_primitives +sep+ str_scene +sep+ str_main;
};