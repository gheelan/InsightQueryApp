import CourseDataPoint from "./CourseDataPoint";
import {isNumber} from "util";
import CAggregateDataPoint from "./CAggregateDataPoint";

export default class CourseQueryResultSorter {

    public courseMergeSortAscending(orderKeys: any[], unsortedArray: CAggregateDataPoint[]): CAggregateDataPoint[] {
        if (unsortedArray.length <= 1) {
            return unsortedArray;
        }
        const middle = Math.floor(unsortedArray.length / 2);
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);

        // Using recursion to combine the left and right
        // tslint:disable-next-line:max-line-length
        return this.mergeAscending(orderKeys, this.courseMergeSortAscending(orderKeys, left), this.courseMergeSortAscending(orderKeys, right));
    }

    public courseMergeSortDescending(orderKeys: any[], unsortedArray: CAggregateDataPoint[]): CAggregateDataPoint[] {
        if (unsortedArray.length <= 1) {
            return unsortedArray;
        }
        const middle = Math.floor(unsortedArray.length / 2);
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);

        // Using recursion to combine the left and right
        // tslint:disable-next-line:max-line-length
        return this.mergeDescending(orderKeys, this.courseMergeSortDescending(orderKeys, left), this.courseMergeSortDescending(orderKeys, right));
    }

