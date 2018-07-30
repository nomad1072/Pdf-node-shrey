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
    let headers = [["Name", "Group Id", "Product Type", "Equipment"]];
    let body = equipmentGroups.reduce((a, eq) => {
        let some = eq.equipments.reduce((a,b) => {
            return a.concat(b.name)
        }, []);
        const eqsString = some.join(", ")
        a.push([`${eq.name} & ${eq.groupId} & ${eq.productType.name} & ${eqsString}`]);
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["2.5cm", "1.5cm", "1.8cm", "6cm"];
    let data = {
        table,
        columnWidths,
        leftAlign: true
    }
    return tableComponent(data);
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
    return finalStr;
}

function fillFormulaData(formulas) {
    let headers = [["Name", "Sampling Type", "Product Type", "Formula", "Description"]];
    let body = formulas.reduce((a, f) => {
        a.push([`${escapeUnderscore(f.name)}`, `${f.samplingType}` , `${f.productType.name}` , `${escapeUnderscore(f.formula)}` , `${f.description}`]);
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["2.5cm", "1.5cm", "1.2cm", "5cm", "6cm"];
    let data = {
        table,
        columnWidths,
        leftAlign: true
    }
    return tableComponent(data);
}

function fillVariablesData(variables) {
    let headers = [["Name", "Short Name", "Unit", "Description", "Default Value"]];
    let body = variables.reduce((a, v) => {
        a.push([`${v.name}`, `${escapeUnderscore(v.shortName)}`, `${v.unit}`, `${v.description}`, `${v.defaultValue}`]);
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["2.5cm", "2cm", "1.2cm", "8cm", "2cm"];
    let data = {
        table,
        columnWidths,
        leftAlign: true
    }
    return tableComponent(data);
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
    let headers = [["Equipment Id", "Equipment Name", "Surface Area"]];
    let body = equipments.reduce((a, equipment) => {
        a.push([`${equipment.equipment_id}`, `${equipment.name}`, `${equipment.surface_area.value}`]);
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["2.5cm", "3cm", "3.5cm"];
    let data = {
        table,
        columnWidths,
        leftAlign: true
    }
    return tableComponent(data);
}

function fillProductsData(products) {
    let headers = [["Name", "Product Id", "API", "Solubility Factor", "Cleanability Factor", "PDE", "Min TD", "Max TD", "Min BS", "Strength"]];
    let body = products.reduce((a,product) => {
        a.push([`${product.name}`, `${product.product_id}`, `${product.api_name}`, `${product.solubility_factor.value}`, `${Math.round(+product.cleanability_factor.value)}`, `${Math.round(+product.pde.value)}`, `${product.min_td.value}`, `${product.max_td.value}`, `${Math.round(+product.min_bs.value)}`, `${Math.round(+product.strength.value)}`])
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["1.5cm", "1.7cm", "1cm", "1.5cm", "1.7cm", "1cm", "1cm", "1cm", "1cm", "1.5cm"]
    let data = {
        table,
        columnWidths,
        leftAlign: true
    };
    return tableComponent(data);
}

function fillRpnFormulaData(rpnFormulas) {
    let headers = [["Name", "Description", "Rank", "Formula"]];
    let body = rpnFormulas.reduce((a, rpnFormula) => {
        a.push([`${escapeUnderscore(rpnFormula.name)}`, `${rpnFormula.description}`, `${rpnFormula.rank}` , `${rpnFormula.formula}`])
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["2cm", "3cm", "1.5cm", "3cm"]
    let data = {
        table,
        columnWidths,
        leftAlign: true
    };
    return tableComponent(data);
}

function fillCleaningLimitData(cleaningLimits) {
    let headers = [["Name", "Description"]];
    let body = cleaningLimits.reduce((a, cl) => {
        a.push([`${cl.name}`, `${cl.description}`])
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["1.5cm", "14cm"]
    let data = {
        table,
        columnWidths,
        leftAlign: true
    };
    return tableComponent(data);
}

function calculateCategories(
    valuesIn,
    order,
    productProperty
  ) {
    let values = [...valuesIn];
  
    let updateValues = [];
    if (order === "DESC") {
      values.push(0);
      values = values.reverse();
  
      updateValues = values.map((x, i) => {
        const riskNumber = values.length - i;
        const highValue = i === values.length - 1 ? Infinity : values[i + 1];
        return {
          lowValue: x,
          highValue,
          riskNumber
        };
      });
    } else if (order === "ASC") {
      let numberLength = values.unshift(0);
  
      const maxValue = productProperty === "cleanability_factor" ? 10 : Infinity;
      updateValues = values.map((x, i) => {
        const riskNumber = i + 1;
        const isLastIndex = i === numberLength - 1;
        const highValue = isLastIndex ? maxValue : values[i + 1];
        return {
          lowValue: x,
          highValue,
          riskNumber
        };
      });
    }
  
    return updateValues;
  }

function fillRPNNumbers(riskNumbers) {
    
    const headers = [[
      "Name",
      "Risk ID",
      "Product Property",
      "Unit",
      "From",
      "To",
      "Risk Category Number"
    ]];
  
    const body = riskNumbers.reduce((a, risk) => {
      const order = risk.values[0] > risk.values[1] ? "DESC" : "ASC";
      const values = risk.values ? risk.values.map(x => +x) : [];
      const rpnCategories = calculateCategories(
        values,
        order,
        risk.productProperty
      );
      const entries = rpnCategories.map(rpnCategory => [
        risk.name,
        risk.riskID,
        escapeUnderscore(risk.productProperty),
        risk.unit,
        rpnCategory.lowValue,
        rpnCategory.highValue,
        rpnCategory.riskNumber
      ]);
      return [...a, ...entries];
    }, []);

    let table = [...headers, ...body];

    let columnWidths = ["3cm", "2cm", "3cm", "1.3cm", "1cm", "1cm", "4cm"]
    let data = {
        table,
        columnWidths,
        leftAlign: true
    };

    return tableComponent(data);

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

function formTableHeaders(headers, columnWidths) {
    if(headers.length !== columnWidths.length) {
        throw new Error('Headers length and columnWidths length do not match')
    }
    let str = `\\begin{longtable}[l]{|`;
    const len = columnWidths.length;
    columnWidths.forEach((a, key) => {
        const colWidth = `p{${a}}|`
        str += colWidth;
    })
    str += '}\n'
    str += "\n\\hline\n"
    headers.forEach((a, key) => {
        if(key !== len-1) {
            const head = `${a} & `;
            str += head;
        } else {
            str += `${a}\\\\\n`
        }
    });
    str += '\\hline\n';
    return str;
}

function formTableBody(tableBody) {
    let str = '';
    tableBody.forEach((tableRecord) => {
        str += tableRecord.join(" & ");
        str += `\\\\\n`
        str += `\\hline\n`
    });
    str += `
    \\end{longtable}
    `
    return str;
}

function tableComponent(data) {
    const { table, columnWidths, leftAlign } = data;
    let tableHeadersString  = formTableHeaders(table[0], columnWidths)
    let tableBody = table.slice(1);
    let tableBodyString = formTableBody(tableBody);
    let tableString = `${tableHeadersString}\n${tableBodyString}`
    return tableString;
}

const MACMetrics = {
    // L1: "MAC Next Product",
    // L2: "MAC Next Batch",
    L3: "MAC Surface Area",
    L4: "MAC Swab",
    L5: "MAC Swab Extract"
  };
function fillEquipmentWiseProductMACTable(
    equipments,
    eqWiseMAC
  ) {
    const headers = [["ID","Name",`Toxicity based ${MACMetrics["L5"]}`,`Dosage based ${MACMetrics["L5"]}` ,`General ${MACMetrics["L5"]} `, `Site Acceptance limit ${MACMetrics["L5"]}`]];
    
    // const formatMAC = formatMACPPM('ppm');
    const body = equipments
      .filter(
        e =>
          eqWiseMAC[e.id].productLimits !== null
      )
      .map(e => {
        const macs = eqWiseMAC[e.id].productLimits;
        return [
          e.equipment_id,
          e.name,
          macs.macToxicity.L5,
          macs.macDosage.L5,
          macs.macGeneral.L5,
          macs.alertLimit.L5
        ];
      });
      
      let table = [...headers, ...body];
      let columnWidths = ["1.5cm", "2cm", "3cm", "3cm", "3cm", "3cm"]
      let data = {
          table,
          columnWidths,
          leftAlign: true
      };
      return tableComponent(data);
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
        const rpnCategories = reportObject.evaluation.snapshot.rpnCategories;
        const rpnFormulas = reportObject.evaluation.snapshot.rpnFormulas;
        const selectionCriteria = reportObject.selectionCriteria;
        const defaultUnits = reportObject.defaultUnits;
        const cleaningLimitPolicies = reportObject.evaluation.snapshot.cleaningLimitPolicies;
        const equipmentWiseMac = reportObject.content.macCalculation.macLimits.equipmentWiseMac;
        const equipmentGroupWiseMac = reportObject.content.macCalculation.macLimits.equipmentGroupWiseMac;


        const productsData = fillProductsData(products);
        const equipmentsData = fillEquipmentsData(equipments);
        const equipmentGroupsData = fillEquipmentGroupsData(equipmentGroups);
        const peMatrixData = fillPEMatrixData(products, equipments)
        const variableData = fillVariablesData(variables);
        const macFormulaData = fillFormulaData(MACformulas)
        const samplingParamsData = fillSamplingParamsData(samplingParams)
        const rpnFormulaData = fillRpnFormulaData(rpnFormulas);
        const cleaningLimitPolicyData = fillCleaningLimitData(cleaningLimitPolicies)
        const equipmentWiseProductMacTable = fillEquipmentWiseProductMACTable(equipments, equipmentWiseMac);
        const rpnCategoryData = fillRPNNumbers(rpnCategories) 

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
        ${variableData}
        ${macFormulaData}
        ${cleaningLimitPolicyData}
        ${rpnFormulaData}
        ${peMatrixData}
        ${equipmentWiseProductMacTable}
        ${rpnCategoryData}
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