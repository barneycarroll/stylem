const o = require( 'mithril/ospec' )

const window = require( 'jsdom' ).jsdom().defaultView

for( const x in window )
  if( !( x in global ) )
    global[ x ] = window[ x ]

const m      = require( 'mithril' )
const stylem = require( '../stylem' )

const frames = ( frames = 1 ) =>
  new Promise( done =>
    setTimeout( done, 16 * frames )
  )

o( 'Consumes a function, returns a component', () => {
  o( typeof stylem( () => {} ) ).equals( 'object' )
  o( typeof stylem( () => {} ).view ).equals( 'function' )
} )

o( 'Style function returns a style rule object which applies to the component root', done => {
  const StyledComponent = stylem( () => ( {
    color : 'red'
  } ) )

  m.mount( document.body, StyledComponent )

  frame().then( () => {
    o( getComputedStyle( document.body.firstChild ) )

    done()
  } )
} )
