import {expect} from "chai";
import RoomSyntaxChecker from "../src/RoomQueryProcessing/RoomSyntaxChecker";
import Criteria from "../src/syntax&processing/Criteria";
import Log from "../src/Util";

// tslint:disable-next-line:max-line-length
const roomQuery1: string = "In rooms dataset rooms, find entries whose Full Name is \"Frank Forward\" and Seats is greater than 10; show Seats; sort in descending order by Seats.";
// tslint:disable-next-line:max-line-length
const roomQuery2: string = "In rooms dataset rooms, find entries whose Latitude is greater than 10; show Seats and Short Name; sort in descending order by Seats.";
// tslint:disable-next-line:max-line-length
const roomQuery3: string = "In rooms dataset rooms, find entries whose Seats is less than 30; show Short Name, Name, and Furniture; sort in descending order by Short Name.";
// tslint:disable-next-line:max-line-length
const roomQuery4: string = "In rooms dataset rooms, find entries whose Seats is less than 30; show Short Name, Name, and Seats; sort in ascending order by Short Name, Seats, and Name.";
// tslint:disable-next-line:max-line-length
const roomQuery5: string = "In rooms dataset rooms, find entries whose Seats is less than 30; show Short Name, Name, and Seats; sort in ascending order by Short Name, Furniture, and Name.";
// tslint:disable-next-line:max-line-length
const roomQuery6: string = "In rooms dataset rooms, find entries whose Latitude is greater than 10; show Full Name, Short Name, Furniture, and Seats; sort in descending order by Seats.";
describe("Tests for RoomSyntaxChecker methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Tests isValidFilter method on a room query with a multi-word Filter key", function () {
        const check: RoomSyntaxChecker = new RoomSyntaxChecker(roomQuery1);
        const result: boolean = check.isValidFilter();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay method on a room query with a 2 word Display key", function () {
        const check: RoomSyntaxChecker = new RoomSyntaxChecker(roomQuery2);
        const result: boolean = check.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidDisplay method on a room query with a multi-word Display key", function () {
        const check: RoomSyntaxChecker = new RoomSyntaxChecker(roomQuery6);
        const result: boolean = check.isValidDisplay();
        expect(result).to.equal(true);
    });

    it("Tests isValidOrder method on a room query with a multi-word Order key", function () {
        const check: RoomSyntaxChecker = new RoomSyntaxChecker(roomQuery3);
        const result: boolean = check.isValidOrder();
        expect(result).to.equal(true);
    });

    it("Tests isValidOrder method on a room query with multiple Order keys", function () {
        const check: RoomSyntaxChecker = new RoomSyntaxChecker(roomQuery4);
        const result: boolean = check.isValidOrder();
        expect(result).to.equal(true);
    });
    it("Tests isValidOrder method on a room query with Order not contained in display", function () {
        const check: RoomSyntaxChecker = new RoomSyntaxChecker(roomQuery5);
        const result: boolean = check.isValidOrder();
        expect(result).to.equal(false);
    });
});
