"use strict";

THREE.Screen = function ( container ) {
    var _this = this;
    //var container, renderer, camera, controls, scene;
    this.renderer  = initRendered(container);
    this.camera    = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );  _this.camera.position.z = 500;
    this.controls  = initControls(_this.camera);
    this.scene     = initScene();

    function initRendered(container){
        // renderer
        let renderer = new THREE.WebGLRenderer( { antialias: false } );
        //renderer.setClearColor( scene.fog.color );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        return renderer;
    }
    
    function initControls(camera){
        let controls = new THREE.TrackballControls( camera );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 5.0;
        controls.panSpeed  = 0.8;
        controls.noZoom    = false;
        controls.noPan     = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [ 65, 83, 68 ];
        //controls.addEventListener( 'change', render );  // NOTE: this works only is global function
        controls.addEventListener( 'change', function(){_this.render(); } ); // Trick described here  https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
        return controls;
    }
    
    function initScene(){
        // world
        let scene = new THREE.Scene();
        //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        // lights
        let light;
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );
    
        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );
    
        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );
    
        return scene;
    }

    /*
    // This does not work
    function animate() {
        requestAnimationFrame( _this.animate );
        _this.controls.update();
    }

    function render() {
        _this.renderer.render( _this.scene, _this.camera );
    }
    */
    
    this.animate = ( function () {
        return function animate(){
            requestAnimationFrame( _this.animate );
            _this.controls.update();
        }
    }() );

    this.render = ( function() {
        return function render(){ _this.renderer.render( _this.scene, _this.camera ); };
    }() );

}

// NOTE : we can implement new functionality to any existing class this way

function IMPLEMENT_Vector3_FUNCS () {
    THREE.Vector3.prototype.prokop_op = function (){
        this.x = 3.14159265359;
        this.y = 2.71828182846;
        this.z = 1.61803398874;
    }
}

/*
// ================ BAD GLOBAL WAY WHICH WORKS

var container, renderer, camera, controls, scene;

function initRendered(container){
    // renderer
    let renderer = new THREE.WebGLRenderer( { antialias: false } );
    //renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    return renderer;
}

function initControls(camera){
    let controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 5.0;
    controls.panSpeed  = 0.8;
    controls.noZoom    = false;
    controls.noPan     = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );
    return controls;
}

function initScene(){
    // world
    let scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    // lights
    let light;
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    scene.add( light );

    light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );

    return scene;
}

*/