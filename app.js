const express = require('express');
const bodyParser = require('body-parser');
const { ReportGeneration } = require('./ReportGeneration');
// const EventEmitter = require('events');
// class Emitter extends EventEmitter {}
// const reportProcess = new Emitter();
const kue = require('kue');
const app = express();
const CEReportQueue = new ReportGeneration("Mac Protocol");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

CEReportQueue.queue
      .on("job enqueue", (id, type) => {
        CEReportQueue.processItem(type);
        console.log("Job %s got queued of type %s", id, type);
      })
      .on("job complete", (id, result) => {
        console.log("Result: <<<<", result);
        kue.Job.get(id, (err, job) => {
          if (err) return;
          job.remove(err => {
            if (err) throw err;
            console.log("removed completed job: ", job.id);
          });
        });
      });

      function count() {
        CEReportQueue.queue.inactiveCount("CE Report", (err, length) => {
          console.log("Queue inactive count: <<<<<<", length);
          return length;
        });
      }

let index = 0;
app.get('/queue', async (req, res) => {
    let obj = {
        title: 'Generate Report',
        reason: 'test',
        name: `CV${index}`
    };
    index++;
    
    CEReportQueue.enqueue(obj, "CE Report");
    let cnt = count();
    res.status(202).json({eta:cnt});
});

app.listen(8080, () => {
    console.log('Server started at 8080');
});

