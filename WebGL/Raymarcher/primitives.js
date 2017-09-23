"use strict";

const MAX_DIST = 1e-8;

var SDFs = []; 

class SDF{
    constructor() {
        //this.args = [];
        this.id   = SDFs.length;
        this.name = "_"+this.id; 
        SDFs.push(this);
    }
    toGLSL(){ return MAX_DIST; };
    //add(){}
};

function arg2GLSL( arg ){
    if      ( arg instanceof SDF ){
        //return arg.toGLSL();
        return name;
    }else if ( typeof arg === "number" ){
        //console.log( "number ", arg );
        return arg.toString(); 
    }else if( arg instanceof Array ){
        let n = arg.length;
        if( n == 2 ){ return "vec2("+arg.join(",")+")"; }
        if( n == 3 ){ return "vec3("+arg.join(",")+")"; }
        if( n == 4 ){ return "vec4("+arg.join(",")+")"; }
        else{  
            alert( "only vec2,vec3,vec4 possible here" );
        }    
    }
};

class Sphere extends SDF{
    constructor( pos, R ){
        super();
        this.pos = pos;
        this.R   = R; 
        //console.log( R, pos );
    }
    toGLSL(){ 
        let R   = arg2GLSL( this.R   );
        let pos = arg2GLSL( this.pos );
        //console.log( R, pos, this.R );
        return "sphere_sdf("+pos+","+R+")";
    }
}

class Union extends SDF{
    constructor( o1, o2 ){
        super();
        this.o1 = o1;
        this.o2 = o2;
    }
    toGLSL(){ 
        let o1 = this.o1.toGLSL();
        let o2 = this.o2.toGLSL();
        return " Union("+o1+","+o2+")";
    }
}

class Complement extends SDF{
    constructor( o1, o2 ){
        super();
        this.o1 = o1;
        this.o2 = o2;
    }
    toGLSL(){ 
        let o1 = this.o1.toGLSL();
        let o2 = this.o2.toGLSL();
        return " Complement("+o1+","+o2+")";
    }
}

/*
var scene_code = `
var s0 = new Sphere( [0,0,0], 1.0 );
var s1 = new Sphere( [1,0,0], 0.5 );
var s2 = new Sphere( [0,1,0], 0.5 );
var s3 = new Sphere( [0,0,1], 0.5 );
var u1 = new Union( s0, s1 );
var c1 = new Complement( s2, s3 );
`;
*/

var scene_code = `
s0 = Sphere( [0,0,0], 1.0 );
s1 = Sphere( [1,0,0], 0.5 );
s2 = Sphere( [0,1,0], 0.5 );
s3 = Sphere( [0,0,1], 0.5 );
u1 = Union ( s0, s1 );
c1 = Complement( s2, s3 );
`;

function parseSceneCode( scene_code ){
    let lines = scene_code.split( ";" );
    console.log( lines );
    for( let i=0; i<lines.length; i++ ){
        let sides   = lines[i].split( "=" ); 
        console.log(  "|", sides[0], " rhs: ", sides[1] );
        let o = eval( "new "+sides[1] );
        if( sides[0] ){
            o.name = sides[0];
        }
    }
}

function sceneToGLSL( ){
    for( let i=0; i<SDFs.length; i++ ){
        let sdf = SDFs[i];
        let line = sdf.name + sdf.toGLSL()
        console.log( line );
    }
}

window.onload = function(){

    parseSceneCode( scene_code );
    sceneToGLSL( );


    // see https://stackoverflow.com/questions/35423964/getting-the-window-object-for-an-eval-and-list-all-vars-javascript-eval-inli
    /*
    var geval = eval;
    geval( scene_code );
    for ( var i in window ) {
        //console.log(i, typeof window[i], window[i]);
        if( window[i] instanceof SDF ){
            console.log(i, window[i].toGLSL() );

        } 
    }
    */

    /*
    var f = Function( "", scene_code );
    console.log( f );
    for ( var i in f ) { console.log( i ); }
    */

    //geval('var a=1; b=2');
    //console.log(window.a, window.b);

}

