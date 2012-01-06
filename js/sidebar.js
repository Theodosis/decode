var Sidebar = {
    Init: function(){
        DB._bind( 'sync-complete-categories', function(){
            $( '#categories' ).empty();
            var li = $( "<li class='selected'></li>" );
            for( var i = 0; i < categories.length; ++i ){
                $( '#categories' ).append( li.clone().attr( 'id', 'category_' + categories[ i ].id ).text( categories[ i ].name ) );
            }
        } );

        $( '#categories li' ).live( 'click', function(){
            if( $( this ).hasClass( 'selected' ) ){
                $( this ).removeClass( 'selected' );
                getById( categories, $( this ).attr( 'id' ).split( '_' )[ 1 ] ).hide();
            }
            else{
                $( this ).addClass( 'selected' );
                getById( categories, $( this ).attr( 'id' ).split( '_' )[ 1 ] ).show();
            }
        } );
    }
};
