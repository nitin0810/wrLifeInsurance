import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';


@Injectable()
export class BackBtnService {


  constructor(private platform: Platform) { }

  overrideBackBtnFunctionality(thisRef:any) {

    /**overide the defult behaviour of navbar back btn */
    thisRef.navBar.backButtonClick = (ev: any) => {
      ev.preventDefault();
      ev.stopPropagation();
      thisRef.navCtrl && thisRef.navCtrl.popTo(thisRef.navCtrl.getByIndex(1));
    }

    /**handle the android hardware back btn for the same purpose*/
    if (this.platform.is('android')) {
      thisRef.unregisterBackButtonActionForAndroid = this.platform.registerBackButtonAction(() => {
        thisRef.navCtrl && thisRef.navCtrl.popTo(thisRef.navCtrl.getByIndex(1));
      });
    }
  }
}