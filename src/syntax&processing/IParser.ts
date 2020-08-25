import Criteria from "./Criteria";

export interface IParser {
     datasetKey: string;
     filterCriteria: Criteria[];
     displayKeys: string[];
     orderKeys: any[];
     sortingOrder: string;

    parseQuery(): any;
    parseDataset(): any;
    parseFilter(): any;
    parseDisplay(): any;
    parseOrder(): any;
}
