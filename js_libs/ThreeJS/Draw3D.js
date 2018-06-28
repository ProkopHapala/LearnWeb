
"use strict";

var Vec3 = THREE.Vector3;
var tri = THREE.Face3;


function printArray( arr ){
    for(let i=0; i<arr.length; i++){
        console.log( i, arr[i] );
    }
}

THREE.capsula = function( p0, p1, r1, r2, theta1, theta2, dTheta, nPhi, capped ){
    let ax   = new Vec3(); 
    let up   = new Vec3();
    let left = new Vec3();
    let cph  = new Vec2(1.0,0.0);
    let dph  = new Vec2();
    let cth  = new Vec2(1.0,0.0);
    let cth_ = new Vec2(1.0,0.0);
    let dth  = new Vec2();
    let pa=new Vec3(),pb=new Vec3(),na=new Vec3(),nb=new Vec3();
    ax.set_sub( p1, p0 );  
    let L = ax.normalize_r();
    ax.getSomeOrtho(up,left);
    //console.log("phi",  Math.PI, nPhi, 2*Math.PI/nPhi );
    dph.fromAngle( 2*Math.PI/nPhi );
    // Cylinder
    let dr = r2-r1;
    let cv = Math.sqrt(L*L+dr*dr);
    cth.set( L/cv, -dr/cv );

    //console.log(" dr, cv,  L/cv, -dr/cv ",  dr, L, cv,  L/cv, -dr/cv  );
    //glBegin(GL_TRIANGLE_STRIP);
    //console.log( "ax up left", ax, up, left );
    //console.log( "r1 r2  cph dph  cth dph", r1, r2, cph, dph,  cth, dth );

    /*
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
    */
    let geom = new THREE.Geometry(); 
    for(let iph=0; iph<(nPhi+1); iph++){
        pa.set_lincomb3f( 1.0, cph.x*r1, cph.y*r1,   p0, left, up );
        pb.set_lincomb3f( 1.0, cph.x*r2, cph.y*r2,   p1, left, up );
        //console.log( iph, p0, left, up,  1.0, cph.x*r1, cph.y*r1, pa )
        //console.log( "i cph, pa ", iph, cph, pa )
        //na.set_lincomb( left, up, ax,   cph.x, cph.y*cth.x, ax*cth.y );
        //nb.set_lincomb( left, up, ax,   cph.x, cph.y*cth.x, ax*cth.y );
        //glNormal3f(na.x,na.y,na.z); glVertex3f(pa.x,pa.y,pa.z);
        //glNormal3f(nb.x,nb.y,nb.z); glVertex3f(pb.x,pb.y,pb.z);
        let iv = geom.vertices.length;
        geom.vertices.push( pa.clone() );
        geom.vertices.push( pb.clone() );
        if( iph>0 ){ 
            geom.faces.push( new THREE.Face3( iv-1, iv, iv+1 ) );
            geom.faces.push( new THREE.Face3( iv-2, iv-1, iv ) );
        }
        cph.mul_cmplx(dph);
    }
    //printArray( geom.vertices );
    //printArray( geom.faces   );
    //glEnd();

    
    let DTh,h;
    let nTheta;
    // Spherical Cap
    cph.set(1.0,0.0);
    cth.set( L/cv, -dr/cv );
    //dth.fromSin(v1/r1);
    DTh = (-theta1 - Math.asin(cth.y));
    nTheta = Math.floor(  Math.abs(DTh) / dTheta );
    dth.fromAngle( DTh/nTheta );
    //printf( " cth (%f,%f)  dth (%f,%f) \n", cth.x, cth.y,  dth.x, dth.y );
    r1/=cth.x;
    h  =-cth.y*r1;
    // Left
    for(let ith=0; ith<(nTheta+1); ith++){
        //cth_.setv(cth);
        cth_.set_mul_cmplx(cth,dth);
        //glBegin(GL_TRIANGLE_STRIP);
        //glBegin(GL_LINES);
        for(let iph=0; iph<(nPhi+1); iph++){
            //Vec3f pa = p0 + (left*(cph.x*r1) + up*(cph.y*r1))*cth.x  + ax*(h+cth.y*r1);
            //Vec3f pb = p0 + (left*(cph.x*r1) + up*(cph.y*r1))*cth_.x + ax*(h+cth_.y*r1);
            //Vec3f na = (left*(cph.x) + up*(cph.y)*cth.x  + ax*cth.y)*1.0;
            //Vec3f nb = (left*(cph.x) + up*(cph.y)*cth_.x + ax*cth_.y)*1.0;
            //glNormal3f(na.x,na.y,na.z); glVertex3f(pa.x,pa.y,pa.z);
            //glNormal3f(nb.x,nb.y,nb.z); glVertex3f(pb.x,pb.y,pb.z);
            pa.setv(p0); pa.add_lincomb3f( cph.x*r1*cth .x, cph.y*r1*cth .x, h+r1*cth .y,   left, up, ax );
            pb.setv(p0); pb.add_lincomb3f( cph.x*r1*cth_.x, cph.y*r1*cth_.x, h+r1*cth_.y,   left, up, ax );
            //console.log( ith, iph,  cph.x*r1, cph.y*r1*cth .x, h+r1*cth .y );
            //console.log( iph, pa );
            let iv = geom.vertices.length;
            geom.vertices.push( pa.clone() );
            geom.vertices.push( pb.clone() );
            if( iph>0 ){ 
                geom.faces.push( new THREE.Face3( iv-1, iv, iv+1 ) );
                geom.faces.push( new THREE.Face3( iv-2, iv-1, iv ) );
            }
            cph.mul_cmplx(dph);
        }
        //glEnd();
        //printf( "%i cth (%f,%f)  cth_ (%f,%f) \n", ith, cth.x, cth.y,  cth_.x, cth_.y );
        cth.setv(cth_);
    }

    //return 0;
    cph.set(1.0,0.0);
    cth.set( L/cv, -dr/cv );
    //cth = Vec2fX;
    //cth.set( dr/cv, L/cv);
    //dth.fromAngle( asin(v2/r2)/nTheta );
    
    DTh    = (theta2-Math.asin(cth.y));
    nTheta = Math.floor( Math.abs(DTh) / dTheta );
    //console.log( "theta2, cth.y, Math.asin(cth.y), DTh, nTheta ", theta2, cth.y, Math.asin(cth.y), DTh, nTheta  );
    dth.fromAngle(DTh/nTheta );
    r2 /= cth.x;
    h  =-cth.y*r2;
    // Right
    for(let ith=0; ith<(nTheta+1); ith++){
        cth_.set_mul_cmplx(cth,dth);
        //glBegin(GL_TRIANGLE_STRIP);
        for(let iph=0; iph<(nPhi+1); iph++){
            //Vec3f pa = p1 + (left*(cph.x*r2) + up*(cph.y*r2))*cth.x  + ax*(h+cth.y*r2);
            //Vec3f pb = p1 + (left*(cph.x*r2) + up*(cph.y*r2))*cth_.x + ax*(h+cth_.y*r2);
            //Vec3f na = (left*(cph.x) + up*(cph.y)*cth.x  + ax*cth.y)*-1.0;
            //Vec3f nb = (left*(cph.x) + up*(cph.y)*cth_.x + ax*cth_.y)*-1.0;
            //glNormal3f(na.x,na.y,na.z); glVertex3f(pa.x,pa.y,pa.z);
            //glNormal3f(nb.x,nb.y,nb.z); glVertex3f(pb.x,pb.y,pb.z);
            pa.setv(p1); pa.add_lincomb3f( cph.x*r2*cth .x, cph.y*r2*cth .x, h+r2*cth .y,   left, up, ax );
            pb.setv(p1); pb.add_lincomb3f( cph.x*r2*cth_.x, cph.y*r2*cth_.x, h+r2*cth_.y,   left, up, ax );
            //console.log( ith, iph,  cph.x*r1, cph.y*r1*cth .x, h+r1*cth .y );
            let iv = geom.vertices.length;
            geom.vertices.push( pa.clone() );
            geom.vertices.push( pb.clone() );
            if( iph>0 ){ 
                geom.faces.push( new THREE.Face3( iv-1, iv, iv+1 ) );
                geom.faces.push( new THREE.Face3( iv-2, iv-1, iv ) );
            }
            cph.mul_cmplx(dph);
        }
        //glEnd();
        cth.setv(cth_);
    }

    geom.computeFaceNormals();
    return geom;
}


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
        for( let i=0;i<edges.length; i++ ){
            let edge = edges[i];
            let i6=i*6;
            let p;
            //let p = verts[ edge.a ];
            //console.log( "i: ", i, i6 );
            p = verts[ edge[0] ];   //console.log( "p1 ", p );
            coords[i6  ] = p.x;
            coords[i6+1] = p.y;
            coords[i6+2] = p.z;
            //let p = verts[ edges.b ];
            p = verts[ edge[1] ];  //console.log( "p2 ", p );
            coords[i6+3] = p.x;
            coords[i6+4] = p.y;
            coords[i6+5] = p.z;
        }
        //console.log( coords );
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