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
