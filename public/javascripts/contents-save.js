/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('contents-save', {
  schema: {
    scene_id: { type: 'string', default: "hello" },
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
      var el1 = document.querySelectorAll('a-link');    // link querySelect
      var el2 = document.querySelectorAll('#boxtest');  // boxtest querySelect

      console.log(self);
      console.log(el1);
      console.log(el2);

      var jdata = new Object();   // DB로 보낼 jdata
      var jarray = [];            // boxtest entity 담을 array

      //jdata.left   = el1[0].getAttribute('position');
      //jdata.right  = el1[1].getAttribute('position');
      //jdata.up     = el1[2].getAttribute('position');
      //jdata.down   = el1[3].getAttribute('position');

      // jdata에 link 넣기
      for (elem of el1) {
        // jdata[elem.getAttribute('title')] = [elem.getAttribute('position'), elem.getAttribute('rotation')];
        jdata[elem.getAttribute('loc')] = [elem.getAttribute('position'), elem.getAttribute('rotation')];
      }
      console.log(jdata);
      // console.log(`jdata : ${jdata}`);

      // jarray에 entity array로 넣기
      for (elem2 of el2) {
        // jarray.push([elem2.getAttribute('position'), elem2.getAttribute('rotation'), elem2.getAttribute('id'), elem2.getAttribute('loc'), elem2.getAttribute('geometry').primitive, elem2.getAttribute('material').color]);

        jarray.push([elem2.getAttribute('position'), elem2.getAttribute('rotation'), elem2.getAttribute('scale'), elem2.getAttribute('id'), elem2.getAttribute('loc'), elem2.getAttribute('geometry').primitive, elem2.getAttribute('material').color]);
      }

      // jdata에서 key가 boxtest이고, value가 jarray로 넣기
      jdata['boxtest'] = jarray;

      // console.log('jdata', jdata);

      // el2 여러 개
      // for(elem of el2)
      // {
      //   jdata[elem.getAttribute('loc')] = [elem.getAttribute('position'), elem.getAttribute('rotation'), elem.getAttribute('id'), elem.getAttribute('loc'), elem.getAttribute('mixin'), elem.getAttribute('color')];
      //}

      // el2 한 개 --> 잘 동작함
      // jdata[el2.getAttribute('id')] = [el2.getAttribute('position'), el2.getAttribute('rotation'), el2.getAttribute('id'), el2.getAttribute('loc'), el2.getAttribute('mixin'), el2.getAttribute('color')];

      // for(elem of el1){console.log(`jdata id : ${jdata}`);}
      // console.log(el2.getAttribute('position'))

      // save 클릭했을 때 green으로 바꾸기
      this.setAttribute('material', 'color', 'green');

      //console.log('I was clicked at: ', evt.detail.intersection.point);
      console.log(self.data);
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
          if (typeof value === "object" && value !== null) { // object, array(boxtest)
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };

      try {
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        xhr.onreadystatechange = function () { // Call a function when the state changes.
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(`responseText : ${xhr.responseText}`); //updated done
          }
        }
        //console.log(`JSON : ${JSON.stringify(jdata, getCircularReplacer())}`);
        xhr.send(JSON.stringify(jdata, getCircularReplacer()));

        const Toast = Swal.mixin({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 1000
        });

        Toast.fire({
          icon: 'success',
          iconColor: '#a5dc86',
          title: '저장되었습니다'
        });
      } catch (error) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 1000
        });

        Toast.fire({
          icon: 'error',
          iconColor: '#f27474',
          title: '저장에 실패했습니다'
        });
      }
    });
  }
});