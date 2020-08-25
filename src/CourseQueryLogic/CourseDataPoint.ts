export default class CourseDataPoint {
    public "courses_avg": number;
    public "courses_id": string;
    public "courses_instructor": string;
    public "courses_title": string;
    public "courses_pass": number;
    public "courses_fail": number;
    public "courses_audit": number;
    public "courses_year": number;
    public "courses_uuid": string;
    public "courses_dept": string;
    // Initializes only the fields needed for a specific query
    constructor(indices: number[], data: string[]) {
        for (const ind of indices) {
            if (ind === 0) {
                this.courses_title = data[0];
            }
            if (ind === 1) {
                this.courses_uuid = data[1];
            }
            if (ind === 2) {
                this.courses_instructor = data[2];
            }
            if (ind === 3) {
                this.courses_audit = Number(data[3]);
            }
            if (ind === 4) {
                this.courses_year = Number(data[4]);
            }
            if (ind === 5) {
                this.courses_id = data[5];
            }
            if (ind === 6) {
                this.courses_pass = Number(data[6]);
            }
            if (ind === 7) {
                this.courses_fail = Number(data[7]);
            }
            if (ind === 8) {
                this.courses_avg = Number(data[8]);
            }
            if (ind === 9) {
                this.courses_dept = data[9];
            }
        }
    }
}
