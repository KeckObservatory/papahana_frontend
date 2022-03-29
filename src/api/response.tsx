import { toast } from 'react-toastify'
import axios, {AxiosError} from 'axios';
export function handleResponse(response: any) {
    toast("a response is here")
    if (response.results) {
        return response.results;
    }

    if (response.data) {
        return response.data;
    }

    return response;
}

export function handleError(error: Error | AxiosError) {
    toast.error(error.message)
    if (axios.isAxiosError(error)) {
        console.error('handleError: ', error.message)
        return error.toJSON();
    }
    return error;
}
