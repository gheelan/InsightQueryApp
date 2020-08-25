import AggregateParser from "./syntax&processing/AggregateParser";
import DataTransformer from "./DataTransformer";
import {IParser} from "./syntax&processing/IParser";

export default abstract class AggregateDataTransformer extends DataTransformer {
    protected aggParser: AggregateParser;

    protected constructor(parser: AggregateParser) {
        super(parser);
    }

    public makeFinalGroups(group: string[][]): string[][][] {
        let finalGroupings: string[][][];
        let sortedRows: string[][];
        sortedRows = this.sortFilteredData(this.aggParser.aggGroupKeys[0], group);
        let groupings = this.formGroup(sortedRows, this.aggParser.aggGroupKeys[0]);
        for (let i = 1; i < this.aggParser.aggGroupKeys.length; i++) {
            const sortedGroups = this.sortGroups(this.aggParser.aggGroupKeys[i], groupings);
            groupings = this.formGroups(sortedGroups, this.aggParser.aggGroupKeys[i]);
        }
        finalGroupings = groupings;
        return finalGroupings;
    }

    public formGroups(groups: string[][][], groupKey: string): string[][][] {
        let groupings: string[][][] = [];
        let newGroups: string[][][];
        for (const group of groups) {
            const filtered = this.sortFilteredData(groupKey, group);
            newGroups = this.formGroup(filtered, groupKey);
            groupings = groupings.concat(newGroups);
        }
        return groupings;
    }

    protected abstract sortFilteredData(key: string, lst: string[][]): string[][];

    // Method only called when there are multiple group keys specified in a query
    protected formGroup(sortedData: string[][], groupKey: string): string[][][] {
        const groupings: string[][][] = [];
        const keyIndex: number = this.findFilterKeyIndex(groupKey);
        let group: string[][] = [];
        if (sortedData.length === 1) {
            groupings.push(sortedData);
            return groupings;
        } else {
            for (let i = 0; i < sortedData.length; i++) {
                if (sortedData[i][keyIndex] === sortedData[i + 1][keyIndex] &&
                    i === sortedData.length - 2) {
                    group.push(sortedData[i]);
                    group.push(sortedData[i + 1]);
                    groupings.push(group);
                    group = [];
                    break;
                } else if (sortedData[i][keyIndex] !== sortedData[i + 1][keyIndex] &&
                    i === sortedData.length - 2) {
                    group.push(sortedData[i]);
                    groupings.push(group);
                    group = [];
                    group.push(sortedData[i + 1]);
                    groupings.push(group);
                    break;
                } else if (sortedData[i][keyIndex] === sortedData[i + 1][keyIndex]) {
                    group.push(sortedData[i]);
                } else if (sortedData[i][keyIndex] !== sortedData[i + 1][keyIndex]) {
                    group.push(sortedData[i]);
                    groupings.push(group);
                    group = [];
                }
            }
            return groupings;
        }
    }

    protected sortGroups(key: string, groups: string[][][]) {
        const sortedGroups: string[][][] = [];
        for (const group of groups) {
            sortedGroups.push(this.sortFilteredData(key, group));
        }
        return sortedGroups;
    }
}
