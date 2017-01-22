if( typeof require != 'undefined' )
  var j2c = require( 'j2c' )

const rules     = []
const sheets    = []
const selectors = new Map()

let initialised = false

function init(){
  m.mount(
    document.head.appendChild(
      document.createElement( 'style' )
    ),
    {
      view : () =>
        sheets()
    }
  )
}

function process( style_function ){
  return vnode => {
    if( !initialised ) init()

    const rule  = style_function( vnode )
    const index = rules.indexOf( JSON.stringify( rule ) )

    let   sheet

    if( index == -1 ){
      sheet = j2c( { ' ' : rule } )

      rules.push( rule )
      sheets.push( sheet )
    }
    else {
      sheet = sheets[ index ]
    }

    selectors.set( vnode.state, sheet[ ' ' ] )
  }
}

function stylem( style_function ){
  return {
    oninit : process( style_function ),
    onbeforeupdate : process( style_function ),
    onremove : vnode => {
      selectors.delete( vnode.state )
    },
    view : vnode =>
      m( '.' + state.get( vnode.state ) )
  }
}

Object.assign( stylem, {
  selectors : vnode =>
    selectors.get( vnode.state )
} )

if( typeof module != 'undefined' ) module[ 'exports' ] = stylem
else if( typeof window != 'undefined' ) window.stylem  = stylem
