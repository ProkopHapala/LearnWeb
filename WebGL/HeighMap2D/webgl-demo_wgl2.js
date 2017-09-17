var cubeRotation = 0.0;

// noise generation:   http://paulbourke.net/fractals/noise/



// ==== Vertex shader program
const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying highp vec2 vTextureCoord;
void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`;

/*
// ==== Fragment shader program
const fsSource = `
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;
*/

/*
// ==== Fragment shader program
const fsSource = `
precision lowp float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void) {
    float h = texture2D(uSampler, vTextureCoord).r;
    h = floor( h*10.0 )*0.1;
    gl_FragColor = vec4( h, h, h, 1.0 );
}
`;
*/

// https://stackoverflow.com/questions/20052381/glsl-performance-function-return-value-type/21357620#21357620

const fsSource = `
precision lowp float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

vec4 textureBicubic(sampler2D sampler, vec2 texCoords, vec2 d  ){
    vec4 p0 = texture2D(sampler, texCoords).rgba;
    vec4 p1 = texture2D(sampler, texCoords+vec2( d.x, d.y));
    vec4 p2 = texture2D(sampler, texCoords+vec2(-d.x, d.y));
    vec4 p3 = texture2D(sampler, texCoords+vec2( d.x,-d.y));
    vec4 p4 = texture2D(sampler, texCoords+vec2(-d.x,-d.y));
    return (2.0*p0 + p1 + p2 + p3 + p4)/6.0;
}

void main(void) {
    float d = 1.0/(8.0*16.0);
    float h = textureBicubic(uSampler, vTextureCoord,  vec2( d, d ) ).r;
    h = floor( h*16.0 )/16.0;
    gl_FragColor = vec4( h, h, h, 1.0 );
}
`;


// ==== Fragment shader program

/*
const fsSource = `
// from here https://stackoverflow.com/questions/13501081/efficient-bicubic-filtering-code-in-glsl
// from http://www.java-gaming.org/index.php?topic=35123.0

precision lowp float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

vec4 cubic(float v){
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;
    return vec4(x, y, z, w) * (1.0/6.0);
}

vec4 textureBicubic(sampler2D sampler, vec2 texCoords){
    //ivec2 texSize = textureSize(sampler, 0); // this does not work in WebGL1 // https://webgl2fundamentals.org/webgl/lessons/webgl2-whats-new.html
    //
    
    vec2 texSize = vec2( 16, 16 );
    vec2 invTexSize = 1.0 / texSize;

    texCoords = texCoords * texSize - 0.5;

    vec2 fxy = fract(texCoords);
    texCoords -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = texCoords.xxyy + vec2 (-0.5, +1.5).xyxy;

    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4 (xcubic.yw, ycubic.yw) / s;

    offset *= invTexSize.xxyy;

    vec4 sample0 = texture2D(sampler, offset.xz);
    vec4 sample1 = texture2D(sampler, offset.yz);
    vec4 sample2 = texture2D(sampler, offset.xw);
    vec4 sample3 = texture2D(sampler, offset.yw);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix(
       mix(sample3, sample2, sx), mix(sample1, sample0, sx)
    , sy);
}

void main(void) {
    //float h = texture2D(uSampler, vTextureCoord).r;
    
    float h = textureBicubic( uSampler, vTextureCoord );
    h = floor( h*10.0 )*0.1;
    gl_FragColor = vec4( h, h, h, 1.0 );
}
`;
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
    },
  };

  //const buffers = initGLObj_indTex(gl, positions, textureCoordinates, indices );   console.log( "Here !!!!! " );
  
  obj1     = new GLObject( gl ); obj1.fromVertNormUVind( Obj1.verts, null, Obj1.UVs, Obj1.inds );
  
    //let nx=256,ny=256;
    let nx=16,ny=16;
    let pixels  = new  Uint8Array(nx*ny);
    let heights = new  Float32Array(nx*ny);
    for(let ix=0; ix<nx; ix++){
        for(let iy=0; iy<ny; iy++){
           //pixels[ix+iy*nx]  = Math.random()*255;
           //pixels[ix+iy*nx] = ix^iy;
           heights[ix+iy*nx]  = Math.random();
        }
    }
  //texture1 = textureFromUint8Array( gl, pixels, nx, ny );
  texture1 = textureFromFloat32Array( gl, heights, nx, ny );
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
    gl.bindTexture  (gl.TEXTURE_2D, texture1 );
    gl.uniform1i( programInfo.uniformLocations.uSampler, 0);

    gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix );
    gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix  );
    
    obj1.bind( programInfo.attribLocations );
    obj1.draw( );

    // Update the rotation for the next draw
    cubeRotation += deltaTime;
}



