let events = [];
let startTime = performance.now();
gameLoop();

function gameLoop(browserTime) {
    // DONE: Get elapsed time
    let elapsedTime = browserTime - startTime;
    // TODO: Add update funciton
    update(elapsedTime);
    // TODO: Add redner function
    // let node = document.getElementById('box_1');
    // node.innerHTML += "Current Time: " + gameTime + "\n";
    //console.log(myTime);
    //let y = node.scrollTop;
    requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
    // TODO: Add logic to calculate if an object should be rendered. Based on interval
    for (let i = 0; i < events.length; i++) {
        if (Math.floor(elapsedTime) % events[i].interval == 0) {
            console.log('event #: ' + i + events[i]);    
        }
        else
        {
            console.log('event #: ' + i + ' waiting...' + typeof(Math.floor(elapsedTime)));
        }
        //console.log('event #: ' + i + events[i]);
    }
    // TODO: Add step to delete object if # of times is 0
    // TODO: If object is to be rendered, subtract the number of times left by 1.
    // Keep objects ordered by time added.
}

function render() {
    // TODO: For each event that needs to be rendered, do so.
}

function addNewEvent() {
    // add a new event to the events array
    let name = document.getElementById('id-name');
    let interval = document.getElementById('id-interval');
    let times = document.getElementById('id-times');

    name = name.value;
    interval = interval.value;
    times = times.value;
    // make sure all fields are populated, otherwise ignore the command
    if (name !== '' && interval !== '' && times !== '') {
        let newEvent = {name:name , interval:interval, times:times, render:true};
        events.push(newEvent);
        console.log(events);
    } 
}

