/**
 * Created by ss on 20/02/18.
 */
({
    openModal: function (component) {
        component.find('dialog').open();
        console.log(component.get('v.value'));
    },
    closeWindow: function (component) {
        component.find('dialog').close();
    },
    ok: function (component) {
        alert('You are press OK :)');
        component.find('dialog').close();
    }
})