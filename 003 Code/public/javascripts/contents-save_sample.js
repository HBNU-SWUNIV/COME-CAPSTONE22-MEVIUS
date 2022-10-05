/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('contents-save', {
    schema: {
        scene_id: {type: 'string', default:"hello"},
    },
/*
    init: function () {
        var data = this.data;
        var el = this.el;

        this.el.addEventListener('click', function (event) {
            event.preventDefault();
            // Fade out image.
            window.location = data.url;
            // Wait for fade to complete.
        });
    },*/
    init: function () {
    
    var self = this;

    this.el.addEventListener('click', function (evt) {
      var el1 = document.querySelectorAll('a-link');
      var el2 = document.querySelector('#box1');
      
      // var el3 = document.querySelector('#boxtest2');

      console.log(el2);

      var jdata = new Object();

      for(elem of el1)
      {
        jdata[elem.getAttribute('loc')] = [elem.getAttribute('position'), elem.getAttribute('rotation')];
      }

      jdata[el2.getAttribute('id')] = [el2.getAttribute('position'), el2.getAttribute('rotation')];
      // jdata[el3.getAttribute('id')] = [el3.getAttribute('position'), el3.getAttribute('rotation')];

      // for(elem of el1){console.log(`jdata id : ${jdata}`);}
      // console.log(el2.getAttribute('position'))
      el2.setAttribute('material', 'color', 'purple');
      this.setAttribute('material', 'color', 'green');

      //console.log('I was clicked at: ', evt.detail.intersection.point);

      var url = 'scene_update/' + self.data.scene_id;
      console.log(url);
      /*$.ajax({
          type: "PUT",
          url: url,
          data: el1,
      });*/
      var xhr = new XMLHttpRequest();
      
      const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8'); 
      
      xhr.onreadystatechange = function() { // Call a function when the state changes.
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
             console.log(`responseText : ${xhr.responseText}`); //updated done
          }
      }
      console.log(`JSON : ${JSON.stringify(jdata, getCircularReplacer())}`);
      xhr.send(JSON.stringify(jdata, getCircularReplacer()));
    });
  }
});