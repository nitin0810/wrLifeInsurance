import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../../providers/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class GuestHomePage {

  policies: Array<any>;

  constructor(
    public navCtrl: NavController,
    private authService: AuthService
  ) {
  }

  openPolicyForm() {
    this.navCtrl.push('MedicalInsuranceFormPage');
  }

  getPolicies() {
    if (this.authService.isLoggedIn()) {
      this.authService.fetchPolicies()
        .subscribe((res: any) => {
          // this.storeInfo(res);
        //   setTimeout(() => {

        //     this.navigate();
        //   }, 1000);
        // }, (err: any) => {
        //   this.logging = false;
        //   this.showError(err.msg);
        // });
    }
  }


}
