import { toast } from 'react-toastify'
import axios, {AxiosError, AxiosResponse } from 'axios';
export function handleResponse(response: AxiosResponse) {
    if (response.status > 200) {
        console.log('response status >200', response)
        toast.error(response.statusText)
    }
    else { 
        console.log('errored response', response)
        toast.error(response.status)
    }

    if (response.data) {
        return response.data;
    }

    return response;
}

export function handleError(error: Error | AxiosError) {
    toast.error(error.message)
    if (axios.isAxiosError(error)) {
        console.error('handleError: ', error)
        console.error(error.toJSON())
        return error.toJSON();
    }
    return error;
}
