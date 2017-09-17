var time = 0.0;

// noise generation:   http://paulbourke.net/fractals/noise/

// ==== Vertex shader program

const vsSource = `#version 300 es
precision lowp float;
//attribute vec4 aVertexPosition;
//attribute vec2 aTextureCoord;
layout(location = 0) in vec4 aVertexPosition;
layout(location = 1) in vec2 aTextureCoord;
out vec3 vTextureCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;
void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = vec3( aTextureCoord, sin(time)*0.5+0.5 );
  //vTextureCoord = vec3( aTextureCoord, 0.5 );
}`;

const fsSource = `#version 300 es
precision lowp float;
precision lowp sampler3D;
uniform sampler3D textureData;
uniform mat3 texRot;
in  vec3 vTextureCoord;
out vec4 color;

float map( vec3 pos ){
    pos = texRot * pos;
    return texture(textureData, pos+vec3(0.5,0.5,0.0) ).r;
}

vec3 gradient( vec3 pos ){
    float d = 0.01;
    float val0 = map( pos );
    return vec3( 
        map( pos+vec3(d,0.0,0.0) ) - val0,
        map( pos+vec3(0.0,d,0.0) ) - val0,
        map( pos+vec3(0.0,0.0,d) ) - val0
    ) /d;
}

void main(){

    vec3 rp = vec3( 0.0, 0.0, -1.0 );
    vec3 rd = vec3( vTextureCoord.xy*2.0-1.0, 0.0 ) - rp;
    rd = normalize( rd );

    float iso = 0.5;

    float t = 0.0;
    float dt = 0.1;
    for( int i=0; i<64; i++ ){
        float val = map( rp+t*rd ) - iso;
        if( val > 0.0 ) break;
        if( t>1.0     ){ discard; break; }
        //t += 1.0/( 5.0/(val*val) + (1.0/dt) );
        t += min( dt, 0.1*abs(val) );
    }
    
    color = vec4( normalize( gradient( rp+t*rd ) )*0.5 + 0.5, 1.0 );
    //color = vec4( t,t,t, 1.0 );
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
var texture1 = null;
var projectionMatrix = mat4.create();
var modelViewMatrix  = mat4.create(); mat4.translate  ( modelViewMatrix,  modelViewMatrix, [ 0.0, 0.0, -4.0] );
var texRot           = mat3.create();

window.onload = function() {
    main();
};

// ========== main

function main() {

  const canvas = document.querySelector('#glcanvas');
  const gl     = canvas.getContext('webgl2');
  if (!gl) { alert('Unable to initialize WebGL. Your browser or machine may not support it.'); return; }
  //gl.getExtension('OES_texture_float_linear');
  //let fsSource = document.getElementsByTagName("src_raymarchTex3D_glslf")[0].innerHTML;
  //let fsSource =  document.getElementById("src_raymarchTex3D_glslf").innerHTML;
  //let myFrame = document.getElementById("src_raymarchTex3D_glslf");     console.log("myFrame:  ", myFrame);
  //let fsSource = myFrame.contentWindow.document.body.innerHTML;        
  //let fsSource = myFrame.contentDocument.body.innerHTML;         
  //let fsSource = document.getElementById("src_raymarchTex3D_glslf").contentDocument.body.childNodes[0].textContent; // does not work in Chrome !!!! :-(
  //console.log("fsSource: ", fsSource);
  
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vert: gl.getAttribLocation(shaderProgram,   'aVertexPosition' ),
      UV  :   gl.getAttribLocation(shaderProgram, 'aTextureCoord'   ),
    },
    uniformLocations: {
      projectionMatrix : gl.getUniformLocation(shaderProgram, 'uProjectionMatrix' ),
      modelViewMatrix  : gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'  ),
      uSampler         : gl.getUniformLocation(shaderProgram, 'uSampler'          ),
      time             : gl.getUniformLocation(shaderProgram, 'time'              ),
      texRot           : gl.getUniformLocation(shaderProgram, 'texRot'            ),
    },
  };

  //const buffers = initGLObj_indTex(gl, positions, textureCoordinates, indices );   console.log( "Here !!!!! " );
  
  obj1     = new GLObject( gl ); obj1.fromVertNormUVind( Obj1.verts, null, Obj1.UVs, Obj1.inds );
  
  
    function gauss(x,y,z){ return Math.exp( -(x*x+y*y+z*z) ); }
    
    //let nx=256,ny=256;
    //let nx=16,ny=16,nz=16;
    let nx=64,ny=64,nz=64;
    let sigma = 3.0/nx;
    //let pixels  = new  Uint8Array(nx*ny*nz);
    let heights = new  Float32Array(nx*ny*nz);
    let ii = 0;
    for(let ix=0; ix<nx; ix++){
        for(let iy=0; iy<ny; iy++){
            for(let iz=0; iz<nz; iz++){
               //pixels[ix+iy*nx]  = Math.random()*255;
               //pixels[ix+iy*nx] = ix^iy;
               //heights[ii]  = gauss((ix-nx*0.5)*0.1,(iy-ny*0.5)*0.1,(iz-nz*0.5)*0.1);
               
               let x = (ix-nx*0.5)*sigma;
               let y = (iy-ny*0.5)*sigma;
               let z = (iz-nz*0.5)*sigma;
               //heights[ii]  = Math.random() * gauss(x,y,z);
               let f = Math.cos(x*5.0)*Math.cos(y*5.0)*Math.cos(z*5.0)+0.5;
               heights[ii]  =  f*f* gauss(x,y,z);
               
               ii++;
            }
        }
    }
  //texture1 = textureFromUint8Array( gl, pixels, nx, ny );
  //texture1 = textureFromFloat32Array( gl, heights, nx, ny );
  texture1 = texture3DFromFloat32Array( gl, heights, nx, ny, nz );
  //texture1 = loadTexture(  gl, 'cubetexture.png');

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
    
    mat3.rotateAxisAngle( texRot, texRot, [0, 1, 0], 0.01 );
    
    //mat3.rotate(texRot, texRot,  0.01 );

    gl.activeTexture(gl.TEXTURE0);     // Tell WebGL we want to affect texture unit 0
    //gl.bindTexture  (gl.TEXTURE_2D, texture1 );
    gl.bindTexture  (gl.TEXTURE_3D, texture1 );
    gl.uniform1i( programInfo.uniformLocations.uSampler, 0);

    gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix );
    gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix  );
    gl.uniformMatrix3fv( programInfo.uniformLocations.texRot,  false, texRot  );
    gl.uniform1f( programInfo.uniformLocations.time, time );   time+=0.1;
    
    obj1.bind( programInfo.attribLocations );
    obj1.draw( );
}



