"use strict";

// ===========================
//         Formation 
// ===========================

/*

goal is to make simplest possible representation of formation battle
 - formation si represented by rectangular block which colide and (deform?)
 - it feels repulsion and friction when clashed into other block
 - losses and morality fall of faster when enemy block touches corners, side or rear 

*/

var Formation = function( name, pos ){
    this.name  = name;
    this.tyoe  = type;
    this.stance = ; // loose, hold ground, push, run, retreat, flee ....  
    this.pos   = 
    this.dir   =
    this.width =
    this.depth = 
    this.N     =
    this.Nwound  = 0;
    this.moral   = ;
    this.stamina = ;
    this.ammo    = ;
}

// https://www.gamedev.net/articles/programming/general-and-gameplay-programming/2d-rotated-rectangle-collision-r2604/
function formationFormationCollision( form1, form2 ){
    let cor1 = form1.getCorners();
    let cor2 = form1.getCorners();
    
    let l1 = // how deep left-corner penetrated into enemy
    let r1 = // the same for right corner
    let l2 = // how deep left-corner penetrated into enemy
    let r2 = // the same for right corner

}
