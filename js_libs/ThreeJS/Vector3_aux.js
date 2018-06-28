"use strict"

var Vec3 = THREE.Vector3;
var Vec2 = THREE.Vector2;

Vec3.prototype.xy = function() { return new Vec2(x,y); };
Vec3.prototype.xz = function() { return new Vec2(x,z); };
Vec3.prototype.yz = function() { return new Vec2(x,y); };
Vec3.prototype.yx = function() { return new Vec2(x,y); };
Vec3.prototype.zx = function() { return new Vec2(x,z); };
Vec3.prototype.zy = function() { return new Vec2(x,y); };

THREE.toVec3 = function( v ){
    if( v.isVector3 ){
        return v;
    }else{
        return new Vec3(v[0],v[1],v[2]);
    }
}

THREE.Array2Vec3 = function(arr){
    return new Vec3(arr[0],arr[1],arr[2]);
}

THREE.Array2Vec3s = function(arr){
    let arr_ = [];
    for(let i=0; i<arr.length; i++){
        arr_.push( THREE.Array2Vec3(arr[i] ) );
    }
    return arr_;
}

THREE.Vec3toArray = function(v){
    return [v.x,v.y,v.z];
}

THREE.Vec3toArrays = function(vs){
    let vs_ = [];
    for(let i=0; i<vs.length; i++){
        vs_.push( THREE.Vec3toArray(vs[i]) );
    }
    return vs_;
}

//    inline void add( TYPE f ) { x+=f; y+=f; z+=f; };
//    inline void mul( TYPE f ) { x*=f; y*=f; z*=f; };

//    inline void add( const VEC&  v ) { x+=v.x; y+=v.y; z+=v.z; };
//    inline void sub( const VEC&  v ) { x-=v.x; y-=v.y; z-=v.z; };

//Vec3.prototype.mul  = function( v ) { this.x*=v.x; this.y*=v.y; this.z*=v.z; }else{ this.x*=v; this.y*=v; this.z*=v; } };
//Vec3.prototype.div  = function( v ) { this.x/=v.x; this.y/=v.y; this.z/=v.z; }else{ this.x/=v; this.y/=v; this.z/=v; } };

Vec3.prototype.setf   = function( f       ) { this.x=f;      this.y=f;      this.z=f;      };
//Vec3.prototype.set    = function( x, y, z ) { this.x=x;      this.y=y;      this.z=z;      }; 
Vec3.prototype.setv   = function( v       ) { this.x=v.x;    this.y=v.y;    this.z=v.z;    };
Vec3.prototype.setArr = function( arr     ) { this.x=arr[0]; this.y=arr[1]; this.z=arr[2]; };

//Vec3.prototype.mul  = function( v ) { this.x*=v.x; this.y*=v.y; this.z*=v.z; };
//Vec3.prototype.div  = function( v ) { this.x/=v.x; this.y/=v.y; this.z/=v.z; };
Vec3.prototype.mulf = function( v ) { this.x*=v; this.y*=v; this.z*=v; };
Vec3.prototype.divf = function( v ) { this.x/=v; this.y/=v; this.z/=v; };

Vec3.prototype.set_inv   = function( v       ){ this.x=1/v.x;     this.y=1/v.y;     this.z=1/v.z; };
Vec3.prototype.set_addf  = function( a, f    ){ this.x=a.x+f;     this.y=a.y+f;     this.z=a.z+f; };
Vec3.prototype.set_mulf  = function( a, f    ){ this.x=a.x*f;     this.y=a.y*f;     this.z=a.z*f; };
Vec3.prototype.set_mul   = function( a, b    ){ this.x=a.x*b.x;   this.y=a.y*b.y;   this.z=a.z*b.z; };
Vec3.prototype.set_mulvf = function( a, b, f ){ this.x=a.x*b.x*f; this.y=a.y*b.y*f; this.z=a.z*b.z*f; };

Vec3.prototype.set_add = function( a, b ){ this.x=a.x+b.x; this.y=a.y+b.y; this.z=a.z+b.z; };
Vec3.prototype.set_sub = function( a, b ){ this.x=a.x-b.x; this.y=a.y-b.y; this.z=a.z-b.z; };
Vec3.prototype.set_mul = function( a, b ){ this.x=a.x*b.x; this.y=a.y*b.y; this.z=a.z*b.z; };
Vec3.prototype.set_div = function( a, b ){ this.x=a.x/b.x; this.y=a.y/b.y; this.z=a.z/b.z; };

