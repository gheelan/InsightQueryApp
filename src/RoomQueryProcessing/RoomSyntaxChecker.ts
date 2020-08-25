import Scanner from "../syntax&processing/Scanner";
import Criteria from "../syntax&processing/Criteria";
import SyntaxChecker from "../syntax&processing/SyntaxChecker";

export default class RoomSyntaxChecker extends SyntaxChecker {
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
        return datasetScanner.peek() === "In " &&
            datasetScanner.advance() === "rooms " &&
            datasetScanner.advance() === "dataset " &&
            typeof datasetScanner.advance() === "string";
    }

    public isValidFilter(): boolean {
        const lst: Criteria[] = this.buildCriteria();
        let result: boolean = false;
        if (this.filter === "find all entries") {
            result = true;
        }
        for (const criteria of lst) {
            if (criteria.getKey() && this.roomMKeys.includes(criteria.getKey().trim())
                && this.mOps.includes(criteria.getOp())
                && criteria.getVal() && !isNaN(Number(criteria.getVal()))) {
                result = true;
            } else if (criteria.getKey() && this.roomSKeys.includes(criteria.getKey().trim())
                && this.sOps.includes(criteria.getOp())
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
        // If/else statement accounts for situations where Order has been omitted from a query and Display is the
        // end of the query, thus ending in a period
        if (this.display.endsWith(".")) {
            const trimPeriod: string = this.display.slice(0, -1);
            displayScanner = new Scanner(trimPeriod);
        } else {
            displayScanner = new Scanner(this.display);
        }
        if (displayScanner.peek() === "show ") {
            displayScanner.advance();
            while (displayScanner.hasTokens() &&
            this.isValidKey(displayScanner.peek()) ||
                this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                displayScanner.advance();
            }
            if (displayScanner.peek() === null) {
                return true;
            } else if (displayScanner.peek() === "and ") {
                displayScanner.advance();
                if (this.isValidKey(displayScanner.peek()) ||
                this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                    return true;
                }
            } else if (displayScanner.peek() === ",") {
                displayScanner.advance();
                while (displayScanner.hasTokens() &&
                this.isValidKey(displayScanner.peek()) ||
                this.isValidKey(displayScanner.peek() + displayScanner.getNext()) ||
                displayScanner.peek() === ",") {
                    displayScanner.advance();
                }
                if (displayScanner.peek() === "and ") {
                    displayScanner.advance();
                    if (this.isValidKey(displayScanner.peek()) ||
                        this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                        return true;
                    }
                }
            } else {
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
                orderScanner.advance();
                while (orderScanner.hasTokens() &&
                this.isValidKey(orderScanner.peek()) &&
                this.display.includes(orderScanner.peek().trim()) ||
                this.isValidKey(orderScanner.peek() + orderScanner.getNext()) &&
                this.display.includes(orderScanner.peek() + orderScanner.getNext().trim())) {
                    orderScanner.advance();
                }
                if (orderScanner.peek() === ".") {
                    return true;
                } else if (orderScanner.peek() === "and ") {
                    orderScanner.advance();
                    if (this.isValidKey(orderScanner.peek()) &&
                        this.display.includes(orderScanner.peek().trim()) ||
                        this.isValidKey(orderScanner.peek() + orderScanner.getNext()) &&
                        this.display.includes(orderScanner.peek() + orderScanner.getNext().trim())) {
                        return true;
                    }
                } else if (orderScanner.peek() === ",") {
                    orderScanner.advance();
                    while (orderScanner.hasTokens() &&
                    this.isValidKey(orderScanner.peek()) &&
                    this.display.includes(orderScanner.peek().trim()) ||
                    this.isValidKey(orderScanner.peek() + orderScanner.getNext()) &&
                    this.display.includes(orderScanner.peek() + orderScanner.getNext().trim()) ||
                    orderScanner.peek() === ",") {
                        orderScanner.advance();
                    }
                    if (orderScanner.peek() === "and ") {
                        orderScanner.advance();
                        if (this.isValidKey(orderScanner.peek()) &&
                            this.display.includes(orderScanner.peek().trim()) ||
                            this.isValidKey(orderScanner.peek() + orderScanner.getNext()) &&
                            this.display.includes(orderScanner.peek() + orderScanner.getNext().trim())) {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            }
            return false;
        }
    }

    public buildCriteria(): Criteria[] {
        const filterScanner: Scanner = new Scanner(this.filter);
        const allCriteria: Criteria[] = [];
        if (this.isValidFilterPrefix() && this.filter !== "find all entries") {
            while (filterScanner.hasTokens()) {
                const criteria: Criteria = new Criteria();
                // duplicate hasTokens calls in the event a valid key is never found
                while (filterScanner.hasTokens && !this.isValidKey(filterScanner.peek()) &&
                !this.isValidKey(filterScanner.peek() + filterScanner.getNext())) {
                    filterScanner.advance();
                }
                if (filterScanner.peek() !== null &&
                    this.isValidKey(filterScanner.peek() + filterScanner.getNext())) {
                    criteria.setKey(filterScanner.peek() + filterScanner.getNext());
                    filterScanner.advance();
                } else if (filterScanner.peek() !== null) {
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
        } else {
            return allCriteria;
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
