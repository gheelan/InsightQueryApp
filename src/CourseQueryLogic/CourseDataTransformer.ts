import CourseQueryParser from "../CourseQueryProcessing/CourseQueryParser";
import CAggregateDataPoint from "./CAggregateDataPoint";
import DataTransformer from "../DataTransformer";

export default class CourseDataTransformer extends DataTransformer {

    constructor(courseParser: CourseQueryParser) {
        super(courseParser);
    }

    public listDataPoints(keyIndices: number[], data: string[][]): Promise<CAggregateDataPoint[]> {
        return new Promise<any[]>((resolve) => {
            if (!data) {
                throw new Error();
            } else {
                const result: any[] = [];
                for (const file of data) {
                    const dataPoint: CAggregateDataPoint = new CAggregateDataPoint(keyIndices, file);
                    result.push(dataPoint);
                }
                resolve(result);
            }
        });
    }

    // TODO: will probably have to refactor this to resemble findDisplayKeyIndices
    public findFilterKeyIndex(key: string): number {
        const trimmedKey: string = key.trim();
        switch (trimmedKey) {
            case "Title": {
                return 0;
            }
            case "UUID": {
                return 1;
            }
            case "Instructor": {
                return 2;
            }
            case "Audit": {
                return 3;
            }
            case "Year": {
                return 4;
            }
            case "ID": {
                return 5;
            }
            case "Pass": {
                return 6;
            }
            case "Fail": {
                return 7;
            }
            case "Average": {
                return 8;
            }
            case "Department": {
                return 9;
            }
        }
    }

    // Creates a list of indices that correspond to the index of a given data point in a File[] object
    public findDisplayKeyIndices(keys: string[]): number[] {
        const indices: number[] = [];
        for (const key of keys) {
            const trimmedKey: string = key.trim();
            if (trimmedKey === "Title") {
                indices.push(0);
            } else if (trimmedKey === "UUID") {
                indices.push(1);
            } else if (trimmedKey === "Instructor") {
                indices.push(2);
            } else if (trimmedKey === "Audit") {
                indices.push(3);
            } else if (trimmedKey === "Year") {
                indices.push(4);
            } else if (trimmedKey === "ID") {
                indices.push(5);
            } else if (trimmedKey === "Pass") {
                indices.push(6);
            } else if (trimmedKey === "Fail") {
                indices.push(7);
            } else if (trimmedKey === "Average") {
                indices.push(8);
            } else if (trimmedKey === "Department") {
                indices.push(9);
            }
        }
        return indices;
    }
}
