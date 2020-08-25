import {ASTNode} from "parse5";
import {URL} from "url";
import * as http from "http";

export default class RoomDataset {
    public id: string;
    public parsedData: string[][] = [];

    constructor(id: string) {
        this.id = id;
    }

    public parseFiles(parsedXML: any[]) {
        for (const file of parsedXML) {
            this.parseBuildingData(file);
        }
    }

    // TODO: Make sure ASTNode is correct data type
    public parseBuildingData(buildingNode: ASTNode) {
        const precursor: any[] = [];
        const children: ASTNode = buildingNode.childNodes[2];
        for (const attribute of children.attrs) {
            precursor.push(attribute.value);
        }
        this.parseRoomNodes(buildingNode, precursor);
    }

    public async parseRoomNodes(obj: ASTNode, precursorList: any[]) {
        const roomNodesList = obj.childNodes[2].childNodes[1].childNodes;
        for (const node of roomNodesList) {
            if (node.nodeName === "room") {
                const lst = this.parseRoomNode(node);
                const joined = precursorList.concat(lst);
                // Creates the Name value
                joined.push(joined[0] + "_" + joined[3]);
                // const geoLocation = await this.getGeoLocation(joined[1]);
                // const lon: any = geoLocation.lon;
                // const lat: any = geoLocation.lat;
                // joined.push(lon);
                // joined.push(lat);
                this.parsedData.push(joined);
            }
        }
    }

    public parseRoomNode(roomNode: ASTNode): any[] {
        const result: any[] = [];
        // pushes roomNumber value to list
        result.push(roomNode.attrs[0].value);
        // pushes href value to list
        result.push(roomNode.childNodes[1].attrs[0].value);
        const finalNode = roomNode.childNodes[1].childNodes[1].attrs;
        // pushes seats, furniture, and type values
        for (const attribute of finalNode) {
            result.push(attribute.value);
        }
        return result;
    }

    public async getGeoLocation(address: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const url: URL = new URL(`http://sdmm.cs.ubc.ca:11316/api/v1/teamsecap_gheelan/${address}`);
            http.get(url, ((res) => {
                res.setEncoding("utf8");
                let rawData = "";
                res.on("data", (chunk) => {
                    rawData += chunk;
                });
                res.on("end", () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    } catch (e) {
                        reject(e.message);
                    }
                });
            }));
        });
    }
}
