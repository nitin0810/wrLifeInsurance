import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CustomService } from '../../../providers/custom.service';
import { MedicalInsuranceService } from '../../../providers/medicalInsurance.service';


@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  // ngModal variables
  form: any = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customService: CustomService,
    private medInsServ: MedicalInsuranceService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  onSubmit() {
    this.customService.showLoader();
    this.medInsServ.contactUS(this.form).subscribe(response => {
      this.customService.showToast('Message sent, You will be contacted soon .');      
      this.customService.hideLoader();
      this.navCtrl.pop();
    }, error => {
      this.customService.hideLoader();
      this.customService.showToast(error.msg);
    })
  }

}
