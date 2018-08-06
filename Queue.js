const {fork} = require('child_process');
const kill = require('tree-kill');
class Queue {
    constructor(name) {
        this.queue = [];
        this.index = 0;
        this.name = name; 
        this.isBusy = false;
        this.forked = fork('./delay.js');
    }

    queueItem(item) {
        this.queue.push(item);
        // console.log('Queue: <<<<< ', JSON.stringify(this.queue, null, 3));
        // this.dequeueItem();
    }

    //  task() {
    //     if(this.queue.length > 0) {
    //         this.forked.send({item: this.queue[0]});
    //         this.queue.shift();
    //         console.log('Queue after shift: <<<< ', this.queue);
    //     } 
    //     // else {
    //     //     kill(forked.pid)
    //     // }
    //     this.forked.on("message", (msg) => {
    //         if(msg.status === "Done") {
    //             console.log('Done called');
    //             console.log(msg.reportId);
    //             // this.queue.shift();
    //             // console.log('Queue after done: <><<<<', this.queue);
    //             if(this.queue.length > 0) {
    //                 // this.task();
    //             } 
    //             // else {
    //             //     kill(forked.pid);
    //             // }
    //         }
    //     });
    //     this.forked.on('exit', (code, signal) => {
    //         console.log('child process killed')
    //     });
    // }

     dequeueItem() {
        this.queue.shift();
        this.task();
        this.isBusy = false;
        console.log('Queue after dequeuing: <<<<<', this.queue);
    }
}

module.exports = {
    reportQueue: new Queue("pdf generation")
}

