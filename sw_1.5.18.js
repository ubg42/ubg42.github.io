self.addEventListener('install',function(event){
    console.log('GD-SW installed ...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',function(event){
    console.log('GD-SW Activated ....');

    event.waitUntil(
      self.clients.claim() // This takes control of all open clients as soon as it's activated.
      .then(() => {
          console.log('GD-SW activated and controlling all clients ... ');
      })
  );

});

