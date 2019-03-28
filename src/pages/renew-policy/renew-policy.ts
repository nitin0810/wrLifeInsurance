import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CustomService } from '../../providers/custom.service';
import { STRIPE_KEY } from '../../providers/app.constants';
import { Stripe } from '@ionic-native/stripe';
import { MedicalInsuranceService } from '../../providers/medicalInsurance.service';

/**This page is used for both renewing the policy and paying the amount of new policy
 * which user tried to purchase but did not complete its payment.
 * This differentiation is based on ordeid
 */
@IonicPage()
@Component({
  selector: 'page-renew-policy',
  templateUrl: 'renew-policy.html',
})
export class RenewPolicyPage {

  //variables for taking payment details
  card: any = {
    cardNumber: '',
    cardExpiryDate: '',//MMMM-YY
    cvv: '',
    saveDetailsForFuture: false
  };

  policyToRenew: any;
  callBack: Function;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customService: CustomService,
    private alertCtrl: AlertController,
    private stripe: Stripe,
    private medicalInsuranceService: MedicalInsuranceService,

  ) {
    this.policyToRenew = this.navParams.get('policy');
    this.callBack = this.navParams.get('callBack');
  }

  onMakePaymentBtn() {

    if (!this.isCardValid()) {
      this.customService.showToast('Please enter correct card details');
      return;
    };
    this.customService.showLoader('Please wait... It might take some time.');
    this.getCardToken()
      .then((token: string) => this.makePayment(token, this.card.saveDetailsForFuture))
      .then((response: any) => {
        // show success alert
        // alert(JSON.stringify(response));
        if (response.status === 'succeeded') {
          // this.showSuccessPage();
          // alert(JSON.stringify(response, undefined, 2));
          const renewalTrans = {
            cdate: response.created *1000,
            amount: response.amount,
            order_id: response.id,
            pay_id: response.source.id,
            currency: response.currency,
            status: response.status,
            transection_id: this.policyToRenew.transection_id
          };
          this.navCtrl.pop().then(()=>{
            this.callBack(renewalTrans);
          });
        } else {
          this.showAlert(response.failure_message);
        }
      })
      .catch((err) => {
        // show error alert
        // alert(JSON.stringify(err));
        this.showAlert(err);
      })
      .then(() => { this.customService.hideLoader(); });
  }

  isCardValid() {
    // alert(JSON.stringify(this.card));
    const re = /^[0-9]+$/;
    if (!re.test(this.card.cardNumber)) { return false; }
    if (!re.test(this.card.cvv)) { return false; }
    return true;
  }


  getCardToken() {

    return new Promise((res, rej) => {

      this.stripe.setPublishableKey(STRIPE_KEY);
      const [y, m] = this.card.cardExpiryDate.split('-');
      const card = {
        number: this.card.cardNumber,
        expMonth: m,
        expYear: y,
        cvc: this.card.cvv
      };

      this.stripe.createCardToken(card)
        .then(token => {
          // alert(JSON.stringify(token)); 
          res(token.id)
        })
        .catch(error => { rej(error) });
    });

  }


  makePayment(token: string, saveDetails: boolean) {
    // alert('make ayment called//,' + token);
    return new Promise((res, rej) => {

      const info = {
        transactionId: this.policyToRenew.transection_id,
        membershipNumber: this.policyToRenew.membership_number,
        subscriptionPackage: this.policyToRenew.policyTransaction.policy_id,
        description: `transId: ${this.policyToRenew.transaction_id}, membershipNo: ${this.policyToRenew.membership_number}`,
        stripeToken: token,
        autopayment: saveDetails
      };
      // also send mailId in case of autopayment is true
      if (info.autopayment) { info['emailId'] = this.policyToRenew.e_mail; }

      // alert(JSON.stringify(info));
      this.medicalInsuranceService.makePayment(info)
        .subscribe((resp: any) => {
          res(resp);
        }, (err: any) => {
          // alert(JSON.stringify(err));
          rej(err);
        });
    });
  }

  showSuccessPage() {
    this.navCtrl.setRoot('PaymentSuccessPage', { animate: true, direction: 'forward' })
  }

  showAlert(msg: string | any) {
    const aler = this.alertCtrl.create({
      title: 'Error',
      message: typeof msg === 'string' ? msg : JSON.stringify(msg),
      buttons: ['Ok']
    });
    aler.present();
  }

  // min and max date for debit/credit card expiry date
  get minDate() {
    return new Date().toISOString().slice(0, 7);
  }
  get maxDate() {
    const y: string = new Date().toISOString().slice(0, 7).split('-')[0];
    return `${Number(y) + 30}-01`;
  }

}
