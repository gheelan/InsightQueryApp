import Log from "../src/Util";
import {expect} from "chai";
import CAggregateParser from "../src/CourseQueryProcessing/CAggregateParser";

// tslint:disable-next-line:max-line-length
const aggQuery1: string = "In courses dataset courses grouped by Department, find entries whose Department is \"cpsc\"; show Department, Instructor, avgGrade and sumGrade, where avgGrade is the AVG of Average and sumGrade is the SUM of Average; sort in descending order by Department and avgGrade.";
// tslint:disable-next-line:max-line-length
const aggQuery2: string = "In courses dataset courses grouped by Department, Instructor, and Average, find entries whose Department is \"cpsc\"; show Department, sumGrade, minGrade and avgGrade, where sumGrade is the SUM of Average, minGrade is the MIN of Average and avgGrade is the AVG of Average; sort in ascending order by avgGrade, sumGrade and minGrade.";
const parserSimple: CAggregateParser = new CAggregateParser(aggQuery1);
const parserComplex: CAggregateParser = new CAggregateParser(aggQuery2);
describe("Tests for course aggregate query parser methods", function () {
    before(function () {
        parserSimple.parseDisplay();
        parserSimple.parseOrder();
        parserComplex.parseDisplay();
        parserComplex.parseOrder();
    });
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests parseDisplay on Aggregate query with two aggregate parameters", function () {
        const result: any[] = parserSimple.aggCriteria;
        // tslint:disable-next-line:max-line-length
        const expected = [{title: "avgGrade", aggKey: "AVG", key: "Average"},
            {title: "sumGrade", aggKey: "SUM", key: "Average"}];
        expect(result).to.deep.equal(expected);
    });

    it("Tests that parseDisplay is parsing the correct display keys", function () {
        const result: any[] = parserComplex.displayKeys;
        const expected = ["Department", "sumGrade", "minGrade", "avgGrade"];
        expect(result).to.deep.equal(expected);
    });

    it("Tests that parseOrder is parsing the correct order keys (mix of S-key and custom)", function () {
        const result: any[] = parserSimple.orderKeys;
        const expected = [{key: "Department ", title: null}, {key: "AVG", title: "avgGrade"}];
        expect(result).to.deep.equal(expected);
    });

    it("Tests that parseOrder is parsing the correct order keys (only custom keys)", function () {
        const result: any[] = parserComplex.orderKeys;
        const expected = [{key: "AVG", title: "avgGrade"}, {key: "SUM", title: "sumGrade"},
            {key: "MIN", title: "minGrade"}];
        expect(result).to.deep.equal(expected);
    });
});
