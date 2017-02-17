import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'groupBy' })
export class GroupBy implements PipeTransform {

    transform(collection: any[], term: string) {

        let newValue: any[] = [];

        for (let i = 0; i < collection.length; i++) {
            let keyVal = GroupBy.deepFind(collection[i], term);
            let index = newValue.findIndex(myObj => myObj.key == keyVal);
            if (index >= 0) {
                newValue[index].value.push(collection[i]);
            } else {
                newValue.push({ key: keyVal, value: [collection[i]] });
            }
        }

        return newValue;

    }

    static deepFind(obj: any, path: string) {
        if (path != undefined) {
            let paths = path.split(/[\.\[\]]/);
            let current = obj;

            for (let i = 0; i < paths.length; ++i) {
                if (paths[i] !== "") {
                    if (current[paths[i]] == path) {
                        return undefined;
                    } else {
                        current = current[paths[i]];
                    }
                }
            }
            return current;
        }
        return undefined;
    }
}
