import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-buy-shares',
  templateUrl: 'buy-shares.html',
})
export class BuySharesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuySharesPage');
  }

  openContactPage(){
    this.navCtrl.push('ContactUsPage');
  }

}
