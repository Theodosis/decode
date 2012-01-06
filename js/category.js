function category( data ){
    this.id = data.id;
    this.name = data.name;
    this.__defineGetter__( 'shops', function( id ){
        return function(){
            return shops.filter( function( a ){
                return a.categoryid == id;
            } );
        }
    }( this.id ) );
    this.hide = function(){
        for( var i = 0; i < this.shops.length; ++i ){
            this.shops[ i ].hide();
        }
    }
    this.show = function(){
        for( var i = 0; i < this.shops.length; ++i ){
            this.shops[ i ].show();
        }
    }
}
categories = [];
