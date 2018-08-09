import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentSuccessPage } from './payment-success';

@NgModule({
  declarations: [
    PaymentSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentSuccessPage),
  ],
})
export class PaymentSuccessPageModule {}
