import Server from "../src/rest/Server";
import chai = require("chai");
import chaiHttp = require("chai-http");
import Log from "../src/Util";
import * as fs from "fs";
import {expect} from "chai";

describe("Facade D3", function () {
    let server: Server = null;

    chai.use(chaiHttp);

    before(function () {
        try {
            server = new Server(4321);
            server.start()
                .then((hasStarted) => {
                    Log.trace("Server has started: " + hasStarted.toString());
                });
        } catch (e) {
            Log.error(e);
        }
    });

    after(function () {
        try {
            server.stop()
                .then((hasStopped) => {
                    Log.trace("Server has stopped: " + hasStopped.toString());
                });
        } catch (e) {
            Log.error(e);
        }
    });

    beforeEach(function () {
        // might want to add some process logging here to keep track of what"s going on
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    afterEach(function () {
        // might want to add some process logging here to keep track of what"s going on
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    it("PUT test for courses dataset", function () {
        const url: string = "/dataset/:id/:kind";
        fs.readFile("./test/data/courses.zip", function (err, data) {
            try {
                return chai.request("http://localhost:4321")
                    .put(url)
                    .attach("body", data, "courses.zip")
                    .then((res) => {
                        Log.info(res.body);
                        expect(res.status).to.be.equal(204);
                    })
                    .catch((e) => {
                        expect.fail(e);
                    });
            } catch (e) {
                Log.error(e);
            }
        });
    });

    it("PUT test for invalid courses dataset", function () {
        const url: string = "/dataset/:id/:kind";
        fs.readFile("./test/data/emptyZip.zip", function (err, data) {
            try {
                return chai.request("http://localhost:4321")
                    .put(url)
                    .attach("body", data, "emptyZip.zip")
                    .then((res) => {
                        expect(res.status).to.be.equal(400);
                    })
                    .catch((e) => {
                        expect.fail(e);
                    });
            } catch (e) {
                Log.error(e);
            }
        });
    });

    it("POST test for courses query", function () {
        const serverURL = "http://localhost:4321";
        const query = {
            query: "In courses dataset courses, find entries whose Average is greater than 95; show Average.",
        };
        return chai.request(serverURL)
            .post("/query")
            .send(query)
            .set("content-type", "application/json")
            .then((res) => {
                expect(res.status).to.be.equal(200);
            })
            .catch((err) => {
                Log.error(err);
                expect.fail();
            });
    });

    it("POST test for invalid courses query", function () {
        const serverURL = "http://localhost:4321";
        const query = {
            query: "",
        };
        return chai.request(serverURL)
            .post("/query")
            .send(query)
            .set("content-type", "application/json")
            .then((res) => {
                expect(res.status).to.be.equal(400);
            })
            .catch((err) => {
                Log.error(err);
                expect.fail();
            });
    });
});
// Hint on how to test PUT requests
/*
it("PUT test for courses dataset", function () {
    try {
        return chai.request(URL)
            .put(YOUR_PUT_URL)
            .attach("body", YOUR_COURSES_DATASET, COURSES_ZIP_FILENAME)
            .then((res) => {
                // some logging here please!
                expect(res.status).to.be.equal(204);
            })
            .catch(function (err) {
                // some logging here please!
                expect.fail();
            });
    } catch (err) {
        // and some more logging here!
    }
});
*/

// The other endpoints work similarly. You should be able to find all instructions at the chai-http documentation
