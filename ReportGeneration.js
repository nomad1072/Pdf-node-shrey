const { fork } = require('child_process');

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
        console.log('Queue Size after queue: <<<<<', this.size);
        this.forked.send(details);
    }

    dequeue() {
        this.queue.shift();
        this.size > 0 && this.size--;
        console.log('Queue Size after dequeue: <<<<<', this.size);
    }
}

module.exports = {
    ReportGeneration
};