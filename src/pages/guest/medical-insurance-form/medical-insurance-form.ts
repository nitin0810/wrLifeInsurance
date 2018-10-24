import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Navbar, AlertController, Alert, Platform, Modal, ModalController, ViewController } from 'ionic-angular';
import { MedicalInsuranceService, FormPayload } from '../../../providers/medicalInsurance.service';
import { CustomService } from '../../../providers/custom.service';
import { Content } from 'ionic-angular';
import { Child } from '../../../Classes/child';
import { Stripe } from '@ionic-native/stripe';
import { AuthService } from '../../../providers/auth.service';
import { STRIPE_KEY } from '../../../providers/app.constants';
import { LinkedIn, LinkedInLoginScopes } from '@ionic-native/linkedin';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


@IonicPage()
@Component({
  selector: 'page-medical-insurance-form',
  templateUrl: 'medical-insurance-form.html',
})
export class MedicalInsuranceFormPage {

  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  @ViewChild(Navbar) navBar: Navbar; // for overriding backbtn's default functionality
  unregisterBackButtonActionForAndroid: any;


  // for showing the current form
  formNames = ['Select Policy', 'Enter Details', 'Summary', 'Payment'];
  showFooter = false;
  title = `Step 1: ${this.formNames[0]}`;

  // state contains all the current inputs and selections and used to calculate premium  price
  state: FormPayload;

  //response from the server containing all the prices
  premiumInfo: any;
  brokerId: string;


  // FORM-1 related data

  countries: Array<{ area_name: string, country_name: string, status: number, uid: string }>; // fetched from server
  // static data list 
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
  inpatientToggle = true; // always remain true and disabled

  //ngModel variables for Date of Births
  dobs: Array<any> = [];

  // today is just for setting the max/min date selectable from calender
  today: string = new Date().toISOString().slice(0, 10);

  // for restricting the max date on calendar while selecting starting date of cover, it shud be within 365 days
  nextYearSameDate: string = `${Number(this.today.split('-')[0]) + 1}-${this.today.split('-')[1]}-${this.today.split('-')[2]}`;

  // maximum possible age for main person and children are obtained from server
  // based on which minimum selectable dob is decided
  maxAgeMain: number;
  maxAgeChild: number;

  //minimum selectable DOB for main person (calculated using maxAgeMain)
  minDOBMain: string;
  //minimum selectable DOB for children (calculated using maxAgeChild)
  minDOBChild: string;


  //variables to show/hide different optional fields group
  showModulesToggles = false; // form1
  otherPersonalInfoToggle = false; //  form2 
  planInfoToggle = false; //  form2

  //variables for taking payment details
  card: any = {
    cardNumber: '',
    cardExpiryDate: '',//MMMM-YY
    cvv: ''
  }

  // used for filling name and email in forms using already present info in case user is logged in
  userStoredInfo: any;

  // min and max date for debit/credit card expiry date
  get minDate() {
    return new Date().toISOString().slice(0, 7);
  }
  get maxDate() {
    const y: string = new Date().toISOString().slice(0, 7).split('-')[0];
    return `${Number(y) + 30}-01`;
  }