// Merge the two arrays: left and right
    private mergeAscending(sortKeys: any[], left: CAggregateDataPoint[], right: CAggregateDataPoint[]): any[] {
        const resultArray: CAggregateDataPoint[] = [];
        let leftIndex = 0;
        let rightIndex = 0;
        const sortKey: string = sortKeys[0].key.trim();

        while (leftIndex < left.length && rightIndex < right.length) {
            if (sortKey === "Title") {
                if (left[leftIndex].courses_title < right[rightIndex].courses_title) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_title === right[rightIndex].courses_title && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "UUID") {
                if (left[leftIndex].courses_uuid < right[rightIndex].courses_uuid) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_uuid === right[rightIndex].courses_uuid && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Instructor") {
                if (left[leftIndex].courses_instructor < right[rightIndex].courses_instructor) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                    // tslint:disable-next-line:max-line-length
                } else if (left[leftIndex].courses_instructor === right[rightIndex].courses_instructor && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Audit") {
                if (left[leftIndex].courses_audit < right[rightIndex].courses_audit) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_audit === right[rightIndex].courses_audit && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "ID") {
                if (left[leftIndex].courses_id < right[rightIndex].courses_id) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_id === right[rightIndex].courses_id && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Pass") {
                if (left[leftIndex].courses_pass < right[rightIndex].courses_pass) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_pass === right[rightIndex].courses_pass && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Fail") {
                if (left[leftIndex].courses_fail < right[rightIndex].courses_fail) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_fail === right[rightIndex].courses_fail && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Average") {
                if (left[leftIndex].courses_avg < right[rightIndex].courses_avg) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_avg === right[rightIndex].courses_avg && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Department") {
                if (left[leftIndex].courses_dept < right[rightIndex].courses_dept) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_dept === right[rightIndex].courses_dept && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Year") {
                if (left[leftIndex].courses_year < right[rightIndex].courses_year) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_year === right[rightIndex].courses_year && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "AVG") {
                if (left[leftIndex].overallAvg < right[rightIndex].overallAvg) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallAvg === right[rightIndex].overallAvg && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "MIN") {
                if (left[leftIndex].overallMin < right[rightIndex].overallMin) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallMin === right[rightIndex].overallMin && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "MAX") {
                if (left[leftIndex].overallMax < right[rightIndex].overallMax) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallMax === right[rightIndex].overallMax && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "SUM") {
                if (left[leftIndex].overallSum < right[rightIndex].overallSum) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallSum === right[rightIndex].overallSum && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "COUNT") {
                if (left[leftIndex].overallCount < right[rightIndex].overallCount) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallCount === right[rightIndex].overallCount && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            }
        }
        // We need to concat to the resultArray because there will be one element left over after the while loop
        return resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }

    private mergeDescending(sortKeys: any[], left: CAggregateDataPoint[], right: CAggregateDataPoint[]): any[] {
        const resultArray: CAggregateDataPoint[] = [];
        let leftIndex = 0;
        let rightIndex = 0;
        const sortKey: string = sortKeys[0].key.trim();

        while (leftIndex < left.length && rightIndex < right.length) {
            if (sortKey === "Title") {
                if (left[leftIndex].courses_title > right[rightIndex].courses_title) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_title === right[rightIndex].courses_title && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "UUID") {
                if (left[leftIndex].courses_uuid > right[rightIndex].courses_uuid) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_uuid === right[rightIndex].courses_uuid && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Instructor") {
                if (left[leftIndex].courses_instructor > right[rightIndex].courses_instructor) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_instructor === right[rightIndex].courses_instructor &&
                    sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Audit") {
                if (left[leftIndex].courses_audit > right[rightIndex].courses_audit) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_audit === right[rightIndex].courses_audit && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "ID") {
                if (left[leftIndex].courses_id > right[rightIndex].courses_id) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_id === right[rightIndex].courses_id && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Pass") {
                if (left[leftIndex].courses_pass > right[rightIndex].courses_pass) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_pass === right[rightIndex].courses_pass && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Fail") {
                if (left[leftIndex].courses_fail > right[rightIndex].courses_fail) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_fail === right[rightIndex].courses_fail && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Average") {
                if (left[leftIndex].courses_avg > right[rightIndex].courses_avg) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_avg === right[rightIndex].courses_avg && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Department") {
                if (left[leftIndex].courses_dept > right[rightIndex].courses_dept) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_dept === right[rightIndex].courses_dept && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "Year") {
                if (left[leftIndex].courses_year < right[rightIndex].courses_year) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_year === right[rightIndex].courses_year && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                        // checks for a tiebreaker from remaining order keys until one is found
                        // or until all keys have been checked
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextAscending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === -1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "AVG") {
                if (left[leftIndex].overallAvg > right[rightIndex].overallAvg) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallAvg === right[rightIndex].overallAvg && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "MIN") {
                if (left[leftIndex].overallMin > right[rightIndex].overallMin) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallMin === right[rightIndex].overallMin && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "MAX") {
                if (left[leftIndex].overallMax > right[rightIndex].overallMax) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].courses_dept === right[rightIndex].courses_dept && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "SUM") {
                if (left[leftIndex].overallSum > right[rightIndex].overallSum) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallSum === right[rightIndex].overallSum && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            } else if (sortKey === "COUNT") {
                if (left[leftIndex].overallCount > right[rightIndex].overallCount) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].overallCount === right[rightIndex].overallCount && sortKeys.length > 1) {
                    let i: number = 1;
                    let nextKeys: any[] = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                    const firstCheck: number = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                    if (firstCheck === -1) {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    } else if (firstCheck === 0) {
                        i += 1;
                        let tieBreak: number = 0;
                        while (tieBreak === 0 && i < sortKeys.length) {
                            nextKeys = this.setSortKey(sortKeys[i].key, left[leftIndex], right[rightIndex]);
                            tieBreak = this.compareNextDescending(nextKeys[0], nextKeys[1]);
                            i++;
                        }
                        if (tieBreak === 1) {
                            resultArray.push(left[leftIndex]);
                            leftIndex++;
                        } else {
                            resultArray.push(right[rightIndex]);
                            rightIndex++;
                        }
                    } else {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    }
                } else {
                    resultArray.push(right[rightIndex]);
                    rightIndex++; // move right array cursor
                }
            }
        }
        // We need to concat to the resultArray because there will be one element left over after the while loop
        return resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }

    private setSortKey(key: string, left: CAggregateDataPoint, right: CAggregateDataPoint): any[] {
        let l;
        let r;
        const fields: any[] = [];
        if (key.trim() === "Title") {
            l = left.courses_title;
            r = right.courses_title;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "UUID") {
            l = left.courses_uuid;
            r = right.courses_uuid;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Instructor") {
            l = left.courses_instructor;
            r = right.courses_instructor;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Audit") {
            l = left.courses_audit;
            r = right.courses_audit;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "ID") {
            l = left.courses_id;
            r = right.courses_id;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Pass") {
            l = left.courses_pass;
            r = right.courses_pass;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Fail") {
            l = left.courses_fail;
            r = right.courses_fail;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Average") {
            l = left.courses_avg;
            r = right.courses_avg;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Department") {
            l = left.courses_dept;
            r = right.courses_dept;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "AVG") {
            l = left.overallAvg;
            r = right.overallAvg;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "MIN") {
            l = left.overallMin;
            r = right.overallMin;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "MAX") {
            l = left.overallMax;
            r = right.overallMax;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "SUM") {
            l = left.overallSum;
            r = right.overallSum;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "COUNT") {
            l = left.overallCount;
            r = right.overallCount;
            fields.push(l);
            fields.push(r);
        }
        return fields;
    }

    private compareNextAscending(left: any, right: any): number {
        if (left === right) {
            return 0;
        } else if (left > right) {
            return 1;
        } else {
            return -1;
        }
    }

    // Returns a number for three distinct scenarios as true/false would not have been sufficient in the case that two
    // fields were equal and the next available field needed to be checked as a tiebreaker
    private compareNextDescending(left: any, right: any): number {
        if (left === right) {
            return 0;
        } else if (left < right) {
            return -1;
        } else {
            return 1;
        }
    }
}
