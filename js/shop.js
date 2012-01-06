function shop( data ){
    this.id = data.id;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.timestamp = data.timestamp;
    this.categoryid = data.categoryid;
    this.__defineGetter__( 'category', function(){
        for( var i = 0; i < categories.length; ++i ){
            if( categories[ i ].id == this.categoryid ){
                return categories[ i ];
            }
        }
        return false;
    } );
    this.visible = true;
    this.hide = function(){
        this.visible = false;
        Map.markers[ this.id ].setVisible( false );
    };
    this.show = function(){
        this.visible = true;
        Map.markers[ this.id ].setVisible( true );
    };
}
shops = [];
