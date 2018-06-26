"use strict";

require(THREE);

function trapezGeom( x0, y0, x1, y1, sym ){
    var geom = new THREE.Geometry(); 
    var y00=0.0,y10=0.0;
    if( sym ){ y00=-y0; y10=-y1; };
    geom.vertices.push(new THREE.Vector3(y00,x0,0));
    geom.vertices.push(new THREE.Vector3(y0 ,x0,0));
    geom.vertices.push(new THREE.Vector3(y10,x1,0));
    geom.vertices.push(new THREE.Vector3(y1 ,x1,0));
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 2, 3 ) );
    geom.computeFaceNormals();
    return geom;
}

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

THREE.drawWireUVFunc = ( function ( na,nb, UVmin, VUVmax, voff, func ){

    var eps = 0.001;
    var duv = UVmax-UVmin; duv.mul( {na,nb} );
    //int i0=mesh.vpos.size()/3;
    var uv;

    return function drawWireUVFunc( Vec2i n, Vec2f UVmin, Vec2f UVmax, float voff, UVfunc func ){
    for(int ia=0;ia<=n.a;ia++){
        // strips
        glBegin(GL_LINE_LOOP);
        for(int ib=0;ib<=n.b;ib++){
            uv.a = UVmin.a+duv.a*ia;
            uv.b = UVmin.b+duv.b*ib +  voff*duv.b*ia;
            Vec3f p;
            p  = func(uv);
            glVertex3f(p.x,p.y,p.z);

        }
        glEnd();

        //
        if(ia<n.a){
            glBegin(GL_LINE_LOOP);
            for(int ib=0;ib<=n.b;ib++){
                uv.a = UVmin.a+duv.a*ia;
                uv.b = UVmin.b+duv.b*ib + voff*duv.b*ia;
                Vec3f p;

                p  = func(uv);
                glVertex3f(p.x,p.y,p.z);

                uv.a += duv.a;
                uv.b += voff*duv.b;

                p  = func(uv);
                glVertex3f(p.x,p.y,p.z);

            }
            glEnd();
        }
    }
}

// ==================== func

THREE.ConeUVfunc  = function ( p, R1, R2, L ){
    Vec2f csb; csb.fromAngle(p.b);
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
}