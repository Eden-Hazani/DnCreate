import { ApiResponse } from 'apisauce';
import { ActionType } from '../app/redux/action-type';
import { store } from '../app/redux/store';
import logger from './logger';



const errorHandler = (answer: ApiResponse<unknown, unknown> | any) => {
    if (answer.data === 'Your Logging session has expired') {
        alert('Your Logging session has expired, Please login again.');
        store.dispatch({ type: ActionType.Logout });
        return true;
    }
    if (answer.status === 401) {
        alert("Incorrect Credentials")
        return true
    }
    if (answer.status === 403) {
        alert("this Username is already registered")
        return true
    }
    if (answer.status === 400) {
        logger.log(new Error(answer.data))
        alert(answer.data)
        return true
    }
    return false;

}

export default errorHandler;