var DB = {
    sync: {},
    schema: {
        shops: [
            'id real unique', 
            'name text', 
            'lat text', 
            'lng text', 
            'categoryid real', 
            'timestamp real'
        ],
        categories: [
            'id real unique', 
            'name text'
        ]
    },
    SyncTable: function( table, root ){
        DB.Query( "CREATE TABLE IF NOT EXISTS `" + table + "` ( " + DB.schema[ table ].join( ', ' ) + " );" );
        $.get( table + '.xml?ts=' + localStorage[ table ], function( data ){
            if( localStorage[ table ] == $( data ).children().attr( 'timestamp' ) ){
                DB.LoadTable( table, root );
                return;
            }
            DB.sync[ table ] = { 
                total: $( data ).find( root ).length, 
                current: 0
            };

            
            var rows = [];
            var q = [];
            var ids = [];
            for( var i = 0; i < DB.schema[ table ].length; ++i ){
                q.push( "?" );
            }
            
            $( data ).find( root ).each( function( i ){
                var row = [];
                $( this ).children().each( function(){
                    row.push( $( this ).text().replace( '"', '\\"' ) );
                } );
                rows.push( row );
                ids.push( $( this ).children( 'id' ).text() );
            } );
            DB.Query( "DELETE FROM `" + table + "` WHERE id IN (" + ids.join( ',' ) + ");" );
            DB.Query( "INSERT INTO `" + table + "` values (" + q.join( ',' ) + ");", rows, function(){
                ++DB.sync[ table ].current;
                if( DB.sync[ table ].current == DB.sync[ table ].total ){
                    DB.LoadTable( table, root );
                }
            } );
            
            localStorage[ table ] = $( data ).children().attr( 'timestamp' );
        } );
    },
    LoadTable: function( table, name ){
        DB.Query( "SELECT * FROM `" + table + "`;", [[]], function( items ){
            var length = items.rows.length;
            
            var cat = eval( table );
            for( var i = 0; i < length; ++i ){
                var item = eval( 'new ' + name + "( " + JSON.stringify( items.rows.item( i ) ) + " )" );
                cat.push( item );
            }
            DB._fire( 'sync-complete-' + table, true );
        } );
    },
    Query: function( query, data, success, failure ){
        if( !DB.db ){
            return false;
        }
        this.db.transaction( function( tx ){
            if( !data ){
                data = [[]];
            }
            for( var i = 0; i < data.length; ++i ){
                tx.executeSql( query, data[ i ],
                    function( tx, results ){
                        console.log( "Query executed successfully. " + query );
                        if( typeof success == 'function' ){
                            success( results );
                        }
                    },
                    function( tx, result ){
                        console.log( "An error occured. query: " + query );
                        if( typeof failure == 'function' ){
                            failure( results );
                        }
                    }
                );
            }
        } );
    },
    Fetch: function( table, root ){
        $.get( table + ".xml", function( data ){
            var cat = eval( table );
            $( data ).find( root ).each( function( i ){
                var row = {};
                $( this ).children().each( function(){
                    row[ this.localName ] = $( this ).text().replace( '"', '\\"' );
                } );
                var item = eval( 'new ' + root + "( " + JSON.stringify( row ) + " );" );
                cat.push( item );
            } );
            DB._fire( 'sync-complete-' + table, true );
        } );
    },
    Init: function(){
        eventize( this );
        if( typeof openDatabase == 'function' && !!localStorage ){
            this.db = openDatabase( 'Decode', '1', 'shop database', 3072 * 1024 ); //3MB
            DB.SyncTable( 'shops', 'shop' );
            DB.SyncTable( 'categories', 'category' );
        }
        else{
            DB.Fetch( 'shops', 'shop' );
            DB.Fetch( 'categories', 'category' );
        }
    }
};
