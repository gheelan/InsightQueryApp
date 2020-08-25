import Criteria from "./Criteria";
import QueryProcessor from "./QueryProcessor";

export default abstract class SyntaxChecker extends QueryProcessor {
    public courseMKeys: string[] = ["Average", "Pass", "Fail", "Audit", "Year"];
    public roomMKeys: string[] = ["Latitude", "Longitude", "Seats"];
    public courseSKeys: string[] = ["Department", "ID", "Instructor", "Title", "UUID"];
    public roomSKeys: string[] = ["Full Name", "Short Name", "Number", "Name", "Address", "Type", "Furniture", "Link"];
    public keywords: string[] = ["in", "dataset", "find", "all", "show", "and", "or",
        "sort", "by", "entries", "grouped", "where", "is", "the", "of", "whose"];
    protected mOps: string[] = ["is greater than ", "is less than ", "is equal to ",
        "is not greater than ", "is not less than ", "is not equal to "];
    protected sOps: string[] = ["is ", "is not ", "includes ", "does not include ", "begins with ",
        "does not begin with ", "ends with ", "does not end with "];
    protected orderPrefixAsc: string = "sort in ascending order by ";
    protected orderPrefixDesc: string = "sort in descending order by ";

    constructor(query: string) {
        super(query);
    }

    public checkQuery(): boolean {
        return (this.isValidDataset() && this.isValidFilter()
            && this.isValidDisplay() && this.isValidOrder());
    }

    protected isValidFilterPrefix(): boolean {
        const lst: string[] = this.filter.split(" ");
        return (lst[0] === "find" &&
            lst[1] === "all" &&
            lst[2] === "entries" &&
            this.isValidKey(lst[3]) ||
            this.isValidKey(lst[3] + " " + lst[4])) ||
            (lst[0] === "find" &&
                lst[1] === "entries" &&
                lst[2] === "whose" &&
                this.isValidKey(lst[3]) ||
                this.isValidKey(lst[3] + " " + lst[4])) ||
            (lst[0] === "find" &&
                lst[1] === "all" &&
                lst[2] === "entries");
    }

    protected abstract isValidDataset(): boolean;

    protected abstract isValidFilter(): boolean;

    protected abstract buildCriteria(): Criteria[];

    protected abstract isValidDisplay(): boolean;

    protected abstract isValidOrder(): boolean;

    protected abstract isValidKey(key: string): boolean;

}
