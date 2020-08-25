import Log from "../src/Util";
import {expect} from "chai";
import RAggregateSyntaxChecker from "../src/RoomQueryProcessing/RAggregateSyntaxChecker";

// tslint:disable-next-line:max-line-length
const aggQuery1: string = "In rooms dataset rooms grouped by Full Name, find entries whose Full Name is \"Brock Hall Annex\"; show Full Name and avgSeats, where avgSeats is the AVG of Seats; sort in ascending order by avgSeats and Full Name.";
// tslint:disable-next-line:max-line-length
const aggQuery2: string = "In rooms dataset rooms grouped by Full Name, Address and Seats, find entries whose Seats is less than 30 and Address includes \"7\"; show Full Name, Address, sumSeats and minSeats, where sumSeats is the SUM of Seats and minSeats is the MIN of Seats; sort in ascending order by Full Name, Address, sumSeats and minSeats.";
// tslint:disable-next-line:max-line-length
const aggQuery3: string = "In rooms dataset rooms grouped by Full Name, Address and Seats, find entries whose Seats is less than 30 and Address includes \"7\"; show sumSeats, where sumSeats is the SUM of Seats; sort in ascending order by sumSeats.";
const checkSimple: RAggregateSyntaxChecker = new RAggregateSyntaxChecker(aggQuery1);
const checkComplex: RAggregateSyntaxChecker = new RAggregateSyntaxChecker(aggQuery2);
const checkReallySimple: RAggregateSyntaxChecker = new RAggregateSyntaxChecker(aggQuery3);
describe("Tests for room aggregate query syntax check methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests isValidDataset on Aggregate dataset with one key", function () {
        const result: boolean = checkSimple.isValidDataset();
        expect(result).to.equal(true);
    });

    it("Tests isValidDataset on Aggregate dataset with multiple keys", function () {
        const result: boolean = checkComplex.isValidDataset();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay/isValidAggregate on Aggregate display with 1 agg_def", function () {
        const result: boolean = checkReallySimple.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay/isValidAggregate on Aggregate display with 2 agg_defs", function () {
        const result: boolean = checkSimple.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay/isValidAggregate on Aggregate display with multiple agg_defs", function () {
        const result: boolean = checkComplex.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidOrder on Aggregate display with 2 agg_defs", function () {
        const result: boolean = checkSimple.isValidOrder();
        expect(result).to.equal(true);
    });

    it("Tests isValidOrder on Aggregate display with multiple agg_defs", function () {
        const result: boolean = checkComplex.isValidOrder();
        expect(result).to.equal(true);
    });
});
