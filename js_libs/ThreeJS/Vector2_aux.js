
"use strict"

var Vec2 = THREE.Vector2;

Vec2.prototype.setf   = function( f     ) { this.x=f;      this.y=f;   };
Vec2.prototype.set2f  = function( x, y  ) { this.x=fx;     this.y=fy;  };
//Vec2.prototype.set    = function( v     ) { this.x=v.x;    this.y=v.y; };
Vec2.prototype.setArr = function( arr   ) { this.x=arr[0]; this.y=arr[1]; };

Vec2.prototype.addf = function( f ) { this.x+=f; this.y+=f; };
Vec2.prototype.mulf = function( f ) { this.x*=f; this.y*=f; };

Vec2.prototype.add = function( v ) { this.x+=v.x; this.y+=v.y; };
//Vec2.prototype.sub = function( v ) { this.x-=v.x; this.y-=v.y; };
//Vec2.prototype.mul = function( v ) { this.x*=v.x; this.y*=v.y; };
//Vec2.prototype.div = function( v ) { this.x/=v.x; this.y/=v.y; };

Vec2.prototype.add2f = function( x, y ) { this.x+=x; this.y+=y; };
Vec2.prototype.sub2f = function( x, y ) { this.x-=x; this.y-=y; };
Vec2.prototype.mul2f = function( x, y ) { this.x*=x; this.y*=y; };
Vec2.prototype.div2f = function( x, y ) { this.x/=x; this.y/=y; };


Vec2.prototype.set_inv = function( v ) { this.x=1/v.x; this.y=1/v.y; };

Vec2.prototype.set_add = function( a, f ){ this.x=a.x+f; this.y=a.y+f; };
Vec2.prototype.set_mul = function( a, f ){ this.x=a.x*f; this.y=a.y*f; };
Vec2.prototype.set_mul = function( a, b, f ){ this.x=a.x*b.x*f; this.y=a.y*b.y*f; };

Vec2.prototype.set_add = function( a, b ){ this.x=a.x+b.x; this.y=a.y+b.y; };
Vec2.prototype.set_sub = function( a, b ){ this.x=a.x-b.x; this.y=a.y-b.y; };
Vec2.prototype.set_mul = function( a, b ){ this.x=a.x*b.x; this.y=a.y*b.y; };
Vec2.prototype.set_div = function( a, b ){ this.x=a.x/b.x; this.y=a.y/b.y; };

Vec2.prototype.add_mul = function( a, f     ){ this.x+=a.x*f;     this.y+=a.y*f;     };
Vec2.prototype.add_mul = function( a, b     ){ this.x+=a.x*b.x;   this.y+=a.y*b.y;   };
Vec2.prototype.sub_mul = function( a, b     ){ this.x-=a.x*b.x;   this.y-=a.y*b.y;   };
Vec2.prototype.add_mul = function( a, b, f  ){ this.x+=a.x*b.x*f; this.y+=a.y*b.y*f; };

Vec2.prototype.set_add_mul = function( a, b, f ){ this.x= a.x + f*b.x;     this.y= a.y + f*b.y; };

Vec2.prototype.set_lincomb = function( fa, a, fb, b ){ this.x = fa*a.x + fb*b.x;  this.y = fa*a.y + fb*b.y; };
Vec2.prototype.add_lincomb = function( fa, a, fb, b ){ this.x+= fa*a.x + fb*b.x;  this.y+= fa*a.y + fb*b.y; };

Vec2.prototype.set_lincomb = function( fa, fb, fc, a, b, c ){ this.x = fa*a.x + fb*b.x + fc*c.x;  this.y = fa*a.y + fb*b.y + fc*c.y; };
Vec2.prototype.add_lincomb = function( fa, fb, fc, a, b, c ){ this.x+= fa*a.x + fb*b.x + fc*c.x;  this.y+= fa*a.y + fb*b.y + fc*c.y; };

Vec2.prototype.dot       = function( a ) { return this.x*a.x + y*a.y; };
Vec2.prototype.dot_perp  = function( a ) { return this.y*a.x - x*a.y; };
Vec2.prototype.norm2     = function(   ) { return this.x*this.x + this.y*this.y;     };

Vec2.prototype.norm      = function() { return  Math.sqrt( this.x*this.x + this.y*this.y ); };
Vec2.prototype.normalize = function() {
    let r  = this.norm();
    let inVnorm = 1.0/r;
    this.x *= inVnorm;    this.y *= inVnorm;
    return r;
};

