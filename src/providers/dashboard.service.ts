import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardService {

    constructor(
        private http: CustomHttpService
    ) { }

    loadScript(): any {
        return Observable.create((observer) => {
          if (document.getElementById('GoogleCharts') == null) {
            const node = document.createElement('script');
            node.src = 'https://www.gstatic.com/charts/loader.js';
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            node.id = 'GoogleCharts';
            document.getElementsByTagName('head')[0].appendChild(node);
            node.onload = function () {
              observer.complete();
            };
          } else {
            observer.complete();
          }
        });
      }

    // below requests fetch the data required for drawing the various graphs 
    complaintByStatus(compOrSugg: string) {
        return this.http.get(`/graph/status/${compOrSugg}`);
    }
    complaintByCategory(compOrSugg: string) {
        return this.http.get(`/graph/category-status/${compOrSugg}`);
    }
    complaintByStore(compOrSugg: string) {
        // fetches store-wise statuses
        return this.http.get(`/graph/store-status/${compOrSugg}`);
    }

    //appreciation graphs

    appreciationByStore() {
        return this.http.get(`/graph/appreciation`);
    }

    //survey graphs
    surveyRatingByStore() {
        return this.http.get(`/survey/graph/store-star`);
    }

    surveyRatingByQuestion() {
        return this.http.get(`/survey/graph/question-star`);
    }

    surveyStore() {
        return this.http.get(`/survey/graph/store`);
    }

}