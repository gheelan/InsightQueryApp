import Log from "../src/Util";
import {expect} from "chai";
import RAggregateParser from "../src/RoomQueryProcessing/RAggregateParser";

// tslint:disable-next-line:max-line-length
const aggQuery1: string = "In rooms dataset rooms grouped by Full Name, find entries whose Full Name is \"Brock Hall Annex\"; show Full Name and avgSeats, where avgSeats is the AVG of Seats; sort in ascending order by avgSeats and Full Name.";
// tslint:disable-next-line:max-line-length
const aggQuery2: string = "In rooms dataset rooms grouped by Short Name, Seats and Furniture, find entries whose Seats is greater than 25 and Furniture includes \"Movable Chairs\"; show Seats, Full Name, avgSeats, minSeats and sumSeats, where avgSeats is the AVG of Seats, minSeats is the MIN of Seats and sumSeats is the SUM of Seats; sort in ascending order by Seats, avgSeats, sumSeats and minSeats.";
const parserSimple: RAggregateParser = new RAggregateParser(aggQuery1);
const parserComplex: RAggregateParser = new RAggregateParser(aggQuery2);
describe("Tests for room aggregate query parser methods", function () {
    before(function () {
        parserSimple.parseDisplay();
        parserSimple.parseOrder();
        parserComplex.parseDisplay();
        parserComplex.parseOrder();
    });
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Checks that aggregates are being parsed correctly in display ", function () {
        const result: any[] = parserSimple.aggCriteria;
        // tslint:disable-next-line:max-line-length
        const expected = [{title: "avgSeats", aggKey: "AVG", key: "Seats"}];
        expect(result).to.deep.equal(expected);
    });

    it("Checks that aggregates are being parsed correctly in display (multiple) ", function () {
        const result: any[] = parserComplex.aggCriteria;
        // tslint:disable-next-line:max-line-length
        const expected = [{title: "avgSeats", aggKey: "AVG", key: "Seats"},
            {title: "minSeats", aggKey: "MIN", key: "Seats"},
            {title: "sumSeats", aggKey: "SUM", key: "Seats"}];
        expect(result).to.deep.equal(expected);
    });

    it("Tests that parseDisplay is parsing the correct display keys (standard key/agg)", function () {
        const result: any[] = parserSimple.displayKeys;
        const expected = ["Full Name", "avgSeats"];
        expect(result).to.deep.equal(expected);
    });

    it("Tests that parseDisplay is parsing the correct display keys (multiple aggs)", function () {
        const result: any[] = parserComplex.displayKeys;
        const expected = ["Seats", "Full Name", "avgSeats", "minSeats", "sumSeats"];
        expect(result).to.deep.equal(expected);
    });

    it("Tests that parseOrder is parsing the correct order keys (mix of S-key and custom)", function () {
        const result: any[] = parserSimple.orderKeys;
        const expected = [{key: "AVG", title: "avgSeats"}, {key: "Full Name", title: null}];
        expect(result).to.deep.equal(expected);
    });

    it("Tests that parseOrder is parsing the correct order keys (only custom keys)", function () {
        const result: any[] = parserComplex.orderKeys;
        const expected = [{key: "Seats", title: null},
            {key: "AVG", title: "avgSeats"},
            {key: "SUM", title: "sumSeats"},
            {key: "MIN", title: "minSeats"}];
        expect(result).to.deep.equal(expected);
    });
});
