"use strict"

var Vec3 = THREE.Vector3;

function absMax(x,xmax){
    if(x<0)x=-x; if(x>xmax){ return x; }else{ return xmax; };
}

function Mat3() {
    this.a = new Vec3( 1.0, 0.0, 0.0 );
    this.b = new Vec3( 0.0, 1.0, 0.0 );
    this.c = new Vec3( 0.0, 0.0, 1.0 );
}
Mat3.prototype = {
constructor: Matrix3,
isMat3: true,
//_a: new Mat3(), _b: new Mat3(), _c: new Mat3()

set_outer:function( a, b ){
    this.a.x=a.x*b.x; this.a.y=a.x*b.y; this.a.z=a.x*b.z;
    this.b.x=a.y*b.x; this.b.y=a.y*b.y; this.b.z=a.y*b.z;
    this.c.x=a.z*b.x; this.c.y=a.z*b.y; this.c.z=a.z*b.z;
},

diag_add:function( TYPE f ){ this.a.x+=f; this.b.y+=f; this.c.z+=f; },

get:function(i){ switch(i){ case 0:return a; case 1:return b; case 2:return c; } },

colx_to:function( out ){ out.x = this.a.x; out.y = this.b.x; out.z = this.c.x; },
coly_to:function( out ){ out.x = this.a.y; out.y = this.b.y; out.z = this.c.y; },
colz_to:function( out ){ out.x = this.a.z; out.y = this.b.z; out.z = this.c.z; },

setColx:function( v ){ this.a.x = v.x; this.b.x = v.y; this.c.x = v.z; },
setColy:function( v ){ this.a.y = v.x; this.b.y = v.y; this.c.y = v.z; },
setColz:function( v ){ this.a.z = v.x; this.b.z = v.y; this.c.z = v.z; },

// ====== transpose

T:function(){
    let t;
    t=this.b.x; this.b.x=this.a.y; this.a.y=t;
    t=this.c.x; this.c.x=this.a.z; this.a.z=t;
    t=this.c.y; this.c.y=this.b.z; this.b.z=t;
},

setT:function( M ){
    this.a.x=M.a.x; this.a.y=M.b.x; this.a.z=M.c.x;
    this.b.x=M.a.y; this.b.y=M.b.y; this.b.z=M.c.y;
    this.c.x=M.a.z; this.c.y=M.b.z; this.c.z=M.c.z;
},

setT:function( va, vb, vc ){
    this.a.set( va.x, vb.x, vc.x );
    this.b.set( va.y, vb.y, vc.y );
    this.c.set( va.z, vb.z, vc.z );
},

mu :function( f  ){ this.a.mul(f);   this.b.mul(f);    this.c.mul(f);    },
mul:function( va ){ this.a.mul(va.a); this.b.mul(va.b); this.c.mul(va.c); },
div:function( va ){ this.a.mul(1/va.a); this.b.mul(1/va.b); this.c.mul(1/va.c); },

mulT:function( va ){
    this.a.x*=va.x; this.a.y*=va.y; this.a.z*=va.z;
    this.b.x*=va.x; this.b.y*=va.y; this.b.z*=va.z;
    this.c.x*=va.x; this.c.y*=va.y; this.c.z*=va.z;
},

divT:function( va ){
    let fx=1/va.x,fy=1/va.y,fz=1/va.z;
    this.a.x*=fx; this.a.y*=fy; this.a.z*=fz;
    this.b.x*=fx; this.b.y*=fy; this.b.z*=fz;
    this.c.x*=fx; this.c.y*=fy; this.c.z*=fz;
},
normAbsMax:function(){
    let m = 0;
    m=absMax(a.x,m); m=absMax(a.y,m); m=absMax(a.z,m);
    m=absMax(b.x,m); m=absMax(b.y,m); m=absMax(b.z,m);
    m=absMax(c.x,m); m=absMax(c.y,m); m=absMax(c.z,m);
    return m;
},

// ====== dot product with vector

/*
dot( v ){
    VEC vout;
    vout.x = xx*v.x + xy*v.y + xz*v.z;
    vout.y = yx*v.x + yy*v.y + yz*v.z;
    vout.z = zx*v.x + zy*v.y + zz*v.z;
    return vout;
},

dotT( v ){
    VEC vout;
    vout.x = xx*v.x + yx*v.y + zx*v.z;
    vout.y = xy*v.x + yy*v.y + zy*v.z;
    vout.z = xz*v.x + yz*v.y + zz*v.z;
    return vout;
},
*/

dot_to:function( v, vout ){
    let vx=v.x,vy=v.y,vz=v.z; // to make it safe use inplace
    vout.x = this.a.x*vx + this.a.y*vy + this.a.z*vz;
    vout.y = this.b.x*vx + this.b.y*vy + this.b.z*vz;
    vout.z = this.c.x*vx + this.c.y*vy + this.c.z*vz;
},

dot_to_T:function( v, vout ){
    let vx=v.x,vy=v.y,vz=v.z;
    vout.x = this.a.x*vx + this.b.x*vy + this.c.x*vz;
    vout.y = this.a.y*vx + this.b.y*vy + this.c.y*vz;
    vout.z = this.a.z*vx + this.b.z*vy + this.c.z*vz;
},

// ====== matrix multiplication

set_mmul:function( A, B ){
    this.a.x = A.a.x*B.a.x + A.a.y*B.b.x + A.a.z*B.c.x;
    this.a.y = A.a.x*B.a.y + A.a.y*B.b.y + A.a.z*B.c.y;
    this.a.z = A.a.x*B.a.z + A.a.y*B.b.z + A.a.z*B.c.z;
    this.b.x = A.b.x*B.a.x + A.b.y*B.b.x + A.b.z*B.c.x;
    this.b.y = A.b.x*B.a.y + A.b.y*B.b.y + A.b.z*B.c.y;
    this.b.z = A.b.x*B.a.z + A.b.y*B.b.z + A.b.z*B.c.z;
    this.c.x = A.c.x*B.a.x + A.c.y*B.b.x + A.c.z*B.c.x;
    this.c.y = A.c.x*B.a.y + A.c.y*B.b.y + A.c.z*B.c.y;
    this.c.z = A.c.x*B.a.z + A.c.y*B.b.z + A.c.z*B.c.z;
},

set_mmul_NT:function( A, B ){
    this.a.x = A.a.x*B.a.x + A.a.y*B.a.y + A.a.z*B.xz;
    this.a.y = A.a.x*B.b.x + A.a.y*B.b.y + A.a.z*B.yz;
    this.a.z = A.a.x*B.c.x + A.a.y*B.c.y + A.a.z*B.zz;
    this.b.x = A.b.x*B.a.x + A.b.y*B.a.y + A.b.z*B.xz;
    this.b.y = A.b.x*B.b.x + A.b.y*B.b.y + A.b.z*B.yz;
    this.b.z = A.b.x*B.c.x + A.b.y*B.c.y + A.b.z*B.zz;
    this.c.x = A.c.x*B.a.x + A.c.y*B.a.y + A.c.z*B.xz;
    this.c.y = A.c.x*B.b.x + A.c.y*B.b.y + A.c.z*B.yz;
    this.c.z = A.c.x*B.c.x + A.c.y*B.c.y + A.c.z*B.zz;
},

set_mmul_TN:function( A, B ){
    this.a.x = A.a.x*B.a.x + A.b.x*B.b.x + A.c.x*B.c.x;
    this.a.y = A.a.x*B.a.y + A.b.x*B.b.y + A.c.x*B.c.y;
    this.a.z = A.a.x*B.a.z + A.b.x*B.b.z + A.c.x*B.c.z;
    this.b.x = A.a.y*B.a.x + A.b.y*B.b.x + A.c.y*B.c.x;
    this.b.y = A.a.y*B.a.y + A.b.y*B.b.y + A.c.y*B.c.y;
    this.b.z = A.a.y*B.a.z + A.b.y*B.b.z + A.c.y*B.c.z;
    this.c.x = A.a.z*B.a.x + A.b.z*B.b.x + A.c.z*B.c.x;
    this.c.y = A.a.z*B.a.y + A.b.z*B.b.y + A.c.z*B.c.y;
    this.c.z = A.a.z*B.a.z + A.b.z*B.b.z + A.c.z*B.c.z;
},

set_mmul_TT:function( A, B ){
    this.a.x = A.a.x*B.a.x + A.b.x*B.a.y + A.c.x*B.a.z;
    this.a.y = A.a.x*B.b.x + A.b.x*B.b.y + A.c.x*B.b.z;
    this.a.z = A.a.x*B.c.x + A.b.x*B.c.y + A.c.x*B.c.z;
    this.b.x = A.a.y*B.a.x + A.b.y*B.a.y + A.c.y*B.a.z;
    this.b.y = A.a.y*B.b.x + A.b.y*B.b.y + A.c.y*B.b.z;
    this.b.z = A.a.y*B.c.x + A.b.y*B.c.y + A.c.y*B.c.z;
    this.c.x = A.a.z*B.a.x + A.b.z*B.a.y + A.c.z*B.a.z;
    this.c.y = A.a.z*B.b.x + A.b.z*B.b.y + A.c.z*B.b.z;
    this.c.z = A.a.z*B.c.x + A.b.z*B.c.y + A.c.z*B.c.z;
},

// ====== matrix solver

determinant:function() {
    let fCoxx = this.b.y * this.c.z - this.b.z * this.c.y;
    let fCoyx = this.b.z * this.c.x - this.b.x * this.c.z;
    let fCozx = this.b.x * this.c.y - this.b.y * this.c.x;
    let fDet  = this.a.x * fCoxx + this.a.y * fCoyx + this.a.z * fCozx;
    return fDet;
},

// TODO: Won't be better     set_inv(M)   ?
set_inv:function( M ) {
    let idet = 1/M.determinant(); // we dont check det|M|=0
    this.a.x = ( M.b.y * M.c.z - M.b.z * M.c.y ) * idet;
    this.a.y = ( M.a.z * M.c.y - M.a.y * M.c.z ) * idet;
    this.a.z = ( M.a.y * M.b.z - M.a.z * M.b.y ) * idet;
    this.b.x = ( M.b.z * M.c.x - M.b.x * M.c.z ) * idet;
    this.b.y = ( M.a.x * M.c.z - M.a.z * M.c.x ) * idet;
    this.b.z = ( M.a.z * M.b.x - M.a.x * M.b.z ) * idet;
    this.c.x = ( M.b.x * M.c.y - M.b.y * M.c.x ) * idet;
    this.c.y = ( M.a.y * M.c.x - M.a.x * M.c.y ) * idet;
    this.c.z = ( M.a.x * M.b.y - M.a.y * M.b.x ) * idet;
},
invert_to:function( Mout){ Mout.set_inv(this); },

set_inv_T( Mout ) {
    let idet = 1/M.determinant(); // we dont check det|M|=0
    this.a.x = ( M.b.y * M.c.z - M.b.z * M.c.y ) * idet;
    this.b.x = ( M.a.z * M.c.y - M.a.y * M.c.z ) * idet;
    this.c.x = ( M.a.y * M.b.z - M.a.z * M.b.y ) * idet;
    this.a.y = ( M.b.z * M.c.x - M.b.x * M.c.z ) * idet;
    this.b.y = ( M.a.x * M.c.z - M.a.z * M.c.x ) * idet;
    this.c.y = ( M.a.z * M.b.x - M.a.x * M.b.z ) * idet;
    this.a.z = ( M.b.x * M.c.y - M.b.y * M.c.x ) * idet;
    this.b.z = ( M.a.y * M.c.x - M.a.x * M.c.y ) * idet;
    this.c.z = ( M.a.x * M.b.y - M.a.y * M.b.x ) * idet;
},
invert_to_T:function( Mout){ Mout.set_inv(this); },

set_adjoint:function( M ) {
    this.a.x = M.b.y * M.c.z - M.b.z * M.c.y;
    this.a.y = M.a.z * M.c.y - M.a.y * M.c.z;
    this.a.z = M.a.y * M.b.z - M.a.z * M.b.y;
    this.b.x = M.b.z * M.c.x - M.b.x * M.c.z;
    this.b.y = M.a.x * M.c.z - M.a.z * M.c.x;
    this.b.z = M.a.z * M.b.x - M.a.x * M.b.z;
    this.c.x = M.b.x * M.c.y - M.b.y * M.c.x;
    this.c.y = M.a.y * M.c.x - M.a.x * M.c.y;
    this.c.z = M.a.x * M.b.y - M.a.y * M.b.x;
},
adjoint_to:function( Mout ){ Mout.set_adjoint(this); },

// ======= Rotation

rotate_csa:function( ca, sa, uaxis ){
    this.a.rotate_csa( ca, sa, uaxis );
    this.b.rotate_csa( ca, sa, uaxis );
    this.c.rotate_csa( ca, sa, uaxis );
},
rotate:function( angle, axis  ){
    //VEC uaxis;
    //uaxis.set( axis * axis.norm() );
    axis.normalize();
    let ca   = Math.cos(angle);
    let sa   = Math.sin(angle);
    this.rotate_csa( ca, sa, axis );
},

dRotateToward:function (){
    var ax = new Vec3();
    return dRotateToward( pivot, rot0, dPhi ){
        let piv  = this.get(pivot);
        let piv0 = rot0.get(pivot);
        ax.set_cross(piv,piv0);
        let sa = ax.norm();
        if( sa > dPhi ){
            ax.mul(1.0/sa);
            //Vec2d csa; csa.fromAngle( dPhi );
            let ca = Math.cos(dPhi);
            let sa = Math.sin(dPhi);
            rotate_csa( ca, sa, ax );
        }else{
            set(rot0);
        }
    }
}(),

// ==== generation

fromDirUp:function( dir, up ){
    // make orthonormal rotation matrix c=dir; b=(up-<b|c>c)/|b|; a=(c x b)/|a|;
    c.set(dir);
    //c.normalize(); // we assume dir is already normalized
    b.set(up);
    b.add_mul( c, -b.dot(c) );   //
    b.normalize();
    a.set_cross(b,c);
    //a.normalize(); // we don't need this since b,c are orthonormal
},

fromSideUp:function( side, up ){
    // make orthonormal rotation matrix c=dir; b=(up-<b|c>c)/|b|; a=(c x b)/|a|;
    a.set(side);
    //c.normalize(); // we assume dir is already normalized
    b.set(up);
    b.add_mul( a, -b.dot(a) );   //
    b.normalize();
    c.set_cross(b,a);
    //a.normalize(); // we don't need this since b,c are orthonormal
},

fromEuler:function( phi, theta, psi ){
    // http://mathworld.wolfram.com/EulerAngles.html
    let ca=1,sa=0, cb=1,sb=0, cc=1,sc=0;
    ca=cos(phi);   sa=sin(phi);
    cb=cos(theta); sb=sin(theta);
    cc=cos(psi);   sc=sin(psi);
    this.a.x =  cc*ca-cb*sa*sc;
    this.a.y =  cc*sa+cb*ca*sc;
    this.a.z =  sc*sb;
    this.c.x = -sc*ca-cb*sa*cc;
    this.c.y = -sc*sa+cb*ca*cc;
    this.c.z =  cc*sb;
    this.b.x =  sb*sa;
    this.b.y = -sb*ca;
    this.b.z =  cb;
},

// http://www.realtimerendering.com/resources/GraphicsGems/gemsiii/rand_rotation.c
// http://www.realtimerendering.com/resources/GraphicsGems/gemsiii/rand_rotation.c
// http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.53.1357&rep=rep1&type=pdf
 //  RAND _ ROTATION   Author: Jim Arvo, 1991
 //  This routine maps three values (x[0], x[1], x[2]) in the range [0,1]
 //  into a 3x3 rotation matrix, M.  Uniformly distributed random variables
 //  x0, x1, and x2 create uniformly distributed random rotation matrices.
 //  To create small uniformly distributed "perturbations", supply
 //  samples in the following ranges
 //      x[0] in [ 0, d ]
 //      x[1] in [ 0, 1 ]
 //      x[2] in [ 0, d ]
 // where 0 < d < 1 controls the size of the perturbation.  Any of the
 // random variables may be stratified (or "jittered") for a slightly more
 // even distribution.
 //=========================================================================
fromRand:function( vrand  ){
    let theta = vrand.x * M_TWO_PI; // Rotation about the pole (Z).
    let phi   = vrand.y * M_TWO_PI; // For direction of pole deflection.
    let z     = vrand.z * 2.0;      // For magnitude of pole deflection.
    // Compute a vector V used for distributing points over the sphere
    // via the reflection I - V Transpose(V).  This formulation of V
    // will guarantee that if x[1] and x[2] are uniformly distributed,
    // the reflected points will be uniform on the sphere.  Note that V
    // has length sqrt(2) to eliminate the 2 in the Householder matrix.
    let r  = sqrt( z );
    let Vx = sin ( phi ) * r;
    let Vy = cos ( phi ) * r;
    let Vz = sqrt( 2.0 - z );
    // Compute the row vector S = Transpose(V) * R, where R is a simple
    // rotation by theta about the z-axis.  No need to compute Sz since
    // it's just Vz.
    let st = sin( theta );
    let ct = cos( theta );
    let Sx = Vx * ct - Vy * st;
    let Sy = Vx * st + Vy * ct;
    // Construct the rotation matrix  ( V Transpose(V) - I ) R, which
    // is equivalent to V S - R.
    this.a.x = Vx * Sx - ct;   this.a.y = Vx * Sy - st;   this.a.z = Vx * Vz;
    this.b.x = Vy * Sx + st;   this.b.y = Vy * Sy - ct;   this.b.z = Vy * Vz;
    this.c.x = Vz * Sx;        this.c.y = Vz * Sy;        this.c.z = 1.0 - z;   // This equals Vz * Vz - 1.0
},

// took from here
// Smith, Oliver K. (April 1961), "Eigenvalues of a symmetric 3 × 3 matrix.", Communications of the ACM 4 (4): 168
// http://www.geometrictools.com/Documentation/EigenSymmetric3x3.pdf
// https://www.geometrictools.com/GTEngine/Include/Mathematics/GteSymmetricEigensolver3x3.h
eigenvals:function( eVals ){
    let inv3  = 0.33333333333;
    let root3 = 1.73205080757;
    //let amax = array[0];
    //for(let i=1; i<9; i++){ 
    //    double a=array[i]; if(a>amax)amax=a; 
    //}
    let amax = this.normAbsMax();
    let c0 = this.a.x*this.b.y*this.c.z + 2*this.a.y*this.a.z*this.b.z -  this.a.x*this.b.z*this.b.z   - this.b.y*this.a.z*this.a.z   -  this.c.z*this.a.y*this.a.y;
    let c1 = this.a.x*this.b.y - this.a.y*this.a.y + this.a.x*this.z.z - this.a.z*this.a.z + this.b.y*this.c.z - this.b.z*this.b.z;
    let c2 = this.a.x + this.b.y + this.c.z;
    let amax2 = amax*amax; c2/=amax; c1/=amax2; c0/=(amax2*amax);
    let c2Div3 = c2*inv3;
    let aDiv3  = (c1 - c2*c2Div3)*inv3;
    if (aDiv3 > 0.0) aDiv3 = 0.0;
    let mbDiv2 = 0.5*( c0 + c2Div3*(2.0*c2Div3*c2Div3 - c1) );
    let q = mbDiv2*mbDiv2 + aDiv3*aDiv3*aDiv3;
    if (q > 0.0) q = 0.0;
    let magnitude = sqrt(-aDiv3);
    let angle = Math.atan2( Math.sqrt(-q), mbDiv2 ) * inv3;
    let cs    = Math.cos(angle);
    let sn    = Math.sin(angle);
    eVals.a = amax*( c2Div3 + 2.0*magnitude*cs );
    eVals.b = amax*( c2Div3 - magnitude*(cs + root3*sn) );
    eVals.c = amax*( c2Div3 - magnitude*(cs - root3*sn) );
},

eigenvec:function(){
    var row0=new Vec3(),row0=new Vec3(),row0=new Vec3();
    var r0xr1=new Vec3(),r0xr2=new Vec3(),r1xr2=new Vec3();
    return function( eVals, eVecs ){
        row0.set( ax - eVals, ay, az );
        row1.set( bx, by - eVals, bz );
        row2.set( cx, cy,  cz- eVals );
        r0xr1.set_cross(row0, row1);
        r0xr2.set_cross(row0, row2);
        r1xr2.set_cross(row1, row2);
        let d0 = r0xr1.dot( r0xr1);
        let d1 = r0xr2.dot( r0xr2);
        let d2 = r1xr2.dot( r1xr2);
        let dmax = d0; 
        let imax = 0;
        if (d1 > dmax) { dmax = d1; imax = 1; }
        if (d2 > dmax) { imax = 2;            }
        if      (imax == 0) { eVecs.set_mul( r0xr1, 1/Math.sqrt(d0) ); }
        else if (imax == 1) { eVecs.set_mul( r0xr2, 1/Math.sqrt(d1) ); }
        else                { eVecs.set_mul( r1xr2, 1/Math.sqrt(d2) ); }
    }
}(),

toString(){ return a.toString() +"\n"+ b.toString() +"\n"+ c.toString();  },
toStringOrtho(){ return a.norm2()+" "+b.norm2()+" "+c.norm2()   +"    "+   a.dot(b)+" "+a.dot(c)+" "+b.dot(c); }

};

var Mat3Identity = Mat();