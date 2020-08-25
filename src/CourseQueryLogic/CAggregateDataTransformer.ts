import CAggregateParser from "../CourseQueryProcessing/CAggregateParser";
import CAggregateDataPoint from "./CAggregateDataPoint";
import {Decimal} from "decimal.js";
import AggregateDataTransformer from "../AggregateDataTransformer";
import AggregateParser from "../syntax&processing/AggregateParser";

export default class CAggregateDataTransformer extends AggregateDataTransformer {
    protected aggParser: AggregateParser;

    constructor(aggregateParser: CAggregateParser) {
        super(aggregateParser);
        this.aggParser = aggregateParser;
    }

    public async applyAggregateToGroups(groups: string[][][]): Promise<CAggregateDataPoint[]> {
        const aggregatePoints: CAggregateDataPoint[] = [];
        for (const group of groups) {
            aggregatePoints.push(this.applyAggregateToGroup(group));
        }
        return aggregatePoints;
    }

    public applyAggregateToGroup(group: string[][]): CAggregateDataPoint {
        const displayKeyIndices: number[] = this.findDisplayKeyIndices(this.aggParser.displayKeys);
        const point: CAggregateDataPoint = new CAggregateDataPoint(displayKeyIndices, group[0]);

        for (const agg of this.aggParser.aggCriteria) {
            const filterKeyIndex: number = this.findFilterKeyIndex(agg.key);
            if (agg.aggKey.trim() === "AVG") {
                let avg: number = 0;
                let sum: number = 0;
                for (const row of group) {
                    const decimal: any = new Decimal(row[filterKeyIndex]);
                    sum += Number(decimal);
                }
                avg = sum / group.length;
                point.setAVG(Number(avg.toFixed(2)));
            }
            if (agg.aggKey.trim() === "MIN") {
                let currentMin: number = 1000;
                for (const row of group) {
                    if (Number(row[filterKeyIndex]) < currentMin) {
                        currentMin = Number(row[filterKeyIndex]);
                    }
                }
                point.setMIN(currentMin);
            }
            if (agg.aggKey.trim() === "MAX") {
                let currentMax: number = -1;
                for (const row of group) {
                    if (Number(row[filterKeyIndex]) > currentMax) {
                        currentMax = Number(row[filterKeyIndex]);
                    }
                }
                point.setMAX(currentMax);
            }
            if (agg.aggKey.trim() === "SUM") {
                let sum: number = 0;
                for (const row of group) {
                    sum += Number(row[filterKeyIndex]);
                }
                point.setSUM(Number(sum.toFixed(2)));
            }
            if (agg.aggKey.trim() === "COUNT") {
                let count: number = 0;
                for (const row of group) {
                    count += 1;
                }
                point.setCOUNT(count);
            }
        }
        return point;
    }

    // TODO: will probably have to refactor this to resemble findDisplayKeyIndices
    public findFilterKeyIndex(key: string): number {
        const trimmedKey: string = key.trim();
        switch (trimmedKey) {
            case "Title": {
                return 0;
            }
            case "UUID": {
                return 1;
            }
            case "Instructor": {
                return 2;
            }
            case "Audit": {
                return 3;
            }
            case "ID": {
                return 5;
            }
            case "Pass": {
                return 6;
            }
            case "Fail": {
                return 7;
            }
            case "Average": {
                return 8;
            }
            case "Department": {
                return 9;
            }
        }
    }

    // Creates a list of indices that correspond to the index of a given data point in a File[] object
    public findDisplayKeyIndices(keys: string[]): number[] {
        const indices: number[] = [];
        for (const key of keys) {
            const trimmedKey: string = key.trim();
            if (trimmedKey === "Title") {
                indices.push(0);
            } else if (trimmedKey === "UUID") {
                indices.push(1);
            } else if (trimmedKey === "Instructor") {
                indices.push(2);
            } else if (trimmedKey === "Audit") {
                indices.push(3);
            } else if (trimmedKey === "ID") {
                indices.push(5);
            } else if (trimmedKey === "Pass") {
                indices.push(6);
            } else if (trimmedKey === "Fail") {
                indices.push(7);
            } else if (trimmedKey === "Average") {
                indices.push(8);
            } else if (trimmedKey === "Department") {
                indices.push(9);
            }
        }
        return indices;
    }

    protected sortFilteredData(key: string, lst: string[][]): string[][] {
        const trimmedKey: string = key.trim();
        if (trimmedKey === "Average") {
            lst.sort((a, b) => {
                return Number(a[8]) - Number(b[8]);
            });
        } else if (trimmedKey === "Pass") {
            lst.sort((a, b) => {
                return Number(a[6]) - Number(b[6]);
            });
        } else if (trimmedKey === "Fail") {
            lst.sort((a, b) => {
                return Number(a[7]) - Number(b[7]);
            });
        } else if (trimmedKey === "Audit") {
            lst.sort((a, b) => {
                return Number(a[3]) - Number(b[3]);
            });
        } else if (trimmedKey === "Instructor") {
            lst.sort((a, b) => {
                const nameA = a[2].toUpperCase();
                const nameB = b[2].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "Department") {
            lst.sort((a, b) => {
                const nameA = a[9].toUpperCase();
                const nameB = b[9].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "ID") {
            lst.sort((a, b) => {
                const nameA = a[5].toUpperCase();
                const nameB = b[5].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "UUID") {
            lst.sort((a, b) => {
                const nameA = a[1].toUpperCase();
                const nameB = b[1].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "Title") {
            lst.sort((a, b) => {
                const nameA = a[0].toUpperCase();
                const nameB = b[0].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        }
        return lst;
    }
}
