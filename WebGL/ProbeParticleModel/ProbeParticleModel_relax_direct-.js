"use strict";

// ===========================================
// ==== Vertex shader program

const vsSource = `#version 300 es
precision mediump float;
layout(location = 0) in vec4 aVertexPosition;
layout(location = 1) in vec2 aTextureCoord;
out vec3 vTextureCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;
void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = vec3( aTextureCoord, sin(time)*0.5+0.5 );
}`;

// ==== Fragment shader program

const fsSource = `#version 300 es
#define NATOM MOD_natoms
//precision mediump float;
//precision mediump sampler2D;
precision highp float;
precision highp sampler2D;
uniform sampler2D txAtoms;
uniform sampler2D txLJ;
in  vec3 vTextureCoord;
out vec4 color;

uniform float z0    ;
uniform float Krad  ;
uniform float Klat  ;
uniform float Rlever;
uniform vec3  dp0   ;
uniform vec3  dtip  ;
uniform float dt    ;
uniform float cdamp ;
uniform float f2conv;
uniform float f2max ;

//const float z0    =    6.8;
//const float Krad  =  -20.0 * 1.60217662;
//const float Klat  =  -0.15 * 1.60217662;
//const float Rlever=   4.0;
//const vec3  dp0   = vec3(0.0,0.0,-4.0);
//const vec3  dtip  = vec3(0.0,0.0,-0.1);
//const float dt    =   0.15;
//const float cdamp =   0.9;
//const float fconv  = 1e-4;
//const float f2conv = fconv*fconv;
//const float fmax  = 0.05;
//const float f2max = fmax*fmax;

const int nzpre   = 7;
const int nzfinal = 3;


vec4 FE_LJ( vec3 dp, vec2 cLJ ){
    float ir2 = 1.0/dot(dp,dp);
    float ir6 = ir2*ir2*ir2;
    float e = (      cLJ.x +       cLJ.y*ir6 )*ir6;
    float f = ( -6.0*cLJ.x + -12.0*cLJ.y*ir6 )*ir6;
    return vec4( dp*( f*ir2 ), e );
}

vec4 Ftip( vec3 dp ){
    
    float  r  = sqrt(dot( dp,dp)); 
    vec3   f  = dp*(Krad*(r-Rlever)/r);
    f        += (dp-dp0)*Klat;
    
    //vec3 f = dp * Klat;
    return vec4( f, 0.0 );
}

vec4 sampleFE( vec3 pvox ){
    vec4 fe = vec4(0.0);
    for( int i=0; i<NATOM; i++ ){
        vec4 atom = texelFetch( txAtoms, ivec2(i,0), 0 );
        vec2 c612 = texelFetch( txLJ,    ivec2(i,0), 0 ).rg;
        vec3 dp   =  atom.xyz -  pvox;
        fe += FE_LJ( dp, c612 );
    }
    return fe;
}

void main(){
    
    vec3  ptip = vec3( (vTextureCoord.xy*2.0-1.0) *10.0 , z0) - dtip*float(nzpre+nzfinal); 
    vec3  pp   = ptip + dp0;
    
    vec3  pp0 = pp;
    //float f2err = 100.0;
    //while( f2err < f2conv ){
    vec4 fe,fetot;
    
    for(int iz=0; iz<nzpre; iz++){
        ptip  += dtip;
        pp    += dtip;
        vec3  vpp = vec3(0.0);
        for(int iter=0; iter<20; iter++){
            fe     = sampleFE( pp );
            fetot  = fe + Ftip( pp-ptip );
            //pp    += fetot.xyz*dt; // better relaxation method later
            
            float f2 = dot(fetot.xyz,fetot.xyz);
            //if( f2<f2conv) break;
            if( f2>f2max ) fetot*=sqrt(f2max/f2);
            
            vpp    *= cdamp; 
            //vpp    += vec3(fetot.xy*dt, 0.0);
            vpp    += fetot.xyz*dt;
            pp     += vpp*dt;
        }
    }
    
    for(int iz=0; iz<nzfinal; iz++){
        ptip  += dtip;
        pp    += dtip;
        vec3  vpp = vec3(0.0);
        for(int iter=0; iter<1000; iter++){
            fe     = sampleFE( pp );
            fetot  = fe + Ftip( pp-ptip );
            //pp    += fetot.xyz*dt; // better relaxation method later
            
            float f2 = dot(fetot.xyz,fetot.xyz);
            if( f2<f2conv) break;
            if( f2>f2max ) fetot*=sqrt(f2max/f2);
            
            vpp    *= cdamp; 
            //vpp    += vec3(fetot.xy*dt, 0.0);
            vpp    += fetot.xyz*dt;
            pp     += vpp*dt;
        }
    }
    
    //fe     = sampleFE ( pp );
    color = vec4( vec3( (fe.z+0.1)*2.0 ), 1.0 );
    //color = vec4( (pp-pp0).zzz*100.0, 1.0 );
    //color = vec4( (pp-pp0)*10.0, 1.0 );
    //color = vec4( (pp+5.0)*0.1, 1.0 );
}`;



