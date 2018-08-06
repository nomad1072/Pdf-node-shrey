const fs = require('fs');
const generateName = require('sillyname');
const util = require('util');
const path = require('path');
const newpdfPath = path.join(__dirname, '/pdfs');
const Mustache = require('mustache');
const latex = require('node-latex');
const {getTemplateData} = require('./app');
Mustache.tags = ['<<', '>>'];


const writeFile = util.promisify(fs.writeFile);
(function() {

     function timeout(ms) {
        return new Promise(resolve => setTimeout(() => {
            console.log('sleeping');
            resolve();
        }, ms));
    }

    process.on("message", async (msg) => {
        console.log('sleep started');
        const name = generateName();
        let template = fs.readFileSync('template_underscore.tex', "utf8");        
        const input = Mustache.render(template, getTemplateData());
        const escaped = input.split('amp;').join('');
        const output = fs.createWriteStream(path.join(newpdfPath, `${name}.pdf`));
        const pdf = latex(escaped);
        // await writeFile('check.tex', escaped);
        pdf.pipe(output).on("finish", () => {
            console.log('Done: <<<<');
            let msg = {
                status: "Done",
                reportId: name
            }
            process.send(msg);
        })
        pdf.on("error", err => console.err)
        console.log('Done Waiting');
    })
})();