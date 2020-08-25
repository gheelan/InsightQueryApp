import Log from "../Util";
import {
    IInsightFacade,
    InsightDataset,
    InsightDatasetKind,
    InsightResponse,
    InsightResponseErrorBody,
    InsightResponseSuccessBody,
} from "./IInsightFacade";
import * as JSZip from "jszip";

import RoomQueryParser from "../RoomQueryProcessing/RoomQueryParser";
import RoomQueryResultSorter from "../RoomQueryLogic/RoomQueryResultSorter";
import RAggregateParser from "../RoomQueryProcessing/RAggregateParser";
import CourseQueryParser from "../CourseQueryProcessing/CourseQueryParser";
import CourseDataset from "../CourseQueryLogic/CourseDataset";
import RoomDataset from "../RoomQueryLogic/RoomDataset";
import CourseDataTransformer from "../CourseQueryLogic/CourseDataTransformer";
import CourseQueryResultSorter from "../CourseQueryLogic/CourseQueryResultSorter";
import RoomDataTransformer from "../RoomQueryLogic/RoomDataTransformer";
import CAggregateParser from "../CourseQueryProcessing/CAggregateParser";
import CAggregateDataTransformer from "../CourseQueryLogic/CAggregateDataTransformer";
import RAggregateDataTransformer from "../RoomQueryLogic/RAggregateDataTransformer";

/**
 * This is the main programmatic entry point for the project.
 */
export default class InsightFacade implements IInsightFacade {
    public courseDataForQuery: CourseDataset[];
    public roomsDataForQuery: RoomDataset[];
    private readonly currentDatasets: InsightDataset[] = new Array<InsightDataset>();

    constructor() {
        Log.trace("InsightFacadeImpl::init()");
        this.courseDataForQuery = [];
        this.roomsDataForQuery = [];
        this.currentDatasets = [];
    }

    public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<InsightResponse> {
        const addSuccessBody: InsightResponseSuccessBody = {result: "Dataset added successfully"};
        const addErrorBody: InsightResponseErrorBody = {error: "Error: Duplicate ID or dataset previously added"};
        const zip = new JSZip();
        const parse5 = require("parse5");
        const that = this;
        return new Promise<InsightResponse>(function (resolve, reject) {
            if (!that.hasCourseDatasetID(id) && content && kind === "courses") {
                that.loadBase64Dataset(content, zip)
                    .then((result: JSZip) => {
                        try {
                            return that.getCourseFileContents(result);
                        } catch (e) {
                            reject({code: 400, body: e});
                        }
                    })
                    .then((result) => {
                        Promise.all(result)
                            .then((list) => {
                                const rawData: string[][] = [];
                                for (const i of list) {
                                    const x = i.split("\r\n");
                                    rawData.push(x);
                                }
                                const courseDataset: CourseDataset = new CourseDataset(id);
                                courseDataset.parseData(rawData);
                                that.courseDataForQuery.push(courseDataset);
                                const rows = that.calculateRows(id);
                                const dataset: InsightDataset = {id, kind: InsightDatasetKind.Courses, numRows: rows};
                                that.currentDatasets.push(dataset);
                                resolve({code: 204, body: addSuccessBody});
                            });
                    })
                    .catch(() => {
                        reject({code: 400, body: addErrorBody});
                    });
            } else if (!that.hasCourseDatasetID(id) && content && kind === "rooms") {
                that.loadBase64Dataset(content, zip)
                    .then((result) => {
                        try {
                            return that.getRoomFileContents(result);
                        } catch (e) {
                            reject({code: 400, body: addErrorBody});
                        }
                    })
                    .then((result) => {
                        Promise.all(result)
                            .then((lst) => {
                                const roomDataset: RoomDataset = new RoomDataset(id);
                                const parsedData: any[] = [];
                                const geoResponses: Array<Promise<any>> = [];
                                for (const i of lst) {
                                    const x = parse5.parseFragment(i);
                                    parsedData.push(x);
                                }
                                roomDataset.parseFiles(parsedData);
                                for (const room of roomDataset.parsedData) {
                                    const geo = roomDataset.getGeoLocation(room[1]);
                                    geoResponses.push(geo);
                                }
                                Promise.all(geoResponses)
                                    .then((responses) => {
                                        for (const i in roomDataset.parsedData) {
                                            roomDataset.parsedData[i].push(responses[i].lat);
                                            roomDataset.parsedData[i].push(responses[i].lon);
                                        }
                                        that.roomsDataForQuery.push(roomDataset);
                                        const dataset: InsightDataset = {
                                            id,
                                            kind: InsightDatasetKind.Rooms,
                                            numRows: roomDataset.parsedData.length,
                                        };
                                        that.currentDatasets.push(dataset);
                                        resolve({code: 204, body: addSuccessBody});
                                    });
                            })
                            .catch(() => {
                                reject({code: 400, body: addErrorBody});
                            });
                    });
            } else {
                reject({code: 400, body: addErrorBody});
            }
        });
    }

