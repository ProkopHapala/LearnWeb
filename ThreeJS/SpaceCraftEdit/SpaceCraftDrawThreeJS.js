"use strict";

// test

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

SpaceCraft.prototype.draw = function( group ){
	let mater = new TrussMaterial( 10.0, 10.0, 1.0, 1.0 );
	let kind_long   = {S:1.0,mat:mater};
	let kind_perp   = {S:1.0,mat:mater};
	let kind_zigIn  = {S:1.0,mat:mater};
	let kind_zigOut = {S:1.0,mat:mater};
	// truss.makeGirder_1( vec3.fromValues(0.0,0.0,0.0), vec3.fromValues(1000.0,5.0,0.0), vec3.fromValues(0.0,1.0,0.0), 6, 20.0, kind_long, kind_perp, kind_zigIn, kind_zigOut );
	
	console.log( "SpaceCraft.draw ", this.girders.length );

	for(let o of this.nodes){
		//console.log( "node : ", o.id, o);
		this.truss.nodes.push( new TrussNode( this.truss.nodes.length, THREE.Vec3toArray( o.pos ), 0.0 ) );
	}
	for(let o of this.ropes){
		//console.log(o.id, o);
		this.truss.sticks.push( new Stick( o.node1.id ,o.node2.id, mater ) );
	}
	//console.log("this.truss.sticks ", this.truss.sticks );
	//printArray( this.truss.nodes  );
	//printArray( this.truss.sticks );
	
	for(let o of this.girders){
	//for(let i=0; i<this.girders.length; i++ ){
	//	let o = this.girders[i];
		//console.log( "girder ", o );
		//console.log( "girder ", o.node1.pos, o.node2.pos, o.up, o.nseg, o.width );
		this.truss.makeGirder_1(          
			THREE.Vec3toArray( o.node1.pos ), 
			THREE.Vec3toArray( o.node2.pos ),
			o.up,
			o.nseg,
			o.width,
			kind_long, kind_perp, kind_zigIn, kind_zigOut
		);
	}
	let ijs = this.truss.getIJs( );        //printArray(ijs);
	let ps  = this.truss.getPoints( );     //printArray(ps );
	let ps_ = THREE.Array2Vec3s( ps );     //printArray(ps_);
	let geom = THREE.makeLinesGeometry( ps_, ijs );
	let mat  = new THREE.LineBasicMaterial( { color:  0x808080 } );
	let mesh = new THREE.Line( geom, mat );  
	group.add(mesh);
	

	//console.log(this.thrusters);
	for(let o of this.thrusters){
		//console.log( "thrusters ", o, o.span, o.pose.pos );
		let verts =  THREE.drawUV_Parabola( [16,16], new Vec2(0.05,0.0), new Vec2(1.0,6.28), o.span.y, -o.span.z, 0.5 );
		//printArray(verts);
		let geom = THREE.makeLinesGeometry( verts );
		let mat  = new THREE.LineBasicMaterial( { color:  0x808080 } );
		let mesh = new THREE.Line( geom, mat );  
		mesh.position.setv( o.pose.pos );
		// ToDo: rotation
		group.add(mesh);
	}


	let p0 = new Vec3();
	let p1 = new Vec3();
	for(let o of this.tanks){
		console.log( "tank ", o);
		console.log( "tank ", o.span, o.pose.pos, o.pose.rot.a, o.pose.rot.b, o.pose.rot.c );
		p0.setv(o.pose.pos);
		console.log( "o.pose.pos, o.span.z, o.pose.rot.c ", o.pose.pos, o.span.z, o.pose.rot.c);
		p1.set_lincomb2f( 1, o.pose.pos, o.span.z, o.pose.rot.c );
		console.log( "tank p0 p1 ", p0, p1 );
		let geom = THREE.capsula( p0, p1, o.span.x, o.span.y, Math.PI*0.5, Math.PI*0.5, Math.PI*0.1, 16, true );
		//let mat  = new THREE.LineBasicMaterial( { color:  0x808080 } );
		//let mesh = new THREE.Line( geom, mat );
		let mat = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } );  
		let mesh = new THREE.Mesh( geom, mat );
		//mesh.position.setv( o.pose.pos );
		// ToDo: rotation
		group.add(mesh);
	}

	geom = new THREE.Geometry(); 
	let p = new Vec3();
	for(let o of this.radiators){
		console.log( "radiator ", o);
		//console.log( "tank ", o.span, o.pose.pos, o.pose.rot.a, o.pose.rot.b, o.pose.rot.c );
		let iv = geom.vertices.length;
		//console.log( "g1", o.girder1, o.girder1.node1 );
		//console.log( "g2", o.girder2, o.girder2.node2 );
		//geom.vertices.push( o.girder1.node1.pos.clone() );
		//geom.vertices.push( o.girder1.node2.pos.clone() );
		//geom.vertices.push( o.girder2.node2.pos.clone() );
		//geom.vertices.push( o.girder2.node1.pos.clone() );
		//console.log( "o.g1span, o.g2span ", o.g1span, o.g2span );
		p.set_lincomb2f( 1-o.g1span.x, o.girder1.node1.pos, o.g1span.x,  o.girder1.node2.pos );  geom.vertices.push( p.clone() );
		p.set_lincomb2f( 1-o.g1span.y, o.girder1.node1.pos, o.g1span.y,  o.girder1.node2.pos );  geom.vertices.push( p.clone() );
		p.set_lincomb2f( 1-o.g2span.x, o.girder2.node1.pos, o.g2span.x,  o.girder2.node2.pos );  geom.vertices.push( p.clone() );
		p.set_lincomb2f( 1-o.g2span.y, o.girder2.node1.pos, o.g2span.y,  o.girder2.node2.pos );  geom.vertices.push( p.clone() );
		geom.faces.push( new THREE.Face3( iv, iv+1, iv+2   ) );
		geom.faces.push( new THREE.Face3( iv+1, iv+2, iv+3 ) );
	}
	printArray( geom.vertices );
	printArray( geom.faces );
	geom.computeFaceNormals();
	mat  = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } );  
	mesh = new THREE.Mesh( geom, mat );
	group.add(mesh);

} 
