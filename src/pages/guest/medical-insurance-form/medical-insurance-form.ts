import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { MedicalInsuranceService, FormPayload } from '../../../providers/medicalInsurance.service';
import { CustomService } from '../../../providers/custom.service';
import { Content } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-medical-insurance-form',
  templateUrl: 'medical-insurance-form.html',
})
export class MedicalInsuranceFormPage {

  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;

  // for showing the current form
  formNames = ['Select Policy', 'Enter Details', 'Make Payment'];

  currentSlideIndex = 0;
  showFooter = true;

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
  //ngModel variables for Date of Births ,used only for 'required' validation in ion-datetime, which 
  // does not work without ngModel variable
  dobs: Array<any> = [];

  today: string = new Date().toISOString().slice(0, 10);



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customService: CustomService,
    private medicalInsuranceService: MedicalInsuranceService
  ) { }




  ionViewDidLoad() {
    this.lockSliding(true);
    this.state = this.medicalInsuranceService.getInitialState();
    this.calculatePremiumPrice();
  }

  lockSliding(bool: boolean) {
    this.slides.lockSwipeToNext(bool);
    this.slides.lockSwipeToPrev(bool);
  }

  slideChanged() {
    this.currentSlideIndex = this.slides.getActiveIndex();
    if (this.currentSlideIndex == 0) {
      this.showFooter = true;
      this.content.resize();
      this.lockSliding(true);
    } else {
      this.showFooter = false;
    }

  }

  calculatePremiumPrice() {

    this.customService.showLoader();

    this.medicalInsuranceService.calculatePremiumPrice(this.state)
      .subscribe((res) => {
        this.premiumInfo = res;
        this.customService.hideLoader();
      }, (err) => {
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

    // Reset the dobs array items in order to avoid trigger of their (ionchange) event
    // if this is not done, it causes the multiple requests when members is changed
    // may lead to bugs
    if (this.state.members == '2-Persons') {
      members == 'Individual' && (this.dobs[1] = undefined);
    }
    if (this.state.members == 'Family') {
      members == 'Individual' ? this.dobs.fill(undefined, 1, 4) : this.dobs.fill(undefined, 2, 4);
    }
    // end of resetting the array items

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
    this.customService.showLoader();
    this.slides.lockSwipeToNext(false);
    this.slides.lockSwipeToPrev(false);
    this.showFooter = false;
    this.content.resize();
    setTimeout(() => {
      this.customService.hideLoader();
      this.slides.slideNext(); 
      this.lockSliding(true);
    }, 800);
  }


  // Slide 2 methods
  onBack(){
    this.lockSliding(false);
    this.slides.slidePrev();
  }

}