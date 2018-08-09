import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-payment-success',
  templateUrl: 'payment-success.html',
})
export class PaymentSuccessPage {

  timerId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }

  ionViewDidLoad() {
    this.removeFormPage();
    this.timerId = setTimeout(() => {
      this.navCtrl.pop();
    }, 4000);
  }

  // remove the insurance form page from the stack so that 
  // on going back, we reach to root page 
  removeFormPage() {
    const prevView: ViewController = this.navCtrl.getPrevious();
    this.navCtrl.removeView(prevView);
  }

  pop() {
    clearTimeout(this.timerId);
    this.navCtrl.pop();
  }
}