Vec3.prototype.add_mul = function( a, f ){ this.x+=a.x*f;    this.y+=a.y*f;   this.z+=a.z*f;   };
Vec3.prototype.add_mul = function( a, b ){ this.x+=a.x*b.x;  this.y+=a.y*b.y; this.z+=a.z*b.z; };
Vec3.prototype.sub_mul = function( a, b ){ this.x-=a.x*b.x;  this.y-=a.y*b.y; this.z-=a.z*b.z; };

Vec3.prototype.set_add_mul = function( a, b, f ){ this.x= a.x + f*b.x;     this.y= a.y + f*b.y;     this.z= a.z + f*b.z;  };

Vec3.prototype.set_lincomb2f = function( fa, a, fb, b ){ this.x = fa*a.x + fb*b.x;  this.y = fa*a.y + fb*b.y;  this.z = fa*a.z + fb*b.z; };
Vec3.prototype.add_lincomb2f = function( fa, a, fb, b ){ this.x+= fa*a.x + fb*b.x;  this.y+= fa*a.y + fb*b.y;  this.z+= fa*a.z + fb*b.z; };

Vec3.prototype.set_lincomb3f = function( fa, fb, fc, a, b, c ){ this.x = fa*a.x + fb*b.x + fc*c.x;  this.y = fa*a.y + fb*b.y + fc*c.y;  this.z = fa*a.z + fb*b.z + fc*c.z; };
Vec3.prototype.add_lincomb3f = function( fa, fb, fc, a, b, c ){ this.x+= fa*a.x + fb*b.x + fc*c.x;  this.y+= fa*a.y + fb*b.y + fc*c.y;  this.z+= fa*a.z + fb*b.z + fc*c.z; };

Vec3.prototype.set_lincombv = function( fs, a, b, c ){ this.x = fs.a*a.x + fs.b*b.x + fs.c*c.x;  this.y = fs.a*a.y + fs.b*b.y + fs.c*c.y;  this.z = fs.a*a.z + fs.b*b.z + fs.c*c.z; };
Vec3.prototype.add_lincombv = function( fs, a, b, c ){ this.x+= fs.a*a.x + fs.b*b.x + fs.c*c.x;  this.y+= fs.a*a.y + fs.b*b.y + fs.c*c.y;  this.z+= fs.a*a.z + fs.b*b.z + fs.c*c.z; };


Vec3.prototype.set_cross = function( a, b ){ this.x =a.y*b.z-a.z*b.y; this.y =a.z*b.x-a.x*b.z; this.z =a.x*b.y-a.y*b.x; };
Vec3.prototype.add_cross = function( a, b ){ this.x+=a.y*b.z-a.z*b.y; this.y+=a.z*b.x-a.x*b.z; this.z+=a.x*b.y-a.y*b.x; };

Vec3.prototype.makeOrthoU = function( a ){ let c = this.dot(a);          this.add_mul(a, -c); return c; }
Vec3.prototype.makeOrtho  = function( a ){ let c = this.dot(a)/a.norm(); this.add_mul(a, -c); return c; }

//inline VEC operator+ ( f   ) const { VEC vo; vo.x=x+f; vo.y=y+f; vo.z=z+f; return vo; };
//inline VEC operator* ( f   ) const { VEC vo; vo.x=x*f; vo.y=y*f; vo.z=z*f; return vo; };
//inline VEC operator+ ( vi ) const { VEC vo; vo.x=x+vi.x; vo.y=y+vi.y; vo.z=z+vi.z; return vo; };
//inline VEC operator- ( vi ) const { VEC vo; vo.x=x-vi.x; vo.y=y-vi.y; vo.z=z-vi.z; return vo; };
//inline VEC operator* ( vi ) const { VEC vo; vo.x=x*vi.x; vo.y=y*vi.y; vo.z=z*vi.z; return vo; };
//inline VEC operator/ ( vi ) const { VEC vo; vo.x=x/vi.x; vo.y=y/vi.y; vo.z=z/vi.z; return vo; };

//inline TYPE dot  ( a ) const { return x*a.x + y*a.y + z*a.z;  };
Vec3.prototype.norm2 = function( ){ return this.x*this.x + this.y*this.y + this.z*this.z;        };
Vec3.prototype.norm = function( ){ return Math.sqrt( this.norm2() ); };


