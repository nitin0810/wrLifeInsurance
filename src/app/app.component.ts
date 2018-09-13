import { Component, ViewChild } from '@angular/core';
import { Platform, Events, App, AlertController, MenuController, Nav } from 'ionic-angular';
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
  activePage: any="";
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
      this.menu.close();
      // this.appCtrl.getRootNavs()[0].setRoot(LoginPage);
      this.nav.setRoot(LoginPage,{}, {animate: true, direction: 'forward'});
      this.activePage="";
      this.events.publish('user:logout');
      return;
    }

    this.activePage = page.component;
    this.menu.close();
    this.nav.setRoot(page.component);

  }


}