//==============================================================
//==============================================================


const Obj1 = {
    verts : [
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
    ],
    UVs : [
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ],
    inds :  [
        0,  1,  2,      0,  2,  3,    // front
      ],
};


var gl            = null;
var shaderProgram = null;
var programInfo   = null;


var needRefresh = true;
var obj1        = null;
//var texture1  = null;
var projectionMatrix = mat4.create();
var modelViewMatrix  = mat4.create(); mat4.translate  ( modelViewMatrix,  modelViewMatrix, [ 0.0, 0.0, -4.0] );

//var atoms     = null;

var alabels = null;
var xyzqs   = null;
var res     = null;

var atomTypes = null;
var tx_xyzq   = null;
var tx_cLJ    = null;

main();

// ========= Functions

function buildShader(mods){
    let fsSource_ = fsSource;
    for (let key in mods) {
        if ( mods.hasOwnProperty(key) ) {
            fsSource_ = fsSource_.replace( "MOD_"+key, mods[key] );
        }
    }

    //console.log( "fsSource: ", fsSource_ );

    shaderProgram = initShaderProgram(gl, vsSource, fsSource_ );
    programInfo = {
        program: shaderProgram,
        attribLocations: {
            vert: gl.getAttribLocation(shaderProgram,   'aVertexPosition' ),
            UV  : gl.getAttribLocation(shaderProgram, 'aTextureCoord'   ),
        },
        //uniform sampler2D txAtoms;
        //uniform sampler2D txLJ;
        uniformLocations: {
            projectionMatrix : gl.getUniformLocation(shaderProgram, 'uProjectionMatrix' ),
            modelViewMatrix  : gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'  ),
            //uSampler       : gl.getUniformLocation(shaderProgram, 'uSampler'          ),
            txAtoms          : gl.getUniformLocation(shaderProgram, 'txAtoms'           ),
            txLJ             : gl.getUniformLocation(shaderProgram, 'txLJ'              ),
            //time             : gl.getUniformLocation(shaderProgram, 'time'              ),
            z0     : gl.getUniformLocation(shaderProgram, "z0"    ),
            Krad   : gl.getUniformLocation(shaderProgram, "Krad"  ),
            Klat   : gl.getUniformLocation(shaderProgram, "Klat"  ),
            Rlever : gl.getUniformLocation(shaderProgram, "Rlever"    ), 
            dp0    : gl.getUniformLocation(shaderProgram, "dp0"   ),
            dtip   : gl.getUniformLocation(shaderProgram, "dtip"  ),
            dt     : gl.getUniformLocation(shaderProgram, "dt"    ),
            cdamp  : gl.getUniformLocation(shaderProgram, "cdamp" ),
            f2max  : gl.getUniformLocation(shaderProgram, "f2max" ),
            f2conv : gl.getUniformLocation(shaderProgram, "f2conv")
        },
    };
}

