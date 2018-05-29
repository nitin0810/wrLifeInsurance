import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { MedicalInsuranceService, FormPayload } from '../../../providers/medicalInsurance.service';



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


  // FORM-1 related data
  countries: Array<any> = [
    { name: 'THAILAND', area: 'area3' },
    { name: 'SINGAPORE', area: 'area2' },
    { name: 'ZIMBABWE', area: 'area3' },
    { name: 'VIET NAM', area: 'area3' },
    { name: 'TURKEY', area: 'area3' },
  ];
  members: Array<string> = ['Individual', '2-Persons', 'Family'];
  assistantEvacuations = ['Individual', '2-Persons', 'Family'];
  globalLimits: Array<any> = [
    { name: '$ 200000 (Serenity Plan)', value: 200000 },
    { name: '$ 400000 (Serenity Plan)', value: 400000 },
    { name: '$ 600000 (Serenity Plan)', value: 600000 },
    { name: '$ 800000 (Serenity Plan)', value: 800000 },
    { name: '$ 1000000 (Serenity Plan)', value: 1000000 },
    { name: '$ 1000000 (Elite Plan)', value: 1000000 }
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
  today: string = new Date().toISOString().slice(0, 10);



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private medicalInsuranceService: MedicalInsuranceService
  ) { }




  ionViewDidLoad() {
    this.slides.lockSwipeToNext(true);
    this.slides.lockSwipeToPrev(true);
    this.state = this.medicalInsuranceService.getInitialState();
    this.fetchDefaultPrice();
  }

  slideChanged() {
    this.currentSlideIndex = this.slides.getActiveIndex();
  }

  fetchDefaultPrice() {
    this.medicalInsuranceService.calculatePremiumPrice(this.state)
      .subscribe((res) => {
        console.log(res);

      }, (err) => {
        console.log(err);

      });;
  }

  // CHANGE HANDLERS
  onAreaChange(country: any) {
    // console.log(country);
    this.state.area = country.area;
    this.calculatePremiumPrice();
  }

  onMemberChange(members: string) {
    console.log(members);
    this.state.members = members;
    this.calculatePremiumPrice();
  }

  calculateAge(date: any, memberNo: number) {
    console.log(date);
    console.log(memberNo);
    console.log(this.giveAge(date));


    // value of memberNo is:
    // undefined for txtApAge,  1 for txtApAge1, 2 for txtApAge2, 3 for txtApAge3
    if (!memberNo) { this.state.txtApAge = this.giveAge(date); return; }
    if (memberNo == 1) { this.state.txtApAge1 = this.giveAge(date); return; }
    if (memberNo == 2) { this.state.txtApAge2 = this.giveAge(date); return; }
    if (memberNo == 3) { this.state.txtApAge3 = this.giveAge(date); return; }
    this.calculatePremiumPrice();
  }

  giveAge(date: any) {
    const dob = new Date(date.year, date.month - 1, date.day);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  calculatePremiumPrice() {

  }

  onGoAhead() {

  }


}
