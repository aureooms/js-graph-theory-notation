

var itertools = require( "aureooms-js-itertools" ) ;
var adjacencymatrix = require( "aureooms-js-adjacency-matrix" ) ;

var  ex = itertools.exhaust ;
var map = itertools.map ;

var V = graphtheorynotation.V ;
var E = graphtheorynotation.E ;
var N = graphtheorynotation.N ;

test( "Matrix with References" , function ( ) {

	var Graph = adjacencymatrix.Matrix ;

	var g = new Graph( ) ;

	var v = [ ] ;
	var e = [ ] ;

	var n = 11 ;

	for( var i = 0 ; i < n ; ++i ) v[i] = g.vadd( ) ;

	e[1] = [ ] ;
	e[1][0] = g.eadd(v[1], v[9] );
	e[0] = [ ] ;
	e[0][0] = g.eadd(v[0], v[10]);
	e[0][1] = g.eadd(v[0], v[5]);
	e[0][2] = g.eadd(v[0], v[3]);
	e[0][3] = g.eadd(v[0], v[1]);
	e[0][4] = g.eadd(v[0], v[0]);
	e[1][1] = e[0][3];
	e[4] = [ ] ;
	e[4][0] = g.eadd(v[4], v[7]);

	var r = [ 0 , 1 , 4 ] ;

	// tests

	var k , set , alledges ;

	k = 0 ;
	set = new WeakSet( v ) ;

	ex( map( function ( j ) {
		ok( set.has( j ) , 'vitr ' + k ) ;
		set.delete( j ) ;
		++k ;
	} , V( g ) ) ) ;

	k = 0 ;
	alledges = e[0].concat( [ e[1][0] ] ).concat( e[4] ) ;
	set = new WeakSet( alledges ) ;

	ex( map( function ( j ) {
		ok( set.has( j ) , 'aeitr ' + k ) ;
		set.delete( j ) ;
		++k ;
	} , E( g ) ) ) ;

	deepEqual( k , alledges.length , 'check edges count before del' ) ;



	r.forEach( function ( m ) {

		var k = e[m].length ;

		var set = new WeakSet( e[m] ) ;

		ex( map( function ( x ) {
			--k ;
			ok( set.has( x ) , 'iitr ' + m + ' ' + k ) ;
			set.delete( x ) ;
		} , g.iitr( v[m] ) ) ) ;

	} ) ;


	// delete edges 1 0 , 0 2 , 4 0
	g.edel(e[1].splice(0, 1)[0]);

	g.edel(e[0].splice(2, 1)[0]);

	g.edel(e[4].splice(0, 1)[0]);

	k = 0 ;
	alledges = e[0].concat( e[4] ) ;
	set = new WeakSet( alledges ) ;

	ex( map( function ( j ) {
		ok( set.has( j ) , 'aeitr ' + k ) ;
		set.delete( j ) ;
		++k ;
	} , E( g ) ) ) ;

	deepEqual( k , alledges.length , 'check edges count after del' ) ;

	k = 0 ;
	set = new WeakSet( map ( function ( _e ) {
		var e = g.endpoints( _e ) ;
		return e[0] === v[0] ? e[1] : e[0] ;
	} , e[0] ) ) ;

	ex( map( function ( j ) {
		ok( set.has( j ) , 'nitr ' + k ) ;
		set.delete( j ) ;
		++k ;
	} , N( g , v[0] ) ) ) ;

	deepEqual( k , e[0].length , 'check neighbour count after del' ) ;

	r.forEach( function ( m ) {

		var k = e[m].length ;

		var set = new WeakSet( e[m] ) ;

		ex( map( function ( x ) {
			--k ;
			ok( set.has( x ) , 'iitr ' + m + ' ' + k ) ;
			set.delete( x ) ;
		} , g.iitr( v[m] ) ) ) ;

	} ) ;

	// delete vertex 3

	g.vdel(v.splice(3, 1)[0]);

	k = 0 ;
	set = new WeakSet( v ) ;

	ex( map( function ( j ) {
		ok( set.has( j ) , 'vitr ' + k ) ;
		set.delete( j ) ;
		++k ;
	} , V( g ) ) ) ;

	deepEqual( k , v.length , 'check vertex count after del' ) ;

	e[0].splice(2, 1);

	// delete remaining edges
	r.forEach( function ( m ) {
		while ( e[m].length ) g.edel( e[m].splice( 0 , 1 )[0] ) ;
	} ) ;

	ex( map( function ( e ) {
		ok( false , 'aeitr never go here') ;
	} , E( g ) ) ) ;

	ex( map( function ( i ) {
		ex( map( function ( e ) {
			ok(false, 'iitr never go here');
		} , g.iitr( i ) ) ) ;
	} , V( g ) ) ) ;

	// delete remaining vertices
	while ( v.length ) g.vdel(v.splice(0, 1)[0]) ;

	ex( map( function ( i ) {
		ok( false , 'vitr never go here') ;
	} , V( g ) ) ) ;


});
