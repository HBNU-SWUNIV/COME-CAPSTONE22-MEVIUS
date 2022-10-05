// import TransformControls from './TransformControls';

AFRAME.registerComponent('object-control', {
    init: function() {
        
        this.el.addEventListener('click', evt => {
            var transEl = document.querySelector('#translate');
            var rotateEl = document.querySelector('#rotate');
            var scaleEl = document.querySelector('#scale');
            console.log(`mode : ${this.el.id} `); //check

            this.setMode('scale');
            THREE.TransformControls();
        });

        // switch(this.id){
        //     case "translate":
        //         console.log('translate');
        //         var _mode = 'translate';
        //         break;
        //     case "scale":
        //         console.log('scale');
        //         var _mode = 'scale';
        //         break;
        //     case "rotate":
        //         console.log('rotate');
        //         var _mode = 'rotate';
        //         break;
        // }
    }
});