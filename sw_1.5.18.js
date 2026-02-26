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
self.addEventListener('fetch', function(event) {
    
   const url = event.request.url;

   const doNotCache = skipList.some(d=>url.indexOf(d)>=0)

   if(doNotCache){
    // console.log('GD-SW not caching url',url);
    return;
   }
   
    event.respondWith(async function() {
       try{
         var res = await fetch(event.request);
         return res;
       }
       catch(error){
         return null;
        }
      }());
  });
