import Scanner from "./Scanner";

// Ensures query follows proper syntax and grammar rules and processes query into distinct sections
export default abstract class QueryProcessor {
    public dataset: string;
    public filter: string;
    public display: string;
    public order: string;
    public mainScanner: Scanner;
    private query: string;

    protected constructor(query: string) {
        this.mainScanner = new Scanner(query);
        this.query = query;
        if (this.checkSyntax()) {
            try {
                const lst: string[] = this.query.split(";");
                // Used this as a way to set the FILTER field without needing to split at commas, this resolves
                // an issue where filter values containing commas were causing strings to be split incorrectly
                const filterStartIndex: number = lst[0].indexOf("find");
                this.dataset = lst[0].slice(0, filterStartIndex - 2);
                this.filter = lst[0].slice(filterStartIndex, lst[0].length);
                this.display = lst[1].trim();
                if (lst[2]) {
                    this.order = lst[2].trim();
                } else {
                    this.order = "";
                }
            } catch (e) {
                throw new Error("Invalid query: Please ensure proper usage of symbols and keywords");
            }
        } else {
            throw new Error("Invalid query: improper syntax used, please ensure proper usage of symbols and keywords");
        }
    }

    // Checks that all symbols and characters are valid
    // * Could keep access to tokens private and use peek/advance methods for this function as well
    public checkSyntax(): boolean {
        const syntaxScanner: Scanner = new Scanner(this.query);
        let checked: string = "";
        checked += syntaxScanner.peek();
        syntaxScanner.advance();
        while (syntaxScanner.hasTokens()) {
            if (syntaxScanner.peek() === "," || syntaxScanner.peek() === ";" ||
                ((syntaxScanner.peek().startsWith("\"") && syntaxScanner.peek().endsWith("\"") &&
                syntaxScanner.getNext() !== ";"))) {
                checked += syntaxScanner.peek() + " ";
                syntaxScanner.advance();
            } else if (syntaxScanner.peek().startsWith("\"") && syntaxScanner.peek().endsWith("\"") &&
                (syntaxScanner.getNext() === ";")) {
                checked += syntaxScanner.peek();
                syntaxScanner.advance();
            } else if (!isNaN(Number(syntaxScanner.peek())) && (syntaxScanner.getNext() !== ";")) {
                checked += syntaxScanner.peek() + " ";
                syntaxScanner.advance();
            } else {
                checked += syntaxScanner.peek();
                syntaxScanner.advance();
            }
        }
        return checked === this.query && this.query.endsWith(".");
    }

    protected abstract isValidKey(key: string): boolean;
}
