
"use strict"

var Vec2 = THREE.Vector2;

Vec2.prototype.setf = function( f     ) { x=f;   y=f;   };
Vec2.prototype.set    = function( x, y  ) { x=fx;  y=fy;  };
Vec2.prototype.setv   = function( v     ) { x=v.x; y=v.y; };
Vec2.prototype.setArr = function( arr   ) { x=arr[0]; y=arr[1]; };

Vec2.prototype.add = function( f ) { x+=f; y+=f; };
Vec2.prototype.mul = function( f ) { x*=f; y*=f; };

Vec2.prototype.add = function( v ) { x+=v.x; y+=v.y; };
Vec2.prototype.sub = function( v ) { x-=v.x; y-=v.y; };
Vec2.prototype.mul = function( v ) { x*=v.x; y*=v.y; };
Vec2.prototype.div = function( v ) { x/=v.x; y/=v.y; };

Vec2.prototype.add = function( x, y) { x+=fx; y+=fy; };
Vec2.prototype.sub = function( x, y) { x-=fx; y-=fy; };
Vec2.prototype.mul = function( x, y ) { x*=fx; y*=fy; };
Vec2.prototype.div = function( x, y ) { x/=fx; y/=fy; };

Vec2.prototype.set_inv = function( v ) { x=1/v.x; y=1/v.y; };

Vec2.prototype.set_add = function( a, f ){ x=a.x+f; y=a.y+f; };
Vec2.prototype.set_mul = function( a, f ){ x=a.x*f; y=a.y*f; };
Vec2.prototype.set_mul = function( a, b, f ){ x=a.x*b.x*f; y=a.y*b.y*f; };

Vec2.prototype.set_add = function( a, b ){ x=a.x+b.x; y=a.y+b.y; };
Vec2.prototype.set_sub = function( a, b ){ x=a.x-b.x; y=a.y-b.y; };
Vec2.prototype.set_mul = function( a, b ){ x=a.x*b.x; y=a.y*b.y; };
Vec2.prototype.set_div = function( a, b ){ x=a.x/b.x; y=a.y/b.y; };

Vec2.prototype.add_mul = function( a, f     ){ x+=a.x*f;     y+=a.y*f;     };
Vec2.prototype.add_mul = function( a, b     ){ x+=a.x*b.x;   y+=a.y*b.y;   };
Vec2.prototype.sub_mul = function( a, b     ){ x-=a.x*b.x;   y-=a.y*b.y;   };
Vec2.prototype.add_mul = function( a, b, f  ){ x+=a.x*b.x*f; y+=a.y*b.y*f; };

Vec2.prototype.set_add_mul = function( a, b, f ){ x= a.x + f*b.x;     y= a.y + f*b.y; };

Vec2.prototype.set_lincomb = function( fa, a, fb, b ){ x = fa*a.x + fb*b.x;  y = fa*a.y + fb*b.y; };
Vec2.prototype.add_lincomb = function( fa, a, fb, b ){ x+= fa*a.x + fb*b.x;  y+= fa*a.y + fb*b.y; };

Vec2.prototype.set_lincomb = function( fa, fb, fc, a, b, c ){ x = fa*a.x + fb*b.x + fc*c.x;  y = fa*a.y + fb*b.y + fc*c.y; };
Vec2.prototype.add_lincomb = function( fa, fb, fc, a, b, c ){ x+= fa*a.x + fb*b.x + fc*c.x;  y+= fa*a.y + fb*b.y + fc*c.y; };

Vec2.prototype.dot       = function( a ) { return x*a.x + y*a.y; };
Vec2.prototype.dot_perp  = function( a ) { return y*a.x - x*a.y; };
Vec2.prototype.norm2     = function(   ) { return x*x + y*y;     };

Vec2.prototype.norm      = function() { return  sqrt( x*x + y*y ); };
Vec2.prototype.normalize = function() {
    let norm  = sqrt( x*x + y*y );
    let inVnorm = 1.0/norm;
    x *= inVnorm;    y *= inVnorm;
    return norm;
};

