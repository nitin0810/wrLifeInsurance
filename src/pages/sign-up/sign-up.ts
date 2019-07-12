import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { CustomService } from '../../providers/custom.service';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
  signupForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public viewCtrl: ViewController,
    private authService: AuthService,
    private customService: CustomService
  ) {
    this.signupForm = this.getForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  getForm() {
    return this.fb.group({
      first: ['', [Validators.required]],
      last: ['', [Validators.required]],
      phone: ['',Validators.pattern(new RegExp('^[0-9]+$'))],
      skypeId: [''],
      mailId: ['',[Validators.required,Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.customService.showLoader();
    delete this.signupForm.value['confirmPassword'];
    this.authService.signup(this.signupForm.value).subscribe(
      response => {
        this.customService.showToast('Signup Successfully');
        this.customService.hideLoader();
        this.dismiss();
      },
      error => {
        this.customService.showToast(error.msg);
        this.customService.hideLoader();
      }
    );
  }

  checkPassword() {
    let pass = this.signupForm.controls.password.value;
    let confirmPass = this.signupForm.controls.confirmPassword.value;
    return pass != confirmPass ? true : false; 
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
