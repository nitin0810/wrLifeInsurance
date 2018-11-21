import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-policy-detail',
  templateUrl: 'policy-detail.html',
})
export class PolicyDetailPage {

  policy: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PolicyDetailPage');
    this.policy = this.navParams.get('policy');
  }

}
        