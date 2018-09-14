import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Alert, AlertController } from 'ionic-angular';
import { GuestHomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-payment-success',
  templateUrl: 'payment-success.html',
})
export class PaymentSuccessPage {

  isLoggedIn = localStorage.getItem('access_token');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {

    setTimeout(() => {
      if (this.isLoggedIn) {
        this.navCtrl.setRoot(GuestHomePage, { animate: true, direction: 'forward' });
      } else {
        this.navCtrl.setRoot("LoginPage", { animate: true, direction: 'forward' })
          .then(() => {
            const alert: Alert = this.alertCtrl.create({
              title: 'Success',
              message: 'Please login now with credentials sent to your email.',
              buttons: ['ok']
            });
            alert.present();
          });
      }
    }, 4000);
  }

}
