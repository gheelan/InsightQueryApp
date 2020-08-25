export default class RoomDataPoint {
    public "rooms_shortname": string;
    public "rooms_address": string;
    public "rooms_fullname": string;
    public "rooms_number": string;
    public "rooms_href": string;
    public "rooms_seats": number;
    public "rooms_furniture": string;
    public "rooms_type": string;
    public "rooms_name": string;
    public "rooms_lat": number;
    public "rooms_lon": number;
    // Initializes only the fields needed for a specific query
    constructor(indices: number[], data: string[]) {
        for (const ind of indices) {
            if (ind === 0) {
                this.rooms_shortname = data[0];
            }
            if (ind === 1) {
                this.rooms_address = data[1];
            }
            if (ind === 2) {
                this.rooms_fullname = data[2];
            }
            if (ind === 3) {
                this.rooms_number = data[3];
            }
            if (ind === 4) {
                this.rooms_href = data[4];
            }
            if (ind === 5) {
                this.rooms_seats = Number(data[5]);
            }
            if (ind === 6) {
                this.rooms_furniture = data[6];
            }
            if (ind === 7) {
                this.rooms_type = data[7];
            }
            if (ind === 8) {
                this.rooms_name = data[8];
            }
            if (ind === 9) {
                this.rooms_lat = Number(data[9]);
            }
            if (ind === 10) {
                this.rooms_lon = Number(data[10]);
            }
        }
    }
}
