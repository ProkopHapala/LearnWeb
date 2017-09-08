// based on https://rosettacode.org/wiki/Mandelbrot_set#JavaScript
// from herehttps://gist.github.com/winduptoy/a1aa09c3499e09edbd33

"use strict";

var p0     = new Vec2( 250.0, 250.0 );

function move( poss, vels, dt ){
    var n = poss.length;
    var d  = new Vec2( 0.0,0.0 );
    var f  = new Vec2( 0.0,0.0 );
    var K  = -0.0001;
    var R3SAFE = 1e+2;
    for( var i=0; i<n; i++ ){
        var pi = poss[i]; 
        d.set_subv( pi, p0 );
        f.set_mulf( d,  K  );
        //console.log( i, d, f );
        for( var j=0; j<n; j++ ){
            if( i==j ) continue;
            var pj = poss[j];
            d.set_subv( pi, pj );
            var r2 = d.norm2();
            var fr = -1.0/( r2*Math.sqrt(r2) + R3SAFE );
            f.add_mulf( d, fr );
            //console.log( i, j, d, f );
        }
        //console.log( f );
        var vel = vels[i];
        vel.add_mulf( f,   dt );
        pi .add_mulf( vel, dt );
    }
}

function move_raw( poss, vels, dt ){
    var n = poss.length;
    var d  = new Vec2( 0.0,0.0 );
    var f  = new Vec2( 0.0,0.0 );
    var K  = -0.0001;
    var R3SAFE = 1e+2;
    for( var i=0; i<n; i++ ){
        var pi = poss[i]; 
        //d.set_subv( pi, p0 );
        d.x = pi.x - p0.x;
        d.y = pi.y - p0.y;
        // f.set_add_mulf( d,  K  );
        f.x = d.x*K;
        f.y = d.y*K;
        for( var j=0; j<n; j++ ){
            if( i==j ) continue;
            var pj = poss[j];
            //d.set_subv( pi, pj );
            d.x = pi.x - pj.x;
            d.y = pi.y - pj.y;
            var r2 = d.norm2();
            var fr = -1.0/( r2*Math.sqrt(r2) + R3SAFE );
            //f.add_mulf( d, fr );
            f.x += d.x*fr;
            f.y += d.y*fr; 
            //console.log( i, j, d, f );
        }
        //console.log( f );
        var v = vels[i];
        //v.add_mulf( f,   dt );
        v.x += f.x * dt;
        v.y += f.y * dt;
        //pi .add_mulf( vel, dt );
        pi.x += v.x * dt;
        pi.y += v.y * dt; 
    }
}

function move_rawNum( poss, vels, dt ){
    var n = poss.length;
    var K  = -0.0001;
    var R3SAFE = 1e+2;
    for( var i=0; i<n; i++ ){
        var pi = poss[i]; 
        //d.set_subv( pi, p0 );
        //f.set_add_mulf( d,  K  );
        var fx = (pi.x - p0.x)*K;
        var fy = (pi.y - p0.y)*K;
        for( var j=0; j<n; j++ ){
            if( i==j ) continue;
            var pj = poss[j];
            //d.set_subv( pi, pj );
            var dx = pi.x - pj.x;
            var dy = pi.y - pj.y;
            var r2 = dx*dx + dy*dy;
            var fr = -1.0/( r2*Math.sqrt(r2) + R3SAFE );
            //f.add_mulf( d, fr );
            fx += dx*fr;
            fy += dy*fr; 
            //console.log( i, j, d, f );
        }
        //console.log( f );
        var v = vels[i];
        //v.add_mulf( f,   dt );
        v.x += fx * dt;
        v.y += fy * dt;
        //pi .add_mulf( vel, dt );
        pi.x += v.x * dt;
        pi.y += v.y * dt; 
    }
}

function drawPoints(ctx, ps ){
    for(var i=0; i<ps.length; i++){
        var p = ps[i]; 
        ctx.fillRect( Math.floor(p.x), Math.floor(p.y), 1, 1 );
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
    window.setTimeout(callback, 1000.0/60.0);
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
        //move_raw( poss, vels, dt );
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
        //var pos = new Vec2( Math.random()*500, Math.random()*500 ); 
        var pos = new Vec2( 250+Math.cos(i)*250, 250+Math.sin(i)*250 ); 
        var vel = new Vec2( 0.0, 0.0 ); 
        poss.push( pos );
        vels.push( vel );
    }
    drawPoints(ctx, poss );
    //console.log( " ================== " );
    //move_raw( poss, vels, dt );
    //console.log( " ================== " );
    //move    ( poss, vels, dt );
    updateScene();
}