Vec3.prototype.normalize_r = function() {
    let norm  = this.norm();
    let inVnorm = 1.0/norm;
    this.x *= inVnorm;    this.y *= inVnorm;    this.z *= inVnorm;
    return norm;
}

/*
Vec3.prototype.normalize = function() {
    let norm  = this.norm();
    TYPE inVnorm = 1.0d/norm;
    x *= inVnorm;    y *= inVnorm;    z *= inVnorm;
    return norm;
}
Vec3.prototype.normalized = function() {
    VEC v; v.set(*this);
    v.normalize();
    return v;
}
*/

Vec3.prototype.getOrtho = function(){
    //var up = new Vec3();
    return function getOrtho( up, out ){
        up.makeOrthoU(this); 
        up.normalize();
        out.set_cross(this,up);
        return out;
    };
}();

Vec3.prototype.getSomeOrtho = function( v1, v2 ){
    let x=this.x, y=this.y, z=this.z;
    if(this.x<this.y){
        v1.x =  -y*y -z*z;
        v1.y =  x*y;
        v1.z =  x*z;
    }else{
        v1.x =  y*x;
        v1.y =  -z*z -x*x;
        v1.z =  y*z;
    }
    v2.x = y*v1.z - z*v1.y;
    v2.y = z*v1.x - x*v1.z;
    v2.z = x*v1.y - y*v1.x;
}

Vec3.prototype.rotate_csa = function( ca, sa, uaxis ){
    let cu  = (1-ca)*dot(uaxis);
    let utx = uaxis.y*this.z - uaxis.z*this.y;
    let uty = uaxis.z*this.x - uaxis.x*this.z;
    let utz = uaxis.x*this.y - uaxis.y*this.x;
    let x   = ca*x + sa*utx + cu*uaxis.x;
    let y   = ca*y + sa*uty + cu*uaxis.y;
    this.z  = ca*z + sa*utz + cu*uaxis.z;
    this.x  = x; this.y = y;
};

// Rodrigues rotation formula: v' = cosa*v + sina*(uaxis X v) + (1-cosa)*(uaxis . v)*uaxis
Vec3.prototype.rotate = function(){
    var uaxis = new Vec3();
    return function rotate( angle, axis ){
        uaxis.set_mulf( axis, axis.norm() );
        let ca   = Math.cos(angle);
        let sa   = Math.sin(angle);
        rotate_csa( ca, sa, uaxis );
    };
}();

Vec3.prototype.rotateTo = function(){
    var ax = new Vec3(); 
    return function rotateTo( rot0, coef ){
        //rot.add_mul( rot0, coef ); rot.normalize();
        ax.set_cross( this, rot0 );
        let sa2 = ax.norm2();
        if( sa2 < coef*coef ){
            ax.mul( 1/sqrt(sa2) ); // this is safe if coef is large enough
            let ca = sqrt( 1-coef*coef );
            rotate_csa( ca, coef, ax );
        }else{
            set(rot0);
        }
    }
}();

Vec3.prototype.getInPlaneRotation = function( rot0, xhat, yhat, ca, sa ){
    let x0 = rot0.dot(xhat);
    let y0 = rot0.dot(yhat);
    let x_ = dot(xhat);
    let y_ = dot(yhat);
    // http://mathworld.wolfram.com/ComplexDivision.html
    let renorm = 1.0/sqrt( (x0*x0 + y0*y0)*(x_*x_ + y_*y_) );
    ca = ( x0*x_ + y0*y_ ) * renorm;
    sa = ( y0*x_ - x0*y_ ) * renorm;
}

/*
Vec3.prototype.along_hat = function(){
    var ap = new Vec3();
    return function along_hat( hat, p ){ 
        ap.set( p.x-x, p.y-y ); return hat.dot( ap ); 
    }
}();
*/

Vec3.prototype.along_hat = function( hat, p ){ 
    let x = p.x-this.x, y = p.y-this.y, z = p.z-this.z;
    return hat.x*x + hat.y*y + hat.z*z; 
}

/*
Vec3.prototype.along  = function(){ 
    var ab = new Vec3();
    var ap = new Vec3();
    return function( b,   p ){
        ab.set( b.x - this.x, b.y - this.y, b.z - this.z ); // TODO: can be optimized
        ap.set( p.x - this.x, p.y - this.y, b.z - this.z );
        return ab.dot(ap) / ab.norm(ab);
    }
}();
*/

