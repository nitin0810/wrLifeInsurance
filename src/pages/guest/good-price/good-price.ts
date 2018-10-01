import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-good-price',
  templateUrl: 'good-price.html',
})
export class GoodPricePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onBack() {
    this.navCtrl.pop();
  }

}
