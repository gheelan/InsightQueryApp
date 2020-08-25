import RoomDataPoint from "./RoomDataPoint";

export default class RAggregateDataPoint extends RoomDataPoint {
    public "overallAvg": number;
    public "overallMin": number;
    public "overallMax": number;
    public "overallSum": number;
    public "overallCount": number;

    constructor(indices: number[], data: string[]) {
        super(indices, data);
    }

    public setAVG(avg: number) {
        this.overallAvg = avg;
    }

    public setMIN(min: number) {
        this.overallMin = min;
    }

    public setMAX(max: number) {
        this.overallMax = max;
    }

    public setSUM(sum: number) {
        this.overallSum = sum;
    }

    public setCOUNT(count: number) {
        this.overallCount = count;
    }

}
