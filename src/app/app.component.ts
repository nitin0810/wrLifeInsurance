import { Component, ViewChild } from '@angular/core';
import { Platform, Events, App, AlertController, MenuController, Nav, Alert } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserSessionManage } from '../Classes/user-session-manage';


import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';
import { CustomService } from '../providers/custom.service';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})


export class MyApp extends UserSessionManage {

  @ViewChild(Nav) nav: Nav;
  activePage: any = "";
  defaultUserImage: string = "assets/imgs/user.png";

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
    });
  }

  openPage(page: any) {

    /**Handle the case when user pic is clicked */
    if (!page) {
      this.activePage = "";
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

    // active page highlight not needed now, as there will be only home page as root page
    // from which side menu is visible 
    // this.activePage = page.component; 
    this.menu.close();
    this.nav.push(page.component);

  }

  askForConfirmation() {

    const alert: Alert = this.alertCtrl.create({
      title:'Confirm',
      message: 'Are you sure you want to logout ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Logout',
        handler: () => {
          this.activePage = "";
          this.events.publish('user:logout');
        }
      }]

    });
    alert.present();
  }


}

