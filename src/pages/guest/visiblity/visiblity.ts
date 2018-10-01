import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-visiblity',
  templateUrl: 'visiblity.html',
})
export class VisiblityPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onBack() {
    this.navCtrl.pop();
  }

}
