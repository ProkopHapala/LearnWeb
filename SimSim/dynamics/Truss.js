"use strict";

glMatrix.ARRAY_TYPE = Float64Array;

// ================
//      Material
// ================

var Material = function( Kpull, Kpush, Spull, Spush, density ){
    this.Spull  = Kpull; 
    this.Spush  = Kpush;
    this.Kpull  = Spull; 
    this.Kpush  = Spush;
    this.density = density;
}

// ================
//      Node
// ================

var Node = function( id, pos, mass ){
    this.id    = id; 
    this.mass  = mass;
    this.pos   = pos;
    this.vel   = vec3.create();
    this.force = vec3.create();
}

// ================
//      Stick
// ================

var Stick = function( i,j, mat, S, l0 ){
    this.i = i | 0;
    this.j = j | 0;
    this.mat = mat;
    this.S  = S;
    this.l  = l0;
    this.l0 = l0;
    this.broken = true;
}

Stick.prototype.autoL0  = function( nodes ){
    this.l0 = vec3.dist( nodes[this.i].pos, nodes[this.j].pos );
}

Stick.prototype.addMass = function( nodes ){
    let mass = 0.5 * this.S * this.l0 * this.mat.density;
    nodes[this.i].mass += mass;
    nodes[this.j].mass += mass;
}

// ================
//      Truss
// ================

var Truss = function( ){
    this.nodes  = [];
    this.sticks = [];
    this.blocks = [];
}

Truss.prototype.evalStickForces = function(){
    let d  = vec2.create();
    //let f  = vec2.create();
    for( let i=0; i<sticks.length; i++ ){
        let stick = this.sticks[i]; 
        let ndi   = this.nodes[stick.i];
        let ndj   = this.nodes[stick.j];
        let mat   = stick.mat;
        vec3.subtract(d, ndi.pos, ndj.pos );
        let l    = vec3.length(d);
        let l0   = stick.l0;
        let kfac = stick.S / l0;
        let f,fmax;
        let dl = l-l0;
        if( dl > 0 ){
            f        = dl*( mat.Kpull*kfac );
            let fmax =      mat.Spull*kfac;
        }else{
            f        = dl*( mat.Kpush*kfac );
            let fmax =      mat.Spush*kfac;
        }
        if( f > fmax ){ stick.broken = true; f=fmax; } 
        d.mul( f/l );
        vec3.sub(ndi,d);
        vec3.add(ndj,d);
    }
}

Truss.prototype.prepareSticks = function(){
    let nodes = this.nodes;
    for( let i=0; i<sticks.length; i++ ){
        let stick = this.sticks[i];
        stick.autoL0 (nodes);
        stick.addMass(nodes);
    }
}

Truss.prototype.clenForce = function(){
    for( let i=0; i<nodes.length; i++ ){
        this.nodes[i].force.set(out, 0.0, 0.0, 0.0);
    }
}

Truss.prototype.moveNodes = function( dt ){
    for( let i=0; i<nodes.length; i++ ){
        let ndi = this.nodes[i];
        let vel = ndi.vel;
        let pos = ndi.pos;
        vec2.scaleAndAdd( vel, vel, ndi.force, dt);
        vec2.scaleAndAdd( pos, pos, vel,       dt);
    }
}

Truss.prototype.upadate = function( dt ){
    this.clenForce( nodes );
    this.evalStickForces( sticks, nodes );
    this.moveNodes( nodes, dt );
}

Truss.prototype.makeStick = function( i, j, S, mat ){
    let l0 = vec3.dist( this.nodes[i].pos, this.nodes[j].pos ); 
    sticks.push( new Stick( i, j, S, l0, mat ) );
}

Truss.prototype.makeSolid = function( verts, edges, mass, kind  ){
    for( let i=0; i<verts.length; i++ ){
        this.nodes.push( new Node( i, vec3.clone( verts[i] ), mass ) );
    }
    for( let i=0; i<edges.length; i++ ){
        let ed = edges[i];
        this.sticks.push( new Stick( ed[0], ed[1], kind.mat, kind.S, 1.0 ) );
    }
}

