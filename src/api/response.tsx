import { toast } from 'react-toastify'
import axios, {AxiosError, AxiosResponse } from 'axios';
export function handleResponse(response: AxiosResponse) {
    if (response.status > 200) {
        console.log('response status >200', response)
        toast.error(response.statusText)
    }

    if (response.data) {
        return response.data;
    }

    return response;
}

export function handleError(error: Error | AxiosError) {
    if (axios.isAxiosError(error)) {
        console.error('handleError: ', error)
        // console.error(error.toJSON())
        return error.toJSON();
    }
    return error;
}

export function intResponse( response: AxiosResponse ) {
    //do somthing with response data
   return response 
}

export function intError(error: AxiosError) {
    //do somthing with error data
    const msg = error.response?.data.detail
    console.log('interceptor error detail', msg)
    toast.error(msg)

    return Promise.reject(error) // send axios error
}
