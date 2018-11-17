var time = 0.0;

// noise generation:   http://paulbourke.net/fractals/noise/

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

const fsSource = `#version 300 es
precision mediump float;
precision mediump sampler2D;
uniform sampler2D txAtoms;
uniform sampler2D txLJ;
in  vec3 vTextureCoord;
out vec4 color;

vec4 FE_LJ( vec3 dp, vec2 cLJ ){
    float ir2 = 1.0/dot(dp,dp);
    float ir6 = ir2*ir2*ir2;
    float e = (      cLJ.x +       cLJ.y*ir6 )*ir6;
    float f = ( -6.0*cLJ.x + -12.0*cLJ.y*ir6 )*ir6;
    return vec4( dp*( f*ir2 ), e );
}

void main(){

/*
   //vec4 value = texture(textureData, vTextureCoord     );
   vec4 value = texture(textureData, vTextureCoord.xy );
   color = vec4( value.rg, 1.0, 1.0 );
*/

    float z0  = 2.0;
    vec3 pvox = vec3( (vTextureCoord.xy*2.0-1.0) *10.0 , z0);

    float f   = 0.0;
    float w   = 0.1;
    float iw2 = 1.0/(w*w);
    
    vec4 fe = vec4(0.0);
    
    for( int i=0; i<11; i++ ){
        vec4 atom = texelFetch( txAtoms, ivec2(i,0), 0 );
        vec2 c612 = texelFetch( txLJ,    ivec2(i,0), 0 ).rg;
        vec3 dp   =  atom.xyz -  pvox;
        //f += 1.0/( 1.0 + dot(dp,dp)*iw2 );
        //f = cos(pvox.x*6.28) + cos(pvox.y*6.28);
        //vec3 pw = sin( pvox * atom.xyz );
        //f += dot(pw,pw);
        fe += FE_LJ( dp, c612 );
        //fe += FE_LJ( dp, vec2(1.0,1.0) );
    }
    
    //color = vec4( vec3(f), 1.0 );
    //color = vec4( fe.xyz * 1000.0, 1.0 );    
    //color = vec4( vec3( (fe.w+0.01)*100.0 ), 1.0 );
    color = vec4( vec3( (fe.z+0.01)*100.0 ), 1.0 );
    
    /*
    vec4 value; 
    if( vTextureCoord.y>0.5 ){ value = texture( txAtoms, vTextureCoord.xy ); }else{ value = texture( txLJ, vTextureCoord.xy ); };
    color = vec4( value.rgb, 1.0 );
    */

}`;

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

var obj1     = null;
//var texture1 = null;

var tx_xyzq = null;
var tx_cLJ  = null;

var projectionMatrix = mat4.create();
var modelViewMatrix  = mat4.create(); mat4.translate  ( modelViewMatrix,  modelViewMatrix, [ 0.0, 0.0, -4.0] );

main();

// ========= Functions

/*
function getBuff_xyzq( rs, es, qs ){
   let cLJs = Float32Array( rs.length*4 );
   for(let i=0; i<rs.length; i++ ){
        let ii = i*4;
        let r6 = rs[i]; r6 = r6*r6*r6; r6*=r6;
        cLJs[ii  ] = -2*es[i] * r6
        cLJs[ii+1] =  - es[i] * r6**r6;
   }
}
*/

/*
function getBuff_cLJ( rs, es ){
   let cLJs = new Float32Array( rs.length*2 );
   //let cLJs = new Float32Array( rs.length*4 );
   for(let i=0; i<rs.length; i++ ){
        let ii = i*2;
        let r6 = rs[i]; r6 = r6*r6*r6; r6*=r6;
        cLJs[ii  ] = -2.0*es[i] * r6;
        cLJs[ii+1] =      es[i] * r6*r6;
   }
   return cLJs;
}
*/

function getBuff_cLJ( rs, es, r0, e0 ){
   let cLJs = new Float32Array( rs.length*2 );
   //let cLJs = new Float32Array( rs.length*4 );
   for(let i=0; i<rs.length; i++ ){
        let ii = i*2;
        let e  = Math.sqrt(es[i]*e0); 
        let r6 = rs[i]+r0; r6 = r6*r6*r6; r6*=r6;
        cLJs[ii  ] = -2.0*e * r6;
        cLJs[ii+1] =      e * r6*r6;
   }
   return cLJs;
}


// ========== main

