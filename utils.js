const {reportObject, selectionCriteriaDescription} = require('./seed');

const MACMetrics = {
    L3: "MAC Surface Area",
    L4: "MAC Swab",
    L5: "MAC Swab Extract"
  };

  function fillProductsData(products, template) {
    let headers = [["Name", "Product Id", "API", "Solubility Factor", "Cleanability Factor", "PDE", "Min TD", "Max TD", "Min BS", "Strength"]];
    let body = products.reduce((a,product) => {
        for(let i = 0; i < 25550; i++) {
            a.push([`${product.name}`, `${product.product_id}`, `${product.api_name}`, `${product.solubility_factor.value}`, `${Math.round(+product.cleanability_factor.value)}`, `${Math.round(+product.pde.value)}`, `${product.min_td.value}`, `${product.max_td.value}`, `${Math.round(+product.min_bs.value)}`, `${Math.round(+product.strength.value)}`])
        }
        return a;
    }, []);
    let table = [...headers, ...body];
    let columnWidths = ["1.5cm", "1.7cm", "1cm", "1.5cm", "1.7cm", "1cm", "1cm", "1cm", "1cm", "1.5cm"]
    let data = {
        table,
        columnWidths,
        leftAlign: true
    };
    if(template) {
        return table;
    } else {
        return tableComponent(data);
    }
}
function fillEquipmentWiseProductMACTable(
    equipments,
    eqWiseMAC,
    template
  ) {
    const headers = [["ID","Name",`Toxicity based ${MACMetrics["L5"]}`,`Dosage based ${MACMetrics["L5"]}` ,`General ${MACMetrics["L5"]} `, `Site Acceptance limit ${MACMetrics["L5"]}`]];
    
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
          macs.macToxicity.L5.toFixed(4),
          macs.macDosage.L5.toFixed(4),
          macs.macGeneral.L5.toFixed(4),
          macs.alertLimit.L5.toFixed(4)
        ];
      });
      
      let table = [...headers, ...body];
      let columnWidths = ["1.5cm", "2cm", "3cm", "3cm", "3cm", "3cm"]
      let data = {
          table,
          columnWidths,
          leftAlign: true
      };
      if(template) {
          return table;
      } else {
        return tableComponent(data);
      }
  }

function fillEquipmentGroupWiseMAC(equipmentGroups, equipmentGroupWiseMAC, template) {
    const headers = [["ID",`Toxicity based ${MACMetrics["L5"]}`,`Dosage based ${MACMetrics["L5"]}` ,`General ${MACMetrics["L5"]} `, `Site Acceptance limit ${MACMetrics["L5"]}`]];
    let body = [];
    for(let i = 0; i < 4000; i++) {
        equipmentGroups.forEach(eg => {
            const macs = equipmentGroupWiseMAC[eg.id];
            const macToxicity = +macs.worstMACToxicity.L5.toFixed(4);
            const macDosage = +macs.worstMACDosage.L5.toFixed(4);
            const macGeneral = +macs.worstMACGeneral.L5.toFixed(4);
            const alertLimit = +macs.alertLimit.L5.toFixed(4);
        
            return body.push([eg.groupId, macToxicity, macDosage, macGeneral, alertLimit]);
          });
    }
    // const body = equipmentGroups.map(eg => {
    //     const macs = equipmentGroupWiseMAC[eg.id];
    //     const macToxicity = +macs.worstMACToxicity.L5;
    //     const macDosage = +macs.worstMACDosage.L5;
    //     const macGeneral = +macs.worstMACGeneral.L5;
    //     const alertLimit = +macs.alertLimit.L5;
    
    //     return [eg.groupId, macToxicity, macDosage, macGeneral, alertLimit];
    //   });
      
      let table = [...headers, ...body];
      let columnWidths = ["1.5cm", "3cm", "3cm", "3cm", "3cm"]
      let data = {
          table,
          columnWidths,
          leftAlign: true
      };
      if(template) {
          return table;
      } else {
        return tableComponent(data);
      }

}

function fillEquipmentWiseCAMACTable(equipments, cleaningAgents, equipmentWiseMAC,template) {
    const headers = [["Equipment ID",`Equipment Name`, ...cleaningAgents.map(c => c.name)]];
    const eqWiseMACData = equipments
    .filter(e => equipmentWiseMAC[e.id].cleaningAgentLimits)
    .map(e => {
      return {
        equipmentId: e.equipment_id,
        equipmentName: e.name,
        cleaningAgents: cleaningAgents.map(c => {
          let ca = equipmentWiseMAC[e.id].cleaningAgentLimits[c.id];
          return ca && ca.mac.L5;
        })
      };
    });

    const body = eqWiseMACData.map(e => [
        e.equipmentId,
        e.equipmentName,
        ...e.cleaningAgents.map(
          x =>
            typeof x !== "undefined"
              ? x
              : "N/A"
        )
      ]);
      let table = [...headers, ...body];
      let columnWidths = ["1.5cm", "2cm"]
      let len = headers[0].length - 2;
      for(let i = 0; i < len; i++) {
        columnWidths.push("2cm");
      }
      let data = {
          table,
          columnWidths,
          leftAlign: true
      };
      if(template) {
          return table;
      } else {
        return tableComponent(data);
      }
}

function createEquipmentWiseRPNTableData(
    equipments,
    eqWiseRPN
  ) {
    return equipments.map(e => ({
      equipmentId: e.equipment_id,
      equipmentName: e.name,
      worstProductRPN: eqWiseRPN[e.id]
    }));
  }

