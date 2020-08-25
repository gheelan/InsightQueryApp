import CourseQueryParser from "../CourseQueryProcessing/CourseQueryParser";
import Criteria from "../syntax&processing/Criteria";
import CourseDataPoint from "../CourseQueryLogic/CourseDataPoint";
import RoomQueryParser from "../RoomQueryProcessing/RoomQueryParser";
import RoomDataPoint from "./RoomDataPoint";
import RAggregateDataPoint from "./RAggregateDataPoint";
import DataTransformer from "../DataTransformer";

export default class RoomDataTransformer extends DataTransformer {

    constructor(roomQueryParser: RoomQueryParser) {
        super(roomQueryParser);
    }

    // TODO: Need to refactor DataPoint classes
    public listDataPoints(keyIndices: number[], data: string[][]): Promise<RAggregateDataPoint[]> {
        return new Promise<any[]>((resolve) => {
            if (!data) {
                throw new Error();
            } else {
                const result: any[] = [];
                for (const file of data) {
                    const dataPoint: RAggregateDataPoint = new RAggregateDataPoint(keyIndices, file);
                    result.push(dataPoint);
                }
                resolve(result);
            }
        });
    }

    // TODO: will probably have to refactor this to resemble findDisplayKeyIndices
    public findFilterKeyIndex(key: string): number {
        const trimmedKey = key.trim();
        switch (trimmedKey) {
            case "Short Name": {
                return 0;
            }
            case "Address": {
                return 1;
            }
            case "Full Name": {
                return 2;
            }
            case "Number": {
                return 3;
            }
            case "Link": {
                return 4;
            }
            case "Seats": {
                return 5;
            }
            case "Furniture": {
                return 6;
            }
            case "Type": {
                return 7;
            }
            case "Name": {
                return 8;
            }
            case "Latitude": {
                return 9;
            }
            case "Longitude": {
                return 10;
            }
        }
    }

    // Creates a list of indices that correspond to the index of a given data point in a File[] object
    public findDisplayKeyIndices(keys: string[]): number[] {
        const indices: number[] = [];
        for (const key of keys) {
            const trimmedKey = key.trim();
            if (trimmedKey === "Short Name") {
                indices.push(0);
            } else if (trimmedKey === "Address") {
                indices.push(1);
            } else if (trimmedKey === "Full Name") {
                indices.push(2);
            } else if (trimmedKey === "Number") {
                indices.push(3);
            } else if (trimmedKey === "Link") {
                indices.push(4);
            } else if (trimmedKey === "Seats") {
                indices.push(5);
            } else if (trimmedKey === "Furniture") {
                indices.push(6);
            } else if (trimmedKey === "Type") {
                indices.push(7);
            } else if (trimmedKey === "Name") {
                indices.push(8);
            } else if (trimmedKey === "Latitude") {
                indices.push(9);
            } else if (trimmedKey === "Longitude") {
                indices.push(10);
            }
        }
        return indices;
    }
}
