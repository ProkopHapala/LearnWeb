"use strict";

function makeTextSprite( message, parameters ){
	if ( parameters === undefined ) parameters = {};
	var  font  = parameters.hasOwnProperty("font")  ? parameters["font"]  : "Arial";
	var  size  = parameters.hasOwnProperty("size")  ? parameters["size"]  : 18;
	var color = parameters.hasOwnProperty("color") ? parameters["color"] : { r:0, g:0, b:0, a:1.0 };
	var canvas   = document.createElement('canvas');
	var context  = canvas.getContext('2d');
	context.font = "Bold " + size + "px " + font;
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
	context.fillText( message, 0, size);
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

function truss( n, sz, y0, w, matwire, mat, group ){
	var mesh;
	var beam = new THREE.CylinderGeometry( w, w, 2*(n-1)*sz, 4, 1, false );
	mesh = new THREE.Mesh( beam, mat ); mesh.position.x = -sz; mesh.position.y = y0; group.add( mesh );
	mesh = new THREE.Mesh( beam, mat ); mesh.position.x = +sz; mesh.position.y = y0; group.add( mesh );
	mesh = new THREE.Mesh( beam, mat ); mesh.position.z = -sz; mesh.position.y = y0; group.add( mesh );
	mesh = new THREE.Mesh( beam, mat ); mesh.position.z = +sz; mesh.position.y = y0; group.add( mesh );
	var block = new THREE.OctahedronGeometry( sz, 0 );
	for ( var i = 0; i < n; i ++ ) {
	    mesh = new THREE.Mesh( block, matwire );
	    mesh.position.y = y0 + 2*(i-0.5*n+0.5)*sz;
	    group.add( mesh );
    }
}

function trapezGeom( x0, y0, x1, y1, sym ){
    var geom = new THREE.Geometry(); 
    var y00=0.0,y10=0.0;
    if( sym ){ y00=-y0; y10=-y1; };
    geom.vertices.push(new THREE.Vector3(y00,x0,0));
    geom.vertices.push(new THREE.Vector3(y0 ,x0,0));
    geom.vertices.push(new THREE.Vector3(y10,x1,0));
    geom.vertices.push(new THREE.Vector3(y1 ,x1,0));
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 2, 3 ) );
    geom.computeFaceNormals();
    return geom;
}
