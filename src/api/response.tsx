import { toast } from 'react-toastify'
import axios, {AxiosError, AxiosResponse } from 'axios';
export function handleResponse(response: AxiosResponse) {
    if (response.data) {
        return response.data;
    }
    return response;
}

export function handleError(error: Error | AxiosError) {
    if (axios.isAxiosError(error)) {
        console.error('handleError: ', error)
        console.error('error reponse: ', error.response)
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
    console.error('intError', error)
    const status = error.response?.status
    if (status === 400) {
        const msg = error.response?.data.detail
        console.log('interceptor error detail', error)
        toast.error(msg)
    }
    if (status === 401) {
        toast.error('Authentication error')
    }
    if (status === 404) {
        toast.error('404 error. API not found')
    }
    else { 
        toast.error(error.message)
    }

    return Promise.reject(error) // send axios error
}
