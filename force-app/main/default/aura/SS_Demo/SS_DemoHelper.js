/**
 * Created by ss on 16/02/18.
 */
({
    createDemoComponent: function(component) {
        var widget = component.get('v.currentWidget');
        $A.createComponent(
            widget,
            {},
            function(newComponent, status, errorMessage){
                if (status === "SUCCESS") {
                    var demoComponent = component.get("v.demoComponent");
                    demoComponent.forEach(function(c) {
                        c.destroy();
                    });
                    demoComponent = [];
                    demoComponent.push(newComponent);
                    component.set("v.demoComponent", demoComponent);
                } else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                    // Show offline error
                } else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                    // Show error message
                }
            }
        );
    }
})