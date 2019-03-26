import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { CustomService } from '../../providers/custom.service';


@IonicPage()
@Component({
  selector: 'page-account-edit',
  templateUrl: 'account-edit.html',
})
export class AccountEditPage {

  userDetails: any;
  form = { first: '', last: '', skypeId: '', phone: '' };
  callBack: Function;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private customService: CustomService) {
    this.callBack = this.navParams.get('callBack');
    this.userDetails = JSON.parse(localStorage.getItem('userInfo'));
  }

  ionViewDidLoad() {
    this.form.first = this.userDetails.first_name;
    this.form.last = this.userDetails.last_name;
    this.form.skypeId = this.userDetails.skype;
    this.form.phone = this.userDetails.phone;
  }

  onSave() {
    this.customService.showLoader();
    this.authService.editAccountDetails(this.form)
      .subscribe(res => {
        this.customService.hideLoader();
        this.customService.showToast('Details Edited Successfully');
        //update info in localstorage
        this.userDetails.first_name = this.form.first;
        this.userDetails.last_name = this.form.last;
        this.userDetails.skype = this.form.skypeId;
        this.userDetails.phone = this.form.phone;
        localStorage.setItem('userInfo', JSON.stringify(this.userDetails));
        // call the callback so that detail in previous page also get updated
        if (this.callBack) { this.callBack(); }
        this.navCtrl.pop();
      }, err => {
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }

}
