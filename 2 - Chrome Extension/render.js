/**
 * global parameters.
 */
let Animator = {
    imageCapture: null,
    originalStream: null,
    canvasStream: null,
    net: null,
    isFirstAdd: true,
    isVideoOn: false,
    drawCanvasHeight: null,
    drawCanvasWidth: null,
    scripts: [
        'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2',
        'https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0',
    ],
    logging: false,
    log: (message) => {
        if(Animator.logging)
            console.log('Animator:', message);
    },  
};

/**
 * enable the console logging.
 */
Animator.logging = true;

/**
 * Load all the scripts.
 */
((scripts) => {
    scripts.forEach(script => {
        let el = document.createElement('script');
        el.src = script;
        document.head.appendChild(el);
        Animator.log(script, 'loaded!');
    });
    Animator.log('loaded all scripts');
})(Animator.scripts);


function add_dynamic_elements(constraints) {
    /*  
        Primary canvas that serves as the source of the modified stream which is passed onto the getUserMedia API.
        Resolution needs to be what the User's device supports.
        Check constraints.txt for sample JSON.
    */

    var invisible_canvas = document.createElement('CANVAS');
    invisible_canvas.id = "invisible";
    invisible_canvas.height = constraints.video.advanced[1].height.min;
    invisible_canvas.width = constraints.video.advanced[2].width.min;
    invisible_canvas.style.position= "absolute";
    invisible_canvas.style.right = -constraints.video.advanced[2].width.min;

    Animator.drawCanvasHeight = invisible_canvas.height;
    Animator.drawCanvasWidth = invisible_canvas.width;

    /*  
        A secondary canvas needed to render the image that goes into the TFJS module. We can't use the first canvas as that is the 
        one that generates the stream.
        Resolution needs to be what the User's device supports.
    */
    //  Add code for the seconday canvas here

    //  Div that keeps the content out of the viewport, disables overflow so no scrollbars!
    var wrap_div = document.createElement("div");
    wrap_div.id = "wrap_div";
    wrap_div.style.position= "relative";
    wrap_div.style.right = "0";
    wrap_div.style.bottom = "0px";
    wrap_div.style.width= "0";
    wrap_div.style.height= "0";
    wrap_div.style.overflow= "hidden";

    //  Append all dynamics to the Div
    wrap_div.appendChild(invisible_canvas);
    
    //  Finally append the Div
    document.body.appendChild(wrap_div);
    Animator.isFirstAdd = false  
}

function remove_dynamic_elements() {
    let dyn = document.getElementById("wrap_div");
    if(dyn) {
        document.body.removeChild(dyn);
    }
}

function get_canvas_stream(stream, constraints) {   
    //  set original_stream
    Animator.originalStream = stream;
    
    var stream_new;
    
    if(constraints.video) {
        //  log original Video stream's constraints
        Animator.log("ORIG VIDEO META:" , JSON.stringify(stream.getVideoTracks()[0].getCapabilities()));
        //  Change the video stream and if needed, add Audio to the new stream

        remove_dynamic_elements();
        add_dynamic_elements(constraints);

        var canvas = document.getElementById("invisible");
        stream_new = canvas.captureStream(24);

        //  log new stream's constraints
        Animator.log("NEW VIDEO META:" , JSON.stringify(stream_new.getVideoTracks()[0].getCapabilities()));

        if(constraints.audio) {
            stream_new.addTrack(stream.getAudioTracks()[0]);
            Animator.log("NEW AUDIO META:" , JSON.stringify(stream_new.getAudioTracks()[0].getCapabilities()));
        }
        Animator.canvasStream = stream_new;
        Animator.isVideoOn = true;
        audioTimerLoop(nextFrame, 60);
    } else if (constraints.audio) {   
        //  only audio, just let the original stream be as is.
        Animator.log("Audio Only");
        stream_new = stream;
        Animator.log("NEW AUDIO META:" , JSON.stringify(stream_new.getAudioTracks()[0].getCapabilities()));
    }

    //  feed the stream from the canvas
    return stream_new;
}


