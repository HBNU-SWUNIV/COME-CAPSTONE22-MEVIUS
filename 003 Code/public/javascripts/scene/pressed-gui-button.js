AFRAME.registerComponent('pressed-gui-button', {

    init: function () {
        //var sceneEl = document.querySelector('a-scene');
        var objectEl = document.querySelector('#objects');
        var markerEl = document.querySelector('#marker');

        var COLORS = [
            'pink',
            'blue',
            'yellow',
            'red',
            'peachpuff',
            '#2EAFAC',
            '#BAE'];

        // Add boxe when spacebar is pressed.
        this.el.addEventListener('click', function (e) {

            var newEl = document.createElement('a-entity');
            newEl.setAttribute('id', 'boxtest');
            newEl.setAttribute('geometry', { primitive: this.id });
            newEl.setAttribute('material', 'color', COLORS[Math.floor(Math.random() * COLORS.length)]); //random color
            newEl.setAttribute('loc', this.id + new Date().getTime() / 100);

            objectEl.appendChild(newEl);

            //newEl.classList.add('clickable');
            //newEl.addEventListener('click', handleClickEvent);

            var position = markerEl.object3D.getWorldPosition();

            //position.y = 0.5;;
            newEl.setAttribute('position', position);

            var sceneEl = AFRAME.INSPECTOR.sceneEl;
            console.log(sceneEl.camera.rotation);
        });
    }
});

// 해당 오브젝트가 맞는지 확인하는 용
// function handleClickEvent(event) {
//     event.preventDefault();

//     var obj = event.target;

//     console.log(obj.id);
//     console.dir(obj);
//     //- console.log(obj.getAttribute("position"));
// }

AFRAME.registerComponent('object-link', {
    schema: {
        sceneName: { type: 'string', default: 'none' },
        sceneId: { type: 'string', default: 'none' }
    },
    init: function () {
        // console.log("========================================");
        // console.log(this.data.sceneName);
        // console.log(this.data.sceneId);

        var HREF = 'http://localhost:3000/vr/';

        var nameList = this.data.sceneName.split(',');
        var idList = this.data.sceneId.split(',');

        // console.log("<<<<<<<<<<<<");
        // console.log(nameList);
        // console.log(idList);

        this.el.addEventListener('click', function (e) {

            var objectEl = document.querySelector('#objects');
            var markerEl = document.querySelector('#marker');
            var sceneHref = '';

            (async () => {

                const { value: text } = await Swal.fire({
                    title: 'Link 이름을 입력해주세요',
                    input: 'text',
                    inputLabel: '영어로 작성해주세요',
                    width: 600,
                    inputPlaceholder: 'Link 이름 작성',
                    showCancelButton: true
                })

                if (text) {
                    //list
                    const { value: scene } = await Swal.fire({
                        title: 'Scene 선택',
                        input: 'select',
                        inputOptions: {
                            'Scene List': nameList
                        },
                        inputPlaceholder: 'Scene 선택',
                        showCancelButton: true,
                        inputValidator: (value) => {
                            return new Promise((resolve) => {
                                if (value) {
                                    sceneHref = HREF + idList[value];
                                    resolve();
                                } else {
                                    resolve('연결할 Scene을 선택해주세요!');
                                }
                            })
                        }
                    })

                    //   if (scene) {
                    //     Swal.fire(`You selected: ${scene}`)
                    //   }
                    if (scene) {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'center',
                            showConfirmButton: false,
                            timer: 1000
                        })

                        Toast.fire({
                            icon: 'success',
                            iconColor: '#7066e0',
                            title: 'Link가 생성되었습니다!'
                        })

                        var linkEl = document.createElement('a-entity');
                        linkEl.setAttribute('text', {
                            value: `${text}`,
                            width: 7,
                            align: 'center',
                            anchor: 'align',
                            baseline: 'bottom'
                        });

                        linkEl.setAttribute('geometry', { primitive: 'box' });
                        linkEl.setAttribute('class', 'clickable');
                        linkEl.setAttribute('material', { color: 'purple' });
                        linkEl.setAttribute('link', 'href', sceneHref);

                        var position = markerEl.object3D.getWorldPosition();
                        linkEl.setAttribute('position', position);
                        objectEl.appendChild(linkEl);
                    }
                } else if (text === '') {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 1000
                    })

                    Toast.fire({
                        icon: 'warning',
                        title: '링크 이름을 입력해주세요!'
                    })
                }
            })()
        });
    }
});