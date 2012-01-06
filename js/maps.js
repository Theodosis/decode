var Map = {
    config: {
        cities: {
            "Thessaloniki": { lat: 40.6410, lng: 22.9451, zoom: 12 }
        }
    },
    markers: {},
    Callback: function(){
        var city = Map.config.cities.Thessaloniki;
        var myOptions = {
            zoom: city.zoom,
            center: new google.maps.LatLng( city.lat, city.lng  ),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        Map.Map = new google.maps.Map( document.getElementById( 'map' ), myOptions );
        
        DB._bind( 'sync-complete-shops', function(){
            for( var i = 0; i < shops.length; ++i ){
                Map.markers[ shops[ i ].id ] = new google.maps.Marker( {
                    position: new google.maps.LatLng(
                        shops[ i ].lat,
                        shops[ i ].lng
                    ),
                    map: Map.Map,
                    title: shops[ i ].name,
                    clickable: true
                } );
                google.maps.event.addListener( Map.markers[ shops[ i ].id ], 'click', function( marker, shop ){
                    return function(){

                        var o = new google.maps.InfoWindow({
                            content: shop.name,
                        } );
                        o.open( Map.Map, marker );
                        Map.popup && Map.popup.close();
                        Map.popup = o;
                    }
                }( Map.markers[ shops[ i ].id ], shops[ i ] ) );
            }
            
        } );
    },
    Init: function(){
        //Check Callback too.
        eventize( this );
        var script = document.createElement( "script" );
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=Map.Callback";
        document.body.appendChild( script );
    } 
};
