/**
 * Created by ss on 15/02/18.
 */
({
    rerender: function (component, helper) {
        var nodes = this.superRerender();
        // If the Leaflet library is not yet loaded, we can't draw the map: return
        if (!window.L) {
            return nodes;
        }
        // Draw the map if it hasn't been drawn yet
        if (!component.map) {
            helper.initMap(component);
        }
        return nodes;
    }
})