function main() {

    const canvas = document.querySelector('#glcanvas');
    const gl     = canvas.getContext('webgl2');
    if (!gl) { alert('Unable to initialize WebGL. Your browser or machine may not support it.'); return; }
    //gl.getExtension('OES_texture_float_linear');

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vert: gl.getAttribLocation(shaderProgram,   'aVertexPosition' ),
            UV  :   gl.getAttribLocation(shaderProgram, 'aTextureCoord'   ),
        },
        
        //uniform sampler2D txAtoms;
        //uniform sampler2D txLJ;
        uniformLocations: {
            projectionMatrix : gl.getUniformLocation(shaderProgram, 'uProjectionMatrix' ),
            modelViewMatrix  : gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'  ),
            //uSampler         : gl.getUniformLocation(shaderProgram, 'uSampler'          ),
            txAtoms          : gl.getUniformLocation(shaderProgram, 'txAtoms'           ),
            txLJ             : gl.getUniformLocation(shaderProgram, 'txLJ'              ),
            time             : gl.getUniformLocation(shaderProgram, 'time'              ),
        },
    };

    //const buffers = initGLObj_indTex(gl, positions, textureCoordinates, indices );   console.log( "Here !!!!! " );

    obj1     = new GLObject( gl ); obj1.fromVertNormUVind( Obj1.verts, null, Obj1.UVs, Obj1.inds );

    /*
    let na = 11;
    let apos = new  Float32Array(na*4);
    for(let ia=0; ia<na; ia++){
        let ii = ia*4;
        apos[ii  ]  = ( Math.random()-0.5 )*10.0;
        apos[ii+1]  = ( Math.random()-0.5 )*10.0;
        //apos[ii+2]  = ( Math.random()-0.5 )*10.0;
        //apos[ii+3]  = ( Math.random()-0.5 )*10.0;
        apos[ii+2]  = 0;
        apos[ii+3]  = 0;
    }
    //texture1 = texture1DFromFloat32Array( gl, apos, na );
    */

    let xyzq = new  Float32Array(  [
            1.3603,      0.0256,      0.0000, 0.0000, // C
            0.6971,     -1.2020,      0.0000, 0.0000, // C
           -0.6944,     -1.2184,      0.0000, 0.0000, // C
           -1.3895,     -0.0129,      0.0000, 0.0000, // C
           -0.6712,      1.1834,      0.0000, 0.0000, // C
            0.6816,      1.1960,      0.0000, 0.0000, // N
            2.4530,      0.1083,      0.0000, 0.0000, // H
            1.2665,     -2.1365,      0.0000, 0.0000, // H
           -1.2365,     -2.1696,      0.0000, 0.0000, // H
           -2.4837,      0.0011,      0.0000, 0.0000, // H
           -1.1569,      2.1657,      0.0000, 0.0000  // H
    ] );
    
    let na = xyzq.length/4;
    console.log("na  :", na);
    
    let rs = [  1.9080,  1.9080,  1.9080,  1.9080,  1.9080,   1.7800,   1.4870,  1.4870,  1.4870,  1.4870,  1.4870   ];
    let es = [  0.003729,0.003729,0.003729,0.003729,0.003729, 0.007372, 0.000681,0.000681,0.000681,0.000681,0.000681 ];
    let c612s  = getBuff_cLJ( rs, es, 1.6612, 0.009106  );
    
    //gl.activeTexture(gl.TEXTURE0); tx_xyzq  = texture1DFromFloat32Array_RGBA32F( gl, xyzq,  na );
    //gl.activeTexture(gl.TEXTURE1); tx_cLJ   = texture1DFromFloat32Array_RG32F  ( gl, c612s, na );
    
    tx_xyzq  = texture1DFromFloat32Array_RGBA32F( gl, xyzq,  na );
    //tx_cLJ   = texture1DFromFloat32Array_RGBA32F( gl, xyzq,  na );
    //tx_cLJ   = texture1DFromFloat32Array_RGBA32F( gl, apos,  na );
    //tx_cLJ   = texture1DFromFloat32Array_RGBA32F  ( gl, c612s, na );
    tx_cLJ   = texture1DFromFloat32Array_RG32F  ( gl, c612s, na );
    
    console.log( c612s );

    var then = 0;

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        drawScene(gl, programInfo, deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

};

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

// Draw the scene.
function drawScene(gl, programInfo, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(programInfo.program);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    mat4.perspective( projectionMatrix, 45*Math.PI/180, aspect, 0.1, 100.0  );
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
    gl.uniform1f( programInfo.uniformLocations.time, time );   time+=0.1;
    
    obj1.bind( programInfo.attribLocations );
    obj1.draw( );
}



