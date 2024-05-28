function inputBarcode() {
    var CONSTRAINTS = {
        video: {
            width: { ideal: 1280 },
            height: { ideal: 960 },
            resizeMode: 'none',
            focusMode: 'auto',
            frameRate: 10,
            aspectRatio: 4 / 3,

        }
    };
    const FORMATS = {
        formats: [
            'aztec',
            'code_128',
            'code_39',
            'code_93',
            'codabar',
            'data_matrix',
            'ean_13',
            'ean_8',
            'itf',
            'pdf417',
            'qr_code',
            'upc_a',
            'upc_e'
        ]
    };
    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext('2d');

    var currentController;

    function initDevices ( element ) {
        const streamBox = document.createElement( 'div' );
        streamBox.hidden = true;
        streamBox.setAttribute( 'customType', 'streamBox' );
        canvas.className = 'barcode';
        const video = document.createElement( 'video' );
        video.className = 'barcode';
        video.onloadedmetadata = ( event => video.play() );
        video.onplay = (event => {
            video.hidden = false;
            video.intervalId = setInterval( () => readBarcode( video, element), 100);
        });
        const toolbar = document.createElement( 'div' );
        streamBox.appendChild( video );
        streamBox.appendChild( canvas );
        streamBox.appendChild( toolbar );

        new MutationObserver ( function (mutation, observer) {
            const parentForm = element.closest( '[lsfusion-form]' );
            if ( parentForm ) {
                parentForm.appendChild( streamBox );
                observer.disconnect();
            }
        }).observe( document.body, { childList: true } );

        if ( navigator.mediaDevices !== undefined ) {
            navigator.mediaDevices.enumerateDevices()
                .then( devices => {
                    const cameras = devices.filter( device => device.kind == 'videoinput' )
                    if ( cameras.length ) {
                        if ( cameras.length > 1 ) {
                            cameras.forEach( (camera, index) => {
                                const changer = document.createElement('button');
                                changer.id = camera.deviceId;
                                changer.innerText = index + 1;
                                changer.onclick = (event => {
                                    video.hidden = true;
                                    CONSTRAINTS.video.deviceId = event.srcElement.id;
                                    play( video );
                                    } );
                                toolbar.append( changer );
                            })
                        }
                        CONSTRAINTS.video.deviceId = cameras[cameras.length - 1].deviceId;
                    }
                })
        }
    }

    function addKeyboard( element ) {
        const icon = document.createElement( 'div' );
        icon.className = 'iconKeyboard';
        element.append( icon );
        icon.onmousedown = function() {
            const inp = element.querySelector( '[contenteditable=true]' );
            if ( inp.inputMode == 'none' ) {
                inp.inputMode = 'text';
            } else {
                inp.inputMode = 'none';
            }
        }
    }
    function addCamera( element ) {
        const icon = document.createElement( 'div' );
        icon.className = 'iconCamera';
        element.append( icon );
        icon.onmousedown = ( event => cameraVideo( element ));
    }

    function readBarcode ( video, element) {
        if ( 'BarcodeDetector' in window ) {
            const inp = element.querySelector( '[contenteditable=true]' );
            const barcodeDetector = new BarcodeDetector( FORMATS );
            barcodeDetector.detect( video )
                .then( function( barcodes ) {
                    if ( barcodes.length && currentController ) {
                        let barcode = barcodes[length - 1];
                        const box = barcode.boundingBox;
                        context.strokeStyle = 'yellow';
                        context.drawImage( video, box.x, box.y, box.width, box.height, 0, 0, canvas.width, canvas.height );
                        video.hidden = true;
                        currentController.changeValue( barcode.rawValue );
                        currentController = null;
                        var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
                        snd.play();
                        setTimeout( () => context.clearRect(0, 0, canvas.width, canvas.height), 500 );
//                        barcodes.forEach(barcode => {
//                            inp.innerHTML = barcode.rawValue;
//                            const box = barcode.boundingBox;
//                            let canvas = video.parentNode.querySelector('canvas');
//                            if ( canvas ) {
//                                let context = canvas.getContext('2d');
//                                context.strokeStyle = 'yellow';
//                                // пересчет координат - для упрощения полагаем, что для video и canvas установлен object-fit: cover;
//                                let coef = Math.min( video.clientWidth / video.videoWidth, video.clientHeight / video.videoHeight)
//                                let x = box.x * coef + ( video.clientWidth - video.videoWidth * coef ) / 2;
//                                let y = box.y * coef + ( video.clientHeight - video.videoHeight * coef) / 2 - box.height * coef;
//                                context.strokeRect( x, y, box.width * coef, box.height * coef );
//                                setTimeout( () => context.clearRect(0, 0, canvas.width, canvas.height), 50 );
//
//                            }
//                        })
                        //clearInterval( video.intervalId );
                    }
                })
        }
    }

    function play( video ) {
        if ( video.intervalId ) {
            clearInterval( video.intervalId );
        }
        navigator.mediaDevices.getUserMedia( CONSTRAINTS )
            .then( stream => {
                if ("srcObject" in video) {
                    if ( video.srcObject ) {
                        video.srcObject.getTracks().forEach( track => track.stop() );
                    }
                    video.srcObject = stream;
                  } else {
                    video.src = window.URL.createObjectURL(stream);
                  }
            } )
            .catch( err => console.log(err.name + ": " + err.message) );
    }

    function cameraVideo ( element ) {
        const parentForm = element.closest( '[lsfusion-form]' ) || document.body;
        const streamBox = parentForm.querySelector( '[customType=streamBox]' );
        const video = streamBox.querySelector( 'video' );


        if ( streamBox.hidden && video) {
            play( video );
            streamBox.hidden = false;
        } else {
            if ( video.srcObject ) {
                video.srcObject.getTracks().forEach( track => track.stop() );
            }
            streamBox.hidden = true;
        }
    }

    return {
        render: function( element ) {
            element.setAttribute( 'customType', 'inputBarcode' );

            const inp = document.createElement( 'div' );
            inp.contentEditable = 'true';
            inp.inputMode = 'none';
            element.append( inp );

            new MutationObserver ( function (mutation, observer) {
                if ( document.body.contains( inp ) ) {
                    inp.focus();
                    observer.disconnect();
                }
            }).observe( document.body, { childList: true } );

            inp.onblur = function( event ) {
                const parentForm = element.closest( '[lsfusion-form]' );
                if ( parentForm && parentForm.contains( event.relatedTarget ) ) {
                    this.focus();
                }
            }
            addKeyboard( element );
            addCamera( element );
            initDevices( element );
        },
        update: function( element, controller, value ) {
            const inp = element.querySelector( '[contenteditable=true]' );
            currentController = controller;
            inp.onkeyup = function( event ) {
                if (event.key == 'Enter' && this.innerText !== '') {
                    controller.changeValue( this.innerText );
                    this.innerText = '';
                }
            }
        }
    }
}