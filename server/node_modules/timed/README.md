timed
======

Simplifies high resolution timing for profiling

Usage exampe:

```javascript
timed = require('timed');

//Start the timer
timed.reset();

setTimeout(function() {
  //should be about 1000 ms
  console.log('Elapsed: ' + timed.since() + ' ms');  

  timed.reset();  //timer starts again now from 0    
  setTimeout(function() {
    //This one should be about 1500 ms rounded to 3 decimal places
    console.log('Elapsed: ' + timed.rounded() + 'ms');
  }, 1500);
  

}, 1000);

```
