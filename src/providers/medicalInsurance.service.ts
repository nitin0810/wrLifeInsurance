import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgAnalyzeModulesHost } from '@angular/compiler';
declare var URLPREFIX;
declare var ROLE;

export interface FormPayload {
    area: string;
    txtApAge?: number | any;
    txtApAge1?: number | any;
    txtApAge2?: number | any;
    txtApAge3?: number | any;
    members: string;
    member4status: number;
    adjusment_plan: number;
    adjusment: number;
    globallimit: number;
    complement: number;
    outpatientstatus: number;
    dentalstatus: number;
    selectevacuation: string;
}


@Injectable()
export class MedicalInsuranceService {


    phpUrl = "http://veom.biz/test/wrlife/calculation-ajax.php";

    constructor(
        private http: CustomHttpService,
        private httpClient: HttpClient
    ) { }

    getCountriesAndAge() {
        return this.http.get('/mdi/save-info/step1');
    }

    getBrokerId() {
        return this.http.get('/mdi/save-info/step2');
    }

    getInitialState(ar: string) {
        return {
            area: ar,
            txtApAge: NaN,
            txtApAge1: NaN,
            txtApAge2: NaN,
            txtApAge3: NaN,
            members: 'Individual',
            member4status: 0,
            adjusment_plan: 2,
            adjusment: 0,
            globallimit: 400000,
            complement: 0,
            outpatientstatus: 0,
            dentalstatus: 0,
            selectevacuation: 'none'
        };
    }

    submitForm2(data: any) {
        return this.http.post('/mdi', data);
    }

    makePayment(data){
        return this.http.post('/mdi/stripe/pay', data);
    }

    calculatePremiumPrice(data: FormPayload) {

        return this.post(this.phpUrl, data);
    }

    // POST request to php server for calculating premium price
    post(url: string, body: any) {

        let params = new HttpParams({ fromObject: body });

        return this.httpClient.post(url, params, { observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: HttpResponse<any>) {

        // console.log('inside extract data', res);
        return res.body || res.status;
    }

    private handleError(err: HttpErrorResponse) {
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





}
