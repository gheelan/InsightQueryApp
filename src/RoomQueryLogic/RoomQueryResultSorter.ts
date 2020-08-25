import RoomDataPoint from "./RoomDataPoint";
import RAggregateDataPoint from "./RAggregateDataPoint";

export default class RoomQueryResultSorter {

    public roomMergeSortAscending(orderKeys: any[], unsortedArray: RAggregateDataPoint[]): RAggregateDataPoint[] {
        if (unsortedArray.length <= 1) {
            return unsortedArray;
        }
        const middle = Math.floor(unsortedArray.length / 2);
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);

        // Using recursion to combine the left and right
        // tslint:disable-next-line:max-line-length
        return this.mergeAscending(orderKeys, this.roomMergeSortAscending(orderKeys, left), this.roomMergeSortAscending(orderKeys, right));
    }

    public roomMergeSortDescending(orderKeys: any[], unsortedArray: RAggregateDataPoint[]): RAggregateDataPoint[] {
        if (unsortedArray.length <= 1) {
            return unsortedArray;
        }
        const middle = Math.floor(unsortedArray.length / 2);
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);

        // Using recursion to combine the left and right
        // tslint:disable-next-line:max-line-length
        return this.mergeDescending(orderKeys, this.roomMergeSortDescending(orderKeys, left), this.roomMergeSortDescending(orderKeys, right));
    }

