import Log from "../src/Util";
import {expect} from "chai";
import RoomDataset from "../src/RoomQueryLogic/RoomDataset";

describe("Tests for RoomDataset methods", function () {
    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    it("Should return a GeoLocation object", async () => {
        const roomDataset = new RoomDataset("test");
        const result: any = await roomDataset.getGeoLocation("6245 Agronomy Road V6T 1Z4");
        const expected: any = {lat: 49.26125, lon: -123.24807};
        expect(result).to.deep.equal(expected);
    });
    it("Tests parseFile method on a  object", async () => {
        const roomDataset = new RoomDataset("test");
        const result: any = await roomDataset.getGeoLocation("6245 Agronomy Road V6T 1Z4");
        const expected: any = {lat: 49.26125, lon: -123.24807};
        expect(result).to.deep.equal(expected);
    });
});
