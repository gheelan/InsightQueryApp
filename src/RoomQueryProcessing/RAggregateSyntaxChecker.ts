import Scanner from "../syntax&processing/Scanner";
import Criteria from "../syntax&processing/Criteria";
import {AggregateSyntaxChecker} from "../syntax&processing/AggregateSyntaxChecker";

export default class RAggregateSyntaxChecker extends AggregateSyntaxChecker {
    public dataset: string;
    public filter: string;
    public display: string;
    public order: string;
    public mainScanner: Scanner;

    constructor(query: string) {
        super(query);
    }

    // Returns true if a query is made up of only valid keywords in a valid order
    public checkQuery(): boolean {
        return (this.isValidDataset() && this.isValidFilter()
            && this.isValidDisplay() && this.isValidOrder());
    }

    // Checks that DATASET contains valid keywords
    public isValidDataset(): boolean {
        const datasetScanner: Scanner = new Scanner(this.dataset);
        if (datasetScanner.peek() === "In " &&
            datasetScanner.advance() === "rooms " &&
            datasetScanner.advance() === "dataset " &&
            typeof datasetScanner.advance() === "string" &&
            datasetScanner.advance() === "grouped " &&
            datasetScanner.advance() === "by ") {
            while (datasetScanner.hasTokens()) {
                datasetScanner.advance();
                if (this.isValidKey(datasetScanner.peek())) {
                    datasetScanner.advance();
                    if (!datasetScanner.hasTokens()) {
                        return true;
                    }
                } else if (this.isValidKey(datasetScanner.peek() + datasetScanner.getNext())) {
                    datasetScanner.advance();
                    if (datasetScanner.advance() === null) {
                        return true;
                    }
                } else if (this.isValidKey(datasetScanner.peek()) ||
                    this.isValidKey(datasetScanner.peek() + datasetScanner.getNext())) {
                    datasetScanner.advance(); // peek returns comma
                    if (datasetScanner.getNext() === null) {
                        return true;
                    } else if (datasetScanner.advance() === "," && datasetScanner.getNext() === null) {
                        return true;
                    }
                } else if (this.isValidKey(datasetScanner.peek())) {
                    if (datasetScanner.advance() === "and " &&
                        this.isValidKey(datasetScanner.peek()) ||
                        this.isValidKey(datasetScanner.peek() + datasetScanner.getNext())) {
                        return true;
                    }
                } else if (this.isValidKey(datasetScanner.peek() + datasetScanner.getNext())) {
                    datasetScanner.advance();
                    if (datasetScanner.advance() === "and ") {
                        datasetScanner.advance();
                        if (this.isValidKey(datasetScanner.peek() + datasetScanner.getNext())) {
                            return true;
                        }
                    }
                } else {
                    while (this.isValidKey(datasetScanner.peek()) ||
                    this.isValidKey(datasetScanner.peek() + datasetScanner.getNext()) ||
                    datasetScanner.peek() === ",") {
                        datasetScanner.advance();
                    }
                    if (datasetScanner.peek() === "and ") {
                        datasetScanner.advance();
                        if (this.isValidKey(datasetScanner.peek()) ||
                            this.isValidKey(datasetScanner.peek() + datasetScanner.getNext())) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        }
        return false;
    }

    public isValidFilter(): boolean {
        const lst: Criteria[] = this.buildCriteria();
        let result: boolean = false;
        for (const criteria of lst) {
            // tslint:disable-next-line:max-line-length
            if (criteria.getKey() && this.roomMKeys.includes(criteria.getKey().trim()) && this.mOps.includes(criteria.getOp())
                && criteria.getVal() && !isNaN(Number(criteria.getVal()))) {
                result = true;
                // tslint:disable-next-line:max-line-length
            } else if (criteria.getKey() && this.roomSKeys.includes(criteria.getKey().trim()) && this.sOps.includes(criteria.getOp())
                && typeof criteria.getVal() === "string") {
                result = true;
            } else {
                result = false;
                break;
            }
        }
        return result;
    }

// Checks DISPLAY grammar against EBNF
    public isValidDisplay(): boolean {
        let displayScanner: Scanner;
        // First if/else block accounts for situations where Order has been omitted from a query and Display is the
        // end of the query, thus ending in a period
        if (this.display.endsWith(".")) {
            const trimPeriod: string = this.display.slice(0, -1);
            displayScanner = new Scanner(trimPeriod);
        } else {
            displayScanner = new Scanner(this.display);
        }
        if (displayScanner.peek() === "show ") {
            displayScanner.advance();
            while (displayScanner.hasTokens()) {
                // logic for a display of 1 single word M/S key
                if (this.isValidKey(displayScanner.peek()) &&
                    displayScanner.getNext() === null) {
                    return true;
                }
                // logic for a display of 1 aggKey
                if (this.isValidAggInput(displayScanner.peek()) &&
                    displayScanner.getNext() === ",") {
                    displayScanner.advance();
                    if (displayScanner.getNext() === "where ") {
                        displayScanner.advance();
                        displayScanner.advance();
                        return this.isValidAggregation(displayScanner);
                    }
                }
                // logic for a display with 1 to 2 keys that starts with a 2-word key
                if (this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                    displayScanner.advance();
                    if (displayScanner.getNext() === null) {
                        return true;
                    } else {
                        displayScanner.advance();
                        if (displayScanner.peek() === "and " &&
                            this.isValidKey(displayScanner.getNext()) ||
                            this.isValidAggInput(displayScanner.getNext())) {
                            displayScanner.advance();
                            if (displayScanner.getNext() === ",") {
                                displayScanner.advance();
                                if (displayScanner.getNext() === "where ") {
                                    displayScanner.advance();
                                    displayScanner.advance();
                                    return this.isValidAggregation(displayScanner);
                                } else if (displayScanner.getNext() === null && !this.display.includes("where")) {
                                    return true;
                                }
                            } else if (displayScanner.peek() === "and ") {
                                displayScanner.advance();
                                if (this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                                    displayScanner.advance();
                                    if (displayScanner.getNext() === ",") {
                                        displayScanner.advance();
                                        displayScanner.advance();
                                        return this.isValidAggregation(displayScanner);
                                    } else if (displayScanner.getNext() === null && !this.display.includes("where")) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
                // logic for a display with two 1-word keys
                if ((this.isValidKey(displayScanner.peek()) ||
                    this.isValidAggInput(displayScanner.peek())) &&
                    displayScanner.getNext() === "and ") {
                    displayScanner.advance();
                    displayScanner.advance();
                    if (this.isValidKey(displayScanner.peek()) ||
                        this.isValidAggInput(displayScanner.peek()) &&
                        displayScanner.getNext() === ",") {
                        displayScanner.advance();
                        if (displayScanner.getNext() === "where ") {
                            displayScanner.advance();
                            displayScanner.advance();
                            return this.isValidAggregation(displayScanner);
                        }
                    } else if (displayScanner.getNext() === null && !this.display.includes("where")) {
                        return true;
                    }
                } else if (this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                    displayScanner.advance();
                    displayScanner.advance();
                    if (displayScanner.peek() === "and " &&
                        this.isValidKey(displayScanner.getNext()) ||
                        this.isValidAggInput(displayScanner.getNext())) {
                        displayScanner.advance();
                        if (displayScanner.getNext() === ",") {
                            displayScanner.advance();
                            if (displayScanner.getNext() === "where ") {
                                displayScanner.advance();
                                displayScanner.advance();
                                return this.isValidAggregation(displayScanner);
                            }
                        }
                    }
                } else {
                    while ((this.isValidKey(displayScanner.peek()) ||
                        this.isValidAggInput(displayScanner.peek()) ||
                        this.isValidKey(displayScanner.peek() + displayScanner.getNext()) ||
                        displayScanner.peek() === ",") &&
                        displayScanner.peek() !== "and ") {
                        if (displayScanner.peek() === "," && displayScanner.getNext() === "and ") {
                            return false;
                        } else {
                            displayScanner.advance();
                        }
                    }
                    if (displayScanner.peek() === "and " &&
                        this.isValidKey(displayScanner.getNext())) {
                        displayScanner.advance();
                        if (displayScanner.getNext() === null && !this.display.includes("where ")) {
                            return true;
                        }
                    } else if (displayScanner.peek() === "and " &&
                        this.isValidAggInput(displayScanner.getNext()) ||
                        this.isValidKey(displayScanner.getNext())) {
                        displayScanner.advance();
                        displayScanner.advance();
                        if (displayScanner.peek() === "," && displayScanner.getNext() === "where ") {
                            displayScanner.advance();
                            displayScanner.advance();
                            return this.isValidAggregation(displayScanner);
                        }
                    } else {
                        return false;
                    }
                }
                return false;
            }
        }
        return false;
    }

// Checks ORDER grammar against EBNF
    public isValidOrder(): boolean {
        const orderScanner: Scanner = new Scanner(this.order);
        let prefix: string = "";
        if (this.order === "") {
            return true;
        } else {
            while (orderScanner.hasTokens() && (prefix !== this.orderPrefixAsc && prefix !== this.orderPrefixDesc)) {
                prefix += orderScanner.peek();
                orderScanner.advance();
            }
            if (prefix === this.orderPrefixAsc || prefix === this.orderPrefixDesc) {
                while (orderScanner.hasTokens()) {
                    // Checks if there is a single word M/S key or a custom agg key and it's in display section
                    if ((this.isValidKey(orderScanner.peek()) && this.display.includes(orderScanner.peek())) ||
                        (this.isValidAggInput(orderScanner.peek()) && this.display.includes(orderScanner.peek())) &&
                        orderScanner.getNext() === ".") {
                        return true;
                        // Checks if there is a single two word M/S key and it's in display, in which case there can't
                        // be an agg key
                    } else if (this.isValidKey(orderScanner.peek() + orderScanner.getNext()) &&
                        this.display.includes(orderScanner.peek() + orderScanner.getNext())
                        && orderScanner.getNext() === ".") {
                        return true;
                    } else if ((this.isValidKey(orderScanner.peek()) && this.display.includes(orderScanner.peek())) ||
                        (this.isValidAggInput(orderScanner.peek())) && this.display.includes(orderScanner.peek()) &&
                        orderScanner.getNext() === "and ") {
                        orderScanner.advance();
                        orderScanner.advance();
                        if (this.isValidKey(orderScanner.peek()) ||
                            this.isValidKey(orderScanner.peek() + orderScanner.getNext()) ||
                            this.isValidAggInput(orderScanner.peek()) &&
                            this.display.includes(orderScanner.peek()) ||
                            this.display.includes(orderScanner.peek() + orderScanner.getNext())) {
                            return true;
                        }
                    } else if (this.isValidKey(orderScanner.peek() + orderScanner.getNext()) &&
                        this.display.includes(orderScanner.peek() + orderScanner.getNext())) {
                        orderScanner.advance();
                        if (orderScanner.getNext() === "and ") {
                            orderScanner.advance();
                            if (this.isValidKey(orderScanner.peek()) ||
                                this.isValidKey(orderScanner.peek() + orderScanner.getNext()) ||
                                this.isValidAggInput(orderScanner.peek()) &&
                                this.display.includes(orderScanner.peek()) ||
                                this.display.includes(orderScanner.peek() + orderScanner.getNext())) {
                                return true;
                            }
                        }
                        // logic for an order of arbitrary length
                    } else {
                        while (this.isValidKey(orderScanner.peek()) ||
                        this.isValidKey(orderScanner.peek() + orderScanner.getNext()) ||
                        this.isValidAggInput(orderScanner.peek()) &&
                        this.display.includes(orderScanner.peek()) ||
                        this.display.includes(orderScanner.peek() + orderScanner.getNext()) ||
                        orderScanner.peek() === ",") {
                            if (orderScanner.peek() === "and ") {
                                break;
                            } else {
                                orderScanner.advance();
                            }
                            orderScanner.advance();
                            if (this.isValidKey(orderScanner.peek()) ||
                                this.isValidKey(orderScanner.peek() + orderScanner.getNext()) ||
                                this.isValidAggInput(orderScanner.peek())  &&
                                this.display.includes(orderScanner.peek()) ||
                                this.display.includes(orderScanner.peek() + orderScanner.getNext())) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
            }
            return false;
        }
    }

    public buildCriteria(): Criteria[] {
        const filterScanner: Scanner = new Scanner(this.filter);
        const allCriteria: Criteria[] = [];
        if (this.isValidFilterPrefix()) {
            while (filterScanner.hasTokens()) {
                const criteria: Criteria = new Criteria();
                // duplicate hasTokens calls in the event a valid key is never found
                while (!this.isValidKey(filterScanner.peek()) && filterScanner.hasTokens()) {
                    filterScanner.advance();
                }
                if (filterScanner.peek() !== null) {
                    criteria.setKey(filterScanner.peek());
                }
                let s: string = "";
                filterScanner.advance();
                if (criteria.getKey()) {
                    if (this.roomMKeys.includes(criteria.getKey().trim())) {
                        while (!this.mOps.includes(s) && filterScanner.hasTokens()) {
                            s += filterScanner.peek();
                            filterScanner.advance();
                        }
                    }
                    if (this.roomSKeys.includes(criteria.getKey().trim())) {
                        while (!this.sOps.includes(s) && filterScanner.hasTokens()) {
                            s += filterScanner.peek();
                            filterScanner.advance();
                        }
                    }
                }
                if (s !== "" && s === "is " && filterScanner.peek() === "not ") {
                    criteria.setOp(s + filterScanner.peek());
                    filterScanner.advance();
                } else if (s !== "" && s === "is ") {
                    criteria.setOp(s);
                } else if (s !== "") {
                    criteria.setOp(s);
                }
                if (filterScanner.peek() !== null) {
                    if (filterScanner.peek().startsWith("\"") && filterScanner.peek().endsWith("\"")) {
                        criteria.setVal(filterScanner.peek());
                    } else if (!isNaN(Number(filterScanner.peek()))) {
                        criteria.setVal(filterScanner.peek());
                    } else {
                        criteria.setVal(null);
                    }
                }
                allCriteria.push(criteria);
                filterScanner.advance();
            }
        }
        return allCriteria;
    }

    public isValidKey(key: string): boolean {
        let trimmedKey: string;
        try {
            trimmedKey = key.trim();
        } catch (e) {
            return false;
        }
        return this.roomSKeys.includes(trimmedKey) || this.roomMKeys.includes(trimmedKey);
    }
}