Vec2.prototype.dist2 = function( a ) { let dx = this.x-a.x; let dy = this.y-a.y; return dx*dx + dy*dy; }
Vec2.prototype.dist  = function( a ) { return Math.sqrt( this.dist2(a) ); }

Vec2.prototype.makePerpUni = function( a ) { let cdot=this.x*a.x+this.y*a.y; this.x-=a.x*cdot; this.y-=a.y*cdot; return cdot; }

Vec2.prototype.set_perp = function( a ) { this.x=-a.y; this.y=a.x; }
Vec2.prototype.cross    = function( a ) { return this.x*a.y - this.y*a.x; };

Vec2.prototype.isBetweenRotations = function( a, b ){ return (this.cross(a)<0)&&(this.cross(b)>0);  }

Vec2.prototype.    mul_cmplx  = function(    b ){                        let x_ =  this.x*b.x - this.y*b.y;       this.y =  this.y*b.x + this.x*b.y;       this.x=x_;  }
Vec2.prototype.pre_mul_cmplx  = function( a    ){                        let x_ =  a.x*this.x - a.y*this.y;       this.y =  a.y*this.x + a.x*this.y;       this.x=x_;  }
Vec2.prototype.set_mul_cmplx  = function( a, b ){                        let x_ =  a.x*b.x - a.y*b.y;       this.y =  a.y*b.x + a.x*b.y;       this.x=x_;  }
Vec2.prototype.set_udiv_cmplx = function( a, b ){                        let x_ =  a.x*b.x + a.y*b.y;       this.y =  a.y*b.x - a.x*b.y;       this.x=x_;  }
Vec2.prototype.set_div_cmplx  = function( a, b ){ let ir2 = 1/b.norm2(); let x_ = (a.x*b.x + a.y*b.y)*ir2;  this.y = (a.y*b.x - a.x*b.y)*ir2;  this.x=x_;  }

Vec2.prototype.fromAngle         = function( phi ){	this.x = Math.cos( phi );	this.y = Math.sin( phi );	    }
Vec2.prototype.fromAngle_taylor2 = function( phi ){	Math.sincos_taylor2( phi, this.y, this.x );	}
Vec2.prototype.fromCos           = function( ca  ){ this.x=ca; this.y=Math.sqrt(1-ca*ca); }
Vec2.prototype.fromSin           = function( sa  ){ this.y=sa; this.x=Math.sqrt(1-sa*sa); }

Vec2.prototype.rotate = function( phi ){
    let bx = Math.cos( phi );   		  
    let by = Math.sin( phi );
    let x_ = this.x*bx -   this.y*by;         
    this.y = this.y*bx +   this.x*by;       
    this.x=x_;
}

Vec2.prototype.rotate_taylor2 = function( phi ){
    let bx,by;  Math.sincos_taylor2( phi, by, bx );
    let x_ =  this.x*bx - this.y*by;    this.y =  this.y*bx + this.x*by;       this.x=x_;
}

Vec2.prototype.along_hat = function( hat, p ){ 
    let apx=p.x - this.x, apy=p.y - this.y;
    return (apx*hat.x + apy*hat.y);
    //let ap; ap.set( p.x-x, p.y-y ); return hat.dot( ap ); 
}
Vec2.prototype.along     = function( b, p ){
    //VEC ab,ap;
    //ab.set( b.x - x, b.y - y );
    //ap.set( p.x - x, p.y - y );
    // return ab.dot(ap) / ab.norm(ab);
    let abx=b.x - this.x,aby=b.y - this.y;
    let apx=p.x - this.x,apy=p.y - this.y;
    return (apx*abx + apy*aby) / (abx*abx + aby*aby);
}

Vec2.prototype.angle = function( a ){
    let d = this.cdot ( a );
    let c = this.cross( a );
    return Math.atan2( d, c );
}

Vec2.prototype.totprod = function(){ return this.x*this.y; }



// === static functions:
/*
Vec2.prototype.dot       = function( a, b ){ return a.x*b.y - a.y*b.x; };
Vec2.prototype.cross     = function( a, b ){ return a.x*b.x + a.y*b.y ; };
Vec2.prototype.mul_cmplx = function( a, b ){ return (VEC){ a.x*b.x-a.y*b.y, a.y*b.x+a.x*b.y };  }
*/

var Vec2Zero = new Vec2(0.0,0.0);
var Vec2X    = new Vec2(1.0,0.0);
var Vec2Y    = new Vec2(0.0,1.0);
