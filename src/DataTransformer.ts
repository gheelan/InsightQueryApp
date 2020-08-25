import Criteria from "./syntax&processing/Criteria";
import {IParser} from "./syntax&processing/IParser";
import {IAggregateParser} from "./IAggregateParser";

export default abstract class DataTransformer {
    public parser: IParser | IAggregateParser;

    protected constructor(parser: IParser | IAggregateParser) {
        this.parser = parser;
    }

    public transformAllData(precursor: string[][], criteria: Criteria[]): Promise<string[][]> {
        return new Promise<string[][]>((resolve) => {
            if (!criteria || criteria.length === 0) {
                resolve(precursor);
            } else {
                let filtered = this.transformData(precursor, criteria[0]);
                criteria.splice(0, 1);
                for (const crit of criteria) {
                    if (crit.getLogicKey() === "and ") {
                        filtered = this.transformData(filtered, crit);
                    } else if (crit.getLogicKey() === "or ") {
                        filtered = filtered.concat(this.transformData(precursor, crit));
                    }
                }
                resolve(filtered);
            }
        });
    }

    public transformData(dataset: string[][], criteria: Criteria): string[][] {
        const key = criteria.getKey();
        const keyIndex: number = this.findFilterKeyIndex(key);
        const numValue: number = Number(criteria.getVal());
        const strValue: string = criteria.getVal().slice(1, -1);
        const result: string[][] = [];

        if (criteria.getOp().includes("not ")) {
            if (criteria.getOp().includes("greater ")) {
                for (const row of dataset) {
                    const valFromData: number = Number(row[keyIndex]);
                    if (valFromData <= numValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("less ")) {
                for (const row of dataset) {
                    const valFromData: number = Number(row[keyIndex]);
                    if (valFromData >= numValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("equal ")) {
                for (const row of dataset) {
                    const valFromData: number = Number(row[keyIndex]);
                    if (valFromData !== numValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("is ")) {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (valFromData !== strValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("include ")) {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (!valFromData.includes(strValue)) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("begin ")) {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (valFromData.slice(0, strValue.length) !== strValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("end ")) {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (valFromData.slice(-strValue.length) !== strValue) {
                        result.push(row);
                    }
                }
            }
        } else {
            if (criteria.getOp().includes("greater ")) {
                for (const row of dataset) {
                    const valFromData: number = Number(row[keyIndex]);
                    if (valFromData > numValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("less ")) {
                for (const row of dataset) {
                    const valFromData: number = Number(row[keyIndex]);
                    if (valFromData < numValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("equal ")) {
                for (const row of dataset) {
                    const valFromData: number = Number(row[keyIndex]);
                    if (valFromData === numValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp() === "is ") {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (valFromData === strValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp() === "includes ") {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (valFromData.includes(strValue)) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("begins ")) {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (valFromData.slice(0, strValue.length) === strValue) {
                        result.push(row);
                    }
                }
            } else if (criteria.getOp().includes("ends ")) {
                for (const row of dataset) {
                    const valFromData: string = row[keyIndex];
                    if (valFromData.slice(-strValue.length) === strValue) {
                        result.push(row);
                    }
                }
            }
        }
        return result;
    }

    protected abstract findFilterKeyIndex(criteria: string): number;
    protected abstract findDisplayKeyIndices(keys: string[]): number[];
}
