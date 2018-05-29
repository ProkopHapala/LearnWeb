"use strict";

//function dist2( x,y, x0,y0  ){ dx=x-x0 + dy*dy return dx*dx + dy*dy };
function norm2_2D( x,y ){ return x*x + y*y };


var Vec2 = function(x, y){ this.x = x; this.y = y }; 
Vec2.prototype = {
 
    setf:       function( f      ){ this.x=f;   this.y=f;   },
    setv:       function( v      ){ this.x=v.x; this.y=v.y; },
    setff:      function( fx, fy ){ this.x=fx;  this.y=fy;  },

    set_arr:    function( arr    ){ this.x=arr[0]; this.y=arr[1]; },
    toArray:    function(        ){ return [this.x,this.y]; },
    toBuff:     function( i, arr ){ var i2=i*2; arr[i2]=this.x;  arr[i2+1]=this.y;    },
    fromBuff:   function( i, arr ){ var i2=i*2; this.x =arr[i2]; this.y   =arr[i2+1]; },

    addf:       function( f ) { this.x+=f; this.y+=f; },
    mulf:       function( f ) { this.x*=f; this.y*=f; },

    addv:       function( v ) { this.x+=v.x; this.y+=v.y; },
    subv:       function( v ) { this.x-=v.x; this.y-=v.y; },
    mulv:       function( v ) { this.x*=v.x; this.y*=v.y; },
    divv:       function( v ) { this.x/=v.x; this.y/=v.y; },

    addff:      function( fx, fy) { this.x+=fx; this.y+=fy; },
    subff:      function( fx, fy) { this.x-=fx; this.y-=fy; },
    mulff:      function( fx, fy) { this.x*=fx; this.y*=fy; },
    divff:      function( fx, fy) { this.x/=fx; this.y/=fy; },

    set_inv:    function( v ) { this.x=1.0/v.x; this.y=1.0/v.y; },

    set_addf:   function( a, f    ){ this.x=a.x+f;     this.y=a.y+f; },
    set_mulf:   function( a, f    ){ this.x=a.x*f;     this.y=a.y*f; },
    set_mulv:   function( a, b, f ){ this.x=a.x*b.x*f; this.y=a.y*b.y*f; },

    set_addv:   function( a, b ){ this.x=a.x+b.x; this.y=a.y+b.y; },
    set_subv:   function( a, b ){ this.x=a.x-b.x; this.y=a.y-b.y; },
    set_mulv:   function( a, b ){ this.x=a.x*b.x; this.y=a.y*b.y; },
    set_divv:   function( a, b ){ this.x=a.x/b.x; this.y=a.y/b.y; },

    add_mulf:   function( a, f    ){ this.x+=a.x*f;        this.y+=a.y*f;       },
    add_mulv:   function( a, b    ){ this.x+=a.x*b.x;      this.y+=a.y*b.y;     },
    sub_mulv:   function( a, b    ){ this.x-=a.x*b.x;      this.y-=a.y*b.y;     },
    add_mulvf:  function( a, b, f ){ this.x+=a.x*b.x*f;    this.y+=a.y*b.y*f;   },
    set_add_mulf:function( a, b, f ){ this.x =a.x + f*b.x;  this.y =a.y + f*b.y; },

    set_lerp:   function( a, b, f      ){ this.x = a.x+(b.x-a.x)*f;  this.y = a.y+(b.y-a.y)*f; },
    set_lincomb:function( fa, a, fb, b ){ this.x = fa*a.x + fb*b.x;  this.y = fa*a.y + fb*b.y; },
    add_lincomb:function( fa, a, fb,b  ){ this.x+= fa*a.x + fb*b.x;  this.y+= fa*a.y + fb*b.y; },

    set_lincomb:function( fa, fb, fc, a, b, c ){ this.x = fa*a.x + fb*b.x + fc*c.x;  this.y = fa*a.y + fb*b.y + fc*c.y; },
    add_lincomb:function( fa, fb, fc, a, b, c ){ this.x+= fa*a.x + fb*b.x + fc*c.x;  this.y+= fa*a.y + fb*b.y + fc*c.y; },

    dot:        function( a ){ return this.x*a.x + this.y*a.y; },
    dot_perp:   function( a ){ return this.y*a.x - this.x*a.y; },
    norm2:      function(   ){ return this.x*this.x + this.y*this.y;     },

    norm:       function ( ) { return Math.sqrt( this.x*this.x + this.y*this.y ); },
    normalize:  function() {
        var nor  = Mat.sqrt( this.x*this.x + this.y*this.y ); 
        var iNor = 1.0/nor;
        this.x *= iNor;  
        this.y *= iNor;
        return nor;
    },

    dist2:          function( a ){ var dx = this.x-a.x; var dy = this.y-a.y; return dx*dx + dy*dy; },
    dist :          function( a ){ var dx = this.x-a.x; var dy = this.y-a.y; return Math.sqrt( dx*dx + dy*dy ); },

    set_perp:       function( a ){this. x=-a.y; this.y=a.x; },
    cross :         function( a ){ returnthis. x*a.y - this.y*a.x; },

        mul_cmplx:  function(    b ){                         var x_ =  this.x*b.x - this.y*b.y;   this.y =  this.y*b.x + this.x*b.y;   this.x=x_;  },
    pre_mul_cmplx:  function( a    ){                         var x_ =  a.x*this.x - a.y*this.y;    this.y =  a.y* this.x + a.x* this.y; this.x=x_;  },
    set_mul_cmplx:  function( a, b ){                         var x_ =  a.x*b.x - a.y*b.y;         this.y =  a.y*b.x + a.x*b.y;         this.x=x_;  },
    set_udiv_cmplx: function( a, b ){                         var x_ =  a.x*b.x + a.y*b.y;         this.y =  a.y*b.x - a.x*b.y;         this.x=x_;  },
    set_div_cmplx:  function( a, b ){  var ir2 = 1/b.norm2(); var x_ = (a.x*b.x + a.y*b.y)*ir2;    this.y = (a.y*b.x - a.x*b.y)*ir2;    this.x=x_;  },

    fromAngle:      function( phi  ){ this.x = Math.cos( phi );	this.y = Math.sin( phi );	    },
    fromCos:        function( ca   ){ this.x=ca; this.y=Math.sqrt(1-ca*ca); },
    fromSin:        function( sa   ){ this.y=sa; this.x=Math.sqrt(1-sa*sa); },

    rotate:function( phi ){
        var bx = Math.cos( phi ); 
        var by = Math.sin( phi );
        var x_ = this.x*bx - this.y*by;  this.y = this.y*bx + this.x*by;  this.x=x_;
    },

    angle:function( a ){
        var d = a.x*a.x+a.y*a.y;         // dot
        var c = this.x*a.y - this.y*a.x; // cross
        return Math.atan2( d, c );
    },


    /*
    along_hat( hat, p ){ VEC ap; ap.set( p.x-x, p.y-y ); return hat.dot( ap ); }
    along    ( b,   p ){
        VEC ab,ap;
        ab.set( b.x - x, b.y - y );
        ap.set( p.x - x, p.y - y );
        return ab.dot(ap) / ab.norm(ab);
    }
    */

} // Vec2.prototype
