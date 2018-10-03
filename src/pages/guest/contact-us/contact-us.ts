import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {  }

  onBack() {
    this.navCtrl.pop();
  }
  
  openDropMessagepage() {
    this.navCtrl.push('MessagePage');
  }

}
