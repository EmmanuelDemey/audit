import {Result} from "../types";

export default (result: Result): void => {
    console.log(JSON.stringify(result, null, 2));
}