function parseAtomTypes( typeStr ){
    let lines = typeStr.split('\n');
    //console.log( "typeStr ", typeStr);
    //let rs = new Float32Array( rs.length );
    //let es = new Float32Array( rs.length );
    let atomTypes = {};
    //console.log("lines =",lines);
    for(let i=0; i<lines.length; i++){
        let tmp = lines[i].split(';')[0];
        //console.log("i,tmp ",i,tmp);
        //let wds = tmp.split();
        //let wds = tmp.split(/\s+/); 
        //let wds = tmp.split(/\S+/g); 
        //let wds = tmp.split(/\S+/g); 
        //let wds = tmp.match(/\S+/g); // see https://blog.abelotech.com/posts/split-string-into-tokens-javascript/
        //let wds = tmp.match( /[^\s]+/g);
        let wds = tmp.match(/[^\s\t]+/g ); // see https://stackoverflow.com/questions/8441915/tokenizing-strings-using-regular-expression-in-javascript
        if( wds != null ){
            //console.log("i,tmp,wds ",i,tmp,wds);
            if(wds.length==3){
                let r = parseFloat(wds[1]);
                let e = parseFloat(wds[2]);
                atomTypes[wds[0]] = [r,e];
            }
        }
    }
    //console.log("atomTypes =",atomTypes);
    return atomTypes;
}

function parseAtoms( atomStr, atomTypes ){
    let lines = atomStr.split('\n');
    let labels = [];
    let xyzqs  = [];
    let res    = [];
    //console.log("lines =",lines);
    for(let i=0; i<lines.length; i++){
        let tmp = lines[i].split(';')[0];
        //console.log("i,tmp ",i,tmp);
        let wds = tmp.match(/[^\s\t]+/g ); // see https://stackoverflow.com/questions/8441915/tokenizing-strings-using-regular-expression-in-javascript
        if( wds != null ){
            //console.log("i,tmp,wds ",i,tmp,wds);
            let label = wds[0];
            labels.push(label);
            if(wds.length>4){
                let x = parseFloat(wds[1]);
                let y = parseFloat(wds[2]);
                let z = parseFloat(wds[3]);
                let q = parseFloat(wds[4]);
                xyzqs.push([ x,y,z,q ]);
                let r,e;
                if(wds.length>5){ r=parseFloat(wds[5]); }else{ r=atomTypes[label][0]; };
                if(wds.length>6){ e=parseFloat(wds[6]); }else{ e=atomTypes[label][1]; };
                res.push([r,e]);
                //console.log( i, wds.length, label,x,y,z,q,r,e );
            }
        }
    }
    return [ labels, xyzqs, res];
}

function updateAllParams(doc){
    atomTypes             = parseAtomTypes( document.getElementById("txtAtomTypes"        ).value );
    [alabels, xyzqs, res] = parseAtoms    ( document.getElementById('txtAtoms' ).value, atomTypes );
    let c612s  = getBuff_cLJ( res, 1.6612, 0.009106  );
    let natoms =  xyzqs.length;
    let xyzqs_ = new Float32Array( xyzqs.flat() );
    tx_xyzq    = texture1DFromFloat32Array_RGBA32F( gl, xyzqs_,  natoms );
    //console.log( "xyzqs_ ", xyzqs_ );
    tx_cLJ     = texture1DFromFloat32Array_RG32F  ( gl, c612s, natoms );

    //buildShader(mods);
    //console.log( c612s );
}

function updateScene(doc){
    console.log( "updateScene", doc );
    updateAllParams(doc);
    needRefresh = true;
}

function getInputs( prefix, inp_names ){
    let inps = {};
    for(let i=0; i<inp_names.length; i++){
        let name = inp_names[i];
        inps[name] = parseFloat( document.getElementById( prefix + name ).value );
        //console.log(name, inps[name] );
    };
    return inps;
}

