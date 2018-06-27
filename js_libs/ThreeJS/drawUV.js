"use strict";

var Vec2 = THREE.Vector2;
var Vec3 = THREE.Vector3;

//require(THREE);

/*
THREE.getUVFuncNormal = ( function ( uv, eps,  func ){
    var o = new vec2(),
    var nor= new vec3(),
        da= new vec3(),
        db= new vec3();
    return function getUVFuncNormal( uv, eps,  func ){

    o.set(uv); o[0]+=eps; da.set(func(o));
    o.set(uv); o[0]-=eps; da.sub(func(o));
    o.set(uv); o[1]+=eps; db.set(func(o));
    o.set(uv); o[1]-=eps; db.sub(func(o));
    cross(nor, db,da); 
    normalize(nor, nor);
    nor.normalize();
    return nor;
    }
}() );

THREE.drawSmoothUVFunc = function ( nx, ny, UVmin, UVmax, voff, func ){

    var eps = 0.001;
    var duv = ;  
    UVmax-UVmin; 
    duv.mul( {1.0/n.a,1.0/n.b} );

    //int i0=mesh.vpos.size()/3;
    printf( "n (%i,%i) duv (%f,%f) \n", n.a, n.b, duv.a, duv.b  );
    Vec2f uv;
    for(int ia=0;ia<=n.a;ia++){
        glBegin(GL_TRIANGLE_STRIP);
        for(int ib=0;ib<=n.b;ib++){
            //int i=mesh.vpos.size();
            uv.a = UVmin.a+duv.a*ia;
            uv.b = UVmin.b+duv.b*ib + voff*duv.b*ia;
            Vec3f p,nr;

            //printf( " %i %i: uv (%f,%f) p (%f,%f,%f)\n", ia,ib, uv.a, uv.b,  p.x,p.y,p.z  );
            p  = func(uv);
            nr = getUVFuncNormal(uv,eps,func);
            glNormal3f(nr.x,nr.y,nr.z);
            glVertex3f(p.x,p.y,p.z);

            uv.a += duv.a;
            uv.b += voff*duv.b;

            p  = func(uv);
            nr = getUVFuncNormal(uv,eps,func);
            glNormal3f(nr.x,nr.y,nr.z);
            glVertex3f(p.x,p.y,p.z);

        }
        glEnd();
    }
}
*/

THREE.drawWireUVFunc = function ( ){
    var eps = 0.001;
    //var duv = UVmax-UVmin; 
    //duv.mul( {na,nb} );
    //int i0=mesh.vpos.size()/3;
    var duv = new Vec2();
    var uv = new Vec2();
    var p  = new Vec3();
    return function drawWireUVFunc( ns, UVmin, UVmax, voff, func, args ){
        let verts = [];
        duv.set_sub( UVmin, UVmax );
        duv.x *= 1/ns[0];
        duv.y *= 1/ns[1];
        //console.log( "uv duv ns voff ",  uv, duv, ns, voff );
        for(let ix=0; ix<ns[0]; ix++ ){
            // strips
            //glBegin(GL_LINE_LOOP);
            let p0;
            for(let iy=0; iy<=ns[1]; iy++ ){
                uv.x = UVmin.x+duv.x*ix;
                uv.y = UVmin.y+duv.y*iy +  voff*duv.y*ix;
                func( uv, p, args );
                //console.log( ix,iy,   uv, p  );
                //glVertex3f(p.x,p.y,p.z);
                if(iy>0)    { verts.push( p.clone() ); }else{ p0 = p.clone(); }
                if(iy<ns[1]){ verts.push( p.clone() ); }else{ verts.push( p0.clone ); }
            }
            //console.log( verts.length );
            //glEnd();

            if(ix<ns[0]-1){
                //glBegin(GL_LINE_LOOP);
                for(let iy=0; iy<=ns[1]; iy++){
                    uv.x = UVmin.x+duv.x*ix;
                    uv.y = UVmin.y+duv.y*iy + voff*duv.y*ix;

                    func(uv,p, args);
                    //glVertex3f(p.x,p.y,p.z);
                    verts.push( p.clone() );

                    uv.x += duv.x;
                    uv.y += voff*duv.y;

                    func(uv,p,args);
                    //glVertex3f(p.x,p.y,p.z);
                    verts.push( p.clone() );

                }
                //glEnd();
            }
            
        }
        return verts;
    }
}();

// ==================== func

THREE.ParabolaUVfunc = function  ( uv, p, args ){
    //Vec2f csb; csb.fromAngle(p.b);
    let cb = Math.cos(uv.y);
    let sb = Math.sin(uv.y);
    let r = uv.x;
    let l = uv.x * uv.x * args.K;
    p.x = cb*r;
    p.y = sb*r;
    p.z = l;
    //return (Vec3f){csb.a*r,csb.b*r,l };
}

