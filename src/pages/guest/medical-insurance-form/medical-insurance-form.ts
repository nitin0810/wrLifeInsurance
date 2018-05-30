import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { MedicalInsuranceService, FormPayload } from '../../../providers/medicalInsurance.service';
import { CustomService } from '../../../providers/custom.service';



@IonicPage()
@Component({
  selector: 'page-medical-insurance-form',
  templateUrl: 'medical-insurance-form.html',
})
export class MedicalInsuranceFormPage {

  @ViewChild(Slides) slides: Slides;

  // for showing the current form
  formNames = ['Select Policy', 'Enter Details', 'Make Payment'];

  currentSlideIndex = 0;

  // state contains all the current inputs and selections
  state: FormPayload;

  //response from the server containing all the prices
  premiumInfo: any;


  // FORM-1 related data

  // static data list 
  countries: Array<any> = [
    { name: 'THAILAND', area: 'area3' },
    { name: 'SINGAPORE', area: 'area2' },
    { name: 'ZIMBABWE', area: 'area3' },
    { name: 'VIET NAM', area: 'area3' },
    { name: 'TURKEY', area: 'area3' },
  ];
  members: Array<string> = ['Individual', '2 Persons', 'Family'];
  assistantEvacuations = ['None', 'Individual', '2 Persons', 'Family'];
  globalLimits: Array<any> = [
    { name: '$ 200000 (Serenity Plan)', value: 200000, adjustmentPlanNo: 1 },
    { name: '$ 400000 (Serenity Plan)', value: 400000, adjustmentPlanNo: 2 },
    { name: '$ 600000 (Serenity Plan)', value: 600000, adjustmentPlanNo: 3 },
    { name: '$ 800000 (Serenity Plan)', value: 800000, adjustmentPlanNo: 4 },
    { name: '$ 1000000 (Serenity Plan)', value: 1000000, adjustmentPlanNo: 5 },
    { name: '$ 1000000 (Elite Plan)', value: 1000000, adjustmentPlanNo: 6 }
  ];
  adjustments: Array<any> = [
    { name: '$ 0', value: 0 },
    { name: '$ 100', value: 100 },
    { name: '$ 500', value: 500 },
    { name: '$ 1500', value: 1500 },
    { name: '$ 2000', value: 2000 },
    { name: '$ 2500', value: 2500 },
    { name: '$ 3000', value: 3000 },
    { name: '$ 3500', value: 3500 },
    { name: '$ 4000', value: 4000 },
    { name: '$ 4500', value: 4500 },
    { name: '$ 5000', value: 5000 },
  ];

  //ngModal variables for showing  inital values of some fields
  initialCountry = this.countries[0]; //THAILAND IS INITIAL CONTRY TO BE DISPLAYED
  initialMember = 'Individual';
  initialEvacuation = 'None';
  initialGlobalLimit = this.globalLimits[1];
  initialAdjustment = this.adjustments[0];

  today: string = new Date().toISOString().slice(0, 10);



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customService: CustomService,
    private medicalInsuranceService: MedicalInsuranceService
  ) { }




  ionViewDidLoad() {
    // this.slides.lockSwipeToNext(true);
    // this.slides.lockSwipeToPrev(true);
    this.state = this.medicalInsuranceService.getInitialState();
    this.calculatePremiumPrice();
  }

  slideChanged() {
    this.currentSlideIndex = this.slides.getActiveIndex();
  }

  calculatePremiumPrice() {
    console.log('state before request:', this.state);

    this.customService.showLoader();

    this.medicalInsuranceService.calculatePremiumPrice(this.state)
      .subscribe((res) => {
        console.log(res);
        this.premiumInfo = res;
        this.customService.hideLoader();
      }, (err) => {
        console.log(err);
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });;
  }

  // CHANGE HANDLERS
  onAreaChange(country: any) {
    // console.log(country);
    this.state.area = country.area;
    this.calculatePremiumPrice();
  }

  onMemberChange(members: string) {

    // in case 2 Persons is selected, state.members shud be 2-Persons
    if (members == '2 Persons') {
      this.state.members = members.split(' ').join('-');
    } else {
      this.state.members = members;
    }

    switch (members) {
      case 'Individual':
        this.state.txtApAge1 = this.state.txtApAge2 = this.state.txtApAge3 = NaN;
        break;
      case '2-Persons':
        this.state.txtApAge2 = this.state.txtApAge3 = NaN;
        break;
      case 'Family':
        this.state.txtApAge2 = this.state.txtApAge3 = NaN;
        break;
    }
    this.calculatePremiumPrice();
  }

  toggleChange(event: any, toggleNo: number) {

    switch (toggleNo) {
      case 1: this.state.complement = event.value ? 1 : 0; break;
      case 2: break; // do nothing, case of INPATIENT TOGGLE SELECT, nothing to be done as of now
      case 3: this.state.outpatientstatus = event.value ? 1 : 0; break;
      case 4: this.state.dentalstatus = event.value ? 1 : 0; break;
      case 5: this.state.member4status = event.value ? 1 : 0; break;
    }
    this.calculatePremiumPrice();
  }

  onEvacuationChange(event: any) {
    // in case 2 Persons is selected, state.members shud be 2persons
    if (event == '2 Persons') {
      this.state.selectevacuation = event.split(' ').join('').toLowerCase();
    } else {
      this.state.selectevacuation = event.toLowerCase();
    }
    this.calculatePremiumPrice();
  }

  onGlobalLimitChange(event: any) {
    this.state.globallimit = event.value;
    this.state.adjusment_plan = event.adjustmentPlanNo;
    this.calculatePremiumPrice();
  }

  onAdjustmentChange(event: any) {
    this.state.adjusment = event.value;
    this.calculatePremiumPrice();
  }

  calculateAge(date: any, memberNo: number) {

    // value of memberNo is:
    // undefined for txtApAge,  1 for txtApAge1, 2 for txtApAge2, 3 for txtApAge3
    if (!memberNo) { this.state.txtApAge = this.giveAge(date); }
    else if (memberNo == 1) { this.state.txtApAge1 = this.giveAge(date); }
    else if (memberNo == 2) { this.state.txtApAge2 = this.giveAge(date); }
    else if (memberNo == 3) { this.state.txtApAge3 = this.giveAge(date); }
    this.calculatePremiumPrice();
  }

  giveAge(date: any) {
    const dob = new Date(date.year, date.month - 1, date.day);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  onGoAhead() {
    this.slides.lockSwipeToNext(false);
    this.slides.lockSwipeToPrev(false);
    this.slides.slideNext();
  }


}
