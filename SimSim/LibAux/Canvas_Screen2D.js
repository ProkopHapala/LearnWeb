"use strict";

class Mouse{
    constructor(){
        this.down   = false;
        this.button = 1;
        this.x      = 0.0; 
        this.y      = 0.0;
        this.begX   = 0.0;
        this.begY   = 0.0;
    }
}

class Screen2D{ 
    constructor( canvas, ctx, zoom ){
        this.canvas = canvas; 
        this.ctx    = ctx; 
        this.setZoom(zoom);
        this.x0     = 0.0;
        this.y0     = 0.0;
        this.mouse = new Mouse();
    } 

    setZoom(Zoom){ this.Zoom=Zoom; this.invZoom=1.0/Zoom; }
    x2pix (x ){return Math.fround( ( x-this.x0)*this.Zoom );  }  // recomanded to optimize speed of Canvas by removing antialiasing
    y2pix (y ){return Math.fround( ( y-this.y0)*this.Zoom );  }
    pix2x (px){return px*this.invZoom + this.x0; }
    pix2y (py){return py*this.invZoom + this.y0; }

    point( x,y          ){ return py*this.invZoom + this.y0; }
    line ( x0,y0, x1,y1 ){ 
        this.ctx.beginPath(); 
        this.ctx.moveTo( this.x2pix(x0), this.y2pix(y0) );   
        this.ctx.lineTo( this.x2pix(x1), this.y2pix(y1) ); 
        this.ctx.stroke(); 
    }
    vecInPos( dx,dy, x0,y0 ){
        this.ctx.beginPath();  
        this.ctx.moveTo( this.x2pix(x0), this.y2pix(y0) );   
        this.ctx.lineTo( this.x2pix(x0+dx), this.y2pix(y0+dy) ); 
        this.ctx.stroke(); 
    }
    rect ( x0,y0, x1,y1, filled ){ 
        this.ctx.beginPath(); 
        this.ctx.rect( this.x2pix(x0), this.y2pix(y0), this.x2pix(x1), this.y2pix(y1) );
        if( filled ){ ctx.fill(); }else{ ctx.stroke(); };
    }

    ngon( x0,y0, dx,dy, N, filled ){
        //this.ctx.beginPath();
        let a  = 6.28318530718/N; 
        let sa = Math.sin(a);
        let ca = Math.cos(a);
        this.ctx.beginPath(); 
        ctx.moveTo( this.x2pix( x0+dx), this.y2pix(y0+dy) );
        for( let i=0; i<=N; i++ ){
            ctx.lineTo( this.x2pix( x0+dx), this.y2pix(y0+dy) );
            let _x = dx*ca - dy*sa;
            let _y = dx*sa + dy*ca;
            dx=_x; dy=_y;
        }
        if( filled ){ ctx.fill(); }else{ ctx.stroke(); };
    }

    circle( x0, y0, r, filled ){
        //this.ctx.arc( this.x2pix(x0), this.y2pix(y0), r/this.zoom, 0, 2 * Math.PI, false);
        this.ctx.beginPath();
        this.ctx.arc( this.x2pix(x0), this.y2pix(y0), r*this.Zoom, 0, 2 * Math.PI, false);
        if( filled ){ ctx.fill(); }else{ ctx.stroke(); };
    }

    updateMousePos( e ){
        let rect = this.canvas.getBoundingClientRect();
        let px   = e.clientX - rect.left;
        let py   = e.clientY - rect.top;
        this.mouse.x  = this.pix2x( px );
        this.mouse.y  = this.pix2x( py );
    }

    plot( xs, ys, xscale, yscale ){
        let ctx = this.ctx;
        let x0=0,sx=1.0, y0=0,sy=1.0;      
        if( xscale ){ x0=xscale[0]; sx=xscale[1]; }
        if( yscale ){ y0=yscale[0]; sy=yscale[1]; } 
        ctx.beginPath();
        for(let i=0; i<xs.length; i++){
            let x = this.x2pix( x0+xs[i]*sx  );
            let y = this.y2pix( y0+ys[i]*sy );
            //console.log( i,x,y );
            if( i==0 ){ ctx.moveTo( x, y ); }else{  ctx.lineTo( x, y ); }
        }
        ctx.stroke();
    }

    drawAxis( xscale, yscale ){
        let ctx = this.ctx;    
        let x0=this.x2pix( xscale[0] ); //sx=xscale[1];
        let y0=this.x2pix( yscale[0] ); //sy=yscale[1];
        ctx.beginPath();
        ctx.moveTo( x0, 0.0 ); ctx.lineTo ( x0, this.canvas.height ); 
        ctx.moveTo( 0.0, y0 );  ctx.lineTo( this.canvas.width, y0 ); 
        ctx.stroke();
    }

    axhline( x, xscale ){
        let ctx = this.ctx;    
        let x0=this.x2pix( xscale[0]+x*xscale[1] );
        ctx.beginPath();
        ctx.moveTo( x0, 0.0 ); ctx.lineTo ( x0, this.canvas.height ); 
        ctx.stroke();
    }

};
