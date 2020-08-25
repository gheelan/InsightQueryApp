export default class Criteria {
    // tslint:disable-next-line:variable-name
    private _logicKey: string;
    // tslint:disable-next-line:variable-name
    private _key: string;
    // tslint:disable-next-line:variable-name
    private _op: string;
    // tslint:disable-next-line:variable-name
    private _val: string;

    constructor() {
        this._logicKey = "";
        this._key = "";
        this._op = "";
        this._val = "";
    }

    public getLogicKey(): string {
        return this._logicKey;
    }

    public getKey(): string {
        return this._key;
    }

    public getVal(): string {
        return this._val;
    }

    public getOp(): string {
        return this._op;
    }

    public setLogicKey(key: string) {
        this._logicKey = key;
    }

    public setKey(key: string) {
        this._key = key;
    }

    public setOp(op: string) {
        this._op = op;
    }

    public setVal(val: string) {
        if (!val) {
            this._val = null;
        } else if (val.startsWith("\"") && val.endsWith("\"")) {
            this._val = val;
        } else {
            this._val = val;
        }
    }
}
