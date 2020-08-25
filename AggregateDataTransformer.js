"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataTransformer_1 = require("./DataTransformer");
class AggregateDataTransformer extends DataTransformer_1.default {
    constructor(parser) {
        super(parser);
    }
    makeFinalGroups(group) {
        let finalGroupings;
        let sortedRows;
        sortedRows = this.sortFilteredData(this.aggParser.aggGroupKeys[0], group);
        let groupings = this.formGroup(sortedRows, this.aggParser.aggGroupKeys[0]);
        for (let i = 1; i < this.aggParser.aggGroupKeys.length; i++) {
            const sortedGroups = this.sortGroups(this.aggParser.aggGroupKeys[i], groupings);
            groupings = this.formGroups(sortedGroups, this.aggParser.aggGroupKeys[i]);
        }
        finalGroupings = groupings;
        return finalGroupings;
    }
    formGroups(groups, groupKey) {
        let groupings = [];
        let newGroups;
        for (const group of groups) {
            const filtered = this.sortFilteredData(groupKey, group);
            newGroups = this.formGroup(filtered, groupKey);
            groupings = groupings.concat(newGroups);
        }
        return groupings;
    }
    formGroup(sortedData, groupKey) {
        const groupings = [];
        const keyIndex = this.findFilterKeyIndex(groupKey);
        let group = [];
        if (sortedData.length === 1) {
            groupings.push(sortedData);
            return groupings;
        }
        else {
            for (let i = 0; i < sortedData.length; i++) {
                if (sortedData[i][keyIndex] === sortedData[i + 1][keyIndex] &&
                    i === sortedData.length - 2) {
                    group.push(sortedData[i]);
                    group.push(sortedData[i + 1]);
                    groupings.push(group);
                    group = [];
                    break;
                }
                else if (sortedData[i][keyIndex] !== sortedData[i + 1][keyIndex] &&
                    i === sortedData.length - 2) {
                    group.push(sortedData[i]);
                    groupings.push(group);
                    group = [];
                    group.push(sortedData[i + 1]);
                    groupings.push(group);
                    break;
                }
                else if (sortedData[i][keyIndex] === sortedData[i + 1][keyIndex]) {
                    group.push(sortedData[i]);
                }
                else if (sortedData[i][keyIndex] !== sortedData[i + 1][keyIndex]) {
                    group.push(sortedData[i]);
                    groupings.push(group);
                    group = [];
                }
            }
            return groupings;
        }
    }
    sortGroups(key, groups) {
        const sortedGroups = [];
        for (const group of groups) {
            sortedGroups.push(this.sortFilteredData(key, group));
        }
        return sortedGroups;
    }
}
exports.default = AggregateDataTransformer;
//# sourceMappingURL=AggregateDataTransformer.js.map