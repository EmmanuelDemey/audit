import {Result} from "@audit/model";

export default (result: Result): void => {
    console.log(JSON.stringify(result, null, 2));
}
