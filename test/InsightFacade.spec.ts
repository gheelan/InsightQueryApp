import {expect} from "chai";
import {InsightDatasetKind, InsightResponse, InsightResponseSuccessBody} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";
import {error} from "util";

// This should match the JSON schema described in test/query.schema.json
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    query: any;  // make any to allow testing structurally invalid queries
    response: InsightResponse;
    filename: string;  // This is injected when reading the file
}

describe("InsightFacade Add/Remove Dataset", function () {
    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        rooms: "./test/data/rooms.zip",
        emptyZip: "./test/data/emptyZip.zip",
        emptyCoursesFolder: "./test/data/emptyCoursesFolder.zip",
        incorrectFolder: "./test/data/IncorrectFolder.zip",
        incorrectFolderNotCSV: "./test/data/IncorrectFolderNotCSV.zip",
        correctFolderNotCSV: "./test/data/CorrectFolderNotCSV.zip",
        csvOneLong: "./test/data/csvOneLong.zip",
    };

    let insightFacade: InsightFacade;
    let datasets: { [id: string]: string };

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToLoad)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return {[Object.keys(datasetsToLoad)[i]]: buf.toString("base64")};
            });
            datasets = Object.assign({}, ...loadedDatasets);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    it("Should add a valid dataset (one valid course long)", async () => {
        const id: string = "csvOneLong";
        const expectedCode: number = 204;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should add a valid dataset (multiple courses)", async () => {
        const id: string = "courses";
        const expectedCode: number = 204;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should add a valid dataset (dataset added, removed, re-added)", async () => {
        const id: string = "courses";
        const expectedCode: number = 204;
        let response: InsightResponse;
        await insightFacade.removeDataset(id);
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should add a valid dataset: rooms data", async () => {
        const id: string = "rooms";
        const expectedCode: number = 204;
        let response: InsightResponse;
        try {
            response =  await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Rooms);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: empty zip file", async () => {
        const id: string = "emptyZip";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: Zip file with empty courses folder", async () => {
        const id: string = "emptyCoursesFolder";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset("courses", datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: Incorrect folder name", async () => {
        const id: string = "incorrectFolder";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: Incorrect folder name and not CSV file", async () => {
        const id: string = "incorrectFolderNotCSV";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: Does not contain CSV file", async () => {
        const id: string = "CorrectFolderNotCSV";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: null id", async () => {
        const id: any = null;
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: undefined id", async () => {
        const id: any = undefined;
        const expectedCode = 400;
        let response;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: Invalid id type", async () => {
        const id: any = 83;
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: id does not exist", async () => {
        const id: string = "crses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: id is empty string", async () => {
        const id: string = "";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: null content", async () => {
        const id: string = "courses";
        const expectedCode = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, null, InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: undefined content", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, undefined, InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: Invalid content (not a CSV file)", async () => {
        const id: string = "correctFolderNotCSV";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset("courses", datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: null kind", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], null);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: undefined kind", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], undefined);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: Incorrect kind", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Rooms);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT add dataset: duplicate id", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        try {
            await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should remove the courses dataset", async () => {
        const id: string = "courses";
        const expectedCode: number = 204;
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (e) {
            response = e;
        }
        try {
            response = await insightFacade.removeDataset(id);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT remove the dataset: Dataset not added", async () => {
        const id: string = "course1";
        const expectedCode: number = 404;
        let response;
        try {
            response = await insightFacade.removeDataset(id);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT remove the dataset: empty string id", async () => {
        const id: string = "courses";
        const expectedCode: number = 404;
        let response: InsightResponse;
        try {
            response = await insightFacade.removeDataset("");
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT remove the dataset: null id type", async () => {
        const id: string = "courses";
        const expectedCode: number = 404;
        let response: InsightResponse;
        try {
            response = await insightFacade.removeDataset(null);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should NOT remove the dataset: undefined id type", async () => {
        const expectedCode: number = 404;
        let response: InsightResponse;
        try {
            response = await insightFacade.removeDataset(undefined);
        } catch (e) {
            response = e;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
    it("Should list a valid dataset after it was added (checks body)", async () => {
        const id: string = "courses";
        const facade: InsightFacade = new InsightFacade();
        await facade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        // tslint:disable-next-line:max-line-length
        const expectedBody: InsightResponseSuccessBody = {result: [{id: "courses", kind: InsightDatasetKind.Courses, numRows: 64612}]};
        let response: InsightResponse;
        try {
            response = await facade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.body).to.deep.equal(expectedBody);
        }
    });

    it("Should list a valid dataset after it was added (checks code)", async () => {
        const id: string = "courses";
        const facade: InsightFacade = new InsightFacade();
        await facade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        // tslint:disable-next-line:max-line-length
        const expectedCode: number = 200;
        let response: InsightResponse;
        try {
            response = await facade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    it("Should list an empty list when no dataset was added (checks body)", async () => {
        const facade: InsightFacade = new InsightFacade();
        const expectedBody: InsightResponseSuccessBody = {result: []};
        let response: InsightResponse;
        try {
            response = await facade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.body).to.deep.equal(expectedBody);
        }
    });

    it("Should list an empty list when no dataset was added (checks code)", async () => {
        const facade: InsightFacade = new InsightFacade();
        const expectedCode: number = 200;
        let response: InsightResponse;
        try {
            response = await facade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.deep.equal(expectedCode);
        }
    });
});

// This test suite dynamically generates tests from the JSON files in test/queries.
// You should not need to modify it; instead, add additional files to the queries directory.
describe("InsightFacade PerformQuery", () => {
    const datasetsToQuery: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        rooms: "./test/data/rooms.zip",
    };
    let insightFacade: InsightFacade;
    let testQueries: ITestQuery[] = [];

    // Create a new instance of InsightFacade, read in the test queries from test/queries and
    // add the datasets specified in datasetsToQuery.
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.
        try {
            testQueries = await TestUtil.readTestQueries();
            expect(testQueries).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }

        // Load the datasets specified in datasetsToQuery and add them to InsightFacade.
        // Fail if there is a problem reading ANY dataset.
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToQuery)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return {[Object.keys(datasetsToQuery)[i]]: buf.toString("base64")};
            });
            expect(loadedDatasets).to.have.length.greaterThan(0);

            const responsePromises: Array<Promise<InsightResponse>> = [];
            const datasets: { [id: string]: string } = Object.assign({}, ...loadedDatasets);
            for (const [id, content] of Object.entries(datasets)) {
                if (id === "courses") {
                    responsePromises.push(insightFacade.addDataset(id, content, InsightDatasetKind.Courses));
                }
                if (id === "rooms") {
                    responsePromises.push(insightFacade.addDataset(id, content, InsightDatasetKind.Rooms));
                }
            }
            const responses: InsightResponse[] = await Promise.all(responsePromises);
            responses.forEach((response) => expect(response.code).to.equal(204));

            // This try/catch is a hack to let your dynamic tests execute even though the addDataset method fails.
            // In D1, you should remove this try/catch to ensure your datasets load successfully before trying
            // to run you queries.
            // try {
            //     const responses: InsightResponse[] = await Promise.all(responsePromises);
            //     responses.forEach((response) => expect(response.code).to.equal(204));
            // } catch (err) {
            //     Log.warn(`Ignoring addDataset errors. For D1, you should allow errors to fail the Before All hook.`);
            // }
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    it ("tests agg query", async () => {
        // tslint:disable-next-line:max-line-length
        const query: string = "In rooms dataset rooms, find all entries; show Full Name and Address; sort in ascending order by Full Name.";
        let result: InsightResponse;
        try {
        result = await insightFacade.performQuery(query);
        } catch (e) {
            result = e;
        } finally {
            expect(result.code).to.equal(200);
        }
    });

    // Dynamically create and run a test for each query in testQueries
    it("Should run test queries", () => {
        describe("Dynamic InsightFacade PerformQuery tests", () => {
            for (const test of testQueries) {
                it(`[${test.filename}] ${test.title}`, async () => {
                    let response: InsightResponse;

                    try {
                        response = await insightFacade.performQuery(test.query);
                    } catch (err) {
                        response = err;
                    } finally {
                        expect(response.code).to.equal(test.response.code);

                        if (test.response.code >= 400) {
                            expect(response.body).to.have.property("error");
                        } else {
                            expect(response.body).to.have.property("result");
                            const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                            const actualResult = (response.body as InsightResponseSuccessBody).result;
                            expect(actualResult).to.deep.equal(expectedResult);
                        }
                    }
                });
            }
        });
    });
});
