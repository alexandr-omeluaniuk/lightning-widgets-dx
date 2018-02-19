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
        var initLayer = component.get('v.initLayer');
        component.get('v.layers').forEach(function(layer) {
            if (layer.id === initLayer) {
                L.tileLayer(layer.url, {}).addTo(component.map);
            }
        });
        helper.registerEvents(component);
    },
    initControls: function (component) {
        var helper = this;
        helper.initLayerControl(component);
        helper.initLocationControl(component);
        // =====================================================================
        L.control.layerSwitcher({ position: 'topright' }).addTo(component.map);
        L.control.myLocation({ position: 'topright' }).addTo(component.map);
    },
    // ================================ PRIVATE ================================
    fireAuraEvent: function (component, type, params) {
        var event = component.getEvent("mapEvent");
        event.setParams({
            'nativeEventType': type,
            'nativeEventParams': params
        })
        event.fire();
    },
    createControlButton: function (title, icon, onClick, cssClass) {
        var button = document.createElement('button');
        button.innerHTML = '<span data-aura-rendered-by="182:8;a" class="lightningPrimitiveIcon" data-aura-class="lightningPrimitiveIcon"><svg class="slds-button__icon " focusable="false" aria-hidden="true" data-key="checkin">'
                            + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/_slds/icons/utility-sprite/svg/symbols.svg?cache=8.2.0#' + icon + '"></use>'
                            + '</svg></span>';
        button.setAttribute('title', title);
        button.setAttribute('class', 'slds-button slds-button--icon-border map-control' + (cssClass ? ' ' + cssClass : ''));
        button.addEventListener('click', onClick);
        return button;
    },
    initLayerControl: function (component) {
        var helper = this;
        L.Control.LayerSwitcher = L.Control.extend({
            onAdd: function(map) {
                var container = document.createElement('div');
                container.setAttribute('class', 'ss-button-group');
                var buttons = [];
                var layers = component.get('v.layers');
                var toggleGroupState = function () {
                    var count = 0;
                    buttons.reverse().forEach(function (layerBtn) {
                        setTimeout(function () {
                           $A.util.toggleClass(layerBtn, 'ss-tip-btn-hidden');
                        }, Math.exp(count * 1));
                        count++;
                    });
                };
                layers.forEach(function (layer) {
                    var layerBtn = helper.createControlButton(layer.title, layer.icon, function () {
                        component.map.eachLayer(function (l) {
                            component.map.removeLayer(l);
                        });
                        L.tileLayer(layer.url, {}).addTo(component.map);
                        component.set('v.initLayer', layer.id);
                        toggleGroupState();
                    }, 'ss-tip-btn ss-tip-btn-hidden');
                    container.appendChild(layerBtn);
                    buttons.push(layerBtn);
                });
                var button = helper.createControlButton('Change layer', 'apps', toggleGroupState);
                container.appendChild(button);
                return container;
            }
        });
        L.control.layerSwitcher = function(opts) {
            return new L.Control.LayerSwitcher(opts);
        }
    },
    initLocationControl: function (component) {
        var helper = this;
        L.Control.MyLocation = L.Control.extend({
            onAdd: function(map) {
                return helper.createControlButton('My location', 'checkin', function () {
                    component.map.locate({
                        setView: true,
                        maxZoom: 16
                    });
                });
            }
        });
        L.control.myLocation = function(opts) {
            return new L.Control.MyLocation(opts);
        }
    }
})