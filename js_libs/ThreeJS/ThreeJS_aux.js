"use strict";

THREE.Screen = function ( container ) {
    var _this = this;
    //var container, renderer, camera, controls, scene;
    this.renderer  = initRendered(container);
    this.camera    = new THREE.PerspectiveCamera( 60, _this.aspectRatio, 1, 10000 );  _this.camera.position.z = 500;
    this.controls  = initControls(_this.camera);
    this.materials = initMaterials();
    this.scene     = initScene();

    function initRendered(container){
        // renderer
        let renderer = new THREE.WebGLRenderer( { antialias: false } );
        //renderer.setClearColor( scene.fog.color );
        renderer.setPixelRatio( window.devicePixelRatio );
        
        _this.aspectRatio = container.clientWidth/ container.clientHeight;
        //renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setSize( container.clientWidth, container.clientHeight );

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
    
    function initMaterials(){
        return {
            wire    : new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } ),
            lambert : new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } ),
            phong   : new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } ),
        }
    };

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

// from here: https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag

THREE.disposeMaterial = function(mat){
    if (mat instanceof THREE.MeshFaceMaterial){
        $.each (mat.materials, function (idx, mtrl){
            if (mtrl.map)           mtrl.map.dispose ();
            if (mtrl.lightMap)      mtrl.lightMap.dispose ();
            if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
            if (mtrl.normalMap)     mtrl.normalMap.dispose ();
            if (mtrl.specularMap)   mtrl.specularMap.dispose ();
            if (mtrl.envMap)        mtrl.envMap.dispose ();
            mtrl.dispose ();    // disposes any programs associated with the material
        });
    }else{
        if (mat.map)          mat.map.dispose ();
        if (mat.lightMap)     mat.lightMap.dispose ();
        if (mat.bumpMap)      mat.bumpMap.dispose ();
        if (mat.normalMap)    mat.normalMap.dispose ();
        if (mat.specularMap)  mat.specularMap.dispose ();
        if (mat.envMap)       mat.envMap.dispose ();
        mat.dispose ();   // disposes any programs associated with the material
    }
}

THREE.disposeNode = function(node, bMaterial=false ){
    //console.log(node);
    if (node instanceof THREE.Mesh){
        if (node.geometry){ node.geometry.dispose(); }
        if ( (node.material) &&  bMaterial ){ THREE.disposeMaterial(node.material); }
    }
}   // disposeNode

//THREE.disposeHierarchy = function(node, callback, bMaterial=false ){
THREE.disposeHierarchy = function(node, bMaterial=false ){
    for (var i = node.children.length - 1; i >= 0; i--){
        var child = node.children[i];
        //THREE.disposeHierarchy (child, callback, bMaterial );
        //callback (child, bMaterial);
        THREE.disposeHierarchy (child, bMaterial );
        THREE.disposeNode      (child, bMaterial);
        node.remove(child);
    }
}