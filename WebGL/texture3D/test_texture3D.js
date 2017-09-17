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
in  vec3 vTextureCoord;
out vec4 color;
void main(){
   vec4 value = texture(textureData, vTextureCoord );
   color = vec4( value.rg, 1.0, 1.0 );
}`;

/*
const fsSource = `#version 300 es
precision lowp float;
precision lowp sampler2D;
uniform sampler2D textureData;
//varying highp vec2 vTextureCoord;
in  vec3 vTextureCoord;
out vec4 color;
void main(){
   vec4 value = texture(textureData, vTextureCoord.xy );
   color = vec4( value.rg, 1.0, 1.0 );
}`;
*/

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

main();

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
    uniformLocations: {
      projectionMatrix : gl.getUniformLocation(shaderProgram, 'uProjectionMatrix' ),
      modelViewMatrix  : gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'  ),
      uSampler         : gl.getUniformLocation(shaderProgram, 'uSampler'          ),
      time             : gl.getUniformLocation(shaderProgram, 'time'              ),
    },
  };

  //const buffers = initGLObj_indTex(gl, positions, textureCoordinates, indices );   console.log( "Here !!!!! " );
  
  obj1     = new GLObject( gl ); obj1.fromVertNormUVind( Obj1.verts, null, Obj1.UVs, Obj1.inds );
  
    //let nx=256,ny=256;
    let nx=16,ny=16,nz=16;
    //let pixels  = new  Uint8Array(nx*ny*nz);
    let heights = new  Float32Array(nx*ny*nz);
    let ii = 0;
    for(let ix=0; ix<nx; ix++){
        for(let iy=0; iy<ny; iy++){
            for(let iz=0; iz<nz; iz++){
               //pixels[ix+iy*nx]  = Math.random()*255;
               //pixels[ix+iy*nx] = ix^iy;
               heights[ii]  = Math.random();
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

    gl.activeTexture(gl.TEXTURE0);     // Tell WebGL we want to affect texture unit 0
    //gl.bindTexture  (gl.TEXTURE_2D, texture1 );
    gl.bindTexture  (gl.TEXTURE_3D, texture1 );
    gl.uniform1i( programInfo.uniformLocations.uSampler, 0);

    gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix );
    gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix  );
    gl.uniform1f( programInfo.uniformLocations.time, time );   time+=0.1;
    
    obj1.bind( programInfo.attribLocations );
    obj1.draw( );
}