//  FrameLooper
function nextFrame() {
    /*
        Since we have 2 streams running, and only the canvas stream goes to the app... Only the canvas stream
        will have its' tracks' stop() called when we stop video on the app.
        We have to call the original stream's stop on the video track manually! 
        Otherwise the Camera will still remain active!
    */
    var canvas_track = Animator.canvasStream.getVideoTracks()[0];
    if(canvas_track.readyState != 'live') {
        Animator.log("Video Stopped by App");
        Animator.originalStream.getVideoTracks()[0].stop();
        Animator.isVideoOn = false;
        remove_dynamic_elements();
        return;
    }

    var track = Animator.originalStream.getVideoTracks()[0];
    Animator.imageCapture = new ImageCapture(track);

    if ((Animator.imageCapture.track.readyState == 'live' )) {
        Animator.imageCapture.grabFrame().then(imageBitmap => {
            var canvas = document.getElementById("invisible");
            drawCanvas(canvas, imageBitmap, "grayscale");
        }).catch(error => {
            console.log(error);
        });
    } else {
        Animator.log(Animator.imageCapture.track.readyState);
    }
}


async function drawCanvas(canvas, img, draw_type) {
    if(draw_type ==="grayscale") {
        draw_grayscale(canvas,img);
    }
}


function draw_image(canvas, img) {
    canvas.getContext('2d').drawImage(img, 0, 0);
}


function draw_grayscale(canvas,img) {
    canvas.getContext('2d').filter="grayscale(50)";   
    //  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext('2d').drawImage(img, 0, 0);
}


async function loadPix(){
    //   net = await bodyPix.load();
    Animator.net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
    });

    Animator.log("Loaded BodyPix!");
}

/*
    An alternative timing loop, based on AudioContext's clock

    @arg callback : a callback function 
        with the audioContext's currentTime passed as unique argument
    @arg frequency : float in ms;
*/
function audioTimerLoop(callback, frequency) {

    var freq = frequency / 1000;        //  AudioContext time parameters are in seconds
    var aCtx = new AudioContext();
    //  Chrome needs our oscillator node to be attached to the destination
    //  So we create a silent Gain Node
    var silence = aCtx.createGain();
    silence.gain.value = 0;
    silence.connect(aCtx.destination);

    onOSCend();

    function onOSCend() {
        var osc = aCtx.createOscillator();
        osc.onended = onOSCend;     //  so we can loop
        osc.connect(silence);
        osc.start(0);   //  start it now
        osc.stop(aCtx.currentTime + freq);  //  stop it next frame
        callback(aCtx.currentTime); //  one frame is done

        if (!Animator.isVideoOn) {    //  user broke the loop
            osc.onended = () => {
                aCtx.close();   //  clear the audioContext
                Animator.log("Exiting Timer loop");
                return;
            };
        }    
    };  
}

function get_cam() {
    var audio_constraints = {"audio":{"mandatory":{"sourceId":"default"},"optional":[{"googEchoCancellation":true},{"googEchoCancellation2":true},{"googAutoGainControl":true},{"googNoiseSuppression":true},{"googHighpassFilter":true},{"googAudioMirroring":true}]},"video":false};
    var vid_constraints = {"audio":false,"video":{"advanced":[{"frameRate":{"min":24}},{"height":{"min":720}},{"width":{"min":1280}},{"frameRate":{"max":24}},{"width":{"max":1280}},{"height":{"max":720}},{"aspectRatio":{"exact":1.7777777777777777}}]}};
    var video_cont = document.querySelector("#videoElement");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(vid_constraints).then((stream) => {
            video_cont.srcObject = stream;
        }).catch((err) => {
            console.log("Something went wrong!" , err.message);
        });
    }
}


function override_getUserMedia() {
    Animator.log("Overriding")
    let originalMediaDevicesGetUserMedia = navigator.mediaDevices.getUserMedia;

    navigator.mediaDevices.getUserMedia = (constraints) => { 
        return new Promise((resolve, reject) => {
            Animator.log("Original Constraints:\n" , JSON.stringify(constraints));
            originalMediaDevicesGetUserMedia.bind(
                navigator.mediaDevices
            )(constraints).then(stream => {
                resolve(get_canvas_stream(stream, constraints))
            }).catch(err => {
                reject(err);
            });
        });
    }
}


Animator.log("Calling Override");
override_getUserMedia();
