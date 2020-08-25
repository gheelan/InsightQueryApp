import Log from "../src/Util";
import {expect} from "chai";
import CourseDataTransformer from "../src/CourseQueryLogic/CourseDataTransformer";
import CourseQueryParser from "../src/CourseQueryProcessing/CourseQueryParser";
import CourseDataPoint from "../src/CourseQueryLogic/CourseDataPoint";
import {ok} from "assert";

// tslint:disable-next-line:max-line-length
const okay: string = "In courses dataset courses, find entries whose Department is not \"adhe\"; show Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const queryWhyNotWork: string = "In courses dataset courses, find entries whose Department is \"adhe\" and Instructor does not include \"d\"; show Pass; sort in ascending order by Pass.";
// tslint:disable-next-line:max-line-length
const simpleQueryValid: string = "In courses dataset courses, find entries whose Average is greater than 86; show Department and Average; sort in ascending order by Average.";
// tslint:disable-next-line:max-line-length
const complexQueryValid: string = "In courses dataset courses, find entries whose Average is greater than 85 and Instructor begins with \"s\"; show Department and Average; sort in ascending order by Average.";
const courseParserSimple: CourseQueryParser = new CourseQueryParser(simpleQueryValid);
const courseParserComplex: CourseQueryParser = new CourseQueryParser(complexQueryValid);
const courseParserF: CourseQueryParser = new CourseQueryParser(queryWhyNotWork);
const courseParserHeck: CourseQueryParser = new CourseQueryParser(okay);
const row1: string[] = ["teach adult", "8672", "", "0", "2008", "327", "22", "0", "85.64", "adhe", "63a"];
const row2: string[] = ["teach adult", "8673", "", "0", "2008", "327", "13", "0", "87.15", "adhe", "63c"];
const row3: string[] = ["teach adult", "8674", "", "0", "2008", "327", "35", "0", "86.2", "adhe", "overall"];
// tslint:disable-next-line:max-line-length
const row4: string[] = ["teach adult", "17255", "smulders, dave", "0", "2010", "327", "23", "0", "86.65", "adhe", "63a"];
const row5: string[] = ["teach adult", "17256", "smulders, dave", "0", "2010", "327", "20", "0", "85.6", "adhe", "63c"];
const row6: string[] = ["teach adult" , "17257", "", "0", "2010", "327", "43", "0", "86.16", "adhe", "overall"];
// tslint:disable-next-line:max-line-length
const row7: string[] = ["teach adult", "19177", "palacios, carolina", "0", "2016", "327", "34", "1", "75.71", "adhe", "63a"];
// tslint:disable-next-line:max-line-length
const row8: string[] = ["teach adult", "19178", "smulders, dave", "0", "2016", "327", "32", "1", "79.88", "adhe", "63b"];
const row9: string[] = ["teach adult", "19179", "", "0", "2016", "327", "66", "2", "77.74", "adhe", "overall"];
// tslint:disable-next-line:max-line-length
const row10: string[] = ["teach adult", "27553", "smulders, dave", "0", "2013", "327", "21", "0", "83.57", "adhe", "93q"];
const row11: string[] = ["teach adult", "1234", "", "0", "2013", "327", "21", "0", "83.57", "musc", "93q"];
// tslint:disable-next-line:max-line-length
const row12: string[] = ["teach adult", "5678", "smulders, dave", "0", "2013", "327", "21", "0", "83.57", "musc", "93q"];
const ogDataset: string[][] = [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12];

describe("Tests for CourseDataTransformer methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests transform op on a single criteria", async () => {
        courseParserSimple.parseQuery();
        const dataTransformer: CourseDataTransformer = new CourseDataTransformer(courseParserSimple);
        const expected: string[][] = [row2, row3, row4, row6];
        const result = await dataTransformer.transformData(ogDataset, courseParserSimple.filterCriteria[0]);
        expect(result).to.deep.equal(expected);
    });

    it("Tests transformAllData op on a valid list of criteria", async () => {
        courseParserComplex.parseQuery();
        const dataTransformer: CourseDataTransformer = new CourseDataTransformer(courseParserComplex);
        const expected: string[][] = [row4, row5];
        const result = await dataTransformer.transformAllData(ogDataset, courseParserComplex.filterCriteria);
        expect(result).to.deep.equal(expected);
    });
    it("Tests transformAllData on valid is not query", async () => {
        courseParserHeck.parseQuery();
        const dataTransformer: CourseDataTransformer = new CourseDataTransformer(courseParserHeck);
        const expected: string[][] = [row11, row12];
        const result = await dataTransformer.transformAllData(ogDataset, courseParserHeck.filterCriteria);
        expect(result).to.deep.equal(expected);
    });

    it("Tests transformAllData op on a valid list of criteria (2 s-criteria)", async () => {
        courseParserF.parseQuery();
        const dataTransformer: CourseDataTransformer = new CourseDataTransformer(courseParserF);
        const expected: string[][] = [row1, row2, row3, row6, row7, row9];
        const result = await dataTransformer.transformAllData(ogDataset, courseParserF.filterCriteria);
        expect(result).to.deep.equal(expected);
    });

    it("Tests listDatapoints method", async () => {
        const dataTransformer: CourseDataTransformer = new CourseDataTransformer(courseParserSimple);
        const filtered: string[][] = [row2, row3, row4, row6];
        let result: CourseDataPoint[];
        const keys: number[] = [9, 8];
        const d0: CourseDataPoint = new CourseDataPoint(keys, row2);
        const d1: CourseDataPoint = new CourseDataPoint(keys, row3);
        const d2: CourseDataPoint = new CourseDataPoint(keys, row4);
        const d3: CourseDataPoint = new CourseDataPoint(keys, row6);
        const expected: CourseDataPoint[] = [d0, d1, d2, d3];
        courseParserSimple.parseQuery();
        try {
            await dataTransformer.transformData(ogDataset, courseParserSimple.filterCriteria[0]);
            result =  await dataTransformer.listDataPoints([9, 8], filtered);
        } catch (e) {
            result = e;
        }
        expect(expected).to.deep.equal(result);
    });
});
