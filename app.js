const express = require('express');
const bodyParser = require('body-parser');
const pdfMake = require('pdfmake');
const {reportObject} = require('./seed');
const path = require('path');
const fs = require('fs');
const generateName = require('sillyname');
const wkhtmltopdf = require('wkhtmltopdf');
const pdfPath = path.join(__dirname, '/pdf');
// const PdfPrinter = require("pdfmake/src/printer")
// const printer = new PdfPrinter(fonts)
const app = express();
const os = require('os')
const latex = require('node-latex');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.get('/ping', (req, res) => {
    res.send('pong');
});

function genPdf(docDefinition) {
    return new Promise((res, rej) => {
        try {
            const sillyName = generateName();
            console.log('Generate PDF: <<<<');
            console.log('Memory Usage: <<<<<', process.memoryUsage());
            console.log('Free memory: <<<<', os.freemem());
            console.log('Total memory: <<<<<<', os.totalmem());

            var writeStream = fs.createWriteStream(path.join(pdfPath, `${sillyName}.pdf`));
            let pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(writeStream).on("finish", () => {
                console.log('Pdf generated');
                console.log('Memory Usage: <<<<<', process.memoryUsage());
                console.log('Free memory: <<<<', os.freemem());
                res();
            });
            pdfDoc.end();
        } catch(e) {
            rej(e);
        }   
    });  
}

function startTimer(name) {
    console.time(name);
    console.log(name, " started");
    return () => {
        console.timeEnd(name);
    }
}

async function writeFile(latexstr, sillyName, ext) {
    return new Promise((res, rej) => {
        try {
            fs.writeFile(`${sillyName}.${ext}`, latexstr, function(err) {
                if(err) {
                    return console.log(err)
                }
                console.log("File was aved");
                res()
            })
        } catch (e) {
            rej(e)
        }
    })
}

function handleSpecialCharacters(str) {
    
        var lower = str.toString().toLowerCase();
        var upper = str.toString().toUpperCase();
    
        var res = "";
        for(var i=0; i<lower.length; ++i) {
            if((lower[i] != upper[i] || lower[i].trim() === ''))
                res += str[i];
        }
        return res;
    
}

function readFile(fileName) {
    return new Promise((res, rej) => {
        try {
            fs.readFile(path.join(__dirname, "utils", `${fileName}`), 'utf-8',(err, data) => {
                if (err) throw err
                res(data);
            })
        } catch (e) {
            rej(e)
        }
        
    })
}

function fillEquipmentGroupsData(equipmentGroups) {
    let str = `
        \\newpage
        \\section{Section F3: Equipment Group Attributes}
        The Equipment Group attributes are given below:
        \\begin{longtable}[l]{ |p{2cm} |p{2cm} |p{2.5cm} |p{6cm}|}
        \\hline\n
        Name & Group Id & Product Type & Equipments\\\\\n
        \\hline\n
    `;
    equipmentGroups.forEach((eq) => {
        let some = eq.equipments.reduce((a,b) => {
            return a.concat(b.name)
        }, []);
        const eqsString = some.join(", ")
        str += `${eq.name} & ${eq.groupId} & ${eq.productType.name} & ${eqsString}\\\\\n`
        str += `\\hline\n`
    });
    str += `
    \\end{longtable}
    `
    return str;
}

function escapeUnderscore(str) {
    let finalStr = "";
    for(let i = 0; i < str.length; i++) {
        if(str[i] === '_') {
            finalStr += `\\${str[i]}`
        } else {
            finalStr += str[i];
        }
    }
    console.log('Final String: <<<<', finalStr);
    return finalStr;
}

function fillFormulaData(formulas) {
    let str = `
    \\newpage
    \\section{Section F6: MAC Formula}
    The below set of formula are used to calculate the MAC Limits. Please note that the MAC Surface Area is taken as the default limit here.
    \\begin{longtable}[l]{ |p{2cm} |p{1.5cm} |p{1.5cm} |p{5cm} |p{6cm}|  }
    \\hline\n
    Name & Sampling Type & Product Type & Formula & Description\\\\\n
    \\hline\n
    `;
    formulas.forEach((f) => {
        console.log('Name: <<<<', f.name);
        str += `${escapeUnderscore(f.name)} & ${f.samplingType} & ${f.productType.name} & ${escapeUnderscore(f.formula)} & ${f.description}\\\\\n`
        str += `\\hline\n`
    });
    str += `
    \\end{longtable}
    `;
    return str;

}

