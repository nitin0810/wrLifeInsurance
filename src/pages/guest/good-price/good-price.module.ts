import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodPricePage } from './good-price';

@NgModule({
  declarations: [
    GoodPricePage,
  ],
  imports: [
    IonicPageModule.forChild(GoodPricePage),
  ],
})
export class GoodPricePageModule {}
