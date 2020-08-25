import Log from "../src/Util";
import CAggregateSyntaxChecker from "../src/CourseQueryProcessing/CAggregateSyntaxChecker";
import {expect} from "chai";

// tslint:disable-next-line:max-line-length
const aggDisplay1: string = "In courses dataset courses grouped by Department, find entries whose Department is \"cpsc\"; show Department, avgGrade and sumGrade, where avgGrade is the AVG of Average and sumGrade is the SUM of Average; sort in descending order by Department and avgGrade.";
// tslint:disable-next-line:max-line-length
const aggDisplay2: string = "In courses dataset courses grouped by Department, Instructor and Average, find entries whose Department is \"cpsc\"; show Department, sumGrade, minGrade and avgGrade, where sumGrade is the SUM of Average, minGrade is the MIN of Average and avgGrade is the AVG of Average; sort in ascending order by avgGrade, sumGrade and minGrade.";
// tslint:disable-next-line:max-line-length
const aggDisplay3: string = "In courses dataset courses grouped by Department, find entries whose Department is \"cpsc\"; show avgGrade, where avgGrade is the AVG of Average; sort in descending order by avgGrade.";
const checkSimple: CAggregateSyntaxChecker = new CAggregateSyntaxChecker(aggDisplay1);
const checkReallySimple: CAggregateSyntaxChecker = new CAggregateSyntaxChecker(aggDisplay3);
const checkComplex: CAggregateSyntaxChecker = new CAggregateSyntaxChecker(aggDisplay2);
describe("Tests for course aggregate query syntax check methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests isValidDataset on Aggregate dataset with one key", function () {
        const result: boolean = checkSimple.isValidDataset();
        expect(result).to.equal(true);
    });

    it("Tests isValidDataset on Aggregate dataset with multiple keys", function () {
        const result: boolean = checkComplex.isValidDataset();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay/isValidAggregate on Aggregate display with 1 agg_def", function () {
        const result: boolean = checkReallySimple.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay/isValidAggregate on Aggregate display with 2 agg_defs", function () {
        const result: boolean = checkSimple.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay/isValidAggregate on Aggregate display with multiple agg_defs", function () {
        const result: boolean = checkComplex.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidOrder on Aggregate display with 2 agg_defs", function () {
        const result: boolean = checkSimple.isValidOrder();
        expect(result).to.equal(true);
    });

    it("Tests isValidOrder on Aggregate display with multiple agg_defs", function () {
        const result: boolean = checkComplex.isValidOrder();
        expect(result).to.equal(true);
    });
});
