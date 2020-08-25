import Log from "../src/Util";
import {expect} from "chai";
import CourseQueryParser from "../src/CourseQueryProcessing/CourseQueryParser";
import Criteria from "../src/syntax&processing/Criteria";

// tslint:disable-next-line:max-line-length
const validQuery: string = "In courses dataset courses, find entries whose Average is greater than 97; show Department and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const validQuery1: string  = "In courses dataset courses, find entries whose Department is \"hinu\" and Pass is less than 20; show Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const complexQueryValid: string = "In courses dataset courses, find entries whose Average is greater than 90 or Average is equal to 95; show Department, ID and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const courseParserSimpleM: CourseQueryParser = new CourseQueryParser(validQuery);
const courseParserSimpleS: CourseQueryParser = new CourseQueryParser(validQuery1);
const courseParserComplex: CourseQueryParser = new CourseQueryParser(complexQueryValid);

describe("Tests for CourseQueryParser methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests parseDataset method", function () {
        courseParserSimpleM.parseDataset();
        const result: string = courseParserSimpleM.datasetKey;
        expect(result).to.equal("courses");
    });

    it("Tests parseFilter method on a valid M-Filter", function () {
        courseParserSimpleM.parseFilter();
        const result: Criteria[] = courseParserSimpleM.filterCriteria;
        const expected: Criteria = new Criteria();
        expected.setKey("Average ");
        expected.setOp("is greater than ");
        expected.setVal("97");
        expect(result[0]).to.deep.equal(expected);
    });

    it("Tests parseFilter method on multiple valid M-Filters", function () {
        courseParserComplex.parseFilter();
        const result: Criteria[] = courseParserComplex.filterCriteria;
        const expected: Criteria = new Criteria();
        const expected1: Criteria = new Criteria();
        expected.setKey("Average ");
        expected.setOp("is greater than ");
        expected.setVal("90");
        expected1.setLogicKey("or ");
        expected1.setKey("Average ");
        expected1.setOp("is equal to ");
        expected1.setVal("95");
        expect(result[0]).to.deep.equal(expected);
        expect(result[1]).to.deep.equal(expected1);
    });

    it("Tests parseFilter method on a valid S-Filter", function () {
        courseParserSimpleS.parseFilter();
        const result: Criteria[] = courseParserSimpleS.filterCriteria;
        const expected: Criteria = new Criteria();
        const expected1: Criteria = new Criteria();
        expected.setKey("Department ");
        expected.setOp("is ");
        expected.setVal("\"hinu\"");
        expected1.setLogicKey("and ");
        expected1.setKey("Pass ");
        expected1.setOp("is less than ");
        expected1.setVal("20");
        expect(result[0]).to.deep.equal(expected);
        expect(result[1]).to.deep.equal(expected1);
    });

    it("Tests parseDisplay method on two display keys", function () {
        courseParserSimpleM.parseDisplay();
        const result: string[] = courseParserSimpleM.displayKeys;
        expect(result).to.deep.equal(["Department ", "Average"]);
    });

    it("Tests parseDisplay method on a single display key ", function () {
        courseParserSimpleS.parseDisplay();
        const result: string[] = courseParserSimpleS.displayKeys;
        expect(result).to.deep.equal(["Average"]);
    });

    it("Tests parseOrder method ", function () {
        courseParserSimpleM.parseOrder();
        const result: string = courseParserSimpleM.orderKeys[0];
        expect(result).to.deep.equal({key: "Average", title: null});
    });
});
