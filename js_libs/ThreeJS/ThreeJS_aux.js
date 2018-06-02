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

    this.initShaderScreen = function( src_vert, src_frag ) {

        //basicShader = THREE.ShaderLib['normal'];
        let uniforms = {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2() },
            camMat: { value: new THREE.Matrix3() }
        };
        uniforms.resolution.value.x = _this.renderer.domElement.width;
        uniforms.resolution.value.y = _this.renderer.domElement.height;

        let matGLSL = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            vertexShader:   src_vert,
            fragmentShader: src_frag,
        });

        try {
            var mesh = _this.scene.getObjectByName("glslScreen");
            _this.scene.remove(mesh);
        } catch (err) {
            console.log(" updateShader cannot remove Mesh1");
        };
    
        //mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(100, 100), matGLSL );
        mesh = new THREE.Mesh( new THREE.PlaneGeometry(10000, 10000), matGLSL );
        mesh.name = "glslScreen";
        _this.scene.add(mesh);
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
    
    this.animate = ( function () {
        return function animate(){
            requestAnimationFrame( _this.animate );
            _this.controls.update();
        }
    }() );

    this.userUpdate = function(self){};

    this.render = ( function() {
        return function render(){ 
                _this.userUpdate(_this); 
                _this.renderer.render( _this.scene, _this.camera );
            };
    }() );

}

// NOTE : we can implement new functionality to any existing class this way

function IMPLEMENT_Vector3_FUNCS () {

    THREE.Vector3.prototype.prokop_op = function (){
        this.x = 3.14159265359;
        this.y = 2.71828182846;
        this.z = 1.61803398874;
    }

    THREE.Matrix4.prototype.swap = function(i,j){
        let i3 = i*4;
        let j3 = j*4;
        let t;
        let te = this.elements;
        t=te[i3  ];  te[i3  ]=te[j3  ];  te[j3  ]=t;
        t=te[i3+1];  te[i3+1]=te[j3+1];  te[j3+1]=t;
        t=te[i3+2];  te[i3+2]=te[j3+2];  te[j3+2]=t;
    }


    THREE.Matrix4.prototype.toString= function(){
        let te = this.elements;
        return  "[["+te[0]+","+te[1]+","+te[2]+","+te[3]+"]\n"
               +" ["+te[4]+","+te[5]+","+te[6]+","+te[7]+"]\n"
               +" ["+te[8]+","+te[9]+","+te[10]+","+te[11]+"]\n"
               +" ["+te[12]+","+te[13]+","+te[14]+","+te[15]+"]]\n";
    }

    THREE.Matrix4.prototype.setDirUp = ( function(){ 
        var dir_ = new THREE.Vector3();
        var up_  = new THREE.Vector3();
        var side = new THREE.Vector3();
        return function setDirUp(dir,up){
            /*
            // make orthonormal rotation matrix c=dir; b=(up-<b|c>c)/|b|; a=(c x b)/|a|;
            c.set(dir);
            //c.normalize(); // we assume dir is already normalized
            b.set(up);
            b.add_mul( c, -b.dot(c) );   //
            b.normalize();
            a.set_cross(b,c);
            */
            dir_.copy(dir);
            dir_.normalize();
            if(up){ up_.copy(up); } else { up_.set(0.0,1.0,0.0); }
            let cdir = dir_.dot(up_);
            up_.addScaledVector ( dir_, -cdir );
            up_.normalize();
            side.crossVectors   ( up_, dir_ );

            console.log( "dir_", dir_ );
            console.log( "up_ ", up_ );
            console.log( "side", side );
            
            let te = this.elements;
            te[ 0 ] = side.x;  te[ 4 ] = up_.x;  te[ 8 ] = dir_.x;
            te[ 1 ] = side.y;  te[ 5 ] = up_.y;  te[ 9 ] = dir_.y;
            te[ 2 ] = side.z;  te[ 6 ] = up_.z;  te[10 ] = dir_.z;
        }
    }() );

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