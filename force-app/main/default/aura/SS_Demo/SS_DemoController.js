/**
 * Created by ss on 15/02/18.
 */
({
    init: function(component, event, helper) {
        var widgets = [
            { value: "c:SS_Demo_Map", label: "Map" }
        ];
        component.set('v.widgets', widgets);
        helper.createDemoComponent(component);
    },
    switchWidget: function(component, event, helper) {
        helper.createDemoComponent(component);
    }
})