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
    private modalCtrl: ModalController
  ) {
  }

  onBack() {
    this.navCtrl.pop();
  }
  
  openDropMessagepage() {
    const modal = this.modalCtrl.create('MessagePage');
    modal.present();
  }

}