  // subscriptions for unsubscribing pending request when leaving the page
  subscriptions = {
    countryAge: null,
    broker: null,
    premium: null,
    form2: null,
    payment: null
  };



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customService: CustomService,
    private authService: AuthService,
    private medicalInsuranceService: MedicalInsuranceService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private stripe: Stripe,
    private linkedIn: LinkedIn,
    private facebook: Facebook,
  ) { }


  ionViewDidLoad() {
    // setTimeout(() => {
    //   this.slides.slideTo(2); //remove
    //   this.navCtrl.pop();
    // }, 500);
    this.lockSliding(true);
    this.getCountriesAndAge();
    this.overrideBackBtnFunctionality();
    this.userStoredInfo = this.authService.getUserDetails();
  }

  ionViewWillLeave() {

    //hide loader in case its visible (any request is pending)
    try {
      // console.log('trying...1');
      // put this line inside try block as it generates error if loader is not visible
      this.customService.hideLoader();
    } catch (e) {
      // console.log('error', e);
    }

    // unsubscribe from requests subscriptions, it is done in order to remova a bug in which
    // after closing the page while a request is in progress, code related to request subscription
    // still executes even page is closed
    this.subscriptions.countryAge && this.subscriptions.countryAge.unsubscribe();
    this.subscriptions.broker && this.subscriptions.broker.unsubscribe();
    this.subscriptions.premium && this.subscriptions.premium.unsubscribe();
    this.subscriptions.payment && this.subscriptions.payment.unsubscribe();
    this.subscriptions.form2 && this.subscriptions.form2.unsubscribe();
    // Unregister the custom back button action for this page
    this.unregisterBackButtonActionForAndroid && this.unregisterBackButtonActionForAndroid();
  }

  overrideBackBtnFunctionality() {

    /**overides the defult behaviour of navbar back btn
     * Show an alert stating: 'any filled data in form will be lost on going back'
     */
    this.navBar.backButtonClick = (ev: any) => {
      ev.preventDefault();
      ev.stopPropagation();
      // check if the data being fethed in the initial request is available
      // then only alert the user to confirm leaving the page, not otherwise
      if (this.countries && this.premiumInfo) {
        this.showpageLeaveAlert();
      } else {
        this.navCtrl.pop();
      }
    }


    /**handle the android hardware back btn for the same purpose*/
    if (this.platform.is('android')) {
      this.unregisterBackButtonActionForAndroid = this.platform.registerBackButtonAction(() => {
        if (this.countries && this.premiumInfo) {
          this.showpageLeaveAlert();
        } else {
          this.navCtrl.pop();
        }
      });
    }
  }

  showpageLeaveAlert() {

    const alert: Alert = this.alertCtrl.create({
      title: 'Alert',
      message: 'Any Information filled in this form will be lost on leaving this page. Are you sure to leave ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Leave',
        handler: () => { this.navCtrl.pop(); }
      }]

    });
    alert.present();
  }

  getCountriesAndAge() {
    this.customService.showLoader();
    this.subscriptions.countryAge = this.medicalInsuranceService.getCountriesAndAge()
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
        try {
          // console.log('---------------------------------------');
          // console.log('trying...2');
          this.customService.hideLoader();
        } catch (e) {
          // console.log('error2',e);
        }

        this.calculatePremiumPrice();
        this.getBrokerId();
      }, (err: any) => {
        try {
          // console.log('trying...3');
          this.customService.hideLoader();
        } catch (e) {
          //  console.log('error3',e);
        }
        this.customService.showToast(err.msg);
      });
  }

  getBrokerId() {
    this.subscriptions.broker = this.medicalInsuranceService.getBrokerId()
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

  changTitle(slideIndex: number) {
    this.title = `Step ${slideIndex + 1}: ${this.formNames[slideIndex]}`;
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

    this.changTitle(currentSlideIndex);
  }

  calculatePremiumPrice() {
    // console.log(this.state);

    this.customService.showLoader('Calculating Price...');
    this.subscriptions.premium = this.medicalInsuranceService.calculatePremiumPrice(this.state)
      .subscribe((res) => {
        this.premiumInfo = res;
        this.showFooter = true;
        this.content.resize();
        try {
          // console.log('trying price success');
          this.customService.hideLoader();
        } catch (e) {
          // console.log('error', e);
        }
      }, (err) => {
        try {
          // console.log('trying price error');
          this.customService.hideLoader();
        } catch (e) {
          // console.log('error', e);
        }
        // info about the error response from php server is not available, 
        // So check if error is obtained or not
        if (err) {
          const msg = JSON.stringify(err) + "\n" + "Please Try Again";
          const alert: Alert = this.alertCtrl.create({
            title: 'Error',
            message: msg,
            buttons: ['Dismiss']
          });
          alert.present();

        } else {
          this.customService.showToast('Some error occured, Please try again');

        }
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

    // in case 2 Persons is selected, state.members shud be '2-Persons'
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
    // check if response is present or not, only then move to next slide
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
  form2SubmitResponse: any; // contains info such as transactionId, policyId etc.


  setPayloadData() {
    const form2DetailsCopy = JSON.parse(JSON.stringify(this.form2Details));

    this.form2Details = {
      policy_owner_first: form2DetailsCopy.policy_owner_first || (this.userStoredInfo && this.userStoredInfo.first_name) || '',
      policy_owner_last: form2DetailsCopy.policy_owner_last || (this.userStoredInfo && this.userStoredInfo.last_name) || '',
      sex: form2DetailsCopy.sex || 0, //Male: 0, Female: 1
      dateofbirth_main: this.changeDateFormat(this.dobs[0]), // main person's DOB
      family_description: this.state.members,
      nationality: form2DetailsCopy.nationality || this.countries[0].country_name,
      expatriation_address: form2DetailsCopy.expatriation_address || '',
      billing_address: form2DetailsCopy.billing_address || '',

      Phone: form2DetailsCopy.Phone || '',
      mobile_phone: form2DetailsCopy.mobile_phone || '',
      mail_id: form2DetailsCopy.mail_id || (this.userStoredInfo && this.userStoredInfo.email) || '',
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
    const d: string[] = date.split('-');
    return `${d[2]}/${d[1]}/${d[0]}`;
  }

  setDateOfCover(date: any) {

    this.form2Details.date_of_cover = this.changeDateFormat(`${date.year}-${date.month < 10 ? '0' + date.month : date.month}-${date.day < 10 ? '0' + date.day : date.day}`);
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

  onNext() {
    this.lockSliding(false);
    this.slides.slideNext();
    this.lockSliding(true);
  }

  onGoToPaymentBtn() {
    // validate phone and email format before submitting form
    if (!this.validateMailAndPhone()) { return; }

    const payLoad: any = this.prepareData();
    this.customService.showLoader();
    this.subscriptions.form2 = this.medicalInsuranceService.submitForm2(payLoad)
      .subscribe((res: any) => {

        this.customService.hideLoader();
        this.onNext();
        this.form2SubmitResponse = res;
      }, (err: any) => {
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }

  validateMailAndPhone() {
    //validate mobile number
    const re1 = /^[0-9]+$/;
    if (!re1.test(this.form2Details.mobile_phone)) {
      this.customService.showToast('Please enter a valid mobile number');
      return false;
    }
    //validate email
    const re2 = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re2.test(this.form2Details.mail_id)) {
      this.customService.showToast('Please enter a valid email address');
      return false;
    }
    return true;
  }


  prepareData() {
    let payLoad: any = {};
    // collect all the info except parner and children info (which is to be included in another key)
    for (let key in this.form2Details) {
      if (key.indexOf('partner') == -1) {
        payLoad[key] = this.form2Details[key];
      }
    }

    // form2 array contains the info of partner and children in a single array
    // partner and children are considered same type of entity and have same properties
    // except 'memberType' property which is used to distinguish them
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
    // getting converted into string by ngModel.
    // Convert following values explicitly to integer
    payLoad['sex'] = parseInt(payLoad['sex']);
    payLoad['preexisting_main_insured'] = parseInt(payLoad['preexisting_main_insured']);
    payLoad['form2'].forEach((child: any) => {
      child['sex'] = parseInt(child['sex']);
      child['preexisting'] = parseInt(child['preexisting']);
    });

    // console.log(payLoad);
    return payLoad;
  }

  onEnterPaymentDetais() {

    const alert: Alert = this.alertCtrl.create({
      title: 'Enroll With',
      inputs: [
        {
          type: 'radio',
          label: 'Facebook',
          value: 'fb'
        }, {
          type: 'radio',
          label: 'LinkedIn',
          value: 'li',
        }, {
          type: 'radio',
          label: 'Continue as Guest',
          value: 'none',
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        // handler:
      }, {
        text: 'Continue',
        handler: this.loginWithHandler.bind(this)
      }]
    });

    alert.present();
    // this.onNext();
  }

  loginWithHandler(data: string) {
    if(data==='fb'){this.onFbLogin();}
    else if(data==='li'){this.onLinkedinLogin();}
    else if(data==='none'){this.onNext();}
  }


  onMakePaymentBtn() {

    if (!this.isCardValid()) {
      this.customService.showToast('Please enter correct card details');
      return;
    };
    this.customService.showLoader();
    this.getCardToken()
      .then(token => this.makePayment(token))
      .then((response: any) => {
        // show success alert
        // alert(JSON.stringify(response));
        if (!response.failure_code) {
          this.showSuccessPage();
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
    // console.log(this.card.cardNumber);
    // console.log(this.card);
    // alert(JSON.stringify(this.card));
    const re = /^[0-9]+$/;
    if (!re.test(this.card.cardNumber)) { debugger; return false; }
    if (!re.test(this.card.cvv)) { debugger; return false; }
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

  makePayment(token) {
    // alert('make ayment called//,' + token);
    return new Promise((res, rej) => {

      const info = {
        transactionId: this.form2SubmitResponse.transaction_id,
        membershipNumber: this.form2SubmitResponse.membership_number,
        subscriptionPackage: this.form2SubmitResponse.policy_id,
        description: `transId: ${this.form2SubmitResponse.transaction_id}, membershipNo: ${this.form2SubmitResponse.membership_number}`,
        stripeToken: token
      };

      // const info = {
      //   transactionId: 'MDI8417898',
      //   membershipNumber: '6835511',
      //   subscriptionPackage: 'MDI',
      //   description: `TEST`,
      //   stripeToken: token
      // };
      // alert(JSON.stringify(info));
      this.subscriptions.payment = this.medicalInsuranceService.makePayment(info)
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


  showDefiniton(title: string) {
    this.navCtrl.push('AllDefinitionsPage', { 'title': title });
  }

  showAlert(msg: string | any) {
    const aler = this.alertCtrl.create({
      title: 'Error',
      message: typeof msg === 'string' ? msg : JSON.stringify(msg),
      buttons: ['Ok']
    });
    aler.present();
  }

  // Methods related to fb and linked in login

  onFbLogin() {
    this.customService.showLoader();
    this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        // alert(JSON.stringify(res));
        return this.authService.sendFacebokToken(res.authResponse.accessToken).toPromise();
      })
      .then((backendToken: any) => {
        // alert(JSON.stringify(backendToken));
        this.authService.saveToken(backendToken.token)
        return this.authService.fetchUserDetails().toPromise();
      })
      .then(() => this.onNext())
      .catch(this.handleError.bind(this))
      .then(() => {
        this.customService.hideLoader();
      });
  }

  onLinkedinLogin() {

    this.customService.showLoader();
    const scopes: LinkedInLoginScopes[] = ['r_basicprofile', 'r_emailaddress'/**, 'rw_company_admin', 'w_share'*/];
    this.linkedIn.login(scopes, true)
      .then((res: any) => this.linkedIn.getActiveSession())
      .then((linkedInToken: any) => this.authService.sendLinkedinToken(linkedInToken.accessToken).toPromise())
      .then((backendToken: any) => {
        this.authService.saveToken(backendToken.token)
        return this.authService.fetchUserDetails().toPromise();
      })
      .then(() => this.onNext())
      .catch(this.handleError.bind(this))
      .then(() => {
        this.customService.hideLoader();
      });
  }

  handleError(err: any) {
    let error = '';
    if (typeof err === 'string') { // err object in JSON format
      try {
        error = JSON.parse(err).errorMessage || JSON.parse(err).message || '';
      } catch (e) {
        error = err;
      }
    } else {
      error = err.errorMessage || err.message || err.msg || '';
    }
    this.showAlert(error || err);
    localStorage.clear();
  }


}