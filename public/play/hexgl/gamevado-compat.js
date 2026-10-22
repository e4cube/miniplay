/* GameVado integration only. Original HexGL engine and gameplay remain upstream. */
(function () {
  'use strict';
  // Modern browsers suspend Web Audio until a real user gesture.
  function unlockAudio() {
    var context = window.bkcore && bkcore.Audio && bkcore.Audio._ctx;
    if (context && context.state === 'suspended') context.resume().catch(function (error) {
      console.warn('HexGL audio could not resume:', error);
    });
  }
  document.addEventListener('pointerdown', unlockAudio, true);
  document.addEventListener('keydown', unlockAudio, true);
})();
