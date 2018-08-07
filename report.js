const fs = require('fs');
const generateName = require('sillyname');
const util = require('util');
const path = require('path');
const newpdfPath = path.join(__dirname, '/pdfs');
const Mustache = require('mustache');
const latex = require('node-latex');
const {emitter} = require('./ReportGeneration');
const {getTemplateData} = require('./utils');

Mustache.tags = ['<<', '>>'];

const writeFile = util.promisify(fs.writeFile);
let isProcessing = false;
let index = 0;
    function doTask(details) {
        try {
            if(details.maxAttempts >= 3) {
                throw new Error('MaxAttemptsExceeded');
            }
            details.maxAttempts++;
            isProcessing = true;
            const name = generateName();
            let template = fs.readFileSync('template_underscore.tex', "utf8");   
            const input = Mustache.render(template, getTemplateData());
            const escaped = input.split('amp;').join('');
            const output = fs.createWriteStream(path.join(newpdfPath, `${details.name}.pdf`));
            const pdf = latex(escaped);
        // await writeFile('check.tex', escaped);
            return new Promise((res, rej)=>{
                pdf.pipe(output).on("finish", () => {
                    console.log('Done: <<<<');
                    let msg = {
                        status: "Done",
                        reportId: name
                    }
                isProcessing = false;
                process.send(msg);
                console.log('Done Waiting');
                res(details.name);
                });
                pdf.on("error", err => {
                    console.error(err);
                    rej(err)
                });
        });
        } catch (e) {
            isProcessing = false;
            let msg = {
                status: "Error",
                name: e.name
            }
            if(e.message === "MaxAttemptsExceeded") {
                console.log('Max attempts error');
                msg = {...msg, name: e.message}
            }
            process.send(msg);
        }
    }

    process.on('uncaughtException',function(err) {
        isProcessing = false;
        console.log("retriever.js: " + err.message + "\n" + err.stack);
    })
    

    process.on("error", (err) => {
        isProcessing = false;
        console.log('Error: <<<<<', err);
    });

    process.on("message", async (details) => {
        try {
            if(!isProcessing) {
                doTask(details).then((reportId)=>{
                    console.log(`Completed Job for ${reportId} with PID ${process.pid}`);
                }).catch(e=>{
                    console.log('Error occured : ', e);
                })
            }
        } catch(e) {
            isProcessing = false;
            console.log('Unhandled Promise Rejection', e);
        }
        
    });

