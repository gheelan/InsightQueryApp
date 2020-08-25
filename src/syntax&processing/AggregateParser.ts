import Criteria from "./Criteria";
import Scanner from "./Scanner";
import {IAggregateParser} from "../IAggregateParser";

export default abstract class AggregateParser implements IAggregateParser {
    public datasetKey: string = "";
    public filterCriteria: Criteria[] = [];
    public displayKeys: string[] = [];
    public orderKeys: any[] = [];
    public sortingOrder: string = "";
    public aggGroupKeys: string[] = [];
    public aggCriteria: any[] = [];
    public aggKeys: string[] = ["MAX", "MIN", "AVG", "SUM", "COUNT"];
    protected mOps: string[] = ["is greater than ", "is less than ", "is equal to ",
        "is not greater than ", "is not less than ", "is not equal to "];
    protected sOps: string[] = ["is ", "is not ", "includes ", "does not include ", "begins with ",
        "does not begin with ", "ends with ", "does not end with "];
    protected keywords: string[] = ["in", "dataset", "find", "all", "show", "and", "or",
        "sort", "by", "entries", "grouped", "where", "is", "the", "of", "whose"];

    public parseAggregation(scanner: Scanner) {
        let trimmedKey: string;
        const aggScanner: Scanner = scanner;
        let aggObject: any = {title: null, aggKey: null, key: null};
        while (aggScanner.hasTokens()) {
            aggScanner.advance();
            if (aggScanner.hasTokens() && this.displayKeys.includes(aggScanner.peek().trim()) &&
                !this.isValidKey(aggScanner.peek())) {
                trimmedKey = aggScanner.peek().trim();
                aggObject.title = trimmedKey;
            }
            if (aggScanner.hasTokens() && this.aggKeys.includes(aggScanner.peek().trim())) {
                trimmedKey = aggScanner.peek().trim();
                aggObject.aggKey = trimmedKey;
                aggScanner.advance();
                trimmedKey = aggScanner.advance().trim();
                aggObject.key = trimmedKey;
                this.aggCriteria.push(aggObject);
                aggObject = {title: null, aggKey: null, key: null};
            }
        }
    }

    public isValidAggInput(aggInput: string): boolean {
        const trimmedInput: string = aggInput.trim();
        return !this.isValidKey(trimmedInput) &&
            !this.keywords.includes(trimmedInput) &&
            !this.sOps.includes(trimmedInput) &&
            !this.mOps.includes(trimmedInput) &&
            !trimmedInput.includes("_") &&
            !trimmedInput.includes(",");
    }

    protected abstract isValidKey(key: string): boolean;
}
