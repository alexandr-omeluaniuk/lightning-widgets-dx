/**
 * Created by ss on 16/02/18.
 */
({
    registerEvents: function (component) {
        var helper = this;
        var map = component.map;
        map.on('move', function(e) {
            var latLng = map.getCenter();
            component.set('v.initLatitude', latLng.lat);
            component.set('v.initLongitude', latLng.lng);
            helper.fireAuraEvent(component, 'move', latLng);
        });
        map.on('zoom', function(e) {
            var zoom = map.getZoom();
            component.set('v.initZoom', zoom);
            helper.fireAuraEvent(component, 'zoom', zoom);
        });
        map.on('locationfound', function (e) {
            var radius = parseFloat(e.accuracy / 2).toFixed(1);
            L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius
                    + " meters from this point").openPopup();
            L.circle(e.latlng, radius).addTo(map);
            helper.fireAuraEvent(component, 'locationfound', e);
        });
        map.on('locationerror', function (e) {
            helper.fireAuraEvent(component, 'locationerror', e);
        });
    },
    initMap: function (component) {
        var helper = this;
        var mapElement = component.find("map").getElement();
        if (!mapElement) {
            return;
        }
        component.map = L.map(mapElement, {
            zoomControl: false
        }).setView([
                component.get('v.initLatitude'),
                component.get('v.initLongitude')
                ],
            component.get('v.initZoom')
        );
        L.tileLayer(
            component.get('v.initLayer'), {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(component.map);
        helper.registerEvents(component);
    },
    fireAuraEvent: function (component, type, params) {
        var event = component.getEvent("mapEvent");
        event.setParams({
            'nativeEventType': type,
            'nativeEventParams': params
        })
        event.fire();
    },
    initControls: function (component) {
        L.Control.MyLocation = L.Control.extend({
            onAdd: function(map) {
                var button = document.createElement('button');
                button.innerHTML = '<span data-aura-rendered-by="182:8;a" class="lightningPrimitiveIcon" data-aura-class="lightningPrimitiveIcon"><svg class="slds-button__icon " focusable="false" aria-hidden="true" data-key="checkin">'
                                    + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/_slds/icons/utility-sprite/svg/symbols.svg?cache=8.2.0#checkin"></use>'
                                    + '</svg></span>';
                button.setAttribute('title', "My location");
                button.setAttribute('class', 'slds-button slds-button--icon-border map-control');
                button.addEventListener('click', function () {
                    component.map.locate({
                        setView: true,
                        maxZoom: 16,
                        watch: true,
                        animate: true
                    });
                });
                return button;
            },
            onRemove: function(map) {
                // Nothing to do here
            }
        });
        L.control.myLocation = function(opts) {
            return new L.Control.MyLocation(opts);
        }
        L.control.myLocation({ position: 'topright' }).addTo(component.map);
    }
})