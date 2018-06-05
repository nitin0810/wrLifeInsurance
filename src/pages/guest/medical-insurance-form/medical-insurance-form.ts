import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { MedicalInsuranceService, FormPayload } from '../../../providers/medicalInsurance.service';
import { CustomService } from '../../../providers/custom.service';
import { Content } from 'ionic-angular';
import { Child } from '../../../Classes/child';


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
  selectedFormIndex = 0;
  showFooter = false;

  // state contains all the current inputs and selections
  state: FormPayload;

  //response from the server containing all the prices
  premiumInfo: any;
  brokerId = 'patlor1234';


  // FORM-1 related data

  // static data list 
  countries: Array<{ area_name: string, country_name: string, status: number, uid: string }>;
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

  //ngModel variables for showing  inital values of some fields
  initialCountry;
  initialMember = 'Individual';
  initialEvacuation = 'None';
  initialGlobalLimit = this.globalLimits[1];
  initialAdjustment = this.adjustments[0];
  inpatientToggle = false;

  //ngModel variables for Date of Births
  dobs: Array<any> = [];

  // today is just for setting the max date selectable from calender
  today: string = new Date().toISOString().slice(0, 10);

  maxAgeMain: number;
  maxAgeChild: number;
  //minimum selectable DOB for main person (depends on maxAgeMain)
  minDOBMain: string;
  //minimum selectable DOB for children (depends on maxAgeChild)
  minDOBChild: string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customService: CustomService,
    private medicalInsuranceService: MedicalInsuranceService
  ) { }


  ionViewDidLoad() {
    this.lockSliding(true);
    this.getCountriesAndAge();
  }

  getCountriesAndAge() {
    this.customService.showLoader();
    this.medicalInsuranceService.getCountriesAndAge()
      .subscribe((res: any) => {

        //set max ages
        this.maxAgeMain = res.age[0].max_age;
        this.maxAgeChild = res.age[0].child_max_age;
        this.setMinDOBs(this.maxAgeMain, this.maxAgeChild);
        //set countries
        this.countries = res.countryAreas;
        this.initialCountry = this.countries[0];
        // get the premium info for the first time
        this.state = this.medicalInsuranceService.getInitialState(this.initialCountry.area_name);
        this.customService.hideLoader();
        this.calculatePremiumPrice();
        this.getBrokerId();
      }, (err: any) => {
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }

  getBrokerId() {
    this.medicalInsuranceService.getBrokerId()
      .subscribe((res: any) => {
        this.brokerId = res.brokerId;
      }, (err: any) => {
        this.customService.showToast(err.msg || "Couldn't fetch broker Id");
      });
  }

  setMinDOBs(maxAge: number, maxAgeChild: number) {
    const today = new Date();
    this.minDOBMain = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate()).toISOString().slice(0, 10);
    this.minDOBChild = new Date(today.getFullYear() - maxAgeChild, today.getMonth(), today.getDate()).toISOString().slice(0, 10);
  }

  lockSliding(bool: boolean) {
    this.slides.lockSwipeToNext(bool);
    this.slides.lockSwipeToPrev(bool);
  }

  highlightSelectedForm() {

    const totalSlides = this.state.members == 'Individual' ? 8 : 9;
    if (this.slides.getActiveIndex() == 0) {
      this.selectedFormIndex = 0;
    } else if (this.slides.getActiveIndex() >= 1 && this.slides.getActiveIndex() < totalSlides - 1) {
      this.selectedFormIndex = 1;
    } else {
      this.selectedFormIndex = 2;
    }


  }

  slideChanged() {
    const currentSlideIndex = this.slides.getActiveIndex();
    if (currentSlideIndex == 0) {
      this.showFooter = true;
      this.content.resize();
      this.lockSliding(true);
    } else {
      this.showFooter = false;
    }
    this.highlightSelectedForm();
  }

  calculatePremiumPrice() {
    this.customService.showLoader('Calculating Price...');
    this.medicalInsuranceService.calculatePremiumPrice(this.state)
      .subscribe((res) => {
        this.premiumInfo = res;
        this.showFooter = true;
        this.content.resize();
        this.customService.hideLoader();
      }, (err) => {
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }

  // CHANGE HANDLERS
  onAreaChange(country: any) {
    // console.log(country);
    this.state.area = country.area_name;
    this.calculatePremiumPrice();
  }

  onMemberChange(members: string) {

    // Reset the dobs array items in order to avoid trigger of their (ionchange) event
    // if this is not done, it causes the multiple requests when members is changed
    // may lead to bugs

    //clear the childrenDetail array whenever  inidividual and 2-Person is selected
    if (members == 'Individual' || members == '2 Persons') {
      this.childrenDetail = [];
    }

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
    // chcek if response is present or not, only then move to next slide
    //it is done to handle the case when form has become valid( as DOB is selected) 
    //but some network error occurred while fetching the response

    if (!this.premiumInfo) {
      this.customService.showToast('Some Error occured, Try again filling the form from start');
      return;
    }
    this.customService.showLoader();
    this.showFooter = false;
    this.content.resize();
    setTimeout(() => {
      this.lockSliding(false);
      this.slides.slideNext();
      this.lockSliding(true);
      this.customService.hideLoader();
      this.setPayloadData(); //call this everytime when we go from form1 to form2
    }, 800);
  }


  // Slide 2 and onwards related related data and methods

  //ngModel variables
  form2Details: any = {};
  addressToggleValue = false;
  childrenDetail: Array<Child> = []; //  contains all the details of children
  dobsForm2: Array<any> = []; // contains DOBs of all children, used only for displaying and calculating age, not to be sent to server
  MAXCHILD = 16;
  date_of_cover: string = ''; // just for form validation


  setPayloadData() {
    const form2DetailsCopy = JSON.parse(JSON.stringify(this.form2Details));

    this.form2Details = {
      policy_owner_first: form2DetailsCopy.policy_owner_first || '',
      policy_owner_last: form2DetailsCopy.policy_owner_last || '',
      sex: form2DetailsCopy.sex || 0, //Male: 0, Female: 1
      dateofbirth_main: this.changeDateFormat(this.dobs[0]), // main person's DOB
      family_description: this.state.members,
      nationality: form2DetailsCopy.nationality || this.countries[0].country_name,
      expatriation_address: form2DetailsCopy.expatriation_address || '',
      billing_address: form2DetailsCopy.billing_address || '',

      Phone: form2DetailsCopy.Phone || '',
      mobile_phone: form2DetailsCopy.mobile_phone || '',
      mail_id: form2DetailsCopy.mail_id || '',
      skype_id: form2DetailsCopy.skype_id || '',

      first_usd_cover: this.state.complement == 1 ? 0 : 1,
      // CFE checkbox info is included in form1(state)
      security_CFE: this.state.complement,
      security_CFE_1: form2DetailsCopy.security_CFE_1 || '',

      serenity_cover: this.premiumInfo.plan == 'SERENITY PLAN' ? 1 : 0,
      inpatient_modules: this.inpatientToggle ? 1 : 0,
      outpatient_modules: this.state.outpatientstatus ? 1 : 0,
      dental_optical_modules: this.state.dentalstatus ? 1 : 0,
      assistance_evacuation_modules: this.state.selectevacuation == 'None'.toLowerCase() ? 0 : 1,

      main_insured_height: form2DetailsCopy.main_insured_height || '',
      main_insured_weight: form2DetailsCopy.main_insured_weight || '',

      preexisting_main_insured: form2DetailsCopy.preexisting_main_insured || 0,
      preexisting_main_insured_1: form2DetailsCopy.preexisting_main_insured_1 || '',

      adjust_globallimit: this.state.globallimit,
      hospital_adjusment: this.state.adjusment,
      date_of_cover: form2DetailsCopy.date_of_cover || '',
      currency: form2DetailsCopy.currency || 1,
      frequency_payment: form2DetailsCopy.frequency_payment || 'Annual'

    };

    if (this.state.members == '2-Persons' || this.state.members == 'Family') {
      this.form2Details['partner_first'] = this.form2Details['partner_first'] || '';
      this.form2Details['partner_last'] = this.form2Details['partner_last'] || '';
      this.form2Details['partner_sex'] = this.form2Details['partner_sex'] || 0;
      this.form2Details['partner_dob'] = this.changeDateFormat(this.dobs[1]) || '';
      this.form2Details['partner_height'] = this.form2Details['partner_height'] || '';
      this.form2Details['partner_weight'] = this.form2Details['partner_weight'] || '';
      this.form2Details['preexisting_partner'] = this.form2Details['preexisting_partner'] || 0;
      this.form2Details['preexisting_partner_1'] = this.form2Details['preexisting_partner_1'] || '';
    }

    if (this.state.members == 'Family') {

      //clear the children detail array
      this.childrenDetail = [];

      this.childrenDetail.push(new Child(2, this.changeDateFormat(this.dobs[2]))); // this is Child1 (3rd member)

      if (this.state.member4status == 1) {
        this.childrenDetail.push(new Child(3, this.changeDateFormat(this.dobs[3])));// this is Child2 (4th member)
      }
    }
  }

  onSameAddressToggle() {
    this.addressToggleValue ? this.form2Details.billing_address = this.form2Details.expatriation_address : this.form2Details.billing_address = '';
  }

  onExpatriationAddressChange() {
    if (this.addressToggleValue) { this.form2Details.billing_address = this.form2Details.expatriation_address; }
  }

  changeDateFormat(date: string) {
    // date is in yyyy-mm-dd format
    // output data will be in dd/mm/yyyy format for showing on screen
    const d: any = date.split('-');
    return `${d[2]}/${d[1]}/${d[0]}`;
  }

  setDateOfCover(date: any) {

    this.form2Details.date_of_cover = this.changeDateFormat(`${date.year}-${date.month<10?'0'+date.month:date.month}-${date.day<10?'0'+date.day:date.day}`);
  }

  calculateAgeForForm2(date: any, child: any, index: number) {
    child.age = this.giveAge(date);

    //set dob in dd/yy/mmm format
    const yyyy = date.year,
      mm = date.month < 10 ? '0' + date.month : date.month,
      dd = date.day < 10 ? '0' + date.day : date.day;
    child.dob = `${dd}/${mm}/${yyyy}`;
  }

  onAddChildBtn() {
    // all added child will have memberType:3
    this.childrenDetail.push(new Child(3));
  }

  onRemoveChildBtn(index: number) {
    this.childrenDetail.splice(index, 1);
    this.dobsForm2[index] = null;
  }


  onPrev() {
    this.lockSliding(false);
    this.slides.slidePrev();
    this.lockSliding(true);
  }

  onNext(formNo: number) {
    // perform additional form validation here 
    // forms can be differentiated using formNo 
    if (formNo == 3) {

      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.form2Details.mail_id)) {
        this.customService.showToast('Please enter a valid email address');
        return;
      }
    }

    this.lockSliding(false);
    this.slides.slideNext();
    this.lockSliding(true);
  }

  onGoToPaymentBtn() {

    const payLoad: any = this.prepareData();
    this.customService.showLoader();
    this.medicalInsuranceService.submitForm2(payLoad)
      .subscribe((res: any) => {
        this.customService.hideLoader();
        this.lockSliding(false);
        this.slides.slideNext();
        this.lockSliding(true);
      }, (err: any) => {
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }


  prepareData() {
    let payLoad: any = {};
    // cllect all the info except parner and children info (that is to be included in another key)
    for (let key in this.form2Details) {
      if (key.indexOf('partner') == -1) {
        payLoad[key] = this.form2Details[key];
      }
    }

    // form2 array contains the info of partner and children in a single array
    // partner and children are considered as same type of entity and have same properties
    // except 'memberType' key used to distinguish them
    payLoad['form2'] = [];

    if (this.state.members == '2-Persons' || this.state.members == 'Family') {

      const partnerInfo: any = {
        first: this.form2Details['partner_first'],
        last: this.form2Details['partner_last'],
        sex: this.form2Details['partner_sex'],
        dob: this.form2Details['partner_dob'],
        height: this.form2Details['partner_height'],
        weight: this.form2Details['partner_weight'],
        preexisting: this.form2Details['preexisting_partner'],
        preexisting_1: this.form2Details['preexisting_partner_1'],
        memberType: 1
      };

      payLoad['form2'].push(partnerInfo);
    }


    if (this.state.members == 'Family') {

      payLoad['form2'] = payLoad['form2'].concat(this.childrenDetail)
    }
    
    payLoad['yearly_1'] = this.premiumInfo.yearly_1;
    payLoad['yearly_2'] = this.premiumInfo.yearly_2;
    payLoad['monthly_1'] = this.premiumInfo.monthly_1;
    payLoad['monthly_2'] = this.premiumInfo.monthly_2;
    payLoad['biannually_1'] = this.premiumInfo.biannually_1;
    payLoad['biannually_2'] = this.premiumInfo.biannually_2;
    payLoad['quarterly_1'] = this.premiumInfo.quarterly_1;
    payLoad['quarterly_2'] = this.premiumInfo.quarterly_2;
    
    payLoad['POLICY_AREA'] = this.state.area.toUpperCase();
    payLoad['CHILD_MAX_AGE'] = this.maxAgeChild;
    
    
    // BUG SOLVING: convert the values which are supposed to be integer type but
    // getting converted into string by ngModel
    // convert following values explicitly to integer
    payLoad['sex'] = parseInt(payLoad['sex']);
    payLoad['preexisting_main_insured'] = parseInt(payLoad['preexisting_main_insured']);
    payLoad['form2'].forEach((child: any) => {
      child['sex'] = parseInt(child['sex']);
      child['preexisting'] = parseInt(child['preexisting']);
    });
    
    console.log(payLoad);
    return payLoad;
  }





}