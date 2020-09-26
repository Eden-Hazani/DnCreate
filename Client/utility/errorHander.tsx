import { ApiResponse } from 'apisauce';
import { compose } from 'redux';


const errorHandler = (answer: ApiResponse<unknown, unknown> | any) => {
    if (answer.status === 401) {
        alert("Incorrect Credentials")
        return true
    }
    if (answer.status === 403) {
        alert("this Username is already registered")
        return true
    }
    if (answer.status === 400) {
        console.log(answer.request)
        // alert(answer.request.replace(/['"]+/g, ''))
        return true
    }
    return false;
}

export default errorHandler;