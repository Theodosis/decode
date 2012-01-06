function eventize( item ){
    if( typeof item != 'object' ){
        return false;
    }
    
    item._listeners = [];
    item._waiting = [];
    item._bind = function( type, callback ){
        if( typeof( item._listeners[ type ] ) == 'undefined' ){
            item._listeners[ type ] = [];
        }
        item._listeners[ type ].push( callback );
        if( item._waiting[ type ] ){
            item._fire( type );
        }
    };
    item._once = function( type, callback ){
        callback.prototype.once = true;
        item._bind( type, callback );
    };
    item._fire = function( type, wait ){
        if( typeof item._listeners[ type ]  == 'undefined' ){
            if( wait ){
                item._waiting[ type ] = true;
            }
            return;
        }
        var args = [];
        var count = 0;
        for( var i in arguments ){
            if( !count++ ){
                continue;
            }
            if( count > arguments.length ){
                break;
            }
            args[ i ] = arguments[ i ];
        }
        for( var i in item._listeners[ type ] ){
            item._listeners[ type ][ i ].apply( null, args.splice( 1 ) );
            if( item._listeners[ type ][ i ].prototype.once === true ){
                item._listeners[ type ].splice( i, 1 );
            }
        }
    };
}

getById = function( arr, id ){
    return arr.filter( function( e ){
        return e.id == id;
    } )[ 0 ];
}

/*
   Array.prototype.getById = function( id ){
    if( !this.filter ){
        return false;
    }
    return this.filter( 
        function(){ 
            return this.id == id; 
        } 
    )[ 0 ];
};
*/
