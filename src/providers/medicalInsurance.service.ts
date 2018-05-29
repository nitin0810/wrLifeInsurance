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

    getInitialState() {
        return {
            area: 'area3',
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

    calculatePremiumPrice(data: FormPayload) {

        // const nData: any = {};

        // nData.area = data.area || 'area3';
        // nData.txtApAge = data.txtApAge || NaN;
        // nData.txtApAge1 = data.txtApAge1 || NaN;
        // nData.txtApAge2 = data.txtApAge2 || NaN;
        // nData.txtApAge3 = data.txtApAge3 || NaN;
        // nData.members = data.members || 'Individual';
        // nData.member4status = data.member4status || 0;
        // nData.adjusment_plan = data.adjusment_plan || 2;
        // nData.adjusment = data.adjusment || 0;
        // nData.globallimit = data.globallimit || 400000;
        // nData.complement = data.complement || 0;
        // nData.outpatientstatus = data.outpatientstatus || 0;
        // nData.dentalstatus = data.dentalstatus || 0;
        // nData.selectevacuation = data.selectevacuation || 'none';

        return this.post(this.phpUrl, data);

    }

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





}
