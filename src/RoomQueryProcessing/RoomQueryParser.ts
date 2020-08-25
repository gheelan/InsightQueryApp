import Scanner from "../syntax&processing/Scanner";
import QueryProcessor from "../syntax&processing/QueryProcessor";
import Criteria from "../syntax&processing/Criteria";
import {register} from "ts-node";
import {IParser} from "../syntax&processing/IParser";
import SyntaxChecker from "../syntax&processing/SyntaxChecker";
import CourseSyntaxChecker from "../CourseQueryProcessing/CourseSyntaxChecker";
import RoomSyntaxChecker from "./RoomSyntaxChecker";

export default class RoomQueryParser implements IParser {
    public datasetKey: string = "";
    public filterCriteria: Criteria[] = [];
    public displayKeys: string[] = [];
    public orderKeys: any[] = [];
    public sortingOrder: string = "";
    public syntaxChecker: SyntaxChecker;
    public roomMKeys: string[] = ["Latitude", "Longitude", "Seats"];
    public roomSKeys: string[] = ["Full Name", "Short Name", "Number", "Name", "Address", "Type", "Furniture", "Link"];
    protected mOps: string[] = ["is greater than ", "is less than ", "is equal to ",
        "is not greater than ", "is not less than ", "is not equal to "];
    protected sOps: string[] = ["is ", "is not ", "includes ", "does not include ", "begins with ",
        "does not begin with ", "ends with ", "does not end with "];

    constructor(query: string) {
        this.syntaxChecker = new RoomSyntaxChecker(query);
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
        while (datasetScanner.peek() === "In " || datasetScanner.peek() === "rooms " ||
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
        while (displayScanner.hasTokens()) {
            if (displayScanner.advance() === null) {
                break;
            }
            if (this.isValidKey(displayScanner.peek() + displayScanner.getNext())) {
                this.displayKeys.push(displayScanner.peek() + displayScanner.getNext());
                displayScanner.advance();
            } else if (this.isValidKey(displayScanner.peek())) {
                this.displayKeys.push(displayScanner.peek());
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
            if (this.isValidKey(orderScanner.peek() + orderScanner.getNext())) {
                trimmedKey = orderScanner.peek() + orderScanner.getNext();
                this.orderKeys.push({key: trimmedKey, title: null});
                orderScanner.advance();
            } else if (this.isValidKey(orderScanner.peek())) {
                trimmedKey = orderScanner.peek().trim();
                this.orderKeys.push({key: trimmedKey, title: null});
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
