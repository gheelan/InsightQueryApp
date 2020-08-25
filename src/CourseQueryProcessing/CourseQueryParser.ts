import Scanner from "../syntax&processing/Scanner";
import SyntaxChecker from "../syntax&processing/SyntaxChecker";
import CourseSyntaxChecker from "./CourseSyntaxChecker";
import {IParser} from "../syntax&processing/IParser";
import Criteria from "../syntax&processing/Criteria";

export default class CourseQueryParser implements IParser {
    public datasetKey: string = "";
    public filterCriteria: Criteria[] = [];
    public displayKeys: string[] = [];
    public orderKeys: any[] = [];
    public sortingOrder: string = "";
    public syntaxChecker: SyntaxChecker;
    public courseMKeys: string[] = ["Average", "Pass", "Fail", "Audit", "Year"];
    public courseSKeys: string[] = ["Department", "ID", "Instructor", "Title", "UUID"];
    protected mOps: string[] = ["is greater than ", "is less than ", "is equal to ",
        "is not greater than ", "is not less than ", "is not equal to "];
    protected sOps: string[] = ["is ", "is not ", "includes ", "does not include ", "begins with ",
        "does not begin with ", "ends with ", "does not end with "];

    constructor(query: string) {
        this.syntaxChecker = new CourseSyntaxChecker(query);
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
        while (datasetScanner.peek() === "In " || datasetScanner.peek() === "courses " ||
        datasetScanner.peek() === "dataset ") {
            datasetScanner.advance();
        }
        this.datasetKey = datasetScanner.peek();
    }

    public parseFilter() {
        const filterScanner: Scanner = new Scanner(this.syntaxChecker.filter);
        const allCriteria: Criteria[] = [];
        if (this.syntaxChecker.filter === "find all entries") {
            return;
        }
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
        while (displayScanner.hasTokens()) {
            if (displayScanner.advance() === null) {
                break;
            }
            if (this.isValidKey(displayScanner.peek())) {
                this.displayKeys.push(displayScanner.peek());
            }
        }
    }

    public parseOrder() {
        const orderScanner: Scanner = new Scanner(this.syntaxChecker.order);
        while (orderScanner.hasTokens()) {
            if (orderScanner.advance() === null) {
                break;
            }
            if (orderScanner.peek() === "ascending " || orderScanner.peek() === "descending ") {
                this.sortingOrder = orderScanner.peek();
            }
            if (this.isValidKey(orderScanner.peek())) {
                this.orderKeys.push({key: orderScanner.peek(), title: null});
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
