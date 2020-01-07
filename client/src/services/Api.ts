import { config } from '../config';
import { auth0 } from './ReactAuth';

export class Api {
    private static async appendAuthHeaders(
        headers: Headers = new Headers()
    ): Promise<Headers> {
        const token = await auth0.getTokenSilently();
        headers.append('Authorization', `Bearer ${token}`);
        return headers;
    }

    private static getUrl(url: string, queryParams?: any): string {
        const queryString = queryParams
            ? this.createQueryString(queryParams)
            : '';
        return config.serverUrl + url + queryString;
    }

    private static handleResponse(
        response: Response,
        json = true
    ): Promise<any> {
        if (response.ok) {
            return json ? response.json() : new Promise(resolve => resolve());
        }
        return new Promise((resolve, reject) => {
            console.error('Error in response', response);
            reject(response);
        });
    }

    private static createQueryString(queryParams: any): string {
        const params = Object.keys(queryParams);
        if (!params.length) {
            return '';
        }
        return (
            '?'
            + params
                .map(
                    k =>
                        encodeURIComponent(k)
                        + '='
                        + encodeURIComponent(queryParams[k])
                )
                .join('&')
        );
    }

    static async get<T = any>(url: string, queryParams?: any): Promise<T> {
        return fetch(Api.getUrl(url, queryParams), {
            headers: await Api.appendAuthHeaders()
        }).then(response => this.handleResponse(response));
    }

    static async post<D = any, T = any>(url: string, data: D): Promise<T> {
        return fetch(Api.getUrl(url), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: await Api.appendAuthHeaders(
                new Headers({
                    'Content-Type': 'application/json'
                })
            )
        }).then(response => this.handleResponse(response));
    }

    static async delete<T = any>(url: string): Promise<T> {
        return fetch(Api.getUrl(url), {
            method: 'DELETE',
            headers: await Api.appendAuthHeaders()
        }).then(response => this.handleResponse(response, false));
    }

    static async patch<D = any, T = any>(url: string, data: D): Promise<T> {
        return fetch(Api.getUrl(url), {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: await Api.appendAuthHeaders(
                new Headers({
                    'Content-Type': 'application/json'
                })
            )
        }).then(response => this.handleResponse(response, false));
    }
}
