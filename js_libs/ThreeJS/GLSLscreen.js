// ===================== 
//   THREE JS MAIN
// =====================

// import in browser
// https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file

// ----  Globals

"use strict";

var bAnimate = true;

var renderer;
var scene;
var camera;

var uniforms = {};
var control;
var mousePosOld;

var basicShader;
var mesh;

var fragCodeParts = {};

//var genFragCodeFunc = null;

var str_default_PixelMap = "vec4( (c_diffuse + c_specular*mat.gloss)*mat.color + vec3(0.1,0.1,0.2)*mat.color, 1.0 );";

// ---- Functions

var camQuat = new THREE.Quaternion();
function handleMouseMove(event) {
    let dot, eventDoc, doc, body, pageX, pageY;
    if (mousePosOld) {
        let dx = (event.clientX - mousePosOld.x) * 1.0;
        let dy = (event.clientY - mousePosOld.y) * 1.0;
        let q = new THREE.Quaternion(-dy * 0.002, 0.0, dx * 0.002, 1.0);
        camQuat.multiply(q).normalize();
    } else {
        mousePosOld = new THREE.Vector3();
    }
    mousePosOld.x = event.clientX;
    mousePosOld.y = event.clientY;
}

function render() {
    let camMat4 = new THREE.Matrix4(); camMat4.compose(new THREE.Vector3(0.0, 0.0, 0.0), camQuat, new THREE.Vector3(1.0, 1.0, 1.0));
    let camMat_ = new THREE.Matrix3(); camMat_.getNormalMatrix(camMat4);
    //console.log( camMat_.elements +" "+ camQuat.x+" "+ camQuat.y+" "+ camQuat.z+" "+ camQuat.w  );
    uniforms.camMat.value = camMat_;

    renderer.render(scene, camera);
    uniforms.time.value += 0.05;
    if( bAnimate ) requestAnimationFrame(render);
}

function wrapSceneCode( inner_code ){
    return "vec4 scene( Ray ray ){\n\tvec4 hit = vec4( POSITIVE_INF, vec3(0.0) );\n\t" 
        +  inner_code 
        +  "\n\tvec2 ts1;\n\tADD( SURF1 );\n\treturn hit;\n}";
}

function joinFragCode_default(){
    let rayTracer  = fragCodeParts.rayTracer.replace("OUTPUT_PIXEL", fragCodeParts.pixelMap );
    let scene      = wrapSceneCode( fragCodeParts.scene );
    return  "// ===== primives  \n" + fragCodeParts.primitives
          + "// ===== scene     \n" + scene
          + "// ===== rayTracer \n" + rayTracer;
}

function updateShader( frag_code ) {

    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: basicShader.vertexShader,
        fragmentShader: frag_code,
    });

    try {
        var mesh = scene.getObjectByName("Mesh1");
        scene.remove(mesh);
    } catch (err) {
        console.log(" updateShader cannot remove Mesh1");
    };

    mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), material);
    mesh.name = "Mesh1";
    scene.add(mesh);
}

function init_GLSLScreen( screenBox, shader_code ) {

    //console.log( "BEGIN init_GLSLScreen " );
    
    document.onmousemove = handleMouseMove;
    
    scene    = new THREE.Scene();
    camera   = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize( screenBox.clientWidth, screenBox.clientHeight );

    // SHADER
    basicShader = THREE.ShaderLib['normal'];
    uniforms    = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
        camMat: { value: new THREE.Matrix3() }
    };
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;

    //updateShader(document.getElementById(shaderBoxId));
    updateShader( shader_code );

    camera.position.x = 0.0;
    camera.position.y = 0.0;
    camera.position.z = 100.0;
    camera.lookAt(scene.position);

    //document.body.appendChild(renderer.domElement);

    screenBox.appendChild( renderer.domElement );
    control = new function () {
        this.rotationSpeed = 0.005;
        this.scale = 1;
    };
    //addControls(control);
    // call the render function
    render();

    //console.log( "END init_GLSLScreen " );
}

//window.onload = init; // calls the init function when the window is done loading.
