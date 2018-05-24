import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { BASEURL } from './app.constants';
declare var URLPREFIX;
declare var ROLE;
declare const SockJS;
declare const Stomp;

@Injectable()
export class CustomHttpService {

    constructor(private httpClient: HttpClient) { }

    private getAccessToken() {

        let basicToken = "nxtlifefeedbacksystem:kabuliwala";

        return !localStorage.getItem('access_token') ? 'Basic ' + btoa(basicToken) : 'Bearer ' + localStorage.getItem('access_token');
    }

    private addHeaders(optionalHeaders?: HttpHeaders) {

        let requestHeaders = new HttpHeaders()
            .set('Authorization', this.getAccessToken())
            .set('Content-Type', 'application/json');
        if (optionalHeaders) {
            for (const header of optionalHeaders.keys()) {
                requestHeaders = requestHeaders.append(header, optionalHeaders.get(header));
            }
        }
        return requestHeaders;
    }



    get(url: string, options?: HttpHeaders) {

        const headers = this.addHeaders(options);
        let _url: string;
        if (ROLE) {
            // in case of admin.mngmnt, each request contains ROLE if ROLE exists
            _url = BASEURL + (URLPREFIX ? '/' + URLPREFIX : '') + '/' + ROLE + url;
        } else {
            _url = BASEURL + (URLPREFIX ? '/' + URLPREFIX : '') + url;

        }

        return this.httpClient.get(_url, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }

    post(url: string, body: any, options?: HttpHeaders) {

        let headers = this.addHeaders(options);
        let _url: string;
        if (ROLE) {
            // in case of admin.mngmnt, each request contains ROLE if ROLE exists
            _url = BASEURL + (URLPREFIX ? '/' + URLPREFIX : '') + '/' + ROLE + url;
        } else {
            _url = BASEURL + (URLPREFIX ? '/' + URLPREFIX : '') + url;

        }
        return this.httpClient.post(_url, body, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }

    put(url: string, body: any, options?: HttpHeaders) {

        let headers = this.addHeaders(options);
        let _url: string;
        if (ROLE) {
            // in case of admin.mngmnt, each request contains ROLE if ROLE exists
            _url = BASEURL + (URLPREFIX ? '/' + URLPREFIX : '') + '/' + ROLE + url;
        } else {
            _url = BASEURL + (URLPREFIX ? '/' + URLPREFIX : '') + url;

        }
        return this.httpClient.put(_url, body, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }

    postForLogin(body: any) {

        const searchParams = new HttpParams()
            .append('username', body.username)
            .append('password', body.password);

        const loginHeaders = new HttpHeaders()
            .set('Authorization', this.getAccessToken());

        return this.httpClient.post(BASEURL + '/oauth/token?grant_type=password', {}, { headers: loginHeaders, params: searchParams, observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: HttpResponse<any>) {

        // console.log('inside extract data', res);
        return res.body || res.status;
    }

    private handleError(err: HttpErrorResponse) {
        // console.log('inside handle error', err);
        let errorInfo: any = {};

        if (err.error instanceof Error || err.error instanceof ProgressEvent) {
            /**A client-side or network error occurred. Handle it accordingly.*/
            // console.log('An error occurred:', );
            errorInfo.status = err.status;
            errorInfo.status == 0 ? errorInfo.msg = "No Internet, Check Your connection Or Try again" : errorInfo.msg = err.message || 'Some Error Occured';
        }
        else {
            /**The backend returned an unsuccessful response code.*/
            // console.log('Server occurred:', err);
            errorInfo.status = err.status;
            errorInfo.msg = err.error.message || err.error.error || 'Internal Server Error';
        }
        return Observable.throw(errorInfo);

    }

    getSockJs() {

        let access_token = localStorage.getItem('access_token');
        let url = BASEURL + `/${URLPREFIX}/nxtlife/websocket?access_token=${access_token}`;
        var socket = new SockJS(url);
        return Stomp.over(socket);
    }

}
