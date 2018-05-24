import { Component } from '@angular/core';
import { NavController, NavParams,Events,MenuController } from 'ionic-angular';
import { GuestHomePage } from '../guest/home/home';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events:Events,
    private menu:MenuController
  ) {
  }

  ionViewDidEnter(){
    this.menu.enable(false);
  }

  onSkip() {    
  this.events.publish('user:login');
    // this.navCtrl.setRoot(GuestHomePage);
  }

}
