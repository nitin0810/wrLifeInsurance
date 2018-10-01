import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AuthService } from '../../../providers/auth.service';
import { CustomService } from '../../../providers/custom.service';

/**GuestHomepage is actually home page for all users wheather logged in or not */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class GuestHomePage implements OnInit {

  policies: Array<any>;
  showPolices = false; // only show for logged in user
  loadingPolicies = false;

  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
    private customService: CustomService,
    private menu: MenuController
  ) {
  }

  ngOnInit() {
    this.showPolices = this.authService.isLoggedIn();
    if (this.showPolices) {
      this.getPolicies();
    }
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewDidLeave() {
    this.menu.enable(false);
  }

  openPolicyForm() {
    this.navCtrl.push('MedicalInsuranceFormPage');
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
    // this.navCtrl.push('PolicyDetailPage',{policy:policy});
  }
}
