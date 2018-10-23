import { Component, ViewChild } from '@angular/core';
import { Platform, Events, App, AlertController, MenuController, Nav, Alert, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserSessionManage } from '../Classes/user-session-manage';


import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';
import { CustomService } from '../providers/custom.service';

@Component({
  templateUrl: 'app.html'
})


export class MyApp extends UserSessionManage {

  @ViewChild(Nav) nav: Nav;
  defaultUserImage: string = "assets/imgs/user.png";
  unregisterBackButtonActionForAndroid: Function;
  exitAppPopup: Alert;

  constructor(
    public events: Events,
    public appCtrl: App,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public networkService: NetworkService,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public menu: MenuController,
    private customSercvice: CustomService,
  ) {
    super(events, appCtrl, authService, alertCtrl, networkService, menu, customSercvice);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.menu.enable(false);
      this.overrideBackBtnFunctionality();
    });
  }

  openPage(page: any) {

    /**Handle the case when user pic is clicked */
    if (!page) {
      this.menu.close();
      // this.nav.setRoot("AccountPage");
      return;
    }

    /**logout click case */
    if (!page.component) {
      this.menu.close()
        .then(() => this.askForConfirmation());
      return;
    }

    this.menu.close();
    this.nav.push(page.component);

  }

  askForConfirmation() {

    const alert: Alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to logout ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Logout',
        handler: () => {
          this.events.publish('user:logout');
        }
      }]

    });
    alert.present();
  }


  overrideBackBtnFunctionality() {
    /**overides the defult behaviour of android hardware back btn for the same purpose*/
    if (this.platform.is('android')) {
      this.unregisterBackButtonActionForAndroid = this.platform.registerBackButtonAction(() => {

        if (this.nav.getActive().index === 0) {
          this.showpageLeaveAlert();
        } else {
          this.nav.pop();
        }
      });
    }
  }

  showpageLeaveAlert() {


    if (this.exitAppPopup) { return; }
    this.exitAppPopup = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure to exit the app ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => { this.platform.exitApp(); }
      }]

    });
    this.exitAppPopup.present();

    this.exitAppPopup.onDidDismiss(() => this.exitAppPopup = null);
  }




}

