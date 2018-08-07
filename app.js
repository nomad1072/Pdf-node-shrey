const express = require('express');
const bodyParser = require('body-parser');
const { ReportGeneration } = require('./ReportGeneration');
// const EventEmitter = require('events');
// class Emitter extends EventEmitter {}
// const reportProcess = new Emitter();

const app = express();

const reportQueue = new ReportGeneration("Mac Protocol");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

reportQueue.forked.on("message", (data) => {
    console.log('Data: <<<<<<<<', data);
    if(data.status === "Done") {
        reportQueue.dequeue();
        // reportProcess.emit('reportGenerated', data);
        // Report successfully generated
        if(reportQueue.size > 0) {
            reportQueue.forked.send(reportQueue.queue[0]);
        }
    } else if(data.status === "Error") {
        let currentItem = reportQueue.queue[0];
        currentItem.maxAttempts++;
        if(data.name === "MaxAttemptsExceeded") {
            // send notification saying report generation not successful
            console.log('Report Generation failed');
            reportQueue.dequeue();
            if(reportQueue.size > 0) {
                reportQueue.forked.send(reportQueue.queue[0]);
            }
        } else {
            // There has been an error during report generation, requeue the item 
            console.log('Report Generation failed, attempting to requeue back to the queue');
            console.log('Max Attempts: <<<<< ', currentItem.maxAttempts,);
            console.log('Queue[0] when error: <<<<<', reportQueue.queue[0].index, reportQueue.queue[0].maxAttempts);
           // reportQueue.dequeue();
            reportQueue.forked.send(currentItem);
        }
    }
    
});
let index = 0;
app.get('/queue', async (req, res) => {
    let obj = {
        title: 'Generate Report',
        reason: 'test',
        index,
        maxAttempts: 0,
        name: `CV${index}`
    };
    index++;
    reportQueue.enqueue(obj);
    // reportProcess.on('reportGenerated', (data) => {
    //     res.status(202).json({ cv_reports: data });
    // });
    res.sendStatus(202);
});

app.listen(8080, () => {
    console.log('Server started at 8080');
});

