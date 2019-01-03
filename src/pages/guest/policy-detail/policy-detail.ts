import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    private customService: CustomService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PolicyDetailPage');
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
            name: fileName.split(' ').slice(0,-1,).join(' '),
            link: BASE_PHP_URL + '/pdf_files/' + this.policy.transection_id + '/' + fileName
          });
        });
      }, err => {
        this.loading = false;
        this.customService.showToast(err.msg);
      });
  }

}
