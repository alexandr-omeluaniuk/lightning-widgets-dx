/**
 * Created by ss on 15/02/18.
 */
({
    init: function(component, event, helper) {
        var token = component.get('v.mapboxToken');
        var layers = [{
            id: 'DEFAULT',
            icon: 'favorite',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            title: 'Default OSM'
        }, {
            id: 'STREETS',
            icon: 'location',
            url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + token,
            title: 'Streets'
        }, {
            id: 'DARK',
            icon: 'info',
            url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=' + token,
            title: 'Dark'
        }, {
            id: 'LIGHT',
            icon: 'info_alt',
            url: 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=' + token,
            title: 'Light'
        }, {
            id: 'OUTDOORS',
            icon: 'activity',
            url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=' + token,
            title: 'Outdoors'
        }, {
            id: 'SATELLITE',
            icon: 'image',
            url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + token,
            title: 'Satellite'
        }];
        layers.reverse();
        component.set('v.layers', layers);
    },
    jsLoaded : function(component, event, helper) {
        component.set("v.jsLoaded", true);
    },
    refreshMap : function(component, event, helper) {
        var map = component.map;
        if (map) {
            map.setView(
                [component.get('v.initLatitude'), component.get('v.initLongitude')],
                component.get('v.initZoom')
            );
        }
    },
    toggleMapVisibility : function(component, event, helper) {
        var mapVisibility = component.get('v.mapVisibility');
        mapVisibility = !mapVisibility;
        component.set('v.mapVisibility', mapVisibility);
        if (mapVisibility) {
            component.set('v.destroyMap', false);
            window.setTimeout(
                $A.getCallback(function() {
                    delete component.map;
                    helper.initMap(component);
                }), 400     // related with CSS animation
            );
        } else {
            component.set('v.destroyMap', true);
        }
    },
    myLocation : function(component, event, helper) {
        helper.myLocation(component);
    }
})