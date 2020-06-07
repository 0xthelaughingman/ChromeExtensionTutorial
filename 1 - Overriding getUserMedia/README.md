# Overriding getUserMedia

1. userMedia: Deals with accessing the device's camera feed through the browser's getUserMedia API.

2. Overriding userMedia: To be able to manipulate what we want to be presented as the camera's feed on the page, we have to
first override the default behaviour of the API, so that we can do with the stream as we wish.

3. Stream From a Canvas: Testing the Canvas element. Here, we have a canvas with an animation effect. We want the canvas to
serve as the stream source for the Video element. This is critical as manipulating a stream involves breaking it into images(Frames),
customizing the Frames as we want and then serving them up as a stream - All of which will involve the canvas element.

4. Manipulating live stream: With the getUserMedia API overriden, return the stream from our canvas while using the actual *raw* stream
for getting the frames for the Canvas, animating the frames together to form a 'video'. Apply the simple grayscale filter.

5. Hide canvas: Given the canvas is what *we* require to achieve what is needed, hide it from the User.

6. BodyPix: Trying out the Tensorflow.js - BodyPix. Slight changes to how we handle the stream and the rendering in order to be able to
make use of the model and it's output.
    * Using a secondary canvas to first generate an image from the frame and feed into the model.
    * Writing the model's output onto the primary canvas.
    * This is done to avoid irregular animations between modified and unmodified states if using the same canvas...
    * Way too high RAM and GPU usage... might need optimizations? Maybe try out cloud interactions via 
    Firebase deployment...

7. Demo Google Meet: Try out the progress so far with the grayscale filter on Google Meet. Using the extension TamperMonkey, the javascript code can be tested without waiting for an actual extension. [Copy paste the contents of the script tag into the new script's function defn on TamperMonkey. Enable the script and load up a google meet! :D]
    * Handle the constraints properly when overriding getUserMedia API.
    * Known Issue: The video stream gets stuck if the tab is changed, the audio remains consistent. The videotrack gets into an
    invalid state. Must investigate/fix.
        [FIXED] This was due to the requestAnimationFrame() callback timer being suspended in those cases. 
        Solution: Use a timer that bypasses the suspension/halt. In this case, a Timer based on AudioContext.
    * Make the hidden canvas dimensions dynamic as well, based on the video stream resolution.

8. Enhancements & Handling: Major improvements to how we were handling the stream constraints. Code works fine for Video Screenshare, Audio and Cam Video. Minor testing on Slack was successful.
    * Init'ing the hidden canvas from the Cam Stream's constraints instead of the App's requested constraints.
    The failure to meet constraints doesn't seem to be fatal and this approach avoids handling each app's JSON formats.
    * Still random freezes at times. Added a crap ton of state control and cleanup, can't figure out why. Only way out of the freeze is to keep toggling Cam on/off till it ends up working again...
9. Intermediate Vid Element
    * [UPDATE] Switched to using an intermediate video element before the final draw canvas. Using get_canvas_stream_beta function that supports the 2D filters as well as TFJS based renders, as well as a new
    nextVideoFrame() render root function to make use of the Video element.
      * Added global constraints to be used in case of TFJS renders (global draw_type="tfjs-pixel"), ideal is tfjs_240p.
    * [ISSUE#1] Only Meets does seem to need their dimension constraints met, otherwise the video is smaller and in a corner, Slack/Hangouts still work without an issue... Will switch to using a regex like (link) to eval height/widths from any given JSON, if it fails for either of the two then default to device cam's resolution.
    https://regex101.com/r/BDwrGc/
      * [FIXED] Using utils_json_res() to handle dynamic constraints.
    * [ISSUE#2] The tfjs-pixel draw-mode tends to randomly halt on the render loop, with no visible/logged exception. The Video Element still continues playback.