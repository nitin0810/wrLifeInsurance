import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../providers/auth.service';
import { CustomService } from '../../../providers/custom.service';


@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {

  policies: Array<any>;
  loadingPolicies = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthService,
    private customService: CustomService
    ) {  }

  ionViewDidLoad() {
    this.getPolicies();
    }

  getPolicies() {
    this.loadingPolicies = true;
    this.authService.fetchPolicies()
      .subscribe((res: any) => {
        this.policies = res;
        this.loadingPolicies = false;
      }, (err: any) => {
        this.customService.showToast(err.msg);
        this.loadingPolicies = false;
      });
  }

  openPolicyDetail(policy: any) {
    this.navCtrl.push('PolicyDetailPage',{policy:policy});
  }

}
     