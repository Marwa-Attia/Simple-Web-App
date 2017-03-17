import { Injectable } from '@angular/core';

@Injectable()
export class OrderByService {
    constructor() {
    }
    static _orderByComparator(a: any, b: any): number {

        if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
            //Isn't a number so lowercase the string to properly compare
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
        }
        else {
            //Parse strings as numbers to compare properly
            if (parseFloat(a) < parseFloat(b)) return -1;
            if (parseFloat(a) > parseFloat(b)) return 1;
        }

        return 0; //equal each other
    }

    static _sort(input: any, [field = '+']): any {

        if (!Array.isArray(input)) return input;

        if (!Array.isArray(field) || (Array.isArray(field) && field.length == 1)) {
            let propertyToCheck: string = !Array.isArray(field) ? field : field[0];

            if (propertyToCheck != 'undefined' && propertyToCheck != 'NaN') {
                let direction = propertyToCheck.substr(0, 1) == '-';

                //Basic array
                if (!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+') {
                    return !direction ? input.sort() : input.sort().reverse();
                }
                else {
                    let property: string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
                        ? propertyToCheck.substr(1, propertyToCheck.length)
                        : propertyToCheck;

                    return input.sort(function(a: any, b: any) {
                        return !direction
                            ? OrderByService._orderByComparator(a[property], b[property])
                            : -OrderByService._orderByComparator(a[property], b[property]);
                    });
                }
            }
        }
        else {
            //Loop over property of the array in order and sort
            return input.sort(function(a: any, b: any) {
                for (let i: number = 0; i < field.length; i++) {
                    let desc = field[i].substr(0, 1) == '-';
                    let property = field[i].substr(0, 1) == '+' || field[i].substr(0, 1) == '-'
                        ? field[i].substr(1)
                        : field[i];

                    let comparison = !desc
                        ? OrderByService._orderByComparator(a[property], b[property])
                        : -OrderByService._orderByComparator(a[property], b[property]);

                    //Don't return 0 yet in case of needing to sort by next property
                    if (comparison != 0) return comparison;
                }

                return 0; //equal each other
            });
        }
    }
}
