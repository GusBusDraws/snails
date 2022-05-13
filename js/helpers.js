function keyPressed() {
    // Set spacebar to toggle play/pause of drawing loop
    if (key === ' ') {
      if (isLooping()) {
        noLoop();
        console.log('STOPPED. Press SPACE to resume.')
      } else {
        loop();
        console.log('RESUMED. Press SPACE to stop.')
      }
    }
    if (key === 'r') {
      reset();
    }
  }

function saveFrame() {
  if (frameCount - 1 < nFrames) {
    saveCanvas(`frame_${('000' + frameCount).slice(-3)}`);
  }
}
  