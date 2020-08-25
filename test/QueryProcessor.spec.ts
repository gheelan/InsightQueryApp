import Log from "../src/Util";
import {expect} from "chai";
import CourseSyntaxChecker from "../src/CourseQueryProcessing/CourseSyntaxChecker";
import QueryProcessor from "../src/syntax&processing/QueryProcessor";

// tslint:disable-next-line:max-line-length
const queryNoPeriod: string = "In courses dataset courses, find entries whose Pass is greater than 90 and Average is less than 97; show Department and Average; sort in ascending order by Instructor";
// tslint:disable-next-line:max-line-length
const simpleQueryValid: string = "In courses dataset courses, find entries whose Average is greater than 97; show Department and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const simpleQueryNonIntFilter: string = "In courses dataset courses, find entries whose Average is greater than 96.25; show Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const complexQueryValid: string = "In courses dataset courses, find entries whose Average is greater than 90 and Department is \"adhe\" or Average is equal to 95; show Department, ID and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const queryNoOrder: string = "In courses dataset courses, find entries whose Instructor is \"smulders, dave\"; show Average.";
// tslint:disable-next-line:max-line-length
const simpleQueryInValid: string = "In courses dataset courses, find entries whose Average is !greater than 97; show Department and Average; sort in ascending order by Average.";

describe("Tests for QueryProcessor methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests checkSyntax method with a simple valid query", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(simpleQueryValid);
        const result: boolean = check.checkSyntax();
        expect(result).to.equal(true);
    });

    it("Tests checkSyntax method with a filter val with multiple words in quotes", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(queryNoOrder);
        const result: boolean = check.checkSyntax();
        expect(result).to.equal(true);
    });

    it("Tests checkSyntax method with a simple valid query that has a float Filter val", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(simpleQueryNonIntFilter);
        const result: boolean = check.checkSyntax();
        expect(result).to.equal(true);
    });

    it("Tests checkSyntax method with a complex valid query", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(complexQueryValid);
        const result: boolean = check.checkSyntax();
        expect(result).to.equal(true);
    });

    // Not sure why this isn't working but it appears to pass
    it("Tests checkSyntax method with an invalid query (invalid symbols)", function () {
        let response: any;
        // tslint:disable-next-line:max-line-length
        const error: Error = new Error("Invalid query: improper syntax used, please ensure proper usage of symbols and keywords");
        try {
            response = new CourseSyntaxChecker(simpleQueryInValid);
        } catch (e) {
            response = e;
        } finally {
            expect(response).to.deep.equal(error);
        }
    });

    it("Tests checkSyntax method with an invalid query (missing period at end)", function () {
        let response: any;
        // tslint:disable-next-line:max-line-length
        const error: Error = new Error("Invalid query: improper syntax used, please ensure proper usage of symbols and keywords");
        try {
            response = new CourseSyntaxChecker(queryNoPeriod);
        } catch (e) {
            response = e;
        } finally {
            expect(response).to.deep.equal(error);
        }
    });

    it("Checks the Dataset portion of the splitQuery method on a valid query", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(simpleQueryValid);
        const result: string = check.dataset;
        expect(result).to.equal("In courses dataset courses");
    });

    it("Checks the Filter portion of the splitQuery method on a valid query", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(simpleQueryValid);
        const result: string = check.filter;
        expect(result).to.equal("find entries whose Average is greater than 97");
    });

    it("Checks the Display portion of the splitQuery method on a valid query", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(simpleQueryValid);
        const result: string = check.display;
        expect(result).to.equal("show Department and Average");
    });

    it("Checks the Order portion of the splitQuery method on a valid query", function () {
        const check: QueryProcessor = new CourseSyntaxChecker(simpleQueryValid);
        const result: string = check.order;
        expect(result).to.equal("sort in ascending order by Average.");
    });
});
