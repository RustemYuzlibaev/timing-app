import uuidv4 from 'uuid/v4';

export const helpers = (function() {
  function newTimer(attrs = {}) {
    const timer = {
      title: attrs.title || 'Timer',
      project: attrs.project || 'Project',
      id: uuidv4(),
      elapsed: 0
    };

    return timer;
  }

  function findById(array, id, cb) {
    array.forEach(el => {
      if (el.id === id) {
        cb(el);
        return;
      }
    });
  }

  function renderElapsedString(elapsed, runningSince) {
    let totalElapsed = elapsed;
    if (runningSince) {
      totalElapsed += Date.now() - runningSince;
    }
    return millisecondsToHuman(totalElapsed);
  }

  function millisecondsToHuman(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    const humanized = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');

    return humanized;
  }

  return {
    millisecondsToHuman,
    newTimer,
    findById,
    renderElapsedString
  };
})();
