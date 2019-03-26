import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MedicalInsuranceService } from '../../../providers/medicalInsurance.service';
import { BASE_PHP_URL } from '../../../providers/app.constants';
import { CustomService } from '../../../providers/custom.service';


@IonicPage()
@Component({
  selector: 'page-policy-detail',
  templateUrl: 'policy-detail.html',
})
export class PolicyDetailPage {

  policy: any;
  pdfFiles: { name: string, link: string }[];
  loading = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private medicalInsuranceService: MedicalInsuranceService,
    private customService: CustomService,
    private alert: AlertController
  ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PolicyDetailPage');
    this.policy = this.navParams.get('policy');
    this.getPdfFiles();
  }

  getPdfFiles() {
    this.loading = true;
    this.medicalInsuranceService.getPolicyPDFFiles(this.policy.transection_id)
      .subscribe(res => {
        console.log(res);

        this.loading = false;
        // res is string of file names only
        // make link of files using names
        this.pdfFiles = [];
        res && res.forEach((fileName: string) => {
          this.pdfFiles.push({
            name: fileName.split(' ').slice(0, -1).join(' '),
            link: BASE_PHP_URL + '/pdf_files/' + this.policy.transection_id + '/' + fileName
          });
        });
      }, err => {
        this.loading = false;
        this.customService.showToast(err.msg);
      });
  }
  onRenew() {
    const alert = this.alert.create({
      title: 'Confirm',
      message: 'Are you sure to renew this policy ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Renew',
        handler: () => { this.sendRenewRequest(); }
      }]
    });
    alert.present();
  }

  sendRenewRequest() {
    this.customService.showLoader();
    this.medicalInsuranceService.renewPolicy({ transactionId: this.policy.transection_id })
      .subscribe(res => {
        this.customService.hideLoader();
        // update the renewal transacetion array of policy 
        this.policy.renewalTransactions = res;
        this.showRenewalSuccessAlert();
      }, err => {
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }

  showRenewalSuccessAlert() {
    const alert = this.alert.create({
      title: 'Success',
      message: 'Policy renewed successfully. You will receive a confirmation email shortly.',
      buttons: ['ok']
    });
    alert.present();
  }

  changeDateFormat(date: string | number) {
    if (typeof date === 'string') {

      // date is in 'dd/mm/yyyy' format, convert to 'yyyy-mm-dd' so that angular date pipe can be applied to it
      const [dd, mm, yyyy] = date.split('/');
      return `${yyyy}-${mm}-${dd}`;
    } else {
      // date is in milliseconds since JAN 1, 1970, convert that to ISO format 'yyyy-mm-dd' in order to use witha angular date pipe
      return new Date(date).toISOString().slice(0, 10);
    }
  }

}
