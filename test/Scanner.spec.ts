import Scanner from "../src/syntax&processing/Scanner";
import Log from "../src/Util";
import {expect, assert} from "chai";

describe("Tests for peek() scanner function", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests peek on a basic string", function () {
        const str: string = "courses";
        const scanner: Scanner = new Scanner(str);
        let response: string;
        try {
            response = scanner.peek();
        } catch (e) {
            response = e;
        } finally {
            expect(response).to.equal("courses");
        }
    });

    it("Tests advance on a basic string", function () {
        const str: string = "In courses";
        const scanner: Scanner = new Scanner(str);
        let response: string;
        try {
            response = scanner.advance();
        } catch (e) {
            response = e;
        } finally {
            expect(response).to.equal("courses");
        }
    });

    it("Tests combination of peek and advance", function () {
        const str: string = "In courses dataset courseData";
        const scanner: Scanner = new Scanner(str);
        let response: string;
        try {
            scanner.peek();
            scanner.advance();
            scanner.peek();
            scanner.advance();
            response = scanner.peek();
        } catch (e) {
            response = e;
        } finally {
            expect(response).to.equal("dataset ");
        }
    });

    it("Tests combination of peek and advance on a valid query", function () {
        // tslint:disable-next-line:max-line-length
        const str: string = "In courses dataset courses, find entries whose Average is greater than 97; show Department and Average; sort in ascending order by Average.";
        const scanner: Scanner = new Scanner(str);
        let response: string;
        try {
            scanner.peek();
            scanner.advance();
            scanner.peek();
            scanner.advance();
            response = scanner.peek();
        } catch (e) {
            response = e;
        } finally {
            expect(response).to.equal("dataset ");
        }
    });
});
