import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-all-definitions',
  templateUrl: 'all-definitions.html',
})
export class AllDefinitionsPage {

  title: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController) {
  }


  ionViewDidLoad() {
    this.title = this.navParams.get('title');
  }

  openDownloadsWebPage(){
    window.open('https://www.wrlife.net/downloads.php','_system','location=yes');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
