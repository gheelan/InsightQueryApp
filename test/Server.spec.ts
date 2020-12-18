import Server from "../src/rest/Server";
import chai = require("chai");
import chaiHttp = require("chai-http");
import Log from "../src/Util";
import * as fs from "fs";
import {expect} from "chai";

describe("Facade D3", function () {
    let server: Server = null;
    const datasetsToLoad: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        invalidDataset: "./test/data/emptyZip.zip",
        rooms: "./test/data/rooms.zip",
    };
    let datasets: { [id: string]: Buffer } = {};

    chai.use(chaiHttp);

    before(function () {
        for (const id of Object.keys(datasetsToLoad)) {
            datasets[id] = fs.readFileSync(datasetsToLoad[id]);
        }
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

    it("PUT courses dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .put("/dataset/courses/courses")
                .set("Content-Type", "application/x-zip-compressed")
                .send(datasets["courses"])
                .then((res) => {
                    expect(res.status).to.be.equal(204);
                })
                .catch(function () {
                    expect.fail();
                });
        } catch (err) {
            Log.test(err);
        }
    });

    it("PUT invalid dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .put("/dataset/courses/courses")
                .set("Content-Type", "application/x-zip-compressed")
                .send(datasets["invalidDataset"])
                .then((res) => {
                    expect(res.status).to.be.equal(400);
                })
                .catch(function (res) {
                    expect(res.status).to.be.equal(400);
                });
        } catch (err) {
            Log.test(err);
        }
    });

    it("POST test for courses query", function () {
        const serverURL = "http://localhost:4321";
        const query = {
            query: "In courses dataset courses, find entries whose Average is greater than 95; show Average.",
        };
        return chai.request(serverURL)
            .post("/query")
            .set("content-type", "application/json")
            .send(query)
            .then((res) => {
                Log.trace(res.body);
                expect(res.body.code).to.be.equal(200);
            })
            .catch((e) => {
                expect.fail(e);
            });
    });

    it("POST test for invalid courses query", function () {
        const serverURL = "http://localhost:4321";
        const invalidQuery = {
            query: "In courses dataset courses",
        };
        return chai.request(serverURL)
            .post("/query")
            .set("content-type", "application/json")
            .send(invalidQuery)
            .then((res) => {
                expect(res.body.code).to.be.equal(400);
            })
            .catch((e) => {
                expect.fail(e);
            });
    });
});
