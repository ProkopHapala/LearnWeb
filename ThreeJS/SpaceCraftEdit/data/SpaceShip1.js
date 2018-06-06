
// see
// Named and Optional Arguments in JavaScript https://medium.com/dailyjs/named-and-optional-arguments-in-javascript-using-es6-destructuring-292a683d5b4e

// Central Tubus / Gun
var object = new THREE.Mesh( new THREE.CylinderGeometry(  4.0,  5.0, 800.0, 16,  1, true ),  material );
object.position.set( 0, 0, 0 );
scene.add( object );

// Girder
truss( 22, 16.0, -20, 1.0, matwire, material, scene );

// reactor
var geom = new THREE.CylinderGeometry( 30.0, 10.0, 100.0, 4, 1, false, Math.PI*0.25 ); 
geom.shading = THREE.FlatShading;
var object = new THREE.Mesh( geom, material );
object.position.set( 0, -400.0, 0 );
object.scale.z = 0.5;
scene.add( object );
var sprite = makeTextSprite( "reactor", { size: 36, color: txColor } ); sprite.position.set(50,-400,40); scene.add( sprite );

// Radiation shield
var object = new THREE.Mesh( trapezGeom( -80, 40, 80, 48, true ), material );
object.position.set( 0, +320.0, 0 );
object.rotation.x = -0.15;
scene.add( object );
var sprite = makeTextSprite( "Shield mirror", { size: 36, color: txColor } ); sprite.position.set(50,+320,40); scene.add( sprite );

// radiator
var object = new THREE.Mesh( trapezGeom( -350.0, 20.0, 300.0, 100.0, true ), material ); object.position.set( 0, 0, 0 ); scene.add( object );
var sprite = makeTextSprite( "radiator", { size: 36, color: txColor } ); sprite.position.set(100,+100,40); scene.add( sprite );

// Facilities
var object = new THREE.Mesh( new THREE.TorusGeometry( 32.0, 8.0, 16, 64 ), material ); object.position.set( 0, 200, 0 ); scene.add( object );
var sprite = makeTextSprite( "Facilities", { size: 36, color: txColor } ); sprite.position.set(50,+180,40); scene.add( sprite );

// propelant tank
var object = new THREE.Mesh( new THREE.TorusGeometry( 40.0, 16.0, 16, 64 ), material ); object.position.set( 0, 0, 0 ); scene.add( object );
var object = new THREE.Mesh( new THREE.TorusGeometry( 30.0, 16.0, 16, 64 ), material ); object.position.set( 0, 0, 0 ); scene.add( object );
var sprite = makeTextSprite( "Propelant Tank", { size: 36, color: txColor } ); sprite.position.set(60,+0.0,40); scene.add( sprite );

