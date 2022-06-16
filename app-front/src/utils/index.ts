// import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';
const log = console.log;
const logT = console.table;

interface MyOption {
    headers: {
        'auth-token': string | null
    }
}
const httpOptions: AxiosRequestConfig<MyOption> = {
    headers: {
        'auth-token': localStorage.getItem('authToken'),
    }
}

const api = () => {
    return location.hostname == 'localhost'
        ? 'https://oauth-shopify-app.herokuapp.com'
        : ''
}



export { httpOptions, log, logT, api }