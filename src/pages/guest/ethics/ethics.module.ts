import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EthicsPage } from './ethics';

@NgModule({
  declarations: [
    EthicsPage,
  ],
  imports: [
    IonicPageModule.forChild(EthicsPage),
  ],
})
export class EthicsPageModule {}
