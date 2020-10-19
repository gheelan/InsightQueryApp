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
    private static insightController: InsightFacade;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
        Server.insightController = new InsightFacade();
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
                that.rest.use(
                    function crossOrigin(req, res, next) {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "X-Requested-With");
                        return next();
                    });

                // This is an example endpoint that you can invoke by accessing this URL in your browser:
                // http://localhost:4321/echo/1
                that.rest.get("/echo/:msg", Server.echo);

                // NOTE: your endpoints should go here
                // http://localhost:4321/dataset/myDataset/courses
                // http://localhost:4321/query
                that.rest.put("/dataset/:id/:kind", Server.putDataset);
                that.rest.post("/query", Server.postQuery);
                that.rest.del("/dataset/:id", Server.removeDataset);
                that.rest.get("/datasets", Server.getDatasets);

                // This must be the last endpoint!
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

    private static putDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        if (!req.params || !req.body) {
            return next(new BadRequestError());
        }
        try {
            const dataset = Buffer.from(req.body).toString("base64");
            Server.insightController.addDataset(req.params.id, dataset, req.params.kind)
                .then((response: InsightResponse) => {
                    res.json(response.code, response.body);
                })
                .catch((e: InsightResponse) => {
                    res.send(e.code, e.body);
                });
        } catch (e) {
            res.send(e);
        }
        return next();
    }

    private static postQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        try {
            const query = JSON.stringify(req.body);
            const queryString = query.toString();
            Server.insightController.performQuery(queryString)
                .then((response: InsightResponse) => {
                    res.json(response);
                }).catch((e: InsightResponse) => {
                res.json(e);
            });
        } catch (e) {
            res.json(e.code, {body: e.body});
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
                    res.send(response);
                }).catch((e: InsightResponse) => {
                res.send(e);
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
                    res.send(response);
                }).catch((e: InsightResponse) => {
                res.send(e);
            });
        } catch (e) {
            res.send(e);
        }
        return next();
    }

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.
    private static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace("Server::echo(..) - params: " + JSON.stringify(req.params));
        try {
            const result = Server.performEcho(req.params.msg);
            Log.info("Server::echo(..) - responding " + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error("Server::echo(..) - responding 400");
            res.json(400, {error: err.message});
        }
        return next();
    }

    private static performEcho(msg: string): InsightResponse {
        if (typeof msg !== "undefined" && msg !== null) {
            return {code: 200, body: {result: msg + "..." + msg}};
        } else {
            return {code: 400, body: {error: "Message not provided"}};
        }
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
