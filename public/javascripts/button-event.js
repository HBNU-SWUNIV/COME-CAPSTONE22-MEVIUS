// import * as onclick_event from './onclick-event.js';

function box() {
    var sceneEl = document.querySelector('a-scene');
    var markerEl = document.querySelector('#marker');  
    var boxEl = document.querySelector('#box');

    //boxEl.off('click');
    boxEl.unbind('click').bind('click');

    // Add boxe when spacebar is pressed.
    boxEl.addEventListener('click', function (e) {
        //if (e.keyCode !== 32) return;
        var newEl = document.createElement('a-box');
        newEl.setAttribute('color', 'red');
        // newEl.setAttribute('clickable', true);
        // newEl.onclick = function() { console.log("hello"); };
        sceneEl.appendChild(newEl);
        var position = markerEl.object3D.getWorldPosition();
        //position.y = 0.5;
        newEl.setAttribute('position', position);
    });
}

function circle() {
    var sceneEl = document.querySelector('a-scene');
    var markerEl = document.querySelector('#marker');
    var circleEl = document.querySelector('#circle');

    //circleEl.off('click');
    circleEl.unbind('click').bind('click');

    // Add boxe when spacebar is pressed.
    circleEl.addEventListener('click', function (e) {
        //if (e.keyCode !== 32) return;
        var newEl = document.createElement('a-sphere');
        newEl.setAttribute('color', 'blue');
        sceneEl.appendChild(newEl);
        var position = markerEl.object3D.getWorldPosition();
        //position.y = 0.5;
        newEl.setAttribute('position', position);
    });
}

function cylinder() {
    var sceneEl = document.querySelector('a-scene');
    var markerEl = document.querySelector('#marker');
    var cylinderEl = document.querySelector('#cylinder');

    //cylinderEl.off('click');
    cylinderEl.unbind('click').bind('click');

    // Add boxe when spacebar is pressed.
    cylinderEl.addEventListener('click', function (e) {
        //if (e.keyCode !== 32) return;
        var newEl = document.createElement('a-cylinder');
        newEl.setAttribute('color', 'yellow');
        sceneEl.appendChild(newEl);
        var position = markerEl.object3D.getWorldPosition();
        //position.y = 0.5;
        newEl.setAttribute('position', position);
    });
}