function fillVariablesData(variables) {
    let str = `
        \\newpage
        \\section{Section F5: Calculation Variables}
        The various variables used in the evaluation of the worst case limits and molecules are given in the table given below:
        \\begin{longtable}[l]{ |p{5cm} |p{2cm} |p{1.5cm} |p{6cm} |p{2.5cm}|  }
        \\hline\n
        Name & Short Name & Unit & Description & Default Value\\\\\n
        \\hline\n
    `;
    variables.forEach((v) => {
        str += `${v.name} & ${escapeUnderscore(v.shortName)} & ${v.unit} & ${v.description} & ${v.defaultValue}\\\\\n`
        str += `\\hline\n`
    });
    str += `
    \\end{longtable}
    `;
    return str;
}

function fillPEMatrixData(products, equipments) {
    let str = `
        \\newpage
        \\section{Section F4: PE Matrix}
        The PE (Product-Equipment) relationship is described by the table given below:
        \\begin{longtable}[l]{ |p{3cm} |p{5cm} |p{3cm}|}
        \\hline\n
        Product Id & Equipment Used & Surface Area\\\\\n
        \\hline\n
    `;
    let map = {};
    products.forEach((p) => {
        let total = 0;
        let some = p.equipments.reduce((a, b) => {
            total += +b.surface_area.value;
            if(map[b.name]) {
                let arr = map[b.name];
                arr.push(p.product_id);
                map[b.name] = arr;
            } else {
                map[b.name] = [p.product_id];
            }
            return a.concat(b.equipment_id)
        }, []);
        str += `${p.product_id} & ${some.join(", ")} & ${total}\\\\\n`
        str += `\\hline\n`        
    })
    str += `
    \\end{longtable}
    `;
    str += `The PE (Product-Equipment) relationship is described by the table given below:
    \\begin{longtable}[l]{ |p{3cm} |p{5cm} |p{3cm}|}
    \\hline\n
    Product Id & Equipment Used & Surface Area\\\\\n
    \\hline\n
    `;
    equipments.forEach((eq) => {
        str += `${eq.name} & ${map[eq.name].join(", ")} & ${eq.surface_area.value}\\\\\n`
        str += `\\hline\n`        
    });
    str += `
    \\end{longtable}
    `;
    return str;
}

function fillEquipmentsData(equipments) {
    let str = `
        \\newpage
        \\section{Section F2: Equipment Attributes Table}
        The equipment attributes are given below:
        \\begin{longtable}[l]{ |p{3cm} |p{3cm} |p{2cm}|}
        \\hline\n
        Equipment Id & Equipment Name & Surface Area\\\\\n
        \\hline\n
    `;
    equipments.forEach((e) => {
        str += `${e.equipment_id} & ${e.name} & ${e.surface_area.value}\\\\\n`
        str += `\\hline\n`
    });
    str += `
    \\end{longtable}
    `
    return str;
}

function fillProductsData(products) {
    let str = `
                \\newpage
                \\section{Section F1: Product Attributes Table}         
                The product attributes are given below for Product Type: solid
                \\begin{longtable}{ |p{1.5cm} |p{1.7cm} |p{1cm} |p{1.5cm} |p{1.7cm} |p{1cm} |p{1cm} |p{1cm} |p{1cm} |p{1.5cm} |}
                \\hline\n
                Name & Product Id & API & Solubility Factor & Cleanability Factor & PDE & Min TD & Max TD & Min BS & Strength\\\\\n
                \\hline\n
    `;
    products.forEach((product) => {
        str += `${product.name} & ${product.product_id} & ${product.api_name} & ${product.solubility_factor.value} & ${Math.round(+product.cleanability_factor.value)} & ${Math.round(+product.pde.value)} & ${product.min_td.value} & ${product.max_td.value} & ${Math.round(+product.min_bs.value)} & ${Math.round(+product.strength.value)}\\\\\n`
        str += `\\hline\n`
    });
    str += `
    \\end{longtable}
    `
    return str;
}

function fillRpnFormulaData(rpnFormulas) {
    let str = `
                \\newpage
                \\section{Section G2: Risk Formula}         
                Risk Priority Number(s) are defined as per the formula given in the table below:
                \\begin{longtable}[l]{ |p{2cm} |p{8cm} |p{1.2cm} |p{3cm} |}
                \\hline\n
                Name & Description & Rank & Formula\\\\\n
                \\hline\n
    `;
    rpnFormulas.forEach((rpnFormula) => {
        str += `${escapeUnderscore(rpnFormula.name)} & ${rpnFormula.description} & ${rpnFormula.rank} & ${rpnFormula.formula}\\\\\n`
        str += `\\hline\n`
    });
    str += `
    \\end{longtable}
    `
    return str;
}

function fillCleaningLimitData(cleaningLimits) {
    let str = `
                \\newpage
                \\section{Section H: Current Cleaning Limit Policy}         
                Current Cleaning Limit Policy given in the table below:
                \\begin{longtable}[l]{ |p{3.5cm} |p{14cm} |}
                \\hline\n
                Name & Description\\\\\n
                \\hline\n
    `;
    cleaningLimits.forEach((cl) => {
        str += `${cl.name} & ${cl.description}\\\\\n`
        str += `\\hline\n`
    })
    str += `
    \\end{longtable}
    `
    return str;
}

