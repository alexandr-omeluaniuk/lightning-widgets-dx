/**
 * Created by ss on 16/02/18.
 */
({
    init: function (component, event, helper) {

    },
    refreshMap: function (component, event, helper) {
        var isValid = component.find('mapforminput').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        if(isValid){
            component.find('leflet-map').refreshMap();
        }
    },
    handleMapEvent: function (component, event, helper) {
        // nothing
    },
    myLocation: function (component, event, helper) {
        component.find('leflet-map').myLocation();
    }
})