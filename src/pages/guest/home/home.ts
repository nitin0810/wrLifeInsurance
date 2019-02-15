import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AuthService } from '../../../providers/auth.service';
import { CustomService } from '../../../providers/custom.service';
import { Network } from '@ionic-native/network';

/**GuestHomepage is actually home page for all users wheather logged in or not */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class GuestHomePage implements OnInit {



  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
    private customService: CustomService,
    private menu: MenuController,
    private network:Network
  ) {
  }

  ngOnInit() {   }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewDidLeave() {
    this.menu.enable(false);
  }

  openPolicyForm() {
    this.navCtrl.push('MedicalInsuranceFormPage');
  }

}
