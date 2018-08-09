const fs = require('fs');
const generateName = require('sillyname');
const util = require('util');
const path = require('path');
const newpdfPath = path.join(__dirname, '/pdfs');
const Mustache = require('mustache');
const latex = require('node-latex');
const {getTemplateData} = require('./utils');

Mustache.tags = ['<<', '>>'];

const writeFile = util.promisify(fs.writeFile);
async function doTask(details, done) {
            
    const name = generateName();
    let template = fs.readFileSync('template_underscore.tex', "utf8");   
    const input = Mustache.render(template, getTemplateData());
    const escaped = input.split('amp;').join('');
    const output = fs.createWriteStream(path.join(newpdfPath, `${name}.pdf`));
    const pdf = latex(escaped);
        // await writeFile('check.tex', escaped);
    pdf.pipe(output).on("finish", () => {
        console.log('Done Waiting');
            done(null, name);
    });
    pdf.on("error", err => {
        console.error(err);
        done(err)
    });
}
        

module.exports = {
    doTask
}
