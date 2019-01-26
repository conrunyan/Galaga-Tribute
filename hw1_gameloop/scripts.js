let events = [];
let startTime = performance.now();
let ERROR_MARGIN = 10; 
gameLoop();

function gameLoop(browserTime) {
    // DONE: Get elapsed time
    let elapsedTime = browserTime - startTime;
    // TODO: Add update funciton
    update(elapsedTime);
    // TODO: Add render function
    // let node = document.getElementById('box_1');
    // node.innerHTML += "Current Time: " + gameTime + "\n";
    //console.log(myTime);
    //let y = node.scrollTop;
    requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
    // DONE: Add logic to calculate if an object should be rendered. Based on interval
    for (let i = 0; i < events.length; i++) {
        //console.log('MATH FLOOR: ' + Math.floor(elapsedTime) + ' => ' + parseInt(events[i].interval))
        // if an event has 0 times left to display, mark for deletion
        if (parseInt(events[i].times) === 0) {
            events[i].delete = true;
        }
        // if the elapsed time is a multiple (within a margin of error) of the interval, flag event to render
        else if (Math.floor(elapsedTime) % parseInt(events[i].interval) <= ERROR_MARGIN) {
            console.log('event #: ' + i + events[i]);
            events[i].render = true;
            events[i].times--;   
            console.log('event times: ' + events[i].times) 
        }
        else
        {
            events[i].render = false; 
        }
        //console.log('event #: ' + i + events[i]);
    }
    // TODO: Add step to delete object if # of times is 0
    // filter out any events flagged to be deleted
    events = events.filter(tmp_event => tmp_event.delete === false)
    // Keep objects ordered by time added.
}

function render() {
    // TODO: For each event that needs to be rendered, do so.
    let node = document.getElementById('box_1')
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
        let newEvent = {name:name , interval:interval, times:times, render:true, delete:false};
        events.push(newEvent);
        console.log(events);
    } 
}

