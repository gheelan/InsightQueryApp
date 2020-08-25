export default class Scanner {
    public tokens: string[] = new Array<string>();
    // tslint:disable-next-line:max-line-length
    private regex: RegExp = new RegExp(/[A-Za-z]+\s|[A-Za-z]+|[0-9]*[.]?[0-9]+|-[0-9]*[.]?[0-9]+|[.;,]|"[^"]+"|[\w]+|"\w+"/g);

    constructor(s: string) {
        this.tokens = s.match(this.regex);
    }

    public peek(): string {
        return this.tokens.length > 0 ? this.tokens[0] : null;
    }

    public advance(): string {
        this.tokens.splice(0, 1);
        return this.tokens.length > 0 ? this.tokens[0] : null;
    }

    public getNext(): string {
        return this.tokens[1] ? this.tokens[1] : null;
    }

    public hasTokens(): boolean {
        return this.tokens !== null && this.tokens.length >= 1;
    }
}
