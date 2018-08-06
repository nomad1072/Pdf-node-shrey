const {fork} = require('child_process');
const EventEmitter = require('events');
const emitter = new EventEmitter();

class ReportGeneration {
    constructor(name) {
        this.queue = [];
        this.name = name;
        this.size = 0;
        this.forked = fork('./report.js');
    }

    enqueue(details) {
        // Fetch Report Object
        this.queue.push(details);
        this.size++;
        console.log('Queue Size: <<<<<', this.size);
        // console.log('Queue: <<<<<', JSON.stringify(this.queue, null, 3));
        this.forked.send(details);
    }

    dequeue() {
        this.queue.shift();
        this.size--;
        console.log('Queue Size after dequeue: <<<<<', this.size);
    }
}



module.exports = {
     ReportGeneration,
    emitter
};