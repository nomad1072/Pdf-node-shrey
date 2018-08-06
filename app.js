const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const {ReportGeneration} = require('./ReportGeneration');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const reportQueue = new ReportGeneration("cv report");

reportQueue.forked.on("message", (data) => {
    console.log('Data: <<<<<<<<', data);
    if(data.status === "Done") {
        reportQueue.dequeue();
        if(reportQueue.size > 0) {
            reportQueue.forked.send(reportQueue.queue[0]);
        }
    }
});

app.get('/queue', async (req, res) => {
    let obj = {
        title: 'Generate Report',
        reason: 'test'
    };
    
    reportQueue.enqueue(obj);
    console.log('Queued item call from router');
    res.sendStatus(202);
});

app.listen(8080, () => {
    console.log('Server started at 8080');
});

