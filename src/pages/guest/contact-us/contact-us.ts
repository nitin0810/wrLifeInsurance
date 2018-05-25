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
    private mdoalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

  openDropMessagepage() {
    const modal = this.mdoalCtrl.create('MessagePage');
    modal.present();
  }

}
