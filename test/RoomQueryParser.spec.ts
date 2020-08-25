import Log from "../src/Util";
import {expect} from "chai";
import RoomQueryParser from "../src/RoomQueryProcessing/RoomQueryParser";
import Criteria from "../src/syntax&processing/Criteria";
// tslint:disable-next-line:max-line-length
const roomQuery: string = "In rooms dataset rooms, find entries whose Seats is less than 30; show Full Name and Seats; sort in ascending order by Seats and Full Name.";
// tslint:disable-next-line:max-line-length
const roomQuery1: string = "In rooms dataset rooms, find entries whose Short Name includes \"A\"; show Short Name; sort in ascending order by Short Name.";
// tslint:disable-next-line:max-line-length
const roomQuery2: string = "In rooms dataset rooms, find entries whose Furniture includes \"Movable tables\" and Short Name is \"FORW\" or Seats is greater than 5; show Short Name and Seats; sort in ascending order by Seats.";
const roomParser: RoomQueryParser = new RoomQueryParser(roomQuery);
const roomParser1: RoomQueryParser = new RoomQueryParser(roomQuery1);
const roomParser2: RoomQueryParser = new RoomQueryParser(roomQuery2);
describe("Tests for RoomQueryParser methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("should parse a Room Filter with one m-key", async () => {
        const rp: RoomQueryParser = new RoomQueryParser(roomQuery);
        const expected: Criteria = new Criteria();
        rp.parseFilter();
        expected.setKey("Seats ");
        expected.setOp("is less than ");
        expected.setVal("30");
        expect(rp.filterCriteria[0]).to.deep.equal(expected);
    });
    it("should parse a Room Filter with one multi-word s-key", async () => {
        roomParser1.parseFilter();
        const expected: Criteria = new Criteria();
        expected.setKey("Short Name ");
        expected.setOp("includes ");
        expected.setVal("\"A\"");
        expect(roomParser1.filterCriteria[0]).to.deep.equal(expected);
    });
    it("should parse a Room Filter with multiple types of keys", async () => {
        const expected: Criteria = new Criteria();
        const expected1: Criteria = new Criteria();
        const expected2: Criteria = new Criteria();
        roomParser2.parseFilter();
        expected.setKey("Furniture ");
        expected.setOp("includes ");
        expected.setVal("\"Movable tables\"");
        expected1.setLogicKey("and ");
        expected1.setKey("Short Name ");
        expected1.setOp("is ");
        expected1.setVal("\"FORW\"");
        expected2.setLogicKey("or ");
        expected2.setKey("Seats ");
        expected2.setOp("is greater than ");
        expected2.setVal("5");
        expect(roomParser2.filterCriteria[0]).to.deep.equal(expected);
        expect(roomParser2.filterCriteria[1]).to.deep.equal(expected1);
        expect(roomParser2.filterCriteria[2]).to.deep.equal(expected2);
    });

    it("should parse a Room Display with one multi-word key", async () => {
        const expected: string[] = ["Short Name"];
        roomParser1.parseDisplay();
        expect(roomParser1.displayKeys).to.deep.equal(expected);
    });
    it("should parse a Room Display with multiple different keys", async () => {
        const expected: string[] = ["Short Name ", "Seats"];
        roomParser2.parseDisplay();
        expect(roomParser2.displayKeys).to.deep.equal(expected);

    });
    it("should parse a Room Order with one multi-word key", async () => {
        const expected: any[] = [{key: "Short Name", title: null}];
        roomParser1.parseOrder();
        expect(roomParser1.orderKeys).to.deep.equal(expected);

    });
    it("should parse a Room Order with multiple different keys", async () => {
        const expected: any[] = [{key: "Seats", title: null}, {key: "Full Name", title: null}];
        roomParser.parseOrder();
        expect(roomParser.orderKeys).to.deep.equal(expected);
    });
});