function fillRiskNumbers(riskNumbers) {
    let str = `
                \\newpage
                \\section{Section G1: Risk Numbers}         
                Risk numbers are based on various properties as given in the table below. Risk numbers are categorized based on a lower bound and an upper bound in every risk category.
                \\begin{longtable}[l]{ |p{3.5cm} |p{14cm} |}
                \\hline\n
                Name & Description\\\\\n
                \\hline\n\n\n\n
    `;
}

function fillSamplingParamsData(samplingParams) {
    let str = `
                \\newpage
                \\section{Section F7: Sampling Paramters}         
                The Sampling Parameters used in the protocol workflow is as:
                \\begin{longtable}[l]{ |p{2cm} |p{1.5cm} |p{1cm} |p{1cm} |p{}}
                \\hline\n
                Name & Risk Id & Product Property & Unit & From & To & Risk Category Number\\\\\n
                \\hline\n
    `;
    const keys = Object.keys(samplingParams.params)
    keys.forEach((key) => {
        str += `${key} & ${samplingParams.params[key]}\\\\\n`
        str += `\\hline\n`
    })
    str += `
    \\end{longtable}
    `
    return str;
}

app.get('/mac_protocol', async (req, res) => {
    try {
        // reportObject = await readFile('reportObject.json');
        const samplingParams = reportObject.content.macCalculation.samplingParams
        const products = reportObject.evaluation.snapshot.products;
        const cleaningAgents = reportObject.cleaningAgents;
        const equipments = reportObject.evaluation.snapshot.equipments;
        const equipmentGroups = reportObject.evaluation.snapshot.equipmentGroups;
        const variables = reportObject.evaluation.snapshot.variables;
        const MACformulas = reportObject.evaluation.snapshot.macFormulas;
        const rpnCategories = reportObject.rpnCategories;
        const rpnFormulas = reportObject.evaluation.snapshot.rpnFormulas;
        const selectionCriteria = reportObject.selectionCriteria;
        const defaultUnits = reportObject.defaultUnits;
        const cleaningLimitPolicies = reportObject.evaluation.snapshot.cleaningLimitPolicies;
        const productsData = fillProductsData(products);
        const equipmentsData = fillEquipmentsData(equipments);
        const equipmentGroupsData = fillEquipmentGroupsData(equipmentGroups);
        const peMatrixData = fillPEMatrixData(products, equipments)
        const variableData = fillVariablesData(variables);
        const macFormulaData = fillFormulaData(MACformulas)
        const samplingParamsData = fillSamplingParamsData(samplingParams)
        const rpnFormulaData = fillRpnFormulaData(rpnFormulas);
        const cleaningLimitPolicyData = fillCleaningLimitData(cleaningLimitPolicies)
        let latexstr = `
        \\documentclass{article}
        \\usepackage[left=1.5cm, right=5cm, top=2cm]{geometry}
        \\usepackage[utf8]{inputenc}
        \\usepackage{longtable,pdflscape,graphicx}
        \\begin{document}
        \\pagenumbering{gobble}
        ${productsData}
        ${equipmentsData}
        ${equipmentGroupsData}
        ${peMatrixData}
        ${variableData}
        ${macFormulaData}
        ${samplingParamsData}
        ${rpnFormulaData}
        ${cleaningLimitPolicyData}
        \\end{document}
        `;
        await writeFile(latexstr, 'sample', 'tex')
        const input = fs.createReadStream(`sample.tex`)
        const output = fs.createWriteStream(path.join(pdfPath, `sample.pdf`))
        const pdf = latex(input);
        pdf.pipe(output).on("finish", () => {
            console.log('Done: <<<<', os.freemem());
        })
        pdf.on("error", err => console.err)
    } catch (e) {
        console.error(e)
    }
})

