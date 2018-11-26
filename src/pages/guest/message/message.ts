import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CustomService } from '../../../providers/custom.service';


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
    private customService: CustomService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  onSubmit() {
    this.customService.showToast('Message sent, You will be contacted soon .');
    this.navCtrl.pop();
  }

}
