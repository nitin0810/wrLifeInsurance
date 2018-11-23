import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { CustomService } from '../../providers/custom.service';

/**
 * Generated class for the ForgortPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgort-password',
  templateUrl: 'forgort-password.html',
})
export class ForgortPasswordPage {
  email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private authService: AuthService, private customService:CustomService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgortPasswordPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  submit(){
    this.customService.showLoader();
    this.authService.forgotPassword({'email': this.email}).subscribe((response:any) => {
      this.customService.hideLoader();
      this.customService.showToast('New password is sent to you mail');
      this.dismiss();
    },(error:any) => {
      this.customService.hideLoader();
      this.customService.showToast(error.msg);
    })
  }

}
