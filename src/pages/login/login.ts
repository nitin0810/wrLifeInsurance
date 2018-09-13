import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events, MenuController, AlertController } from 'ionic-angular';
import { GuestHomePage } from '../guest/home/home';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { LinkedInLoginScopes, LinkedIn } from '@ionic-native/linkedin';
import { CustomService } from '../../providers/custom.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  logging = false;
  errorMsg = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private fb: FormBuilder,
    private menu: MenuController,
    private authService: AuthService,
    private linkedIn: LinkedIn,
    private facebook: Facebook,
    private alertCtrl: AlertController,
    private customService: CustomService
  ) { }


  ngOnInit() {
    this.menu.close();
    this.createForm();
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {

    if (!this.loginForm.valid) {
      this.showError();
      return;
    }
    this.logging = true;
    this.errorMsg = '';

  }

  login() {

    // this.authService.login(this.loginForm.value)
    //   .subscribe((res: any) => {
    //     // this.storeInfo(res);
    //     setTimeout(() => {

    //       this.navigate();
    //     }, 1000);
    //   }, (err: any) => {
    //     this.logging = false;
    //     this.showError(err.msg);
    //   });
  }

  showError(msg?: string) {
    if (msg) { this.errorMsg = msg; return; }
    if (this.loginForm.controls.username.invalid) {
      this.errorMsg = 'Please enter username';
      return;
    }
    if (this.loginForm.controls.password.invalid) {
      this.errorMsg = 'Please enter password';
      return;
    }
  }

  onGuest() {
    this.events.publish('user:login');
    // this.navCtrl.setRoot(GuestHomePage);
  }



  onFbLogin() {
    this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        alert(JSON.stringify(res));
      })
      .catch((e: any) => {

      })
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
      .then(() => this.navigate())
      .catch((err: any) => {
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
      })
      .then(() => {
        this.customService.hideLoader();
        localStorage.clear();
      })
  }



  navigate() {
    this.events.publish('user:login');
  }


  showAlert(msg: string | any) {
    const aler = this.alertCtrl.create({
      title: 'Error',
      message: typeof msg === 'string' ? msg : JSON.stringify(msg),
      buttons: ['Ok']
    });
    aler.present();
  }
}
