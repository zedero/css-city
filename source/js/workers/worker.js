'use strict';

self.addEventListener('message', function(e) {
  // Send the message back.
  self.postMessage('You said: ' + e.data);
}, false);