function updateFloatUniforms( locs, names, vals ){
    for(let i=0; i<names.length; i++){ let name=names[i]; gl.uniform1f( locs[name], vals[name] ); };
}


function updateUniforms(){

    let inp_names = [ "z0", "Krad","Klat","Rlever","dz","dt","cdamp","fconv","fmax" ];
    let inps = getInputs( "inp_", inp_names );

    inps.Klat *= -1.0;
    inps.Krad *= -1.0;
    inps["f2conv"] = inps.fconv*inps.fconv;
    inps["f2max" ] = inps.fmax *inps.fmax;   console.log( "inps.f2max", inps.f2max );
    inps.z0 += inps.Rlever;
    console.log(inps);
    //console.log("inp_z", inps.z0    );

    console.log( "locs = programInfo.uniformLocations" );
    let locs = programInfo.uniformLocations;

    updateFloatUniforms( locs, [ "z0", "Krad","Klat","Rlever","dt","cdamp","f2conv","f2max" ], inps );
    gl.uniform3fv (locs.dp0,   [0.0,0.0,-inps.Rlever ] );
    gl.uniform3fv (locs.dtip,  [0.0,0.0,-inps.dz     ] );
    //gl.uniform3fv (locs.dtip,  [0.0,0.0,-0.1     ] );

}

function getBuff_cLJ( res, r0, e0 ){
   let cLJs = new Float32Array( res.length*2 );
   for(let i=0; i<res.length; i++ ){
        let ii = i*2;
        let e  = Math.sqrt(res[i][1]*e0); 
        let r6 = res[i][0]+r0; r6 = r6*r6*r6; r6*=r6;
        cLJs[ii  ] = -2.0*e * r6;
        cLJs[ii+1] =      e * r6*r6;
   }
   return cLJs;
}

// ========== main

function main() {

    const canvas = document.querySelector('#glcanvas');
    gl     = canvas.getContext('webgl2');
    if (!gl) { alert('Unable to initialize WebGL. Your browser or machine may not support it.'); return; }
    //gl.getExtension('OES_texture_float_linear');

    updateAllParams();
    buildShader( {"natoms": alabels.length } );

    obj1     = new GLObject( gl ); obj1.fromVertNormUVind( Obj1.verts, null, Obj1.UVs, Obj1.inds );

    var then = 0;

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        then = now;
        if(needRefresh){
            drawScene(gl, programInfo);
            needRefresh = false;
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

};


function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

// Draw the scene.
function drawScene(gl, programInfo) {

    console.log("drawScene");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(programInfo.program);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    mat4.perspective( projectionMatrix, 45.0*Math.PI/180.0, aspect, 0.1, 100.0  );
    //mat4.rotate(modelViewMatrix, modelViewMatrix,  cubeRotation,     [0, 0, 1]);
    //mat4.rotate(modelViewMatrix, modelViewMatrix,  cubeRotation*0.7, [0, 1, 0]);

    gl.activeTexture(gl.TEXTURE0);   gl.bindTexture(gl.TEXTURE_2D, tx_xyzq );
    gl.activeTexture(gl.TEXTURE1);   gl.bindTexture(gl.TEXTURE_2D, tx_cLJ  );

    //console.log( " txAtoms: ",programInfo.uniformLocations.txAtoms , "txLJ: ",programInfo.uniformLocations.txLJ );
    gl.uniform1i( programInfo.uniformLocations.txAtoms, 0);
    gl.uniform1i( programInfo.uniformLocations.txLJ,    1);
    //gl.uniform1i( programInfo.uniformLocations.uSampler, 0);

    gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix );
    gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix  );
    //gl.uniform1f( programInfo.uniformLocations.time, time );   time+=0.1;
    
    updateUniforms();

    obj1.bind( programInfo.attribLocations );
    obj1.draw( );
}