    public removeDataset(id: string): Promise<InsightResponse> {
        const that = this;
        const successBody: InsightResponseSuccessBody = {result: "Dataset removed successfully"};
        const errorBody: InsightResponseErrorBody = {error: "Error: ID not found"};
        const fulfilled: InsightResponse = {code: 204, body: successBody};
        const rejected: InsightResponse = {code: 404, body: errorBody};
        return new Promise<InsightResponse>((resolve, reject) => {
            for (const dataset of that.currentDatasets) {
                if (dataset.id === id && dataset.kind === "courses") {
                    for (let i = 0; i < that.courseDataForQuery.length; i++) {
                        if (that.courseDataForQuery[i]) {
                            if (that.courseDataForQuery[i].id === id) {
                                delete that.courseDataForQuery[i];
                                resolve(fulfilled);
                                return;
                            }
                        }
                    }
                } else if (dataset.id === id && dataset.kind === "rooms") {
                    for (let i = 0; i < that.roomsDataForQuery.length; i++) {
                        if (that.roomsDataForQuery[i]) {
                            if (that.roomsDataForQuery[i].id === id) {
                                delete that.roomsDataForQuery[i];
                                resolve(fulfilled);
                                return;
                            }
                        }
                    }
                }
            }
            reject(rejected);
        });
    }

