export default class CourseDataset {
    public id: string;
    public parsedData: string[][] = [];

    constructor(id: string) {
        this.id = id;
    }

    // Processes rows from a CSV file that are currently strings into a multi-dimensional array that contains rows and
    // columns for the data to be sorted on --> Ex. parsedData[i][8] will always return an Average, if it's present
    public parseData(rawData: string[][]) {
        for (const lst of rawData) {
            if (lst.length > 2) {
                for (let i = 1; i < lst.length - 1; i++) {
                    this.parsedData.push(lst[i].split("|"));
                }
            }
        }
    }
}
