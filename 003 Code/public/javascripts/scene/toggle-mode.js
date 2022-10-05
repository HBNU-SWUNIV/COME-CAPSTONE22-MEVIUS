window.selectTranslate = function() {
    var rotate = document.getElementById('rotate');
    var scale = document.getElementById('scale');
    //var translate = document.getElementById('translate');

    rotate.components['gui-button'].setActiveState(false);
    scale.components['gui-button'].setActiveState(false);
}

window.selectRotate = function() {
    //var rotate = document.getElementById('rotate');
    var scale = document.getElementById('scale');
    var translate = document.getElementById('translate');

    translate.components['gui-button'].setActiveState(false);
    scale.components['gui-button'].setActiveState(false);
}

window.selectScale = function() {
    var rotate = document.getElementById('rotate');
    //var scale = document.getElementById('scale');
    var translate = document.getElementById('translate');

    rotate.components['gui-button'].setActiveState(false);
    translate.components['gui-button'].setActiveState(false);
}


window.toggleCustomInspector = function(evt) {
    evt.preventDefault(); //두번 눌러야 동작.. 왜지?
    var insBtn = document.getElementById('inspectorBtn');
    var objContainerEl = document.getElementById('objContainer');

    insBtn.addEventListener('click', function() {

        var visible = objContainerEl.getAttribute('visible');

        console.log(visible);
        if(!visible) {
            objContainerEl.setAttribute('visible', true);
        } else {
            objContainerEl.setAttribute('visible', false);
        }

        var inspector = scene.components.inspector;
        var scene = document.querySelector('a-scene');
        
        // Show inspector immediately.
        inspector.injectInspector();

        window.postMessage('INJECT_AFRAME_INSPECTOR','*');
       
        // // Show inspector after event.
        // scene.addEventListener('loaded', function () {
        //   inspector.injectInspector();
        // });
    });
}