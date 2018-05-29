//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, controls;
var cross;

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.y = 400;
	
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed          = 1.0;
	controls.zoomSpeed            = 10.0;
	controls.panSpeed             = 0.8;
	controls.noZoom               = false;
	controls.noPan                = false;
	controls.staticMoving         = false;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );
	
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

	var light, object;

	scene.add( new THREE.AmbientLight( 0x404040 ) );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( -1, 1, -1 );
	scene.add( light );

	//var map = new THREE.TextureLoader().load( 'textures/UV_Grid_Sm.jpg' );
	//map.wrapS = map.wrapT = THREE.RepeatWrapping;
	//map.anisotropy = 16;

	//var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );
	matwire      = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } );
	var material = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } );


    //  barrel
    //                                                     
	//object = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5, 500, 40, 5, {openEnded: true} ), material, );
	//object = new THREE.Mesh( new THREE.CylinderGeometry( {radiusTop: 5, radiusBottom: 5, height: 500, radiusSegments: 16, heightSegments: 5, openEnded: true} ), material );
	//object = new THREE.Mesh( new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength);
	object = new THREE.Mesh( new THREE.CylinderGeometry(        5.0,          5.0, 500.0,              16,              1,      true ),  material );
	//object = new THREE.Mesh( new THREE.CylinderGeometry(      5.0,          5.0, 500.0,              16,              1,      false ),  material );
	object.position.set( 0, 0, 0 );
	scene.add( object );
	
	// reactor
	//object = new THREE.Mesh( new THREE.CylinderGeometry( 25, 75, 100, 40, 5 ), material );
	//object.position.set( 400, 0, 0 );
	//scene.add( object );
	
	// Truss
	object = new THREE.Mesh( new THREE.OctahedronGeometry( 75.0, 0 ), matwire );
	object.position.set( 0, 0, 0);
	scene.add( object );

    // radiator
	object = new THREE.Mesh( new THREE.RingGeometry( 10.0, 200.0, 64, 1, 100.0, Math.PI * 2 ), material );
	object.position.set( 0, -100, 0 );
	object.rotation.x = 3.14159265359/2;
	scene.add( object );
	
	object = new THREE.Mesh( new THREE.TorusGeometry( 80.0, 10.0, 16, 64 ), material );
	object.position.set( 0, 0, 0 );
	object.rotation.x = 3.14159265359/2;
	scene.add( object );


	//object = new THREE.Mesh( new THREE.SphereGeometry( 75, 20, 10 ), material );
	//object.position.set( -400, 0, 200 );
	//scene.add( object );

	//object = new THREE.Mesh( new THREE.IcosahedronGeometry( 75, 1 ), matwire );
	//object.position.set( -200, 0, 200 );
	//scene.add( object );

	//object = new THREE.Mesh( new THREE.CircleGeometry( 50, 20, 0, Math.PI * 2 ), material );
	//object.position.set( 0, 0, 0 );
	//scene.add( object );

	object = new THREE.AxisHelper( 50 );
	object.position.set( 200, 0, -200 );
	
	scene.add( object );

	//object = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50 );
	//object.position.set( 400, 0, -200 );
	//scene.add( object );

	//renderer = new THREE.WebGLRenderer( { antialias: true } );
	//renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setSize( window.innerWidth, window.innerHeight );
	
	renderer = new THREE.WebGLRenderer();
	//renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	/*
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;
    */
   
	container.appendChild( renderer.domElement );
	//stats = new Stats();
	//container.appendChild( stats.dom );
	window.addEventListener( 'resize', onWindowResize, false );
	render();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	render();
}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	camera.updateProjectionMatrix();
	//render();
	//stats.update();
}

function render() {
	renderer.render( scene, camera );
}
