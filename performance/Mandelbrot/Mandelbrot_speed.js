// based on https://rosettacode.org/wiki/Mandelbrot_set#JavaScript
// from herehttps://gist.github.com/winduptoy/a1aa09c3499e09edbd33

/*
Firefox:
mandelbrot               Time   76.630 [ms]  1169.281 [ns/pix]   4.541 [ns/iter] 
mandelbrot_scoped        Time   78.270 [ms]  1194.305 [ns/pix]   4.657 [ns/iter] 
mandelbrot_vec2          Time 2026.630 [ms] 30923.919 [ns/pix] 120.467 [ns/iter] // this was when "c" was outside local function scope
mandelbrot_vec2_literal  Time  210.215 [ms]  3207.626 [ns/pix]  12.495 [ns/iter] 
mandelbrot_vec2_array    Time  500.895 [ms]  7643.051 [ns/pix]  29.774 [ns/iter] 
mandelbrot_vec2_inplace  Time  124.785 [ms]  1904.067 [ns/pix]   7.417 [ns/iter] 

mandelbrot               Time   30.550 [ms]   466.156 [ns/pix]   4.709 [ns/iter]   
mandelbrot_scoped        Time   31.435 [ms]   479.660 [ns/pix]   4.895 [ns/iter] 
mandelbrot_vec2          Time   72.800 [ms]  1110.840 [ns/pix]  11.327 [ns/iter] 
mandelbrot_vec2_inplace  Time   31.584 [ms]   481.949 [ns/pix]  4.9145 [ns/iter] 
mandelbrot_vec2_literal  Time   75.255 [ms]  1148.300 [ns/pix]  11.709 [ns/iter] 
mandelbrot_vec2_array    Time  202.755 [ms]  3093.796 [ns/pix]  31.547 [ns/iter] 
mandelbrot_vec2_farr32   Time  136.415 [ms]  2081.528 [ns/pix]  21.226 [ns/iter] 
mandelbrot_vec2_farr64   Time  120.039 [ms]  1831.665 [ns/pix]  18.677 [ns/iter] 

Chrome:
mandelbrot               Time   47.155 [ms]   719.528 [ns/pix]   7.269 [ns/iter]
mandelbrot_scoped        Time   43.610 [ms]   665.435 [ns/pix]   6.792 [ns/iter] 
mandelbrot_vec2          Time   52.099 [ms]   794.982 [ns/pix]   8.106 [ns/iter]
mandelbrot_vec2_inplace  Time  124.239 [ms]  1895.751 [ns/pix]  19.331 [ns/iter] 
mandelbrot_vec2_literal  Time   55.154 [ms]   841.598 [ns/pix]   8.581 [ns/iter]
mandelbrot_vec2_array    Time   86.435 [ms]  1318.893 [ns/pix]  13.448 [ns/iter] 
mandelbrot_vec2_farr32   Time  140.260 [ms]  2140.197 [ns/pix]  21.824 [ns/iter] 
mandelbrot_vec2_farr64   Time  211.885 [ms]  3233.108 [ns/pix]  32.968 [ns/iter] 
*/

// =====  Vec2 class and routines

function Vec2(x, y) { this.x = x; this.y = y; }

Vec2.prototype = {
    norm2:       function( ){ return this.x*this.x + this.y*this.y; },
    mul_complex: function(v){ x_ = this.x*v.x - this.y*v.y; this.y=this.x*v.y + this.y*v.x; this.x=x_; },
    add:         function(v){ this.x+=v.x; this.y+=v.y; },
}

Vec2.mul_complex      = function(a,b){ return new Vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x ); };
Vec2.add              = function(a,b){ return new Vec2( a.x+b.x , a.y+b.y ); };

Vec2.dot              = function(a,b){ return a.x*b.x + a.y*b.y; };
Vec2.mul_complex_l    = function(a,b){ return { x: a.x*b.x - a.y*b.y, y: a.x*b.y + a.y*b.x }; };
Vec2.add_l            = function(a,b){ return { x: a.x+b.x , y: a.y+b.y }; };

Vec2.dot_arr          = function(a,b){ return a[0]*b[0] + a[1]*b[1]; };
Vec2.mul_complex_arr  = function(a,b){ return [ a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0] ]; };
Vec2.add_arr          = function(a,b){ return [ a[0]+b[0] , a[1]+b[1] ]; };

Vec2.mul_complex_arro = function(a,b,out){ out[0]=a[0]*b[0]-a[1]*b[1]; out[1]=a[0]*b[1]+a[1]*b[0]; };
Vec2.add_arro         = function(a,b,out){ out[0]=a[0]+b[0];           out[1]=a[1]+b[1];           };

// =====  mandelbrot variants

function mandelbrot_vec2( cx, cy, maxIter) {
    var p =  new Vec2(0.0,0.0);
    var c =  new Vec2(cx,cy);
    var i = maxIter;
    while (i-- && p.norm2() <= 4) {
        p = Vec2.add( Vec2.mul_complex(p,p), c );
    }
    return maxIter - i;
}

function mandelbrot_vec2_literal( cx, cy, maxIter) {
    var p =  {x:0.0,y:0.0};
    var c =  {x:cx,y:cy};
    var i = maxIter;
    while (i-- && Vec2.dot(p,p) <= 4) {
        p = Vec2.add_l( Vec2.mul_complex_l(p,p), c );
    }
    return maxIter - i;
}

