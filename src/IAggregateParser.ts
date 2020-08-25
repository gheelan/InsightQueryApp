import Scanner from "./syntax&processing/Scanner";

export interface IAggregateParser {
     aggGroupKeys: string[];
     aggCriteria: any[];
     aggKeys: string[];

     parseAggregation(scanner: Scanner): any;
     isValidAggInput(aggInput: string): boolean;
}
