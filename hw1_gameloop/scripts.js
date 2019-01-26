let events = [];
let startTime = performance.now();
let ERROR_MARGIN = 20; 
let firstLoop = true;
let prevBrowserTime = 0;
gameLoop();

function gameLoop(browserTime) {
    // Get elapsed time
    let elapsedTime = 0
    if (!firstLoop) {
        elapsedTime = browserTime - prevBrowserTime;
        prevBrowserTime = browserTime;
    }
    update(elapsedTime);
    render()
    firstLoop = false;
    requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
    // Logic to calculate if an object should be rendered. Based on interval
    for (let i = 0; i < events.length; i++) {
        // if an event has 0 times left to display, mark for deletion
        if (parseInt(events[i].times) === 0) {
            events[i].delete = true;
        }
        // logic to flag event to render
        else if (events[i].timeSinceLastRender >= events[i].interval) {
            events[i].render = true;
            events[i].times--;   
            // carry over extra elapsed time
            events[i].timeSinceLastRender = (events[i].timeSinceLastRender - events[i].interval);
        }
        else
        {
            // capture elapsed time so far and make sure event isn't rendered
            events[i].timeSinceLastRender += Math.floor(elapsedTime);
            events[i].render = false; 
        }
    }
    // filter out any events flagged to be deleted
    events = events.filter(tmpEvent => tmpEvent.delete === false);
}

function render() {
    // For each event that needs to be rendered, do so.
    let node = document.getElementById('box_1')
    // For each event flagged to be rendered, print it to box_1
    events.forEach(function(tmpEvent) {
        if (tmpEvent.render === true) {
            // remove prompt to enter event
            let prompt = document.getElementById('id-initinfo');
            prompt.style.display = 'none';
            node.innerHTML += '<p class="console_text">Event: ' + tmpEvent.name + ' (' + tmpEvent.times + ' remaining)' + '</p>';
            // make sure the display always shows the newest element. (Unless user manually scrolls up, of course)
            node.scrollTop += 50;
            node.scrollHeight = 50;
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

function clearDisplay() {
    let displayBox = document.getElementById('box_1');
    displayBox.innerHTML = '<p id="id-initinfo" class="console_text">Please enter an event.</p>';
    events = [];
}

