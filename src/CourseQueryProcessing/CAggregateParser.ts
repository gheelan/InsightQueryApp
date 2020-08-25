import Scanner from "../syntax&processing/Scanner";
import Criteria from "../syntax&processing/Criteria";
import {IParser} from "../syntax&processing/IParser";
import AggregateParser from "../syntax&processing/AggregateParser";
import CAggregateSyntaxChecker from "./CAggregateSyntaxChecker";
import {AggregateSyntaxChecker} from "../syntax&processing/AggregateSyntaxChecker";
import {IAggregateParser} from "../IAggregateParser";

export default class CAggregateParser extends AggregateParser implements IParser, IAggregateParser {
    public syntaxChecker: AggregateSyntaxChecker;
    public courseMKeys: string[] = ["Average", "Pass", "Fail", "Audit", "Year"];
    public courseSKeys: string[] = ["Department", "ID", "Instructor", "Title", "UUID"];

    constructor(query: string) {
        super();
        this.syntaxChecker = new CAggregateSyntaxChecker(query);
    }

    // ASSUMES: query is valid
    public parseQuery() {
        if (this.syntaxChecker.checkQuery()) {
            this.parseDataset();
            this.parseFilter();
            this.parseDisplay();
            this.parseOrder();
        }
    }

    public parseDataset() {
        const datasetScanner: Scanner = new Scanner(this.syntaxChecker.dataset);
        if (datasetScanner.peek() === "In " &&
            datasetScanner.advance() === "courses " &&
            datasetScanner.advance() === "dataset ") {
            this.datasetKey = datasetScanner.advance();
        }
        while (datasetScanner.hasTokens()) {
            datasetScanner.advance();
            if (this.isValidKey(datasetScanner.peek())) {
                this.aggGroupKeys.push(datasetScanner.peek());
            }
        }
    }

    public parseFilter() {
        const filterScanner: Scanner = new Scanner(this.syntaxChecker.filter);
        const allCriteria: Criteria[] = [];
        while (filterScanner.hasTokens()) {
            const criteria: Criteria = new Criteria();
            // duplicate hasTokens calls in the event a valid key is never found
            while (!this.isValidKey(filterScanner.peek()) && filterScanner.hasTokens()) {
                if (filterScanner.peek() === "and " || filterScanner.peek() === "or ") {
                    criteria.setLogicKey(filterScanner.peek());
                }
                filterScanner.advance();
            }
            criteria.setKey(filterScanner.peek());
            let s: string = "";
            filterScanner.advance();
            if (this.courseMKeys.includes(criteria.getKey().trim())) {
                while (!this.mOps.includes(s) && filterScanner.hasTokens()) {
                    s += filterScanner.peek();
                    filterScanner.advance();
                }
            } else {
                while (!this.sOps.includes(s) && filterScanner.hasTokens()) {
                    s += filterScanner.peek();
                    filterScanner.advance();
                }
            }
            if (s !== "" && s === "is " && filterScanner.peek() === "not ") {
                criteria.setOp(s + filterScanner.peek());
                filterScanner.advance();
            } else if (s !== ""  && s === "is ") {
                criteria.setOp(s);
            } else if (s !== "") {
                criteria.setOp(s);
            }
            if (filterScanner.peek() !== null) {
                criteria.setVal(filterScanner.peek());
            }
            allCriteria.push(criteria);
            filterScanner.advance();
        }
        this.filterCriteria = allCriteria;
    }

    public parseDisplay() {
        const displayScanner: Scanner = new Scanner(this.syntaxChecker.display);
        let trimmedKey: string;
        while (displayScanner.hasTokens()) {
            if (displayScanner.advance() === null) {
                break;
            }
            if (this.isValidKey(displayScanner.peek()) ||
                this.isValidAggInput(displayScanner.peek())) {
                trimmedKey = displayScanner.peek().trim();
                this.displayKeys.push(trimmedKey);
            } else if (displayScanner.peek() === "where ") {
                this.parseAggregation(displayScanner);
            }
        }
    }

    public parseOrder() {
        const orderScanner: Scanner = new Scanner(this.syntaxChecker.order);
        let trimmedKey: string;
        while (orderScanner.hasTokens()) {
            if (orderScanner.advance() === null) {
                break;
            }
            if (orderScanner.peek() === "ascending " || orderScanner.peek() === "descending ") {
                this.sortingOrder = orderScanner.peek();
            }
            if (this.isValidKey(orderScanner.peek()) && this.displayKeys.includes(orderScanner.peek().trim())) {
                this.orderKeys.push({key: orderScanner.peek(), title: null});
            } else if (this.isValidAggInput(orderScanner.peek()) &&
                this.displayKeys.includes(orderScanner.peek().trim())) {
                for (const criteria of this.aggCriteria) {
                    if (criteria.title.trim() === orderScanner.peek().trim()) {
                        trimmedKey = orderScanner.peek().trim();
                        this.orderKeys.push({key: criteria.aggKey, title: trimmedKey});
                    }
                }
            }
        }
    }

    public isValidKey(key: string): boolean  {
        let trimmedKey: string;
        try {
            trimmedKey = key.trim();
        } catch (e) {
            return false;
        }
        return this.courseSKeys.includes(trimmedKey) || this.courseMKeys.includes(trimmedKey);
    }
}