function mandelbrot_vec2_array( cx, cy, maxIter) {
    var p =  [0.0,0.0];
    var c =  [cx,cy];
    var i = maxIter;
    while (i-- && Vec2.dot_arr(p,p) <= 4) {
        p = Vec2.add_arr( Vec2.mul_complex_arr(p,p), c );
    }
    return maxIter - i;
}

function mandelbrot_vec2_farr32( cx, cy, maxIter) {
    var p  =  new Float32Array([0.0,0.0]);
    var c  =  new Float32Array([cx,cy]);
    var p2 =  new Float32Array([0.0,0.0]);
    var i = maxIter;
    while (i-- && Vec2.dot_arr(p,p) <= 4) {
        Vec2.mul_complex_arro ( p,  p, p2);
        Vec2.add_arro         ( p2, c, p );
    }
    return maxIter - i;
}

function mandelbrot_vec2_farr64( cx, cy, maxIter) {
    var p  =  new Float64Array([0.0,0.0]);
    var c  =  new Float64Array([cx,cy]);
    var p2 =  new Float64Array([0.0,0.0]);
    var i = maxIter;
    while (i-- && Vec2.dot_arr(p,p) <= 4) {
        Vec2.mul_complex_arro ( p,  p, p2);
        Vec2.add_arro         ( p2, c, p );
    }
    return maxIter - i;
}

function mandelbrot_vec2_inplace( cx, cy, maxIter) {
    var p =  new Vec2(0.0,0.0);
    var c =  new Vec2(cx,cy);
    var i = maxIter;
    while (i-- && p.norm2() <= 4) {
        p.mul_complex(p);
        p.add(c);
    }
    return maxIter - i;
}

function mandelbrot(cx, cy, maxIter) {
    var x  = 0.0; var y = 0.0;
    var xx = 0;   var yy = 0;  var xy = 0;
    var i = maxIter;
    while (i-- && xx + yy <= 4) {
        xx = x * x;
        yy = y * y;
        xy = x * y;
        x = xx - yy + cx;
        y = xy + xy + cy;
    }
    return maxIter - i;
}

function mandelbrot_scoped(cx, cy, maxIter) {
    var x  = 0.0; var y = 0.0;
    var i = maxIter;
    do {
        var xx = x * x;
        var yy = y * y;
        var xy = x * y;
        x  = xx - yy + cx;
        y  = xy + xy + cy;
        i--;
        //console.log(  xx + yy );
    } while( (i>0) && ((xx+yy) <= 4) );
    return maxIter - i;
}

function colorMap( c, pix, ip ){
    if      (c < 1) { pix[ip] = 255 * c; pix[ip+1] = 0;             pix[ip+2] = 0;             }
    else if (c < 2) { pix[ip] = 255;     pix[ip+1] = 255 * (c - 1); pix[ip+2] = 0;             } 
    else            { pix[ip] = 255;     pix[ip+1] = 255;           pix[ip+2] = 255 * (c - 2); }
}

function makeImage( canvas, xmin, xmax, ymin, ymax, maxIter, func, func_name ){
    var width  = canvas.width;
    var height = canvas.height;
    var ctx    = canvas.getContext('2d');
    var img    = ctx.getImageData(0, 0, width, height);
    var pix    = img.data;
    //console.time('Function #1');
    var t0 = performance.now();
    var itersum = 0;
    for (var ix = 0; ix < width; ++ix)  {
        for (var iy=0; iy<height; ++iy) {
            var x     = xmin + (xmax - xmin) * ix / (width - 1);
            var y     = ymin + (ymax - ymin) * iy / (height - 1);
            var iters = func( x,y, maxIter );
            itersum +=  iters;
            var ip    = 4*(width*iy+ix);
            if  ( iters > maxIter ){ pix[ip]=0; pix[ip+1]=0; pix[ip+2]=0;                            } 
            else                   { colorMap( 3*Math.log(iters)/Math.log(maxIter-1.0), pix, ip ); }
            pix[ip + 3] = 255;
            //return;
        }
    }
    //console.timeEnd('Function #1');
    var dt       = performance.now()-t0;
    var per_pix  = 1e+6*dt/(width*height);
    var per_iter = 1e+6*dt/itersum ;
    var outstr   = func_name +  "Time "+dt+" [ms] "+ per_pix + " [ns/pix] "+per_iter+" [ns/iter] " ;
    console.log   ( outstr  );
    //document.write( outstr  );
    //document.getElementById("P_Log").innerHTML += outstr+"</BR>";
    document.getElementById("P_Log").innerHTML += outstr+"\n";
    ctx.putImageData(img, 0, 0);
}

// ----  main
var canvas = document.createElement('canvas');
canvas.width  = 256;
canvas.height = 256;
document.body.insertBefore(canvas, document.body.childNodes[0]);
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot              , "mandelbrot              " );
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot_scoped       , "mandelbrot_scoped       " );
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot_vec2         , "mandelbrot_vec2         " );
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot_vec2_inplace , "mandelbrot_vec2_inplace " );
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot_vec2_literal , "mandelbrot_vec2_literal " );
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot_vec2_array   , "mandelbrot_vec2_array   " );
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot_vec2_farr32  , "mandelbrot_vec2_farr32  " );
makeImage(canvas, -2, 2, -2, 2, 1000, mandelbrot_vec2_farr64  , "mandelbrot_vec2_farr64  " );
