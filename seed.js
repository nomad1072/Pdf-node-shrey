module.exports = {
    selectionCriteriaDescription: [
        {
           "criteriaId": "7d704c9f-0cfb-419f-912d-f7987ea20d14",
           "name": "C1",
           "descriptions": [
              "Product having the highest solubility rating will be selected as worst product.",
              "In case where solubility rating of two products are identical, Product having the highest Toxicity Risk category will be selected as worst product.",
              "In case where Toxicity Risk category of two products are identical, Product having the highest risk number as per RPN overall will be selected as worst product."
           ],
           "rules": [
              {
                 "type": "ProductProperty",
                 "step": 1,
                 "property": "solubility_factor"
              },
              {
                 "type": "RPNCategory",
                 "step": 2,
                 "category": {
                    "name": "Toxicity Risk",
                    "riskID": "R1",
                    "productProperty": "pde",
                    "unit": "mg",
                    "values": [
                       "1",
                       "0.1",
                       "0.01",
                       "0.001"
                    ],
                    "id": 1
                 }
              },
              {
                 "type": "RPNFormula",
                 "step": 3,
                 "formula": {
                    "name": "RPN_overall",
                    "formula": "R1*R2*R3*R4",
                    "description": "risk evaluation from multiple risk factors",
                    "rank": 1,
                    "enabled": true,
                    "id": 1
                 }
              }
           ]
        }
     ]
     ,
    reportObject: {
        "name": "Document1",
        "referenceId": "D1",
        "type": "MACProtocol",
        "status": "ApprovalPending",
        "createdOn": "2018-07-25T07:55:43.669Z",
        "updatedOn": "2018-07-25T07:55:43.669Z",
        "content": {
           "macCalculation": {
              "macLimits": {
                 "macGraph": {
                    "1": {
                       "2": {
                          "sharedAreaSqcm": 30000,
                          "macToxicityMgPSqcm": 0.008749999999999997,
                          "macDosageMgPSqcm": 0.0035,
                          "macGeneralMgPSqcm": 0.00007
                       },
                       "3": {
                          "sharedAreaSqcm": 50000,
                          "macToxicityMgPSqcm": 0.002999999999999998,
                          "macDosageMgPSqcm": 0.0011999999999999995,
                          "macGeneralMgPSqcm": 0.000039999999999999976
                       },
                       "4": {
                          "sharedAreaSqcm": 70000,
                          "macToxicityMgPSqcm": 0.0042857142857142825,
                          "macDosageMgPSqcm": 0.0017142857142857135,
                          "macGeneralMgPSqcm": 0.000028571428571428557
                       }
                    },
                    "2": {
                       "1": {
                          "sharedAreaSqcm": 30000,
                          "macToxicityMgPSqcm": 0.002851851851851852,
                          "macDosageMgPSqcm": 0.007333333333333334,
                          "macGeneralMgPSqcm": 0.00014666666666666666
                       },
                       "3": {
                          "sharedAreaSqcm": 10000,
                          "macToxicityMgPSqcm": 0.0023333333333333322,
                          "macDosageMgPSqcm": 0.0059999999999999975,
                          "macGeneralMgPSqcm": 0.0001999999999999999
                       },
                       "4": {
                          "sharedAreaSqcm": 30000,
                          "macToxicityMgPSqcm": 0.001555555555555555,
                          "macDosageMgPSqcm": 0.003999999999999998,
                          "macGeneralMgPSqcm": 0.00006666666666666663
                       }
                    },
                    "3": {
                       "1": {
                          "sharedAreaSqcm": 50000,
                          "macToxicityMgPSqcm": 0.007577777777777779,
                          "macDosageMgPSqcm": 0.007333333333333334,
                          "macGeneralMgPSqcm": 0.00008800000000000001
                       },
                       "2": {
                          "sharedAreaSqcm": 10000,
                          "macToxicityMgPSqcm": 0.018083333333333337,
                          "macDosageMgPSqcm": 0.0175,
                          "macGeneralMgPSqcm": 0.00021
                       },
                       "4": {
                          "sharedAreaSqcm": 50000,
                          "macToxicityMgPSqcm": 0.004133333333333332,
                          "macDosageMgPSqcm": 0.003999999999999998,
                          "macGeneralMgPSqcm": 0.00003999999999999998
                       }
                    },
                    "4": {
                       "1": {
                          "sharedAreaSqcm": 70000,
                          "macToxicityMgPSqcm": 0.02095238095238095,
                          "macDosageMgPSqcm": 0.002619047619047619,
                          "macGeneralMgPSqcm": 0.00006285714285714286
                       },
                       "2": {
                          "sharedAreaSqcm": 30000,
                          "macToxicityMgPSqcm": 0.023333333333333334,
                          "macDosageMgPSqcm": 0.002916666666666667,
                          "macGeneralMgPSqcm": 0.00007
                       },
                       "3": {
                          "sharedAreaSqcm": 50000,
                          "macToxicityMgPSqcm": 0.007999999999999997,
                          "macDosageMgPSqcm": 0.0009999999999999996,
                          "macGeneralMgPSqcm": 0.000039999999999999976
                       }
                    }
                 },
                 "equipmentWiseMac": {
                    "1": {
                       "cleaningAgentLimits": {
                          "1": {
                             "mac": {
                                "L3": 0.17119999999999988,
                                "L4": 6.847999999999995,
                                "L5": 342.39999999999975
                             },
                             "productIds": [
                                3
                             ]
                          }
                       },
                       "productLimits": {
                          "macToxicity": {
                             "L3": 0.001555555555555555,
                             "L4": 0.0622222222222222,
                             "L5": 3.1111111111111103
                          },
                          "macDosage": {
                             "L3": 0.0009999999999999996,
                             "L4": 0.03999999999999998,
                             "L5": 1.9999999999999993
                          },
                          "macGeneral": {
                             "L3": 0.000028571428571428557,
                             "L4": 0.0011428571428571423,
                             "L5": 0.05714285714285712
                          },
                          "alertLimit": {
                             "L3": 0.0007777777777777775,
                             "L4": 0.0311111111111111,
                             "L5": 1.5555555555555551
                          }
                       },
                       "analysis": {
                          "dedicationImprovement": {
                             "productId": 2,
                             "from": 1.5555555555555551,
                             "to": 2.999999999999998,
                             "impact": 0.9285714285714277
                          },
                          "combinationImprovement": {
                             "pair": [
                                2,
                                4
                             ],
                             "from": 1.5555555555555551,
                             "to": 2.333333333333332,
                             "impact": 0.49999999999999956
                          }
                       }
                    },
                    "2": {
                       "cleaningAgentLimits": {
                          "1": {
                             "mac": {
                                "L3": 0.24457142857142847,
                                "L4": 9.78285714285714,
                                "L5": 489.142857142857
                             },
                             "productIds": [
                                4
                             ]
                          }
                       },
                       "productLimits": {
                          "macToxicity": {
                             "L3": 0.001555555555555555,
                             "L4": 0.0622222222222222,
                             "L5": 3.1111111111111103
                          },
                          "macDosage": {
                             "L3": 0.0017142857142857135,
                             "L4": 0.06857142857142855,
                             "L5": 3.428571428571427
                          },
                          "macGeneral": {
                             "L3": 0.000028571428571428557,
                             "L4": 0.0011428571428571423,
                             "L5": 0.05714285714285712
                          },
                          "alertLimit": {
                             "L3": 0.0007777777777777775,
                             "L4": 0.0311111111111111,
                             "L5": 1.5555555555555551
                          }
                       },
                       "analysis": {
                          "dedicationImprovement": {
                             "productId": 2,
                             "from": 1.5555555555555551,
                             "to": 4.285714285714282,
                             "impact": 1.755102040816325
                          },
                          "combinationImprovement": {
                             "pair": [
                                2,
                                4
                             ],
                             "from": 1.5555555555555551,
                             "to": 2.851851851851852,
                             "impact": 0.8333333333333339
                          }
                       }
                    },
                    "3": {
                       "cleaningAgentLimits": {
                          "1": {
                             "mac": {
                                "L3": 0.17119999999999988,
                                "L4": 6.847999999999995,
                                "L5": 342.39999999999975
                             },
                             "productIds": [
                                3
                             ]
                          }
                       },
                       "productLimits": {
                          "macToxicity": {
                             "L3": 0.002999999999999998,
                             "L4": 0.11999999999999991,
                             "L5": 5.999999999999996
                          },
                          "macDosage": {
                             "L3": 0.0009999999999999996,
                             "L4": 0.03999999999999998,
                             "L5": 1.9999999999999993
                          },
                          "macGeneral": {
                             "L3": 0.000028571428571428557,
                             "L4": 0.0011428571428571423,
                             "L5": 0.05714285714285712
                          },
                          "alertLimit": {
                             "L3": 0.001499999999999999,
                             "L4": 0.059999999999999956,
                             "L5": 2.999999999999998
                          }
                       },
                       "analysis": {
                          "dedicationImprovement": {
                             "productId": 1,
                             "from": 2.999999999999998,
                             "to": 4.133333333333332,
                             "impact": 0.37777777777777843
                          },
                          "combinationImprovement": {
                             "pair": [
                                1,
                                3
                             ],
                             "from": 2.999999999999998,
                             "to": 4.133333333333332,
                             "impact": 0.37777777777777843
                          }
                       }
                    }
                 },
                 "alertLimit": {
                    "L3": 0.0007777777777777775,
                    "L4": 0.0311111111111111,
                    "L5": 1.5555555555555551
                 },
                 "worstMACDosage": {
                    "L3": 0.0009999999999999996,
                    "L4": 0.03999999999999998,
                    "L5": 1.9999999999999993
                 },
                 "worstMACToxicity": {
                    "L3": 0.001555555555555555,
                    "L4": 0.0622222222222222,
                    "L5": 3.1111111111111103
                 },
                 "worstMACGeneral": {
                    "L3": 0.000028571428571428557,
                    "L4": 0.0011428571428571423,
                    "L5": 0.05714285714285712
                 },
                 "equipmentGroupWiseMac": {
                    "1": {
                       "alertLimit": {
                          "L3": 0.0007777777777777775,
                          "L4": 0.0311111111111111,
                          "L5": 1.5555555555555551
                       },
                       "worstMACDosage": {
                          "L3": 0.0009999999999999996,
                          "L4": 0.03999999999999998,
                          "L5": 1.9999999999999993
                       },
                       "worstMACToxicity": {
                          "L3": 0.001555555555555555,
                          "L4": 0.0622222222222222,
                          "L5": 3.1111111111111103
                       },
                       "worstMACGeneral": {
                          "L3": 0.000028571428571428557,
                          "L4": 0.0011428571428571423,
                          "L5": 0.05714285714285712
                       }
                    }
                 }
              },
              "samplingParams": {
                 "type": "Swab",
                 "params": {
                    "swab": 40,
                    "sda": 20
                 }
              },
              "equipmentWiseWorstProduct": {
                 "1": {
                    "C1": [
                       "P3"
                    ]
                 },
                 "2": {
                    "C1": [
                       "P2"
                    ]
                 },
                 "3": {
                    "C1": [
                       "P3"
                    ]
                 }
              }
           },
           "generatedBy": {
              "firstName": "Admin",
              "lastName": "User",
              "email": "admin@leucinetech.com",
              "_passwordSaltedHash": "$2a$10$udUgRMnwnt8PtPOmGYXRcugp2Bsd2EAf11xFCx30bXSThkY33aly6",
              "role": {
                 "name": "Admin",
                 "permission": {
                    "User": {
                       "Add": true,
                       "Archive": true,
                       "Modify": true,
                       "Get": true
                    },
                    "UserRole": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "Equipment": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true,
                       "Archive": true
                    },
                    "EquipmentGroup": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "Product": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true,
                       "Archive": true
                    },
                    "ProductType": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "MACFormula": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "RPNFormula": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "RPNCategory": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "CEReport": {
                       "Generate": true,
                       "GeneratePDF": true,
                       "Get": true
                    },
                    "CleaningAgent": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "Master": {
                       "BulkExport": true,
                       "BulkImport": true
                    },
                    "AuditLog": {
                       "Get": true
                    },
                    "Variable": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "DefaultUnit": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "SwabLocation": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "ResidueMeasure": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "CleaningPolicy": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "ApprovalPolicy": {
                       "Modify": true,
                       "Get": true,
                       "Sign": true
                    },
                    "Department": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "SelectionCriteria": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "FacilityCleaningEvaluation": {
                       "Generate": true,
                       "Get": true
                    },
                    "ReportDocument": {
                       "Generate": true,
                       "GeneratePDF": true,
                       "Get": true,
                       "Modify": true
                    },
                    "WorstProductOverride": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "EquipmentWiseWorstProduct": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "AnalyticalMethod": {
                       "Add": false,
                       "Delete": false,
                       "Modify": false,
                       "Get": false
                    },
                    "EquipmentWiseCleaningAgentLimit": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    }
                 },
                 "id": 1
              },
              "enabled": true,
              "department": {
                 "department_id": "Default",
                 "name": "Default",
                 "id": 1
              },
              "id": 1
           }
        },
        "id": 1,
        "evaluationId": 1,
        "evaluation": {
           "startedOn": "2018-07-25T07:55:43.660Z",
           "startedBy": {
              "firstName": "Admin",
              "lastName": "User",
              "email": "admin@leucinetech.com",
              "_passwordSaltedHash": "$2a$10$udUgRMnwnt8PtPOmGYXRcugp2Bsd2EAf11xFCx30bXSThkY33aly6",
              "role": {
                 "name": "Admin",
                 "permission": {
                    "User": {
                       "Add": true,
                       "Archive": true,
                       "Modify": true,
                       "Get": true
                    },
                    "UserRole": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "Equipment": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true,
                       "Archive": true
                    },
                    "EquipmentGroup": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "Product": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true,
                       "Archive": true
                    },
                    "ProductType": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "MACFormula": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "RPNFormula": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "RPNCategory": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "CEReport": {
                       "Generate": true,
                       "GeneratePDF": true,
                       "Get": true
                    },
                    "CleaningAgent": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "Master": {
                       "BulkExport": true,
                       "BulkImport": true
                    },
                    "AuditLog": {
                       "Get": true
                    },
                    "Variable": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "DefaultUnit": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "SwabLocation": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "ResidueMeasure": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "CleaningPolicy": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "ApprovalPolicy": {
                       "Modify": true,
                       "Get": true,
                       "Sign": true
                    },
                    "Department": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "SelectionCriteria": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "FacilityCleaningEvaluation": {
                       "Generate": true,
                       "Get": true
                    },
                    "ReportDocument": {
                       "Generate": true,
                       "GeneratePDF": true,
                       "Get": true,
                       "Modify": true
                    },
                    "WorstProductOverride": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "EquipmentWiseWorstProduct": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    },
                    "AnalyticalMethod": {
                       "Add": false,
                       "Delete": false,
                       "Modify": false,
                       "Get": false
                    },
                    "EquipmentWiseCleaningAgentLimit": {
                       "Add": true,
                       "Delete": true,
                       "Modify": true,
                       "Get": true
                    }
                 },
                 "id": 1
              },
              "enabled": true,
              "department": {
                 "department_id": "Default",
                 "name": "Default",
                 "id": 1
              },
              "id": 1
           },
           "snapshot": {
              "cleaningAgents": [
                 {
                    "name": "methanol",
                    "ld50": {
                       "value": 428,
                       "unit": "mg / kg"
                    },
                    "id": 1
                 }
              ],
              "equipments": [
                 {
                    "name": "Equipment1",
                    "equipment_id": "EQ1",
                    "surface_area": {
                       "value": 10000,
                       "unit": "sqcm"
                    },
                    "metadata": {},
                    "enabled": true,
                    "id": 1
                 },
                 {
                    "name": "Equipment2",
                    "equipment_id": "EQ2",
                    "surface_area": {
                       "value": 20000,
                       "unit": "sqcm"
                    },
                    "metadata": {},
                    "enabled": true,
                    "id": 2
                 },
                 {
                    "name": "Equipment3",
                    "equipment_id": "EQ3",
                    "surface_area": {
                       "value": 40000,
                       "unit": "sqcm"
                    },
                    "metadata": {},
                    "enabled": true,
                    "id": 3
                 }
              ],
              "equipmentGroups": [
                 {
                    "groupId": "EqGrp1",
                    "name": "Train1",
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "equipments": [
                       {
                          "name": "Equipment1",
                          "equipment_id": "EQ1",
                          "surface_area": {
                             "value": 10000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 1
                       },
                       {
                          "name": "Equipment2",
                          "equipment_id": "EQ2",
                          "surface_area": {
                             "value": 20000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 2
                       },
                       {
                          "name": "Equipment3",
                          "equipment_id": "EQ3",
                          "surface_area": {
                             "value": 40000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 3
                       }
                    ],
                    "id": 1
                 }
              ],
              "products": [
                 {
                    "name": "Product1",
                    "product_id": "P1",
                    "api_name": "API1",
                    "solubility_factor": {
                       "value": 1
                    },
                    "cleanability_factor": {
                       "value": 1
                    },
                    "pde": {
                       "value": 0.44999999999999984,
                       "unit": "mg"
                    },
                    "min_td": {
                       "value": 180,
                       "unit": "mg"
                    },
                    "max_td": {
                       "value": 360,
                       "unit": "mg"
                    },
                    "min_bs": {
                       "value": 440000,
                       "unit": "mg"
                    },
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "equipments": [
                       {
                          "name": "Equipment1",
                          "equipment_id": "EQ1",
                          "surface_area": {
                             "value": 10000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 1
                       },
                       {
                          "name": "Equipment2",
                          "equipment_id": "EQ2",
                          "surface_area": {
                             "value": 20000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 2
                       },
                       {
                          "name": "Equipment3",
                          "equipment_id": "EQ3",
                          "surface_area": {
                             "value": 40000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 3
                       }
                    ],
                    "strength": {
                       "value": 399.9999999999999,
                       "unit": "mg"
                    },
                    "enabled": true,
                    "id": 1,
                    "overrides": []
                 },
                 {
                    "name": "Product2",
                    "product_id": "P2",
                    "api_name": "API2",
                    "solubility_factor": {
                       "value": 3
                    },
                    "cleanability_factor": {
                       "value": 3
                    },
                    "pde": {
                       "value": 0.07,
                       "unit": "mg"
                    },
                    "min_td": {
                       "value": 180,
                       "unit": "mg"
                    },
                    "max_td": {
                       "value": 360,
                       "unit": "mg"
                    },
                    "min_bs": {
                       "value": 210000,
                       "unit": "mg"
                    },
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "equipments": [
                       {
                          "name": "Equipment1",
                          "equipment_id": "EQ1",
                          "surface_area": {
                             "value": 10000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 1
                       },
                       {
                          "name": "Equipment2",
                          "equipment_id": "EQ2",
                          "surface_area": {
                             "value": 20000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 2
                       }
                    ],
                    "strength": {
                       "value": 399.99999999999983,
                       "unit": "mg"
                    },
                    "enabled": true,
                    "cleaningAgent": {
                       "name": "methanol",
                       "ld50": {
                          "value": 428,
                          "unit": "mg / kg"
                       },
                       "id": 1
                    },
                    "id": 2,
                    "overrides": []
                 },
                 {
                    "name": "Product3",
                    "product_id": "P3",
                    "api_name": "API3",
                    "solubility_factor": {
                       "value": 5
                    },
                    "cleanability_factor": {
                       "value": 3
                    },
                    "pde": {
                       "value": 0.31,
                       "unit": "mg"
                    },
                    "min_td": {
                       "value": 300,
                       "unit": "mg"
                    },
                    "max_td": {
                       "value": 600,
                       "unit": "mg"
                    },
                    "min_bs": {
                       "value": 199999.99999999988,
                       "unit": "mg"
                    },
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "equipments": [
                       {
                          "name": "Equipment1",
                          "equipment_id": "EQ1",
                          "surface_area": {
                             "value": 10000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 1
                       },
                       {
                          "name": "Equipment3",
                          "equipment_id": "EQ3",
                          "surface_area": {
                             "value": 40000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 3
                       }
                    ],
                    "strength": {
                       "value": 399.99999999999983,
                       "unit": "mg"
                    },
                    "enabled": true,
                    "cleaningAgent": {
                       "name": "methanol",
                       "ld50": {
                          "value": 428,
                          "unit": "mg / kg"
                       },
                       "id": 1
                    },
                    "id": 3,
                    "overrides": []
                 },
                 {
                    "name": "Product4",
                    "product_id": "P4",
                    "api_name": "API4",
                    "solubility_factor": {
                       "value": 2
                    },
                    "cleanability_factor": {
                       "value": 5
                    },
                    "pde": {
                       "value": 1.2,
                       "unit": "mg"
                    },
                    "min_td": {
                       "value": 150,
                       "unit": "mg"
                    },
                    "max_td": {
                       "value": 300,
                       "unit": "mg"
                    },
                    "min_bs": {
                       "value": 199999.9999999999,
                       "unit": "mg"
                    },
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "equipments": [
                       {
                          "name": "Equipment1",
                          "equipment_id": "EQ1",
                          "surface_area": {
                             "value": 10000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 1
                       },
                       {
                          "name": "Equipment2",
                          "equipment_id": "EQ2",
                          "surface_area": {
                             "value": 20000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 2
                       },
                       {
                          "name": "Equipment3",
                          "equipment_id": "EQ3",
                          "surface_area": {
                             "value": 40000,
                             "unit": "sqcm"
                          },
                          "metadata": {},
                          "enabled": true,
                          "id": 3
                       }
                    ],
                    "strength": {
                       "value": 399.9999999999999,
                       "unit": "mg"
                    },
                    "enabled": true,
                    "id": 4,
                    "overrides": []
                 }
              ],
              "variables": [
                 {
                    "name": "Body weight (for LD50 dose)",
                    "shortName": "bw",
                    "unit": "kg",
                    "description": "body weight of patient taking next product",
                    "defaultValue": 60,
                    "defaultValueReason": "Average body weight",
                    "id": 1
                 },
                 {
                    "name": "Equipment Verification Period",
                    "shortName": "verifyPeriod",
                    "unit": "month",
                    "description": "The frequency at which equipment needs to be verified.",
                    "defaultValue": 3,
                    "defaultValueReason": "Quaterly check",
                    "id": 2
                 },
                 {
                    "name": "Modification factor",
                    "shortName": "mf",
                    "unit": "",
                    "description": "Cumulative modifying factor, selected by the toxicologist. generally no more than 1000",
                    "defaultValue": 1000,
                    "defaultValueReason": "As recommended by the PDA Technical Report 29",
                    "id": 3
                 },
                 {
                    "name": "Safety Factor - Solids",
                    "shortName": "sf_solid",
                    "unit": "",
                    "description": "Safety Factor for Solids drug dosage",
                    "defaultValue": 1000,
                    "defaultValueReason": "As recommended by Pharmaceutical Process Validation: Second Edition (I. R. Berry, R. A. Nash, eds.)",
                    "id": 4
                 }
              ],
              "macFormulas": [
                 {
                    "name": "MAC_dosage",
                    "formula": "(1 / sf_solid) * (min_td_a) * (1 / max_td_b) * (min_bs_b) * (1 / area_shared)",
                    "description": "based on minimum daily dose of the drug active in a maximum daily dose of the next drug product",
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "samplingType": "swab",
                    "disabled": false,
                    "id": 1
                 },
                 {
                    "name": "MAC_general",
                    "formula": "(1 / 1e+5) * (min_bs_b) * (1 / area_shared)",
                    "description": "general 10ppm limit to be considered when it is lower than dosage/toxicity based limits or when dosage/toxicity data is not available",
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "samplingType": "swab",
                    "disabled": false,
                    "id": 2
                 },
                 {
                    "name": "MAC_toxicity",
                    "formula": "(pde_a) * (1 / max_td_b) * (min_bs_b) * (1 / area_shared)",
                    "description": "based on Risk-MaPP Acceptable Daily Exposure (ADE) approach",
                    "productType": {
                       "name": "solid",
                       "id": 1
                    },
                    "samplingType": "swab",
                    "disabled": false,
                    "id": 3
                 }
              ],
              "rpnCategories": [
                 {
                    "name": "Toxicity Risk",
                    "riskID": "R1",
                    "productProperty": "pde",
                    "unit": "mg",
                    "values": [
                       "1",
                       "0.1",
                       "0.01",
                       "0.001"
                    ],
                    "id": 1
                 },
                 {
                    "name": "Potency Risk",
                    "riskID": "R2",
                    "productProperty": "min_td",
                    "unit": "mg",
                    "values": [
                       "1",
                       "0.1",
                       "0.01",
                       "0.001"
                    ],
                    "id": 2
                 },
                 {
                    "name": "Solubility Risk",
                    "riskID": "R3",
                    "productProperty": "solubility_factor",
                    "unit": "",
                    "values": [
                       "1",
                       "2",
                       "3",
                       "4",
                       "5"
                    ],
                    "id": 3
                 },
                 {
                    "name": "Cleanability Risk",
                    "riskID": "R4",
                    "productProperty": "cleanability_factor",
                    "unit": "",
                    "values": [
                       "1",
                       "2",
                       "3",
                       "4",
                       "5",
                       "6",
                       "7"
                    ],
                    "id": 4
                 }
              ],
              "rpnFormulas": [
                 {
                    "name": "RPN_overall",
                    "formula": "R1*R2*R3*R4",
                    "description": "risk evaluation from multiple risk factors",
                    "rank": 1,
                    "enabled": true,
                    "id": 1
                 }
              ],
              "selectionCriteria": [
                 {
                    "criteriaId": "66e486d1-dad0-4c37-8b4c-824b474dff65",
                    "name": "C1",
                    "type": "ProductProperty",
                    "step": 1,
                    "id": 1,
                    "property": "solubility_factor"
                 },
                 {
                    "criteriaId": "66e486d1-dad0-4c37-8b4c-824b474dff65",
                    "name": "C1",
                    "type": "RPNCategory",
                    "step": 2,
                    "id": 2,
                    "property": null,
                    "category": {
                       "name": "Toxicity Risk",
                       "riskID": "R1",
                       "productProperty": "pde",
                       "unit": "mg",
                       "values": [
                          "1",
                          "0.1",
                          "0.01",
                          "0.001"
                       ],
                       "id": 1
                    }
                 },
                 {
                    "criteriaId": "66e486d1-dad0-4c37-8b4c-824b474dff65",
                    "name": "C1",
                    "type": "RPNFormula",
                    "step": 3,
                    "formula": {
                       "name": "RPN_overall",
                       "formula": "R1*R2*R3*R4",
                       "description": "risk evaluation from multiple risk factors",
                       "rank": 1,
                       "enabled": true,
                       "id": 1
                    },
                    "id": 3,
                    "property": null
                 }
              ],
              "defaultUnits": {
                 "strength": "mg",
                 "sda": "ml",
                 "swabbed_area": "sqcm",
                 "ld50": "mg/kg",
                 "L5": "ppm",
                 "L4": "mg",
                 "L3": "mg/sqcm",
                 "surface_area": "sqcm",
                 "min_bs": "mg",
                 "td": "mg",
                 "pde": "mg"
              },
              "productsRaw": {
                 "1": {
                    "productId": "P1",
                    "name": "Product1",
                    "rpnNumbers": {
                       "R1": {
                          "value": 2
                       },
                       "R2": {
                          "value": 1
                       },
                       "R3": {
                          "value": 2
                       },
                       "R4": {
                          "value": 2
                       }
                    },
                    "rpn": {
                       "RPN_overall": 8
                    },
                    "min_td": 180,
                    "max_td": 360,
                    "min_bs": 440000,
                    "pde": 0.44999999999999984,
                    "solubility_factor": 1,
                    "cleanability_factor": 1,
                    "strength": 399.9999999999999
                 },
                 "2": {
                    "productId": "P2",
                    "name": "Product2",
                    "cleaningAgent": 1,
                    "rpnNumbers": {
                       "R1": {
                          "value": 3
                       },
                       "R2": {
                          "value": 1
                       },
                       "R3": {
                          "value": 4
                       },
                       "R4": {
                          "value": 4
                       }
                    },
                    "rpn": {
                       "RPN_overall": 48
                    },
                    "min_td": 180,
                    "max_td": 360,
                    "min_bs": 210000,
                    "pde": 0.07,
                    "solubility_factor": 3,
                    "cleanability_factor": 3,
                    "strength": 399.99999999999983
                 },
                 "3": {
                    "productId": "P3",
                    "name": "Product3",
                    "cleaningAgent": 1,
                    "rpnNumbers": {
                       "R1": {
                          "value": 2
                       },
                       "R2": {
                          "value": 1
                       },
                       "R3": {
                          "value": 6
                       },
                       "R4": {
                          "value": 4
                       }
                    },
                    "rpn": {
                       "RPN_overall": 48
                    },
                    "min_td": 300,
                    "max_td": 600,
                    "min_bs": 199999.99999999988,
                    "pde": 0.31,
                    "solubility_factor": 5,
                    "cleanability_factor": 3,
                    "strength": 399.99999999999983
                 },
                 "4": {
                    "productId": "P4",
                    "name": "Product4",
                    "rpnNumbers": {
                       "R1": {
                          "value": 1
                       },
                       "R2": {
                          "value": 1
                       },
                       "R3": {
                          "value": 3
                       },
                       "R4": {
                          "value": 6
                       }
                    },
                    "rpn": {
                       "RPN_overall": 18
                    },
                    "min_td": 150,
                    "max_td": 300,
                    "min_bs": 199999.9999999999,
                    "pde": 1.2,
                    "solubility_factor": 2,
                    "cleanability_factor": 5,
                    "strength": 399.9999999999999
                 }
              },
              "mappedCARaw": {
                 "1": 428
              },
              "mappedEqRaw": {
                 "1": {
                    "products": [
                       1,
                       2,
                       3,
                       4
                    ],
                    "cleaningAgents": {
                       "1": true
                    },
                    "surfaceAreaSqcm": 10000
                 },
                 "2": {
                    "products": [
                       1,
                       2,
                       4
                    ],
                    "cleaningAgents": {
                       "1": true
                    },
                    "surfaceAreaSqcm": 20000
                 },
                 "3": {
                    "products": [
                       1,
                       3,
                       4
                    ],
                    "cleaningAgents": {
                       "1": true
                    },
                    "surfaceAreaSqcm": 40000
                 }
              },
              "cleaningLimitPolicies": [
                 {
                    "name": "Default",
                    "type": "default",
                    "description": "Recommended cleaning limit policy based on latest regulatory   guideline. Acceptance limit is always equal to HBEL based limit and site acceptance limit is either based   on dosage based limit if it significantly lower than HBEL or is a lower ratio of HBEL itself",
                    "alertToAcceptanceRatio": 0.5
                 }
              ]
           },
           "status": "InProgress",
           "id": 1
        }
     }
}