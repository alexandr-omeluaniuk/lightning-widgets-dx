/**
 * Created by ss on 15/02/18.
 */
({
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
            setTimeout(function() {
                delete component.map;
                helper.initMap(component);
                helper.initControls(component);
            }, 400);    // related with CSS animation
        } else {
            component.set('v.destroyMap', true);
        }
    }
})