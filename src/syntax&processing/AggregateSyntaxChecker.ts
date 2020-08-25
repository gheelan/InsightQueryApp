import Scanner from "./Scanner";
import QueryProcessor from "./QueryProcessor";
import SyntaxChecker from "./SyntaxChecker";

export abstract class AggregateSyntaxChecker extends SyntaxChecker {
    public aggKeys: string[] = ["MAX", "MIN", "AVG", "SUM", "COUNT"];

    protected isValidAggregation(scanner: Scanner): boolean {
        const aggScanner = scanner;
        if (this.isValidAggInput(aggScanner.peek()) &&
            this.display.includes(aggScanner.peek().trim()) &&
            aggScanner.advance() === "is " &&
            aggScanner.advance() === "the " &&
            this.aggKeys.includes(aggScanner.advance().trim())) {
            if ((aggScanner.peek().trim() === "MIN" ||
                aggScanner.peek().trim() === "MAX" ||
                aggScanner.peek().trim() === "AVG") &&
                aggScanner.advance() === "of ") {
                aggScanner.advance();
                if (this.courseMKeys.includes(aggScanner.peek().trim()) ||
                    this.roomMKeys.includes(aggScanner.peek().trim())) {
                    aggScanner.advance();
                    if (aggScanner.peek() === "," || aggScanner.peek() === "and ") {
                        aggScanner.advance();
                        return this.isValidAggregation(aggScanner);
                    } else {
                        return true;
                    }
                }
            } else if (aggScanner.advance() === "of " && this.isValidKey(aggScanner.advance())) {
                if (aggScanner.getNext() === "," || aggScanner.getNext() === "and ") {
                    aggScanner.advance();
                    aggScanner.advance();
                    return this.isValidAggregation(aggScanner);
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    protected isValidAggInput(aggInput: string): boolean {
        const trimmedString: string = aggInput.trim();
        return !this.isValidKey(trimmedString) &&
            !this.keywords.includes(trimmedString) &&
            !this.sOps.includes(trimmedString) &&
            !this.mOps.includes(trimmedString) &&
            !trimmedString.includes("_") &&
            !trimmedString.includes(",");
    }

}
