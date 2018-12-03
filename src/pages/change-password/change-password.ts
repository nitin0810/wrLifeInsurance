import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { CustomService } from '../../providers/custom.service';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  passwords: any ={}
  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,     public viewCtrl: ViewController, private customService: CustomService) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePasword(){
    this.customService.showLoader();
    this.authService.changePassword(this.passwords).subscribe(response => {
      this.customService.showToast('Password changed Successfully');
      this.dismiss();
      this.customService.hideLoader();
    }, error => {
      this.customService.showToast(error.msg);
      this.customService.hideLoader();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
