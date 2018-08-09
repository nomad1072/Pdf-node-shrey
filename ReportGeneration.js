const kue = require('kue');
const {doTask} = require('./report');
class ReportGeneration {
    constructor(name) {
      this.queue = kue.createQueue();
      this.name = name;
    }
  
    enqueue(details, jobType) {
      const job = this.queue
        .create(jobType, {
          reportID: details.id,
          email: details.email,
          reason: details.reason
        })
        .save(err => {
          if (!err) {
            console.log(job.id);
          } else {
            logger.error("Unable to enqueue job");
          }
        });
    }
  
    processItem(type) {
      this.queue.process(type, async (job, done) => {
        await doTask(job.data, done);
      });
    }
  }

module.exports = {
    ReportGeneration
};