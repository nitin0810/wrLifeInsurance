import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuySharesPage } from './buy-shares';

@NgModule({
  declarations: [
    BuySharesPage,
  ],
  imports: [
    IonicPageModule.forChild(BuySharesPage),
  ],
})
export class BuySharesPageModule {}
