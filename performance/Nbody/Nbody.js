// based on https://rosettacode.org/wiki/Mandelbrot_set#JavaScript
// from herehttps://gist.github.com/winduptoy/a1aa09c3499e09edbd33

"use strict";

var p0     = [250.0,250.0];

function set ( f      , out ){ out[0]=f;           out[1]=f; };
function mulf( a, f   , out ){ out[0]=a[0]*f;      out[1]=a[1]*f; };
function sub ( a, b,    out ){ out[0]=a[0]-b[0];   out[1]=a[1]-b[1];   };
function mad ( a, b, f, out ){ out[0]=a[0]+b[0]*f; out[1]=a[1]+b[1]*f; };
function dot ( a, b,    out ){ return a[0]*b[0] + a[1]*b[1]; };
function acc ( a, b    ){ a[0]+=b[0];   a[1]+=b[1];   };
function accf( a, b, f ){ a[0]+=b[0]*f; a[1]+=b[1]*f; };

function move( poss, vels, dt ){
    var n = poss.length;
    var d  = [0.0,0.0];
    var f  = [0.0,0.0];
    var K  = -0.0001;
    var R3SAFE = 1e+2;
    for( var i=0; i<n; i++ ){
        var pi = poss[i]; 
        //set(0.0,f);
        sub( pi, p0, d);
        mulf( d,K, f);
        for( var j=0; j<n; j++ ){
            if( i==j ) continue;
            var pj = poss[j];
            sub( pi, pj, d);
            var r2 = dot(d,d);
            var fr = -1.0/( r2*Math.sqrt(r2) + R3SAFE );
            accf( f, d, fr );
            //console.log( i, j, d, f );
        }
        //console.log( f );
        var vel = vels[i];
        accf( vel, f,  dt );
        accf( pi, vel, dt );
    }
}

function move_rawNum( poss, vels, dt ){
    var n = poss.length;
    var p0_x = p0[0];
    var p0_y = p0[1];
    var K    = -0.0001;
    var R3SAFE = 1e+2;
    for( var i=0; i<n; i++ ){
        var pi = poss[i];
        var pi_x = pi[0];
        var pi_y = pi[1];
        var fx = (pi_x - p0_x)*K;
        var fy = (pi_y - p0_y)*K;
        for( var j=0; j<n; j++ ){
            if( i==j ) continue;
            var pj   = poss[j];
            var pj_x = pj[0];
            var pj_y = pj[1];
            var dx   = pi_x - pj_x;
            var dy   = pi_y - pj_y;
            var r2   = dx*dx + dy*dy;
            var fr   = -1.0/( r2*Math.sqrt(r2) + R3SAFE);
            fx += dx*fr;
            fy += dy*fr;
            //console.log( i, j, dx,dy, fx, fy );
        }
        //console.log( fx, fy );
        var vel = vels[i];
        var vx = vel[0] + fx*dt;  vels[i][0] = vx;
        var vy = vel[1] + fy*dt;  vels[i][1] = vy;
        poss[i][0] += vx*dt;
        poss[i][1] += vy*dt;
    }
}

function drawPoints(ctx, ps ){
    for(var i=0; i<ps.length; i++){
        var p = ps[i]; 
        ctx.fillRect( Math.floor(p[0]), Math.floor(p[1]), 1, 1 );
    }
}

// ==================== drawing


window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function (callback) {
    window.setTimeout(callback, 1000.0/60);
};

var canvas,ctx;

var poss = []; 
var vels = [];

var dt = 0.1;

function updateScene(){
    var perFrame = 10;
    var t0 = performance.now();
    for( var itr=0; itr<perFrame; itr++ ){
        move( poss, vels, dt );
        //move_rawNum( poss, vels, dt );
    }
    var T = performance.now() - t0;
    console.log( "updateScene", T, " [ms] ", 1e+6*T/(poss.length*poss.length*perFrame), " [ns/op]" );
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints(ctx, poss );
    requestAnimFrame(updateScene);
}

window.onload = function () {
    canvas  = document.getElementById('c');
    ctx     = canvas  .getContext('2d');
    canvas.width  = 1024;
    canvas.height = 512;

    var N = 100;
    for(var i=0; i<N; i++){
        //var pos = [ Math.random()*500, Math.random()*500 ]; 
        var pos = [ 250+Math.cos(i)*250, 250+Math.sin(i)*250 ]; 
        var vel = [ 0.0, 0.0 ]; 
        poss.push( pos );
        vels.push( vel );
    }
    drawPoints(ctx, poss );
    //console.log("==============");
    //move( poss, vels, dt );
    //console.log("==============");
    //move_rawNum( poss, vels, dt );
    updateScene();
}
