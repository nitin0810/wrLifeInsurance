import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../../providers/auth.service';
import { CustomService } from '../../../providers/custom.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class GuestHomePage implements OnInit {

  policies: Array<any>;

  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
    private customService: CustomService
  ) {
  }

  ngOnInit() {
    this.getPolicies();
  }

  openPolicyForm() {
    this.navCtrl.push('MedicalInsuranceFormPage');
  }

  getPolicies() {
    if (this.authService.isLoggedIn()) {
      this.authService.fetchPolicies()
        .subscribe((res: any) => {
          console.log(res);
          this.policies = res;
        }, (err: any) => {
          this.customService.showToast(err.msg);
        });
    }

  }
}
