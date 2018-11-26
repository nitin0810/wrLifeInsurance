import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
  userDetails: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthService,
    private customService: CustomService,
    public modalCtrl:ModalController
    ) {  
      this.userDetails = JSON.parse(localStorage.getItem('userInfo'))[0];
    }

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

  changePassword(){
    const changePasswordModal =  this.modalCtrl.create('ChangePasswordPage');
    changePasswordModal.present();
  }

}
     