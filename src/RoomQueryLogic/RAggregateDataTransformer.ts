import {Decimal} from "decimal.js";
import RAggregateParser from "../RoomQueryProcessing/RAggregateParser";
import RAggregateDataPoint from "./RAggregateDataPoint";
import AggregateDataTransformer from "../AggregateDataTransformer";
import AggregateParser from "../syntax&processing/AggregateParser";

export default class RAggregateDataTransformer extends AggregateDataTransformer {
    protected aggParser: AggregateParser;

    constructor(aggregateParser: RAggregateParser) {
        super(aggregateParser);
        this.aggParser = aggregateParser;
    }

    public async applyAggregateToGroups(groups: string[][][]): Promise<RAggregateDataPoint[]> {
        const aggregatePoints: RAggregateDataPoint[] = [];
        for (const group of groups) {
            aggregatePoints.push(this.applyAggregateToGroup(group));
        }
        return aggregatePoints;
    }

    public applyAggregateToGroup(group: string[][]): RAggregateDataPoint {
        const displayKeyIndices: number[] = this.findDisplayKeyIndices(this.aggParser.displayKeys);
        const point: RAggregateDataPoint = new RAggregateDataPoint(displayKeyIndices, group[0]);

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
            case "Short Name": {
                return 0;
            }
            case "Address": {
                return 1;
            }
            case "Full Name": {
                return 2;
            }
            case "Number": {
                return 3;
            }
            case "Link": {
                return 4;
            }
            case "Seats": {
                return 5;
            }
            case "Furniture": {
                return 6;
            }
            case "Type": {
                return 7;
            }
            case "Name": {
                return 8;
            }
            case "Latitude": {
                return 9;
            }
            case "Longitude": {
                return 10;
            }
        }
    }

    // Creates a list of indices that correspond to the index of a given data point in a File[] object
    public findDisplayKeyIndices(keys: string[]): number[] {
        const indices: number[] = [];
        for (const key of keys) {
            const trimmedKey = key.trim();
            if (trimmedKey === "Short Name") {
                indices.push(0);
            } else if (trimmedKey === "Address") {
                indices.push(1);
            } else if (trimmedKey === "Full Name") {
                indices.push(2);
            } else if (trimmedKey === "Number") {
                indices.push(3);
            } else if (trimmedKey === "Link") {
                indices.push(4);
            } else if (trimmedKey === "Seats") {
                indices.push(5);
            } else if (trimmedKey === "Furniture") {
                indices.push(6);
            } else if (trimmedKey === "Type") {
                indices.push(7);
            } else if (trimmedKey === "Name") {
                indices.push(8);
            } else if (trimmedKey === "Latitude") {
                indices.push(9);
            } else if (trimmedKey === "Longitude") {
                indices.push(10);
            }
        }
        return indices;
    }

    // Indices to sort on correspond to the index of the value in the RoomDataPoint object being passed in lst
    protected sortFilteredData(key: string, lst: string[][]): string[][] {
        const trimmedKey: string = key.trim();
        if (trimmedKey === "Latitude") {
            lst.sort((a, b) => {
                return Number(a[10]) - Number(b[10]);
            });
        } else if (trimmedKey === "Longitude") {
            lst.sort((a, b) => {
                return Number(a[9]) - Number(b[9]);
            });
        } else if (trimmedKey === "Seats") {
            lst.sort((a, b) => {
                return Number(a[5]) - Number(b[5]);
            });
        } else if (trimmedKey === "Full Name") {
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
        } else if (trimmedKey === "Short Name") {
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
        } else if (trimmedKey === "Number") {
            lst.sort((a, b) => {
                const nameA = a[3].toUpperCase();
                const nameB = b[3].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "Name") {
            lst.sort((a, b) => {
                const nameA = a[8].toUpperCase();
                const nameB = b[8].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "Address") {
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
        } else if (trimmedKey === "Type") {
            lst.sort((a, b) => {
                const nameA = a[7].toUpperCase();
                const nameB = b[7].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "Furniture") {
            lst.sort((a, b) => {
                const nameA = a[6].toUpperCase();
                const nameB = b[6].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        } else if (trimmedKey === "Link") {
            lst.sort((a, b) => {
                const nameA = a[4].toUpperCase();
                const nameB = b[4].toUpperCase();
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