    public performQuery(query: string): Promise<InsightResponse> {
        const that = this;
        // tslint:disable-next-line:max-line-length
        const errorBody: InsightResponseErrorBody = {error: "Error: Invalid query or dataset not found. Please ensure dataset has been added and proper keywords, syntax, and grammar are used."};
        const rejected: InsightResponse = {code: 400, body: errorBody};
        return new Promise<InsightResponse>(function (resolve, reject) {
            let kind: string = "";
            try {
                kind = that.findQueryKind(query);
            } catch (e) {
                reject(rejected);
            }
            if (kind === "courses" && !that.isAggregate(query)) {
                let courseParser: CourseQueryParser;
                let dataTransformer: CourseDataTransformer;
                try {
                    courseParser = new CourseQueryParser(query);
                    courseParser.parseQuery();
                } catch (e) {
                    reject(rejected);
                }
                if (that.hasCourseDatasetID(courseParser.datasetKey)) {
                    const dataset: string[][] = that.getCourseData(courseParser.datasetKey);
                    let filteredData: string[][] = [];
                    let displayKeyIndices: number[];
                    dataTransformer = new CourseDataTransformer(courseParser);
                    dataTransformer.transformAllData(dataset, courseParser.filterCriteria)
                        .then((data: string[][]) => {
                            filteredData = data;
                            displayKeyIndices = dataTransformer.findDisplayKeyIndices(courseParser.displayKeys);
                            dataTransformer.listDataPoints(displayKeyIndices, filteredData)
                                .then((lst) => {
                                    const queryResult: any[] = [];
                                    for (const x of lst) {
                                        const stringify: string = JSON.stringify(x);
                                        const parsedJSON: JSON = JSON.parse(stringify);
                                        queryResult.push(parsedJSON);
                                    }
                                    if (courseParser.orderKeys.length >= 1 &&
                                        courseParser.sortingOrder === "ascending ") {
                                        const sorter: CourseQueryResultSorter = new CourseQueryResultSorter();
                                        // tslint:disable-next-line:max-line-length
                                        const sorted = sorter.courseMergeSortAscending(courseParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else if (courseParser.orderKeys.length >= 1 &&
                                        courseParser.sortingOrder === "descending ") {
                                        const sorter: CourseQueryResultSorter = new CourseQueryResultSorter();
                                        // tslint:disable-next-line:max-line-length
                                        const sorted = sorter.courseMergeSortDescending(courseParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else {
                                        resolve({code: 200, body: {result: queryResult}});
                                    }
                                })
                                .catch(() => {
                                    reject(rejected);
                                });
                        });
                } else {
                    reject(rejected);
                }
            } else if (kind === "rooms" && !that.isAggregate(query)) {
                let roomParser: RoomQueryParser;
                let roomDataTransformer: RoomDataTransformer;
                try {
                    roomParser = new RoomQueryParser(query);
                    roomParser.parseQuery();
                } catch (e) {
                    reject(rejected);
                }
                if (that.hasRoomDatasetID(roomParser.datasetKey)) {
                    const dataset: string[][] = that.getRoomData(roomParser.datasetKey);
                    let filteredData: string[][] = [];
                    let displayKeyIndices: number[];
                    roomDataTransformer = new RoomDataTransformer(roomParser);
                    roomDataTransformer.transformAllData(dataset, roomParser.filterCriteria)
                        .then((data: string[][]) => {
                            filteredData = data;
                            displayKeyIndices = roomDataTransformer.findDisplayKeyIndices(roomParser.displayKeys);
                            roomDataTransformer.listDataPoints(displayKeyIndices, filteredData)
                                .then((lst) => {
                                    const queryResult: any[] = [];
                                    for (const x of lst) {
                                        const a: string = JSON.stringify(x);
                                        const b: JSON = JSON.parse(a);
                                        queryResult.push(b);
                                    }
                                    if (roomParser.orderKeys.length >= 1 &&
                                        roomParser.sortingOrder === "ascending ") {
                                        const sorter: RoomQueryResultSorter = new RoomQueryResultSorter();
                                        const sorted = sorter.roomMergeSortAscending(roomParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else if (roomParser.orderKeys.length >= 1 &&
                                        roomParser.sortingOrder === "descending ") {
                                        const sorter: RoomQueryResultSorter = new RoomQueryResultSorter();
                                        // tslint:disable-next-line:max-line-length
                                        const sorted = sorter.roomMergeSortDescending(roomParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else {
                                        resolve({code: 200, body: {result: queryResult}});
                                    }
                                })
                                .catch(() => {
                                    reject(rejected);
                                });
                        });
                } else {
                    reject(rejected);
                }
            } else if (that.isAggregate(query) && that.findQueryKind(query) === "courses") {
                let aggregateDataTransformer: CAggregateDataTransformer;
                let cAggregateParser: CAggregateParser;
                try {
                    cAggregateParser = new CAggregateParser(query);
                    cAggregateParser.parseQuery();
                } catch (e) {
                    reject(rejected);
                }
                if (that.hasCourseDatasetID(cAggregateParser.datasetKey.trim())) {
                    let filteredData: string[][] = [];
                    const dataset: string[][] = that.getCourseData(cAggregateParser.datasetKey.trim());
                    aggregateDataTransformer = new CAggregateDataTransformer(cAggregateParser);
                    aggregateDataTransformer.transformAllData(dataset, cAggregateParser.filterCriteria)
                        .then((data) => {
                            filteredData = data;
                            return aggregateDataTransformer.makeFinalGroups(filteredData);
                        })
                        .then((groups) => {
                            aggregateDataTransformer.applyAggregateToGroups(groups)
                                .then((lst) => {
                                    const queryResult: any[] = [];
                                    for (const x of lst) {
                                        const a: string = JSON.stringify(x);
                                        const b: JSON = JSON.parse(a);
                                        queryResult.push(b);
                                    }
                                    if (cAggregateParser.orderKeys.length >= 1 &&
                                        cAggregateParser.sortingOrder === "ascending ") {
                                        const sorter: CourseQueryResultSorter = new CourseQueryResultSorter();
                                        // tslint:disable-next-line:max-line-length
                                        const sorted = sorter.courseMergeSortAscending(cAggregateParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else if (cAggregateParser.orderKeys.length >= 1 &&
                                        cAggregateParser.sortingOrder === "descending ") {
                                        const sorter: CourseQueryResultSorter = new CourseQueryResultSorter();
                                        // tslint:disable-next-line:max-line-length
                                        const sorted = sorter.courseMergeSortDescending(cAggregateParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else {
                                        resolve({code: 200, body: {result: queryResult}});
                                    }
                                    resolve({code: 200, body: {result: queryResult}});
                                })
                                .catch(() => {
                                    reject(rejected);
                                });
                        }).catch(() => {
                        reject(rejected);
                    });
                } else {
                    reject(rejected);
                }
            } else if (that.isAggregate(query) && that.findQueryKind(query) === "rooms") {
                let rAggregateDataTransformer: RAggregateDataTransformer;
                let rAggregateParser: RAggregateParser;
                try {
                    rAggregateParser = new RAggregateParser(query);
                    rAggregateParser.parseQuery();
                } catch (e) {
                    reject(rejected);
                }
                if (that.hasRoomDatasetID(rAggregateParser.datasetKey.trim())) {
                    let filteredData: string[][] = [];
                    const dataset: string[][] = that.getRoomData(rAggregateParser.datasetKey.trim());
                    rAggregateDataTransformer = new RAggregateDataTransformer(rAggregateParser);
                    rAggregateDataTransformer.transformAllData(dataset, rAggregateParser.filterCriteria)
                        .then((data) => {
                            filteredData = data;
                            return rAggregateDataTransformer.makeFinalGroups(filteredData);
                        })
                        .then((groups) => {
                            rAggregateDataTransformer.applyAggregateToGroups(groups)
                                .then((lst) => {
                                    const queryResult: any[] = [];
                                    for (const x of lst) {
                                        const a: string = JSON.stringify(x);
                                        const b: JSON = JSON.parse(a);
                                        queryResult.push(b);
                                    }
                                    if (rAggregateParser.orderKeys.length >= 1 &&
                                        rAggregateParser.sortingOrder === "ascending ") {
                                        const sorter: RoomQueryResultSorter = new RoomQueryResultSorter();
                                        // tslint:disable-next-line:max-line-length
                                        const sorted = sorter.roomMergeSortAscending(rAggregateParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else if (rAggregateParser.orderKeys.length >= 1 &&
                                        rAggregateParser.sortingOrder === "descending ") {
                                        const sorter: RoomQueryResultSorter = new RoomQueryResultSorter();
                                        // tslint:disable-next-line:max-line-length
                                        const sorted = sorter.roomMergeSortDescending(rAggregateParser.orderKeys, queryResult);
                                        resolve({code: 200, body: {result: sorted}});
                                    } else {
                                        resolve({code: 200, body: {result: queryResult}});
                                    }
                                    resolve({code: 200, body: {result: queryResult}});
                                })
                                .catch(() => {
                                    reject(rejected);
                                });
                        }).catch(() => {
                        reject(rejected);
                    });
                } else {
                    reject(rejected);
                }
            } else {
                reject(rejected);
            }
        });
    }

    public listDatasets(): Promise<InsightResponse> {
        const data = this.getCurrentDatasets();
        return new Promise<InsightResponse>(function (resolve) {
            resolve({code: 200, body: {result: data}});
        });
    }

    private loadBase64Dataset(content: string, zip: JSZip): Promise<JSZip> {
        return new Promise<JSZip>(function (resolve, reject) {
            zip.loadAsync(content, {base64: true})
                .then((result) => {
                    resolve(result);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }

    private getCourseFileContents(zip: JSZip): Array<Promise<string>> {
        const files: Array<Promise<string>> = [];
        if (zip.folder(/^courses/)) {
            zip.forEach((relativePath, file) => {
                if (!file.dir && relativePath.includes(".csv")) {
                    const rawData = zip.file(relativePath).async("text");
                    files.push(rawData);
                } else if (file.dir && !file.name.includes("courses/")) {
                    throw new Error("");
                } else if (!file.dir && !file.name.includes(".csv")) {
                    throw new Error("");
                }
            });
        } else {
            throw new Error("Files must be stored in folder named 'courses'");
        }
        return files;
    }

    private getRoomFileContents(zip: JSZip): Array<Promise<string>> {
        const files: Array<Promise<string>> = [];
        zip.forEach((relativePath, file) => {
            if (!file.dir && file.name !== "index.xml") {
                const rawData = zip.file(relativePath).async("text");
                files.push(rawData);
            }
        });
        return files;
    }

    /* Helper method to determine type of query in performQuery method --> splits query string and returns the KIND key
     * of the DATASET section of a query
     */
    private findQueryKind(query: string): string {
        const firstSplit = query.split(",");
        const secondSplit = firstSplit[0].split(" ");
        return secondSplit[1];
    }

    private isAggregate(query: string): boolean {
        const split = query.split(",");
        return split[0].includes("grouped by ");
    }

    private getCurrentDatasets(): InsightDataset[] {
        return this.currentDatasets;
    }

    private getCourseData(id: string): string[][] {
        let data: string[][];
        for (const file of this.courseDataForQuery) {
            if (file !== undefined && file.id === id) {
                data = file.parsedData;
                break;
            }
        }
        return data;
    }

    private getRoomData(id: string): string[][] {
        let data: string[][];
        for (const file of this.roomsDataForQuery) {
            if (file !== undefined && file.id === id) {
                data = file.parsedData;
                break;
            }
        }
        return data;
    }

    private hasCourseDatasetID(id: string): boolean {
        let result = false;
        if (this.courseDataForQuery.length === 0) {
            return result;
        } else {
            for (const file of this.courseDataForQuery) {
                if ((file !== undefined || null) && file.id === id) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    private hasRoomDatasetID(id: string): boolean {
        let result = false;
        if (this.roomsDataForQuery.length === 0) {
            return result;
        } else {
            for (const file of this.roomsDataForQuery) {
                if ((file !== undefined || null) && file.id === id) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    private calculateRows(id: string): number {
        let count: number = 0;
        const data = this.getCourseData(id);
        for (const lst of data) {
            count += 1;
        }
        return count;
    }
}