app.get('/gen_latex', async (req, res) => {
    try {
        let start = new Date().getTime();
        let count = 100000;
        const sillyName = generateName();
        let updatedData='';
        console.log('Process memory usage: ', process.memoryUsage());

        for(let i = 0; i < data.length; i++) {
            count--;
            if(count === 0) break;
            updatedData += `${handleSpecialCharacters(data[i]["Full Name"])} & ${handleSpecialCharacters(data[i]["Country"])} & ${handleSpecialCharacters(data[i]["Created At"])} & ${handleSpecialCharacters(data[i]["Id"])} & ${handleSpecialCharacters(data[i]["Email"])}\\\\\n`;
            updatedData += `\\hline\n`
        }
        console.log('Process memory usage: ', process.memoryUsage());

        let latexstr = `
        \\documentclass{article}
        \\usepackage[utf8]{inputenc}
        \\usepackage{longtable}
        \\begin{document}
        \\begin{longtable}{ |l |l |l |l |l| }
        ${updatedData}
        \\end{longtable}
        \\end{document}
        `;
        console.log('Process memory usage: ', process.memoryUsage());
        await writeFile(latexstr, sillyName, 'tex')
        console.log('Process memory usage: ', process.memoryUsage());
        const input = fs.createReadStream(`${sillyName}.tex`)
        const output = fs.createWriteStream(path.join(pdfPath, `${sillyName}.pdf`))
        const pdf = latex(input);
        console.log('Process memory usage: ', process.memoryUsage());
        pdf.pipe(output).on("finish", () => {
            console.log('Pdf Generated: <<<<');
            console.log('Process memory usage: ', process.memoryUsage());
            console.log('Free memory: <<<<', os.freemem());
        })
        pdf.on("error", err => console.err)
        let end = new Date().getTime()
        console.log('Process memory usage: ', process.memoryUsage());
        const time = end-start;
        console.log("Execution Time(in seconds): <<<< ", time/1000);
      
    } catch(e) {
        console.log('error:');
        console.error(e);
    }
});

app.get('/generate', async (req, res) => {
    try {
        let start = new Date().getTime();
        // console.time("Pdf Generation")
        let count = 10000;
        // let stop = startTimer("Pdf Generation")
        let updated = [];
        let headers = [
            {text: 'Full Name'},
            {text: 'Country'},
            {text: 'Created At'},
            {text: "Id"},
            {text: 'Email'}
        ];
        updated.push(headers)
        for(let i = 0; i < data.length; i++) {
            count--;
            if(count === 0) {
                break;
            }
            updated.push([
                data[i]["Full Name"],
                data[i]["Country"],
                data[i]["Created At"],
                data[i]["Id"],
                data[i]["Email"]
                ]);
        }
        // data.forEach((item) => {
            
        //     updated.push([
        //         item["Full Name"],
        //         item["Country"],
        //         item["Created At"],
        //         item["Id"],
        //         item["Email"]
        //         ]);
        // });
        console.log('Dataset size: <<<<<', data.length);
        // console.log('Updated: <<<<', updated)
        let docDefinition = {
        pageOrientation: 'landscape',
        content: [
            {
                layout: 'lightHorizontalLines',
                    table: {
                        headerRows: 1,
                        body: updated
                    }
            }
        ],
        styles: {
			header: {
				fontSize: 18,
				alignment: 'center',
				italic: true
			},
			profile: {

			},
			tableExample: {
				margin: [0, 5, 0, 15]
			},
			tableHeader: {
				bold: true,
				fontSize: 13,
				color: 'black'
			}
		}
    };
        await genPdf(docDefinition)
        // stop();
        let end = new Date().getTime()
        const time = end-start;
        console.log("Execution Time(in seconds): <<<< ", time/1000);
        res.send('generated')
    } catch (e) {
        res.send(e)
    }
});

app.get('/html_pdf', (req, res) => {
    try {
        let html = '<table><tr><th>Name</th><th>Country</th><th>CreatedAt</th><th>ID</th><th>Email</th></tr>';
        data.forEach((item) => {
            const record = `<tr><td>${item["Full Name"]}</td><td>${item["Country"]}</td><td>${item["Created At"]}</td><td>${item["Id"]}</td><td>${item["Email"]}</td></tr>`
            html += record;
        })
        html += "</table>"
        wkhtmltopdf(html).pipe(res)
    } catch(e) {
        console.error(e);
    }
});

app.get('/html', async (req, res) => {
    try {
        const sillyName = generateName();
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Page Title</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
            <script src="main.js"></script>
        </head>
        <body>
        <table><tr><th>Name</th><th>Country</th><th>CreatedAt</th><th>ID</th><th>Email</th></tr>`;
        let count = 100000;
        for(let i = 0; i < data.length; i++) {
            count--;
            if(count < 0) {
                break;
            }
            const record = `<tr><td>${data[i]["Full Name"]}</td><td>${data[i]["Country"]}</td><td>${data[i]["Created At"]}</td><td>${data[i]["Id"]}</td><td>${data[i]["Email"]}</td></tr>`
            html += record;
        }
        // data.forEach((item) => {
        //     const record = `<tr><td>${item["Full Name"]}</td><td>${item["Country"]}</td><td>${item["Created At"]}</td><td>${item["Id"]}</td><td>${item["Email"]}</td></tr>`
        //     html += record;
        // })
        html += "</table>"
        await writeFile(html, sillyName, 'html');
    } catch (e) {

    }
});

app.listen(8080, () => {
    console.log('Server started at 8080');
})