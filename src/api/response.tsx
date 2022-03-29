import { toast } from 'react-toastify'
import axios, {AxiosError, AxiosResponse } from 'axios';
export function handleResponse(response: AxiosResponse) {
    if (response.status < 200) {
        toast.error(response.statusText)
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
