"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataTransformer {
    constructor(parser) {
        this.parser = parser;
    }
    transformAllData(precursor, criteria) {
        return new Promise((resolve) => {
            if (!criteria || criteria.length === 0) {
                resolve(precursor);
            }
            else {
                let filtered = this.transformData(precursor, criteria[0]);
                criteria.splice(0, 1);
                for (const crit of criteria) {
                    if (crit.getLogicKey() === "and ") {
                        filtered = this.transformData(filtered, crit);
                    }
                    else if (crit.getLogicKey() === "or ") {
                        filtered = filtered.concat(this.transformData(precursor, crit));
                    }
                }
                resolve(filtered);
            }
        });
    }
    transformData(dataset, criteria) {
        const key = criteria.getKey();
        const keyIndex = this.findFilterKeyIndex(key);
        const numValue = Number(criteria.getVal());
        const strValue = criteria.getVal().slice(1, -1);
        const result = [];
        if (criteria.getOp().includes("not ")) {
            if (criteria.getOp().includes("greater ")) {
                for (const row of dataset) {
                    const valFromData = Number(row[keyIndex]);
                    if (valFromData <= numValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("less ")) {
                for (const row of dataset) {
                    const valFromData = Number(row[keyIndex]);
                    if (valFromData >= numValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("equal ")) {
                for (const row of dataset) {
                    const valFromData = Number(row[keyIndex]);
                    if (valFromData !== numValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("is ")) {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (valFromData !== strValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("include ")) {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (!valFromData.includes(strValue)) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("begin ")) {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (valFromData.slice(0, strValue.length) !== strValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("end ")) {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (valFromData.slice(-strValue.length) !== strValue) {
                        result.push(row);
                    }
                }
            }
        }
        else {
            if (criteria.getOp().includes("greater ")) {
                for (const row of dataset) {
                    const valFromData = Number(row[keyIndex]);
                    if (valFromData > numValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("less ")) {
                for (const row of dataset) {
                    const valFromData = Number(row[keyIndex]);
                    if (valFromData < numValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("equal ")) {
                for (const row of dataset) {
                    const valFromData = Number(row[keyIndex]);
                    if (valFromData === numValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp() === "is ") {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (valFromData === strValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp() === "includes ") {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (valFromData.includes(strValue)) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("begins ")) {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (valFromData.slice(0, strValue.length) === strValue) {
                        result.push(row);
                    }
                }
            }
            else if (criteria.getOp().includes("ends ")) {
                for (const row of dataset) {
                    const valFromData = row[keyIndex];
                    if (valFromData.slice(-strValue.length) === strValue) {
                        result.push(row);
                    }
                }
            }
        }
        return result;
    }
}
exports.default = DataTransformer;
//# sourceMappingURL=DataTransformer.js.map