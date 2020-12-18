/**
 * Created by rtholmes on 2016-06-19.
 */

import fs = require("fs");
import restify = require("restify");
import Log from "../Util";
import {InsightResponse} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";
import {BadRequestError} from "restify";

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;
    protected static insightController: InsightFacade = new InsightFacade();

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info("Server::close()");
        const that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        const that = this;
        return new Promise(function (fulfill, reject) {
            try {
                Log.info("Server::start() - start");

                that.rest = restify.createServer({
                    name: "insightUBC",
                });
                that.rest.use(restify.bodyParser({mapFiles: true, mapParams: true}));
                that.rest.use(
                    function crossOrigin(req, res, next) {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "X-Requested-With");
                        return next();
                    });

                // NOTE: your endpoints should go here
                that.rest.put("/dataset/:id/:kind", Server.addDataset);
                that.rest.post("/query", Server.postQuery);
                that.rest.del("/dataset/:id", Server.removeDataset);
                that.rest.get("/datasets", Server.getDatasets);
                that.rest.get("/.*", Server.getStatic);

                that.rest.listen(that.port, function () {
                    Log.info("Server::start() - restify listening: " + that.rest.url);
                    fulfill(true);
                });

                that.rest.on("error", function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal
                    // node not using normal exceptions here
                    Log.info("Server::start() - restify ERROR: " + err);
                    reject(err);
                });

            } catch (err) {
                Log.error("Server::start() - ERROR: " + err);
                reject(err);
            }
        });
    }

    private static addDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        let id  = req.params.id;
        let kind = req.params.kind;
        if (!req.params || !req.body) {
            return next(new BadRequestError());
        }
        const dataset = Buffer.from(req.body).toString("base64");
        Server.insightController.addDataset(id, dataset, kind)
            .then((response: InsightResponse) => {
                res.json(204, {result: response});
            })
            .catch((e: InsightResponse) => {
                res.json(400, {result: e});
            });
        return next();
    }

    private static postQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        let query = req.body.query;
        if (!query) {
            return next(new BadRequestError());
        } else {
            Server.insightController.performQuery(query)
                .then((response) => {
                    res.json(200, {result: response});
                })
                .catch((e) => {
                    res.json(400, {result: e});
                });
        }
        return next();
    }

    public static removeDataset(req: restify.Request, res: restify.Response, next: restify.Next): InsightResponse {
        if (!req.params || !req.body) {
            return next(new BadRequestError());
        }
        try {
            Server.insightController.removeDataset(req.params.id)
                .then((response: InsightResponse) => {
                    res.json(200, {result: response});
                }).catch((e: InsightResponse) => {
                res.json(404, {result: e});
            });
        } catch (e) {
            res.send(e);
        }
        return next();
    }

    public static getDatasets(req: restify.Request, res: restify.Response, next: restify.Next): InsightResponse {
        if (!req.body) {
            return next(new BadRequestError());
        }
        try {
            Server.insightController.listDatasets()
                .then((response: InsightResponse) => {
                    res.json(200, {result: response});
                }).catch((e: InsightResponse) => {
                res.json(400, {result: e});
            });
        } catch (e) {
            res.send(e);
        }
        return next();
    }

    private static getStatic(req: restify.Request, res: restify.Response, next: restify.Next) {
        const publicDir = "frontend/public/";
        Log.trace("RoutHandler::getStatic::" + req.url);
        let path = publicDir + "index.html";
        if (req.url !== "/") {
            path = publicDir + req.url.split("/").pop();
        }
        fs.readFile(path, function (err: Error, file: Buffer) {
            if (err) {
                res.send(500);
                Log.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }
}
