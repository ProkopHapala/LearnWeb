"use strict";

class SquareRuler{
    constructor( step, x0, y0, n ){
        this.step    = step;
        this.invStep = 1.0/step;
        this.x0 = x0;
        this.y0 = y0;

        // outputs
        this.ia = 0;
        this.ib = 0;
        this.da = 0;
        this.db = 0;

        this.setN(n,n);
    }

setN(na,nb){ this.na=na; this.nb=nb; this.ntot=na*nb; }

i2ip(i    ){ this.ia=i%this.na; this.ib=Math.floor(i/this.nb); }
ip2i(ia,ib){ return (this.na*ib+ia); }

index( x, y ){
    let a = this.invStep * (x-this.x0); let ia = Math.floor( a ); this.ia = ia; this.da  = a - ia;
    let b = this.invStep * (y-this.y0); let ib = Math.floor( b ); this.ib = ib; this.db  = b - ib;
}

/*
int insert2overlaping( Vec2d pos, double r, int * results ){
    Vec2d dpos;
    Vec2i ipos;
    pos2index( pos, dpos, ipos );
    dpos.mul( step );
    results[0] = ip2i(ipos); int nret=1;
    int dix=0,diy=0;
    double dr2   = 0;
    double mr    = 1-r;
    if     (  dpos.x < r  ){ results[nret]=ip2i( {ipos.x-1  , ipos.y    }); nret++; dix=-1; dr2 += sq(  dpos.x); }
    else if(  dpos.x > mr ){ results[nret]=ip2i( {ipos.x+1  , ipos.y    }); nret++; dix=+1; dr2 += sq(1-dpos.x); }
    if     (  dpos.y < r  ){ results[nret]=ip2i( {ipos.x    , ipos.y-1  }); nret++; diy=-1; dr2 += sq(  dpos.y); }
    else if(  dpos.y > mr ){ results[nret]=ip2i( {ipos.x    , ipos.y+1  }); nret++; diy=+1; dr2 += sq(1-dpos.y); }
    if     ( dr2 < (r*r)  ){ results[nret]=ip2i( {ipos.x+dix, ipos.y+diy}); }
    return nret;
}
*/

getOverlapingTiles( x, y, r, results ){
    r /= this.step;
    //this.index( x-0.5*this.step, y-0.5*this.step );
    this.index( x, y );
    let dx = this.da;//+0.5;
    let dy = this.db;//+0.5;
    let ix = this.ia;
    let iy = this.ib;
    results[0] = this.ip2i( ix, iy); let nret=1;
    let dix=0,diy=0;
    let dr2   = 0;
    let mr    = 1-r;
    let d=0;
    if     ( dx < r  ){ results[nret]=this.ip2i( ix-1  , iy    ); nret++; dix=-1; d=dx;   dr2 += d*d; }
    else if( dx > mr ){ results[nret]=this.ip2i( ix+1  , iy    ); nret++; dix=+1; d=1-dx; dr2 += d*d; }
    if     ( dy < r  ){ results[nret]=this.ip2i( ix    , iy-1  ); nret++; diy=-1; d=dy;   dr2 += d*d; }
    else if( dy > mr ){ results[nret]=this.ip2i( ix    , iy+1  ); nret++; diy=+1; d=1-dy; dr2 += d*d; }
    if     ( dr2 < (r*r) ){ results[nret]=this.ip2i( ix+dix, iy+diy ); nret++; }
    return nret;
}

drawTile( screen, ia, ib ){
    let xc = this.x0 + (this.step*ia);
    let yc = this.y0 + (this.step*ib);
    screen.rect( xc, yc, this.step, this.step, false );
}

}