Vec2.prototype.dist2 = function( a ) { let dx = x-a.x; let dy = y-a.y; return dx*dx + dy*dy; }
Vec2.prototype.dist  = function( a ) { return sqrt( dist2(a) ); }

Vec2.prototype.makePerpUni = function( a ) { let cdot=x*a.x+y*a.y; x-=a.x*cdot; y-=a.y*cdot; return cdot; }

Vec2.prototype.set_perp = function( a ) { x=-a.y; y=a.x; }
Vec2.prototype.cross    = function( a ) { return x*a.y - y*a.x; };

Vec2.prototype.isBetweenRotations = function( a, b ){ return (cross(a)<0)&&(cross(b)>0);  }

Vec2.prototype.    mul_cmplx  = function(    b ){                     let x_ =    x*b.x -   y*b.y;       y =    y*b.x +   x*b.y;       x=x_;  }
Vec2.prototype.pre_mul_cmplx  = function( a    ){                     let x_ =  a.x*  x - a.y*  y;       y =  a.y*  x + a.x*  y;       x=x_;  }
Vec2.prototype.set_mul_cmplx  = function( a, b ){                     let x_ =  a.x*b.x - a.y*b.y;       y =  a.y*b.x + a.x*b.y;       x=x_;  }
Vec2.prototype.set_udiv_cmplx = function( a, b ){                         x_ =  a.x*b.x + a.y*b.y;       y =  a.y*b.x - a.x*b.y;       x=x_;  }
Vec2.prototype.set_div_cmplx  = function( a, b ){ let ir2 = 1/b.norm2();  x_ = (a.x*b.x + a.y*b.y)*ir2;  y = (a.y*b.x - a.x*b.y)*ir2;  x=x_;  }

Vec2.prototype.fromAngle         = function( phi ){	x = cos( phi );	y = sin( phi );	    }
Vec2.prototype.fromAngle_taylor2 = function( phi ){	sincos_taylor2( phi, y, x );	}
Vec2.prototype.fromCos           = function( ca  ){  x=ca; y=sqrt(1-ca*ca); }
Vec2.prototype.fromSin           = function( sa  ){  y=sa; x=sqrt(1-sa*sa); }

Vec2.prototype.rotate = function( phi ) = function{
    let bx = cos( phi );   		  TYPE by = sin( phi );
    let x_ =    x*bx -   y*by;         y =    y*bx +   x*by;       x=x_;
}

Vec2.prototype.rotate_taylor2 = function( phi ){
    let bx,by;  sincos_taylor2( phi, by, bx );
    let x_ =    x*bx -   y*by;         y =    y*bx +   x*by;       x=x_;
}

Vec2.prototype.along_hat = function( hat, p ){ VEC ap; ap.set( p.x-x, p.y-y ); return hat.dot( ap ); }
Vec2.prototype.along     = function( b,   p ){
    VEC ab,ap;
    ab.set( b.x - x, b.y - y );
    ap.set( p.x - x, p.y - y );
    return ab.dot(ap) / ab.norm(ab);
}

Vec2.prototype.angle = function( a ){
    let d = cdot ( a );
    let c = cross( a );
    return atan2( d, c );
}

Vec2.prototype.totprod = function(){ return x*y; }

// === static functions:
/*
Vec2.prototype.dot       = function( a, b ){ return a.x*b.y - a.y*b.x; };
Vec2.prototype.cross     = function( a, b ){ return a.x*b.x + a.y*b.y ; };
Vec2.prototype.mul_cmplx = function( a, b ){ return (VEC){ a.x*b.x-a.y*b.y, a.y*b.x+a.x*b.y };  }
*/

var Vec2Zero = Vec2f(0.0,0.0);
var Vec2X    = Vec2f(1.0,0.0);
var Vec2Y    = Vec2f(0.0,1.0);