THREE.drawUV_Parabola  = function( n, UVmin, UVmax, R, L, voff ){
    let K = L/(R*R);
    UVmin.x*=R; UVmax.x*=R;
    return THREE.drawWireUVFunc( n, UVmin, UVmax, voff, THREE.ParabolaUVfunc, {K:K} );
    //printf( "drawUV_Parabola: R %f L %f K %f \n", R, L, K  );
    //auto uvfunc = [&](Vec2f uv){return ParabolaUVfunc(uv,K);};
    //if(wire){ drawWireUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
    //else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
}

/*
THREE.ConeUVfunc  = function ( p, R1, R2, L ){
    Vec2f 
    csb; csb.fromAngle(p.b);
    float R = (1-p.a)*R1 + p.a*R2;
    return (Vec3f){csb.a*R,csb.b*R,L*p.a };
}

THREE.SphereUVfunc  = function ( p, R ){
    Vec2f csa; csa.fromAngle(p.a);
    Vec2f csb; csb.fromAngle(p.b);
    return (Vec3f){csa.a*csb.a*R,csa.a*csb.b*R,csa.b*R };
}

THREE.TorusUVfunc  = function ( p, r, R ){
    Vec2f csa; csa.fromAngle(p.a);
    Vec2f csb; csb.fromAngle(p.b);
    return (Vec3f){csb.a*(R+r*csa.a),csb.b*(R+r*csa.a),r*csa.b};
}

THREE.TeardropUVfunc  = function ( p, R1, R2, L ){
    Vec2f csa; csa.fromAngle(p.a*M_PI-M_PI*0.5);
    Vec2f csb; csb.fromAngle(p.b);
    float f =  0.5-csa.b*0.5;
    float R = (1-f)*R1 + f*R2;
    return (Vec3f){csa.a*csb.a*R,csa.a*csb.b*R,csa.b*R-L*f };
}

THREE.ParabolaUVfunc  = function  ( p, K ){
    Vec2f csb; csb.fromAngle(p.b);
    float r = p.a;
    float l = p.a*p.a*K;
    return (Vec3f){csb.a*r,csb.b*r,l };
}

THREE.HyperbolaRUVfunc  = function ( p, R, K ){
    Vec2f csb; csb.fromAngle(p.b);
    float r = p.a;
    float l = K*sqrt( p.a*p.a + R*R); // - K*R;
    return (Vec3f){csb.a*r,csb.b*r,l };
}

THREE.HyperbolaLUVfunc  = function  ( p, R, K ){
    Vec2f csb; csb.fromAngle(p.b);
    float l = p.a;
    float r = K*sqrt( p.a*p.a + R*R);
    return (Vec3f){csb.a*r,csb.b*r,l };
}

// ==================== drawFunc

THREE.drawUV_Cone  = function( n, UVmin, UVmax, R1, R2, L, voff, wire ){
    auto uvfunc = [&](Vec2f uv){return ConeUVfunc(uv,R1,R2,L);};
    if(wire){ drawWireUVFunc( n, UVmin, UVmax, voff, uvfunc ); }
    else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
}

THREE.drawUV_Sphere  = function( n, UVmin, UVmax, R, voff, wire ){
    auto uvfunc = [&](Vec2f uv){return SphereUVfunc(uv,R);};
    if(wire){ drawWireUVFunc  ( n, UVmin, UVmax, voff, uvfunc ); }
    else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
}

THREE.drawUV_Torus  = function( n, UVmin, UVmax, r, R, voff, wire ){
    auto uvfunc = [&](Vec2f uv){return TorusUVfunc(uv,r,R);};
    if(wire){ drawWireUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
    else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
}

THREE.drawUV_Teardrop  = function( n, UVmin, UVmax, R1, R2, L, voff, wire ){
    auto uvfunc = [&](Vec2f uv){return TeardropUVfunc(uv,R1,R2,L);};
    if(wire){ drawWireUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
    else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
}

THREE.drawUV_Parabola  = function( n, UVmin, UVmax, R, L, voff, wire ){
    float K = L/(R*R);
    UVmin.a*=R; UVmax.a*=R;
    //printf( "drawUV_Parabola: R %f L %f K %f \n", R, L, K  );
    auto uvfunc = [&](Vec2f uv){return ParabolaUVfunc(uv,K);};
    if(wire){ drawWireUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
    else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
}

THREE.drawUV_Hyperbola = function( n, UVmin, UVmax, r, R, L, voff, wire ){
    //printf( "drawUV_Hyperbola: r %f R %f L %f \n", r, R, L  );
    if(r>0){
        float K = R/L;
        UVmin.a*=L; UVmax.a*=L;
        auto uvfunc = [&](Vec2f uv){return HyperbolaLUVfunc(uv,r,K);};
        if(wire){ drawWireUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
        else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
    }else{
        r=-r;
        float K = L/R;
        UVmin.a*=R; UVmax.a*=R;
        auto uvfunc = [&](Vec2f uv){return HyperbolaRUVfunc(uv,r,K);};
        if(wire){ drawWireUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
        else    { drawSmoothUVFunc( n, UVmin, UVmax,voff, uvfunc ); }
    }
    */
