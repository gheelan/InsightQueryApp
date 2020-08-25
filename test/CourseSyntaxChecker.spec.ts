import Log from "../src/Util";
import {expect} from "chai";
import CourseSyntaxChecker from "../src/CourseQueryProcessing/CourseSyntaxChecker";
import Criteria from "../src/syntax&processing/Criteria";

// tslint:disable-next-line:max-line-length
const queryInvalidFilter1: string = "In courses dataset courses, find entries whose Instructor is x; show Instructor; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const queryInvalidFilter: string = "In courses dataset courses, find entries whose Pass is greater than 90 and minus than 97; show Department and Average; sort in ascending order by Instructor.";
// tslint:disable-next-line:max-line-length
const queryInvalidOrder: string = "In courses dataset courses, find entries whose Pass is greater than 90 and minus than 97; show Department and Average; sort in ascending order by data.";
// tslint:disable-next-line:max-line-length
const queryInvalidOrder1: string = "In courses dataset courses, find entries whose Pass is greater than 90 and minus than 97; show Department and Average; sort in ascending order by Avg.";
// tslint:disable-next-line:max-line-length
const queryInvalidDisplay: string = "In courses dataset courses, find entries whose Pass is greater than 90 and minus than 97; show Department, Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const queryInvalidDisplay1: string = "In courses dataset courses, find entries whose Pass is greater than 10 and Average is less than 97; show Sum and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const querySingleDisplay: string = "In courses dataset courses, find entries whose Instructor is \"smulders, dave\"; show Average.";
// tslint:disable-next-line:max-line-length
const simpleQueryValid: string = "In courses dataset courses, find entries whose Average is greater than 97; show Department and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const simpleQueryValid1: string  = "In courses dataset courses, find entries whose Department is \"hinu\" and Pass is less than 20; show Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const complexQueryValid: string = "In courses dataset courses, find entries whose Average is greater than 90 or Average is equal to 95; show Department, ID and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const complexQueryValid1: string = "In courses dataset courses, find entries whose Average is greater than 90 and Department is \"adhe\" or Average is equal to 95; show Department, ID and Average; sort in ascending order by Average.";
const checkerSimple: CourseSyntaxChecker = new CourseSyntaxChecker(simpleQueryValid);
const checkerDisplay: CourseSyntaxChecker = new CourseSyntaxChecker(querySingleDisplay);
const checkComplex: CourseSyntaxChecker = new CourseSyntaxChecker(complexQueryValid);
describe("Tests for SyntaxChecker methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests checkQuery method on a complex query", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(complexQueryValid1);
        const result: boolean = check.checkQuery();
        expect(result).to.equal(true);
    });

    it("Tests isValidDataset method ", function () {
        const result: boolean = checkerSimple.isValidDataset();
        expect(result).to.equal(true);
    });

    it("Tests isValidFilter method ", function () {
        const result: boolean = checkerSimple.isValidFilter();
        expect(result).to.equal(true);
    });

    it("Tests isValidFilter method on an invalid filter", function () {
        const check1: CourseSyntaxChecker = new CourseSyntaxChecker(queryInvalidFilter);
        const result: boolean = check1.isValidFilter();
        expect(result).to.equal(false);
    });

    it("Tests isValidDisplay method on a 1 key display", function () {
        const result: boolean = checkerDisplay.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay method on a 2 key display", function () {
        const result: boolean = checkerSimple.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay method on a 3 key display", function () {
        const result: boolean = checkComplex.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay method on an invalid display (invalid syntax)", function () {
        const check1: CourseSyntaxChecker = new CourseSyntaxChecker(queryInvalidDisplay);
        const result: boolean = check1.isValidDisplay();
        expect(result).to.equal(false);
    });

    it("Tests isValidDisplay method on an invalid display (invalid key)", function () {
        const check1: CourseSyntaxChecker = new CourseSyntaxChecker(queryInvalidDisplay1);
        const result: boolean = check1.isValidDisplay();
        expect(result).to.equal(false);
    });

    it("Tests isValidOrder method", function () {
        const result: boolean = checkerSimple.isValidOrder();
        expect(result).to.equal(true);
    });

    it("Tests isValidOrder method on an invalid order", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(queryInvalidOrder);
        const result: boolean = check.isValidOrder();
        expect(result).to.equal(false);
    });

    it("Tests isValidOrder method on an invalid order (invalid key)", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(queryInvalidOrder1);
        const result: boolean = check.isValidOrder();
        expect(result).to.equal(false);
    });

    it("Tests buildCriteria method on a valid filter with one M-Criteria", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(simpleQueryValid);
        const expected: Criteria = new Criteria();
        expected.setKey("Average ");
        expected.setOp("is greater than ");
        expected.setVal("97");
        const result: Criteria[] = check.buildCriteria();
        expect(result[0]).to.deep.equal(expected);
    });

    it("Tests buildCriteria method on a valid filter with one S-Criteria", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(simpleQueryValid1);
        const expected: Criteria = new Criteria();
        expected.setKey("Department ");
        expected.setOp("is ");
        expected.setVal("\"hinu\"");
        const result: Criteria[] = check.buildCriteria();
        expect(result[0]).to.deep.equal(expected);
    });

    it("Tests buildCriteria method on a valid filter with multiple Criteria", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(complexQueryValid1);
        const expected0: Criteria = new Criteria();
        expected0.setKey("Average ");
        expected0.setOp("is greater than ");
        expected0.setVal("90");
        const expected1: Criteria = new Criteria();
        expected1.setKey("Department ");
        expected1.setOp("is ");
        expected1.setVal("\"adhe\"");
        const expected2: Criteria = new Criteria();
        expected2.setKey("Average ");
        expected2.setOp("is equal to ");
        expected2.setVal("95");
        const result: Criteria[] = check.buildCriteria();
        expect(result[0]).to.deep.equal(expected0);
        expect(result[1]).to.deep.equal(expected1);
        expect(result[2]).to.deep.equal(expected2);
    });

    it("Tests buildCriteria method on a valid filter with multiple Criteria without a string", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(complexQueryValid);
        const expected0: Criteria = new Criteria();
        expected0.setKey("Average ");
        expected0.setOp("is greater than ");
        expected0.setVal("90");
        const expected1: Criteria = new Criteria();
        expected1.setKey("Average ");
        expected1.setOp("is equal to ");
        expected1.setVal("95");
        const result: Criteria[] = check.buildCriteria();
        expect(result[0]).to.deep.equal(expected0);
        expect(result[1]).to.deep.equal(expected1);
    });
    it("Tests buildCriteria method on an invalid filter (invalid val)", function () {
        const check: CourseSyntaxChecker = new CourseSyntaxChecker(queryInvalidFilter1);
        const expected0: Criteria = new Criteria();
        expected0.setKey("Instructor ");
        expected0.setOp("is ");
        expected0.setVal(null);
        const result: Criteria[] = check.buildCriteria();
        expect(result[0]).to.deep.equal(expected0);
    });
});