Vec3.prototype.along = function( b, p ){
    let abx = b.x - this.x,  aby = b.y - this.y, abz = b.z - this.z; 
    let apx = p.x - this.x,  apy = p.y - this.y, apz = p.z - this.z; 
    return (abx*abx + aby*aby + abz*abz)/(apx*apx + apy*apy + apz*apz);
}

Vec3.prototype.isLower   = function( vmax ) { return (this.x<vmax.x)&&(this.y<vmax.y)&&(this.x<vmax.z); }
Vec3.prototype.isGreater = function( vmin ) { return (this.x>vmin.x)&&(this.y>vmin.y)&&(this.x>vmin.z); }
Vec3.prototype.isBetween = function( vmin, vmax ) { return (this.x>vmin.x)&&(this.x<vmax.x)&&(this.y>vmin.y)&&(this.y<vmax.y)&&(this.z>vmin.z)&&(this.z<vmax.z); }

Vec3.prototype.setIfLower   = function(a){ if(a.x<this.x)this.x=a.x; if(a.y<this.y)this.y=a.y; if(a.z<this.z)this.z=a.z; }
Vec3.prototype.setIfGreater = function(a){ if(a.x>this.x)this.x=a.x; if(a.y>this.y)this.y=a.y; if(a.z>this.z)this.z=a.z; }
//inline VEC min(VEC a){ return {fmin(x,a.x),fmin(y,a.y),fmin(z,a.z)}; };
//inline VEC max(VEC a){ return {fmax(x,a.x),fmax(y,a.y),fmax(z,a.z)}; };
//inline VEC set_min(VEC a,VEC b){ return {fmin(x,a.x),fmin(y,a.y),fmin(z,a.z)}; };
//inline VEC set_max(VEC a,VEC b){ return {fmax(x,a.x),fmax(y,a.y),fmax(z,a.z)}; };

Vec3.prototype.dist2 = function( a ) { 
    //VEC d; d.set( x-a.x, y-a.y, z-a.z ); return d.norm2();
    let dx = this.x-a.x, dy = this.y-a.y, dz = this.z-a.z;
    return dx*dx + dy*dy + dz*dz;
}
Vec3.prototype.dist  = function( a ) { Math.sqrt(dist2()); }

Vec3.prototype.totprod = function(){ return this.x*this.y*this.z; };

Vec3.prototype.angleInPlane = function( a, b ){
    let x = dot(a);
    let y = dot(b);
    return atan2( y, x );
}

Vec3.prototype.fromLinearSolution = function( va, vb, vc, p ){
    // https://en.wikipedia.org/wiki/Cramer%27s_rule
    // 30 multiplications
    let Dax = vb.y*vc.z - vb.z*vc.y;
    let Day = vb.x*vc.z - vb.z*vc.x;
    let Daz = vb.x*vc.y - vb.y*vc.x;
    let idet = 1/( va.x*Dax - va.y*Day + va.z*Daz );
    this.x =  idet*( p.x*Dax - p.y*Day + p.z*Daz );
    this.y = -idet*( p.x*(va.y*vc.z - va.z*vc.y) - p.y*(va.x*vc.z - va.z*vc.x) + p.z*(va.x*vc.y - va.y*vc.x) );
    this.z =  idet*( p.x*(va.y*vb.z - va.z*vb.y) - p.y*(va.x*vb.z - va.z*vb.x) + p.z*(va.x*vb.y - va.y*vb.x) );
}

Vec3.prototype.average = function( n, vs, out ){
    out.set(0.0);
    for(let i=0; i<n; i++){ out.add(vs[i]); }
    out.mul( 1.0/n );
    return out;
}

Vec3.prototype.average = function( n, selection, vs, out ){
    out.set(0.0);
    for(let i=0; i<n; i++){ v.add(vs[selection[i]]); }
    v.mul( 1/n );
    return v;
}

//template<typename VEC> inline VEC cross( VEC a, VEC b ){ return (VEC){ a.y*b.z-a.z*b.y, a.z*b.x-a.x*b.z, a.x*b.y-a.y*b.x }; }
//template<typename VEC> inline VEC add  ( VEC a, VEC b ){ return (VEC){ a.x+b.x, a.z+b.z, a.z+b.z }; }

var Vec3Zero = new Vec3(0.0, 0.0, 0.0);
var Vec3X    = new Vec3(1.0, 0.0, 0.0);
var Vec3Y    = new Vec3(0.0, 1.0, 0.0);
var Vec3Z    = new Vec3(0.0, 0.0, 1.0);