Truss.prototype.makeGirder_1 = function( p0, p1, up, n, width,   kind_long, kind_perp, kind_zigIn, kind_zigOut  ){
    //let kind_long   = 0;
    //let kind_perp   = 1;
    //let kind_zigIn  = 2;
    //let kind_zigOut = 3;
    up   = vec3.clone(up);
    let side = vec3.create();
    let dir  = vec3.create();
    vec3.sub( dir, p1, p0 );
    let l   = vec3.makeOrthoNormal(dir,up,side);
    let dl  = l/(2*n + 1);
    let dnp = 4;
    let nodes  = this.nodes;
    let sticks = this.sticks;
    let i00 = this.nodes.length;
    this.blocks.push( [i00,sticks.length] );

    //console.log( " dir, up, side ", dir, up, side );
    //console.log( "dots ", vec3.dot(dir,dir),  vec3.dot(up,up),  vec3.dot(side,side),     vec3.dot(dir,up), vec3.dot(dir,side), vec3.dot(up,side) );
    //console.log( dl );
    for (let i=0; i<n; i++){
        let i01=i00+1; 
        let i10=i00+2; 
        let i11=i00+3;
        let lt = dl*(1+2*i );
        let vtmp;
        let mass = 0.001;
        vtmp = vec3.create(); vec3.lincomb( vtmp, p0, side, dir, 1.0, -width, lt    ); nodes.push( new Node( i00, vtmp, mass ) ); //points.push( p0 + side*-width + dir*(dl*(1+2*i  )) );
        vtmp = vec3.create(); vec3.lincomb( vtmp, p0, side, dir, 1.0, +width, lt    ); nodes.push( new Node( i01, vtmp, mass ) ); //points.push( p0 + side*+width + dir*(dl*(1+2*i  )) );
        vtmp = vec3.create(); vec3.lincomb( vtmp, p0, up,   dir, 1.0, -width, lt+dl ); nodes.push( new Node( i10, vtmp, mass ) ); //points.push( p0 + up  *-width + dir*(dl*(1+2*i+1)) );
        vtmp = vec3.create(); vec3.lincomb( vtmp, p0, up,   dir, 1.0, +width, lt+dl ); nodes.push( new Node( i11, vtmp, mass ) ); //points.push( p0 + up  *+width + dir*(dl*(1+2*i+1)) );
        
        //console.log( i, nodes[i00].pos, nodes[i01].pos, nodes[i10].pos, nodes[i11].pos );
        
        sticks.push( new Stick( i00,i01, kind_perp .mat, kind_perp .S, 1.0 ) );  // edges .push( (TrussEdge){i00,i01,kind_perp}  );
        sticks.push( new Stick( i10,i11, kind_perp .mat, kind_perp .S, 1.0 ) );  // edges .push( (TrussEdge){i10,i11,kind_perp}  );
        sticks.push( new Stick( i00,i10, kind_zigIn.mat, kind_zigIn.S, 1.0 ) );  // edges .push( (TrussEdge){i00,i10,kind_zigIn} );
        sticks.push( new Stick( i00,i11, kind_zigIn.mat, kind_zigIn.S, 1.0 ) );  // edges .push( (TrussEdge){i00,i11,kind_zigIn} );
        sticks.push( new Stick( i01,i10, kind_zigIn.mat, kind_zigIn.S, 1.0 ) );  // edges .push( (TrussEdge){i01,i10,kind_zigIn} );
        sticks.push( new Stick( i01,i11, kind_zigIn.mat, kind_zigIn.S, 1.0 ) );  // edges .push( (TrussEdge){i01,i11,kind_zigIn} );
        if( i<(n-1) ){
            sticks.push( new Stick( i10,i00+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i10,i00+dnp,kind_zigOut} );
            sticks.push( new Stick( i10,i01+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i10,i01+dnp,kind_zigOut} );
            sticks.push( new Stick( i11,i00+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i11,i00+dnp,kind_zigOut} );
            sticks.push( new Stick( i11,i01+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i11,i01+dnp,kind_zigOut} );
            sticks.push( new Stick( i00,i00+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i00,i00+dnp,kind_long} );
            sticks.push( new Stick( i01,i01+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i01,i01+dnp,kind_long} );
            sticks.push( new Stick( i10,i10+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i10,i10+dnp,kind_long} );
            sticks.push( new Stick( i11,i11+dnp, kind_perp.mat, kind_perp.S, 1.0 ) ); //edges.push( (TrussEdge){i11,i11+dnp,kind_long} );
        }
        i00+=dnp;
    }
}