function getEquipmentWiseWorstRPNProductTable(
    equipments,
    eqWiseRPN,
    products,
    selectionCriteria,
    template
  ) {
    const selectionCriteriaNames = selectionCriteria.reduce((old, cur) => {
      if (old.indexOf(cur.name) === -1) {
        old.push(cur.name);
      }
      return old;
    }, []);
    const rpnHeaders = selectionCriteriaNames.map(r => `Worst Product by ${r}`);
    const headers = [
      [
        "Equipment ID",
        "Equipment Name",
        ...rpnHeaders
      ]
    ];
    const columnWidths = ["3cm", "3cm"];
    const len = headers[0].length - 2;
    for(let i = 0; i < len; i++) {
        columnWidths.push("3cm");
    }
    let pIdToNameMap = {};
    let keys = Object.keys(eqWiseRPN);
    keys.forEach(item => {
      selectionCriteriaNames.forEach(name => {
        eqWiseRPN[item][name].forEach(prod => {
          let found = products.find(product => {
            return product.product_id === prod;
          });
          pIdToNameMap[prod] = found.name;
        });
      });
    });
    const eqWiseMACData = createEquipmentWiseRPNTableData(equipments, eqWiseRPN);
    eqWiseMACData.forEach(eq => {
      let rpnValues = selectionCriteriaNames.map(r => {
        let wProducts = eq.worstProductRPN[r];
        let productNames = getProductNamesFromId(wProducts, pIdToNameMap);
        return productNames;
      });
      const row = [eq.equipmentId, eq.equipmentName, ...rpnValues];
      headers.push(row);
    });
    let data = {
        table:headers,
        columnWidths,
        leftAlign: true
    };
    if(template) {
        return headers;
    } else {
        return tableComponent(data);
    }
  }
  
  function getProductNamesFromId(
    productIds,
    pIdToNameMap
  ) {
    const names = productIds.reduce((a, id) => [...a, pIdToNameMap[id]], []);
    return names.join(", ");
  }


function getHeaders(widths) {
    const headers = widths.reduce((a,b) => {
        a += `p{${b}} |`
        return a;
    }, "|");
    return headers;
}   

function getData(table) {
    const data = table.reduce((a,b) => {
        a += '\n'
        a += b.join("&")
        a += '\\\\\n'
        a += '\\hline\n'
        return a;
    }, "");
    return data;
}

function fillSelectionCriterias(selectionCriteria) {
    let str = "";
    selectionCriteria.forEach((selCriteria) => {
        str += "\\begin{itemize}"
        str += `\\item ${selCriteria.name} \\dots{}`
        str += `\\begin{itemize}`
        selCriteria.descriptions.forEach((des) => {
            str += `\\item ${des}`;
        });
        str += `\\end{itemize}`
        str += `\\end{itemize}`
    });
    return str;
}

function getTemplateData() {
    const equipments = reportObject.evaluation.snapshot.equipments;
    const equipmentGroups = reportObject.evaluation.snapshot.equipmentGroups;
    const cleaningAgents = reportObject.evaluation.snapshot.cleaningAgents;
    const eqWiseRPN = reportObject.content.macCalculation.equipmentWiseWorstProduct;
    const selectionCriteria = reportObject.evaluation.snapshot.selectionCriteria;
    const products = reportObject.evaluation.snapshot.products;

    const equipmentWiseMac = reportObject.content.macCalculation.macLimits.equipmentWiseMac;
    const equipmentGroupWiseMac = reportObject.content.macCalculation.macLimits.equipmentGroupWiseMac;
    const eqWiseMacTable = fillEquipmentWiseProductMACTable(equipments, equipmentWiseMac, true);
    const eqGroupWiseMacTable = fillEquipmentGroupWiseMAC(equipmentGroups, equipmentGroupWiseMac, true);
    const eqWiseCAMacTable = fillEquipmentWiseCAMACTable(equipments, cleaningAgents, equipmentWiseMac, true);
    const eqWiseRPNTable = getEquipmentWiseWorstRPNProductTable(equipments, eqWiseRPN, products, selectionCriteria, true);
    const productsTable = fillProductsData(products, true);

    const template_data = {
        eqWiseMacHeaders: getHeaders(["1.5cm", "2cm", "3cm", "3cm", "3cm", "3cm"]),
        eqGroupWiseMacHeaders: getHeaders(["1.5cm", "3cm", "3cm", "3cm", "3cm"]),
        eqWiseCAMacHeaders: getHeaders(["2cm", "2cm", ...cleaningAgents.map(c => "4cm")]),
        eqWiseRPNHeaders: getHeaders(["3cm","3cm", ...selectionCriteria.map(sc => "3cm")]),
        eqWiseMacData: getData(eqWiseMacTable),
        eqGroupWiseMacData: getData(eqGroupWiseMacTable),
        eqWiseCAMacData: getData(eqWiseCAMacTable),
        eqWiseRPNData: getData(eqWiseRPNTable),
        selectionCriteriaList: fillSelectionCriterias(selectionCriteriaDescription),
        products: getData(productsTable),
        productHeaders: getHeaders(["1.5cm", "2cm", "1.5cm", "1.5cm", "2cm", "2cm", "2cm", "2cm", "2cm", "2cm"]),
        siddharth: {
          name: {
            name:'siddharth'
          }
        }
    };
    return template_data;
}

module.exports = {
    getTemplateData
}