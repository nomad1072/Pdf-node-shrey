var express = require('express');
var bodyParser = require('body-parser');
var pdfMake = require('pdfmake');
const {data, docDefinition, fonts} = require('./seed');
var path = require('path');
var fs = require('fs');
var generateName = require('sillyname');

const pdfPath = path.join(__dirname, '/pdf');
const PdfPrinter = require("pdfmake/src/printer")
const printer = new PdfPrinter(fonts)
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('pong');
});

function genPdf() {
    return new Promise((res, rej) => {
        try {
            const sillyName = generateName();
            var writeStream = fs.createWriteStream(path.join(pdfPath, `${sillyName}.pdf`));
            let pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(writeStream).on("finish", () => {
                console.log('Pdf generated');
                res();
            });
            pdfDoc.end();
        } catch(e) {
            rej(e);
        }   
    });  
}

app.get('/generate', async (req, res) => {
    const test = await genPdf();
    if (test) {
        res.send('error');
    } else {
        res.send('generated');
    }
});

app.listen(8080, () => {
    console.log('Server started at 8080');
})