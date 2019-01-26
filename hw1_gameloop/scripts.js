let events = [];
let startTime = performance.now();
let ERROR_MARGIN = 20; 
let topOfLoop = true;
let prevBrowserTime = 0;
gameLoop();

function gameLoop(browserTime) {
    // DONE: Get elapsed time
    let elapsedTime = 0
    if (!topOfLoop) {
        elapsedTime = browserTime - prevBrowserTime;
        prevBrowserTime = browserTime;
    }
    // DONE: Add update funciton
    update(elapsedTime);
    // DONE: Add render function
    render()
    //let y = node.scrollTop;
    topOfLoop = false;
    requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
    // DONE: Add logic to calculate if an object should be rendered. Based on interval
    for (let i = 0; i < events.length; i++) {
        console.log('TOP OF LOOP: ' + Math.floor(elapsedTime) + ' => ' + parseInt(events[i].interval))
        // if an event has 0 times left to display, mark for deletion
        if (parseInt(events[i].times) === 0) {
            events[i].delete = true;
        }
        // if the elapsed time is a multiple (within a margin of error) of the interval, flag event to render
        else if (events[i].timeSinceLastRender >= events[i].interval) {
            console.log('BEFORE: event #: ' + i + events[i].timeSinceLastRender);
            events[i].render = true;
            events[i].times--;   
            // carry over extra elapsed time
            events[i].timeSinceLastRender = (events[i].timeSinceLastRender - events[i].interval);
            console.log('event times: ' + events[i].times); 
            console.log('AFTER : event #: ' + i + events[i].timeSinceLastRender);
        }
        else
        {
            // capture elapsed time so far and make sure event isn't rendered
            events[i].timeSinceLastRender += Math.floor(elapsedTime);
            console.log('NO RENDER: event #: ' + events[i].timeSinceLastRender);
            events[i].render = false; 
        }
        //console.log('event #: ' + i + events[i]);
    }
    // DONE: Add step to delete object if # of times is 0
    // filter out any events flagged to be deleted
    events = events.filter(tmpEvent => tmpEvent.delete === false);
    // TODO: Keep objects ordered by time added.
}

function render() {
    // TODO: For each event that needs to be rendered, do so.
    let node = document.getElementById('box_1')
    // For each event flagged to be rendered, print it to box_1
    events.forEach(function(tmpEvent) {
        if (tmpEvent.render === true) {
            node.innerHTML += '<p>Event: ' + tmpEvent.name + '(' + tmpEvent.times + ' remaining)' + '</p>'
        }
    });
    
}

function addNewEvent() {
    // add a new event to the events array
    let name = document.getElementById('id-name');
    let interval = document.getElementById('id-interval');
    let times = document.getElementById('id-times');

    name = name.value;
    interval = parseInt(interval.value);
    times = parseInt(times.value);
    // make sure all fields are populated, otherwise ignore the command
    if (name !== '' && interval !== '' && times !== '') {
        let newEvent = {name:name , interval:interval, times:times, render:true, delete:false, timeSinceLastRender:0};
        events.push(newEvent);
        console.log(events);
    } 
}

