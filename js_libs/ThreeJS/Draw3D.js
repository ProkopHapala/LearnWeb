
"use strict";


var Vec3 = THREE.Vector3;
var tri = THREE.Face3;

/*
function WebGLLineRender(){

    //var state = new WebGLState( _gl, extensions, paramThreeToGL );
    //_gl = _context || _canvas.getContext( 'webgl', attributes ) || _canvas.getContext( 'experimental-webgl', attributes );
    var state;
    var gl;

    this.init = funtion (){
        object, program, material
    }

    this.line = funtion(p1,p2){
        positions.push(p1);
        positions.push(p2);
    }

    this.draw(){
        var attributes = program.getAttributes();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffers.position );
        gl.bufferData( gl.ARRAY_BUFFER, object.positionArray, gl.DYNAMIC_DRAW );
        state.enableAttribute( attributes.position );
        gl.vertexAttribPointer( attributes.position, 3, gl.FLOAT, false, 0, 0 );

        state.disableUnusedAttributes();
		_gl.drawArrays( _gl.TRIANGLES, 0, object.count );
    }

}
*/


/*
	function EdgesHelper( object, hex ) {
		console.warn( 'THREE.EdgesHelper has been removed. Use THREE.EdgesGeometry instead.' );
		return new LineSegments( new EdgesGeometry( object.geometry ), new LineBasicMaterial( { color: hex !== undefined ? hex : 0xffffff } ) );
	}
*/

/*
THREE.Edge = function(a,b){
    this.a=a | 0;
    this.b=b | 0;
}
*/

/*

// See : Three.BufferGeometry()
THREE.LinesGeometry =  function ( verts, edges ) {
    //THREE.BufferGeometry.call( this );
    THREE.BufferGeometry.call( this );
    console.log(this);
    var nVert;
    var coords;
    if( edges ){
        nVert = edges.length*2;
        coords = new Float32Array( nVert * 3 );
        for( let i=0;i<edges.lenght; i++ ){
            let edge = edges[i];
            let i6=i*6;
            let p;
            //let p = verts[ edge.a ];
            p = verts[ edge[0] ];
            coords[i3  ] = p.x;
            coords[i3+1] = p.y;
            coords[i3+2] = p.z;
            //let p = verts[ edges.b ];
            p = verts[ [1] ];
            coords[i6+3] = p.x;
            coords[i6+4] = p.y;
            coords[i6+5] = p.z;
        }
    }else{
        nVert = verts.length;
        coords = new Float32Array( nVert * 3 );
        for( let i=0;i<verts.length; i++ ){
            let p = verts[ i ];
            let i3=i*3;
            coords[i3+3] = p.x;
            coords[i3+4] = p.y;
            coords[i3+5] = p.z;
        }
    }
    // Why : this.addAttribute is not a function
    this.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );
}

*/



// See : Three.BufferGeometry()
THREE.makeLinesGeometry =  function ( verts, edges ) {
    //THREE.BufferGeometry.call( this );
    var geom = new THREE.BufferGeometry( this );
    //console.log(this);
    var nVert;
    var coords;
    if( edges ){
        nVert = edges.length*2;
        coords = new Float32Array( nVert * 3 );
        for( let i=0;i<edges.lenght; i++ ){
            let edge = edges[i];
            let i6=i*6;
            let p;
            //let p = verts[ edge.a ];
            p = verts[ edge[0] ];
            coords[i3  ] = p.x;
            coords[i3+1] = p.y;
            coords[i3+2] = p.z;
            //let p = verts[ edges.b ];
            p = verts[ [1] ];
            coords[i6+3] = p.x;
            coords[i6+4] = p.y;
            coords[i6+5] = p.z;
        }
    }else{
        nVert = verts.length;
        coords = new Float32Array( nVert * 3 );
        for( let i=0;i<verts.length; i++ ){
            let p = verts[ i ];
            let i3=i*3;
            coords[i3+3] = p.x;
            coords[i3+4] = p.y;
            coords[i3+5] = p.z;
        }
    }
    // Why : this.addAttribute is not a function
    geom.isLineSegments = true;
    geom.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );
    return geom;
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



function trapezGeom( x0, y0, x1, y1, sym ){
    var geom = new THREE.Geometry(); 
    var y00=0.0,y10=0.0;
    if( sym ){ y00=-y0; y10=-y1; };
    verts.push( new Vec3(y00,x0,0) );
    verts.push( new Vec3(y00,x0,0) );
    verts.push( new Vec3(y00,x0,0) );
    verts.push( new Vec3(y00,x0,0) );
    let i = faces.lenght; 
    faces.push( new tri( i+0, i+1, i+2 ) );
    faces.push( new tri( i+0, i+1, i+2 ) );
    geom.computeFaceNormals();
    return geom;
}




/*
function Canvas3D() {
    this.lines = new THREE.Geometry();
    this.faces = new THREE.Geometry();
}
Canvas3D.prototype = {
constructor: Matrix3,
isMat3: true,
//_a: new Mat3(), _b: new Mat3(), _c: new Mat3()

set_outer:function( a, b ){
    this.a.x=a.x*b.x; this.a.y=a.x*b.y; this.a.z=a.x*b.z;
    this.b.x=a.y*b.x; this.b.y=a.y*b.y; this.b.z=a.y*b.z;
    this.c.x=a.z*b.x; this.c.y=a.z*b.y; this.c.z=a.z*b.z;
}
*/