// Merge the two arrays: left and right
    private mergeAscending(sortKeys: any[], left: RAggregateDataPoint[], right: RAggregateDataPoint[]): any[] {
        const resultArray: RAggregateDataPoint[] = [];
        let leftIndex = 0;
        let rightIndex = 0;
        const sortKey: string = sortKeys[0].key.trim();

        while (leftIndex < left.length && rightIndex < right.length) {
            if (sortKey === "Short Name") {
                if (left[leftIndex].rooms_shortname < right[rightIndex].rooms_shortname) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_shortname === right[rightIndex].rooms_shortname &&
                    sortKeys.length > 1) {
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
            } else if (sortKey === "Address") {
                if (left[leftIndex].rooms_address < right[rightIndex].rooms_address) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_address === right[rightIndex].rooms_address && sortKeys.length > 1) {
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
            } else if (sortKey === "Full Name") {
                if (left[leftIndex].rooms_fullname < right[rightIndex].rooms_fullname) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_fullname === right[rightIndex].rooms_fullname && sortKeys.length > 1) {
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
            } else if (sortKey === "Number") {
                if (left[leftIndex].rooms_number < right[rightIndex].rooms_number) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_number === right[rightIndex].rooms_number && sortKeys.length > 1) {
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
            } else if (sortKey === "Link") {
                if (left[leftIndex].rooms_href < right[rightIndex].rooms_href) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_href === right[rightIndex].rooms_href && sortKeys.length > 1) {
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
            } else if (sortKey === "Seats") {
                if (left[leftIndex].rooms_seats < right[rightIndex].rooms_seats) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_seats === right[rightIndex].rooms_seats && sortKeys.length > 1) {
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
            } else if (sortKey === "Furniture") {
                if (left[leftIndex].rooms_furniture < right[rightIndex].rooms_furniture) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_furniture === right[rightIndex].rooms_furniture &&
                    sortKeys.length > 1) {
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
            } else if (sortKey === "Type") {
                if (left[leftIndex].rooms_type < right[rightIndex].rooms_type) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_type === right[rightIndex].rooms_type && sortKeys.length > 1) {
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
            } else if (sortKey === "Name") {
                if (left[leftIndex].rooms_name < right[rightIndex].rooms_name) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_name === right[rightIndex].rooms_name && sortKeys.length > 1) {
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
            } else if (sortKey === "Latitude") {
                if (left[leftIndex].rooms_lat < right[rightIndex].rooms_lat) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_lat === right[rightIndex].rooms_lat && sortKeys.length > 1) {
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
            } else if (sortKey === "Longitude") {
                if (left[leftIndex].rooms_lon < right[rightIndex].rooms_lon) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_lon === right[rightIndex].rooms_lon && sortKeys.length > 1) {
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

    private mergeDescending(sortKeys: any[], left: RAggregateDataPoint[], right: RAggregateDataPoint[]): any[] {
        const resultArray: RAggregateDataPoint[] = [];
        let leftIndex = 0;
        let rightIndex = 0;
        const sortKey: string = sortKeys[0].key.trim();

        while (leftIndex < left.length && rightIndex < right.length) {
            if (sortKey === "Short Name") {
                if (left[leftIndex].rooms_shortname > right[rightIndex].rooms_shortname) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_shortname === right[rightIndex].rooms_shortname &&
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
            } else if (sortKey === "Address") {
                if (left[leftIndex].rooms_address > right[rightIndex].rooms_address) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_address === right[rightIndex].rooms_address && sortKeys.length > 1) {
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
            } else if (sortKey === "Full Name") {
                if (left[leftIndex].rooms_fullname > right[rightIndex].rooms_fullname) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_fullname === right[rightIndex].rooms_fullname && sortKeys.length > 1) {
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
            } else if (sortKey === "Number") {
                if (left[leftIndex].rooms_number > right[rightIndex].rooms_number) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_number === right[rightIndex].rooms_number && sortKeys.length > 1) {
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
            } else if (sortKey === "Link") {
                if (left[leftIndex].rooms_href > right[rightIndex].rooms_href) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_href === right[rightIndex].rooms_href && sortKeys.length > 1) {
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
            } else if (sortKey === "Seats") {
                if (left[leftIndex].rooms_seats > right[rightIndex].rooms_seats) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_seats === right[rightIndex].rooms_seats && sortKeys.length > 1) {
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
            } else if (sortKey === "Furniture") {
                if (left[leftIndex].rooms_furniture > right[rightIndex].rooms_furniture) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_furniture === right[rightIndex].rooms_furniture &&
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
            } else if (sortKey === "Type") {
                if (left[leftIndex].rooms_type > right[rightIndex].rooms_type) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_type === right[rightIndex].rooms_type && sortKeys.length > 1) {
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
            } else if (sortKey === "Name") {
                if (left[leftIndex].rooms_name > right[rightIndex].rooms_name) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_name === right[rightIndex].rooms_name && sortKeys.length > 1) {
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
            } else if (sortKey === "Latitude") {
                if (left[leftIndex].rooms_lat > right[rightIndex].rooms_lat) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_lat === right[rightIndex].rooms_lat && sortKeys.length > 1) {
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
            } else if (sortKey === "Longitude") {
                if (left[leftIndex].rooms_lon > right[rightIndex].rooms_lon) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++; // move left array cursor
                } else if (left[leftIndex].rooms_lon === right[rightIndex].rooms_lon && sortKeys.length > 1) {
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
                } else if (left[leftIndex].overallMax === right[rightIndex].overallMax && sortKeys.length > 1) {
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

    private setSortKey(key: string, left: RAggregateDataPoint, right: RAggregateDataPoint): any[] {
        let l;
        let r;
        const fields: any[] = [];
        if (key.trim() === "Short Name") {
            l = left.rooms_shortname;
            r = right.rooms_shortname;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Address") {
            l = left.rooms_address;
            r = right.rooms_address;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Full Name") {
            l = left.rooms_fullname;
            r = right.rooms_fullname;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Number") {
            l = left.rooms_number;
            r = right.rooms_number;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Link") {
            l = left.rooms_href;
            r = right.rooms_href;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Seats") {
            l = left.rooms_seats;
            r = right.rooms_seats;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Furniture") {
            l = left.rooms_furniture;
            r = right.rooms_furniture;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Type") {
            l = left.rooms_type;
            r = right.rooms_type;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Name") {
            l = left.rooms_name;
            r = right.rooms_name;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Latitude") {
            l = left.rooms_lat;
            r = right.rooms_lat;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "Longitude") {
            l = left.rooms_lon;
            r = right.rooms_lon;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "AVG") {
            l = left.overallAvg;
            r = right.overallAvg;
            fields.push(l);
            fields.push(r);
        } else if (key.trim() === "SUM") {
            l = left.overallSum;
            r = right.overallSum;
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
