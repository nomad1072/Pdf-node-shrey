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
    
    //  function timeout(ms) {
    //     return new Promise(resolve => setTimeout(() => {
    //         console.log('sleeping');
    //         resolve();
    //     }, ms));
    // }

    

    function doTask(details) {
        isProcessing = true;
        const name = generateName();
        let template = fs.readFileSync('template_underscore.tex', "utf8");        
        const input = Mustache.render(template, getTemplateData());
        const escaped = input.split('amp;').join('');
        const output = fs.createWriteStream(path.join(newpdfPath, `${name}.pdf`));
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
                res(name);
            })
            pdf.on("error", err => {
                console.error(err);
                rej(err)
            });
        });
        
    }

    process.on("message", async (details) => {
        console.log('in on enqueue');
        if(!isProcessing) {
            doTask(details).then((reportId)=>{
                console.log(`Completed Job for ${reportId} with PID ${process.pid}`);
            }).catch(e=>{
                console.log('Error occured : ', e);
            })
        }
    });

