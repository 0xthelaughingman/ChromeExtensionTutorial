# ChromeExtensionTutorial
This is a tutorial repository for the Extension idea.
The objective of the extension is to be able to manipulate the webcam/device's video with the tensorflow.js/Body Pix
and other such modules to substitute the User's body, which can then be used by the page for the stream.

Each folder represents an incremental stage in the tutorial towards achieving our desired objective.



# The Stages

1. userMedia: Deals with accessing the device's camera feed through the browser's getUserMedia API.

2. Overriding userMedia: To be able to manipulate what we want to presented as the camera's feed on the page, we have to
first override the default behaviour of the API, so that we can do with the stream as we wish.

3. Stream From a Canvas: Playing with a Canvas element. Here we have a canvas with an animation effect. We want the canvas to
serve as the stream source for the Video element. This is critical as manipulating a stream involves breaking it into images(Frames),
customizing the Frames as we want and then serving them up as a stream - All of which will involve the canvas element.

4. Manipulating live stream: With the getUserMedia API overriden, return the stream from our canvas while using the actual *raw* stream
for getting the frames for the Canvas, animating the frames together to form a 'video'. Apply the simple grayscale filter.

5. Hide canvas: Given the canvas is what *we* require to achieve what is needed, hide it from the User.



 
