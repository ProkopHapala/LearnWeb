//console.log( "DEBUG 1");

var n0 = s.node( origin );
var n1 = s.node( [-100.0,   0.0,    0.0] )
var n2 = s.node( [ 100.0,   0.0,    0.0] )
var n3 = s.node( [   0.0,-200.0,    0.0] )
var n4 = s.node( [   0.0, 200.0,    0.0] )
var n5 = s.node( [   0.0,   0.0, -300.0] )
var n6 = s.node( [   0.0,   0.0,  800.0] )

var defGirderWidth = 4.0

//console.log( "DEBUG 2");

//         from to  Up nseg,mseg   width, hegith
var g1 = s.girder( n0, n1, zvec, 10, 2, [defGirderWidth,defGirderWidth], "Steel" )
var g2 = s.girder( n0, n2, zvec, 10, 2, [defGirderWidth,defGirderWidth], "Steel" )
var g3 = s.girder( n0, n3, xvec, 20, 2, [defGirderWidth,defGirderWidth], "Steel" )
var g4 = s.girder( n0, n4, xvec, 20, 2, [defGirderWidth,defGirderWidth], "Steel" )
var g5 = s.girder( n0, n5, xvec, 30, 2, [8.0,8.0], "Steel" )
var g6 = s.girder( n0, n6, xvec, 80, 2, [8.0,8.0], "Steel" )
var g7 = s.girder( n3, n6, xvec, 70, 2, [defGirderWidth,defGirderWidth], "Steel" )
var g8 = s.girder( n4, n6, xvec, 70, 2, [defGirderWidth,defGirderWidth], "Steel" )

//console.log( "DEBUG 3");

//          type     thick[mm]
s.rope(n5,n1, 25, "Kevlar");
s.rope(n6,n1, 25, "Kevlar" )
s.rope(n5,n2, 25, "Kevlar");
s.rope(n6,n2, 25, "Kevlar" )
s.rope(n5,n3, 25, "Kevlar");
//Rope(n6,n3, 25, "Kevlar" )
s.rope(n5,n4, 25, "Kevlar");
//Rope(n6,n4, 25, "Kevlar" )
s.rope(n1,n3, 25, "Kevlar");
s.rope(n1,n4, 25, "Kevlar");
s.rope(n2,n3, 25, "Kevlar");
s.rope(n2,n4, 25, "Kevlar");

/*
s.tankRing( 6,0.0, 10.0, 5.0, -50.0, -20.0 )
s.girderFan( 4, 0.0, 20.0, 40.0,-50.0, -250, 10, 1.0, true )
s.girderFan( 4, 0.0, 20.0, 40.0, 20.0,  300, 10, 1.0, true )

s.girderFan( 8, 0.0, 80.0, 80.0, -380, -200, 10, 1.0, false )

// = radiatorType = {"LithiumHeatPipe", 1280.0 }

//radiator( g5,0.2,0.8, g1,0.2,0.8, 1280.0 )
s.radiator( g6,0.15,0.8, g7,0.02,0.8, 1280.0 )
s.radiator( g6,0.15,0.8, g8,0.02,0.8, 1280.0 )

//      node1,2, up,  nseg    R     {width,height}
s.ring( [0.0,0.0,4.0], zvec, xvec, 16, 100.0, [4.0,4.0], "Steel" )
s.ring( [20.0,0.0,0.0], xvec, yvec, 16, 108.0,[4.0,4.0], "Steel" )
// Ring( {0.0,0.0,0.0}, yvec, xvec, 16, 160.0, {8.0,5.0}, "Steel" )

//  There should be mechanism how to generate nodes on-top of ship components (anchor points)



s.gun( g6, 0.1, 0.8, "XFEL" )

*/

s.thruster( [0.0,0.0,-300.0], zvec, [5.0,100.0,120.0], "ICF_Ebeam_magNozzle" );
// Thruster( {-16,-16,16}, {1.0,2.0,3.0}, {5.0,100.0,50.0}, "ICF_Ebeam_magNozzle" )