import Criteria from "../syntax&processing/Criteria";
import Scanner from "../syntax&processing/Scanner";
import {AggregateSyntaxChecker} from "../syntax&processing/AggregateSyntaxChecker";
import RAggregateSyntaxChecker from "./RAggregateSyntaxChecker";
import AggregateParser from "../syntax&processing/AggregateParser";

export default class RAggregateParser extends AggregateParser {
    public syntaxChecker: AggregateSyntaxChecker;
    public roomMKeys: string[] = ["Latitude", "Longitude", "Seats"];
    public roomSKeys: string[] = ["Full Name", "Short Name", "Number", "Name", "Address", "Type", "Furniture", "Link"];

    constructor(query: string) {
        super();
        this.syntaxChecker = new RAggregateSyntaxChecker(query);
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
            datasetScanner.advance() === "rooms " &&
            datasetScanner.advance() === "dataset ") {
            this.datasetKey = datasetScanner.advance();
        }
        while (datasetScanner.hasTokens()) {
            datasetScanner.advance();
            if (this.isValidKey(datasetScanner.peek())) {
                this.aggGroupKeys.push(datasetScanner.peek());
            } else if (this.isValidKey(datasetScanner.peek() + datasetScanner.getNext())) {
                this.aggGroupKeys.push(datasetScanner.peek() + datasetScanner.getNext());
                datasetScanner.advance();
            }
        }
    }

    public parseFilter() {
        const filterScanner: Scanner = new Scanner(this.syntaxChecker.filter);
        const allCriteria: Criteria[] = [];
        while (filterScanner.hasTokens()) {
            const criteria: Criteria = new Criteria();
            // duplicate hasTokens calls in the event a valid key is never found
            while (filterScanner.hasTokens() && !this.isValidKey(filterScanner.peek()) &&
            !this.isValidKey(filterScanner.peek() + filterScanner.getNext())) {
                if (filterScanner.peek() === "and " || filterScanner.peek() === "or ") {
                    criteria.setLogicKey(filterScanner.peek());
                }
                filterScanner.advance();
            }
            if (this.isValidKey(filterScanner.peek())) {
                criteria.setKey(filterScanner.peek());
            } else if (this.isValidKey(filterScanner.peek() + filterScanner.getNext())) {
                criteria.setKey(filterScanner.peek() + filterScanner.getNext());
                filterScanner.advance();
            }
            let s: string = "";
            filterScanner.advance();
            if (this.roomMKeys.includes(criteria.getKey().trim())) {
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
        let trimmedString: string;
        while (displayScanner.hasTokens()) {
            if (displayScanner.advance() === null) {
                break;
            }
            if (this.isValidKey(displayScanner.peek())) {
                trimmedString = (displayScanner.peek().trim());
                this.displayKeys.push(trimmedString);
            } else if (this.isValidKey((displayScanner.peek() + displayScanner.getNext()))) {
                trimmedString = displayScanner.peek() + displayScanner.getNext().trim();
                this.displayKeys.push(trimmedString);
                displayScanner.advance();
            } else if (this.isValidAggInput(displayScanner.peek())) {
                trimmedString = displayScanner.peek().trim();
                this.displayKeys.push(trimmedString);
            } else if (displayScanner.peek() === "and ") {
                displayScanner.advance();
                if (this.isValidKey(displayScanner.peek())) {
                    trimmedString = displayScanner.peek().trim();
                    this.displayKeys.push(trimmedString);
                } else if (this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                    trimmedString = displayScanner.peek() + displayScanner.getNext();
                    this.displayKeys.push(trimmedString);
                } else {
                    trimmedString = displayScanner.peek().trim();
                    this.displayKeys.push(trimmedString);
                }
            } else if (displayScanner.peek() === "where ") {
                this.parseAggregation(displayScanner);
            }
        }
    }

    public parseOrder() {
        const orderScanner: Scanner = new Scanner(this.syntaxChecker.order);
        let trimmedString: string;
        while (orderScanner.hasTokens()) {
            if (orderScanner.advance() === null) {
                break;
            }
            if (orderScanner.peek() === "ascending " || orderScanner.peek() === "descending ") {
                this.sortingOrder = orderScanner.peek();
            }
            if (this.isValidKey(orderScanner.peek()) && this.displayKeys.includes(orderScanner.peek().trim())) {
                trimmedString = orderScanner.peek().trim();
                this.orderKeys.push({key: trimmedString, title: null});
            } else if (this.isValidKey(orderScanner.peek() + orderScanner.getNext()) &&
                this.displayKeys.includes(orderScanner.peek() + orderScanner.getNext())) {
                trimmedString = orderScanner.peek() + orderScanner.getNext().trim();
                this.orderKeys.push({key: trimmedString, title: null});
                orderScanner.advance();
            } else if (!this.isValidKey(orderScanner.peek()) && this.displayKeys.includes(orderScanner.peek().trim())) {
                for (const criteria of this.aggCriteria) {
                    trimmedString = orderScanner.peek().trim();
                    if (criteria.title === trimmedString) {
                        this.orderKeys.push({key: criteria.aggKey, title: trimmedString});
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
        return this.roomSKeys.includes(trimmedKey) || this.roomMKeys.includes(trimmedKey);
    }
}
